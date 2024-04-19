"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { signInProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { setAuthData } from "@/slices/OrganizationIdSlice";
import { useDispatch, useSelector } from "react-redux";

import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { decryptPassword, encryptPassword } from "@/utils/Encryptpassword";

const SignInForm = () => {
  const { client } = useAuth();
  // const organizationId = useSelector(selectOrganizationId);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    email: "",
    userCategory: "Customer",
    password: "",
    rememberPassword: true,
  });

  const secretKey = process.env.PASSWORD_ENCRYPTION_KEY as string;

  // Remember password
  useEffect(() => {
    const cookies = parseCookies();
    console.log("NODE_ENV: ",process.env.NODE_ENV);
    if (cookies.rememberedPassword && cookies.rememberedEmail) {
      const decryptedPassword = decryptPassword(
        cookies.rememberedPassword,
        secretKey,
      );
      setInitialValues((prevValues) => ({
        ...prevValues,
        email: cookies.rememberedEmail,
        password: decryptedPassword,
        rememberPassword: true,
      }));
    }
  }, []);

  const {
    mutate: UserSignIn,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["UserLogin"],
    mutationFn: async (values: signInProps) => {
      return client.post(`/api/auth/login`, {
        emailOrPhoneNumber: values.email,
        password: values.password,
      });
    },

    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);

      if (response.data.role === "customer") {
        if (user) {
          router.push(`/customer`);
        }
      } else if (response.data.role === "organisation") {
        if (response.data.kycVerified) {
          router.push("/merchant");
        } else {
          router.push("/welcome");
        }
      }

      if (response.data.role === "customer") {
        dispatch(
          setAuthData({
            organizationId: response.data.organisation,
            token: response.data.token,
            user: response.data,
            userId: response.data._id,
          }),
        );
      } else if (response.data.role === "organisation") {
        dispatch(
          setAuthData({
            organizationId: response.data._id,
            token: response.data.token,
            user: response.data,
            userId: response.data._id,
          }),
        );
      }

      //  dispatch(setOrganizationId(response.data._id));

      setSuccessMessage((response as any).response.data.message);

      setTimeout(() => {}, 3500);
    },

    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
      // setErrorMessage(error.data)
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is Required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        const encryptedPassword = encryptPassword(values.password, secretKey);
        if (initialValues.rememberPassword) {
          setCookie(null, "rememberedPassword", encryptedPassword, {
            maxAge: 3 * 24 * 60 * 60, // Expires in 3 days
            path: "/signin",
          });
          setCookie(null, "rememberedEmail", values.email, {
            maxAge: 3 * 24 * 60 * 60, // Expires in 3 days
            path: "/signin",
          });
        } else {
          destroyCookie(null, "rememberedPassword");
          destroyCookie(null, "rememberedEmail");
        }
        UserSignIn(values);
        setTimeout(() => {
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mt-8">
          <div className="mb-8">
            <div className="mb-3">
              <label
                htmlFor="email"
                className="m-0 text-xs font-medium text-white"
              >
                Email address
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="m-0 text-xs font-medium text-white"
                >
                  Password
                </label>
                <Link href="/reset-password">
                  <span className="m-0 text-xs font-medium text-ajo_orange hover:underline focus:underline">
                    Forgot Password?
                  </span>
                </Link>
              </div>
              <Field
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-xs text-red-500"
              />
            </div>

            <div className="flex gap-x-3">
              <Field
                id="rememberPassword"
                name="rememberPassword"
                type="checkbox"
                className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="rememberPassword"
                className="m-0 block text-xs font-medium text-white"
              >
                Remember Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          {/* Conditionally render SuccessToaster component */}
          {showSuccessToast && (
            <SuccessToaster message={"Sign in successfull!"} />
          )}
          {showErrorToast && errorMessage && errorMessage && (
            <ErrorToaster
              message={
                errorMessage ? errorMessage : "Error creating organization"
              }
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

const SignInPage = () => {
  return (
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
      <div>
        <p className="text-center text-3xl font-bold text-white md:text-6xl">
          SignIn
        </p>
        <p className="mt-2 text-center text-sm text-ajo_orange">
          Experience the power of seamless savings with Ajo.
        </p>
        <SignInForm />
        <div className="mt-6 justify-center md:flex md:gap-1">
          <p className="text-center text-sm font-semibold text-white">
            Dont have an account yet?
          </p>
          <Link href="/signup">
            <p className="text-center text-sm font-semibold text-ajo_orange hover:underline focus:underline">
              Sign up!
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
