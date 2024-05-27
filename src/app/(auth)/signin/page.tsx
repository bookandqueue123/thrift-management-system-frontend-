"use client";
import { useAuth } from "@/api/hooks/useAuth";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { signInProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { setAuthData } from "@/slices/OrganizationIdSlice";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "@/slices/OrganizationIdSlice";
import { decryptPassword, encryptPassword } from "@/utils/Encryptpassword";
import Image from "next/image";

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
  });
  const [rememberPassword, setRememberPassword] = useState(true);

  const secretKey = process.env.PASSWORD_ENCRYPTION_KEY as string;

  // Remember password
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.rememberedPassword && cookies.rememberedEmail) {
      const decryptedPassword = decryptPassword(
        cookies.rememberedPassword,
        secretKey,
      );
      // console.log("decryptionKey: ", secretKey);
      // console.log("decryptedPin: ", decryptedPassword);
      // console.log("rememberedPassword: ", cookies.rememberedPassword);
      // console.log("rememberedEmail: ", cookies.rememberedEmail);
      setInitialValues((prevValues) => ({
        ...prevValues,
        email: cookies.rememberedEmail,
        password: decryptedPassword,
      }));
      setRememberPassword(cookies.rememberedPassword ? true : false);
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
          router.replace(`/customer`);
        }
      } else if (response.data.role === "superadmin") {
        router.replace("/superadmin");
      } else if (response.data.role === "staff") {
        router.replace("/merchant");
      } else if (response.data.role === "organisation") {
        if (response.data.kycVerified) {
          router.replace("/merchant");
        } else {
          router.replace("/welcome");
        }
      }

      if (response.data.role === "customer" || response.data.role === "staff") {
        dispatch(
          setAuthData({
            organizationId: response.data.organisation,
            token: response.data.token,
            user: response.data,
            userId: response.data._id,
          }),
        );
      } else {
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

      setTimeout(() => {
        setShowErrorToast(false)
      }, 5000)
    },
  });

  


  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is Required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        // const encryptedPassword = encryptPassword(values.password, secretKey);
        // if (rememberPassword) {
        //   setCookie(null, "rememberedPassword", encryptedPassword, {
        //     maxAge: 3 * 24 * 60 * 60, // Expires in 3 days
        //     path: "/signin",
        //   });
        //   setCookie(null, "rememberedEmail", values.email, {
        //     maxAge: 3 * 24 * 60 * 60, // Expires in 3 days
        //     path: "/signin",
        //   });
        // } else {
        //   destroyCookie(null, "rememberedPassword", { path: "/signin" });
        //   destroyCookie(null, "rememberedEmail", { path: "/signin" });

        //   // const cookies = parseCookies();

        //   // console.log("rememberedPassword: ", cookies.rememberedPassword);
        //   // console.log("rememberedEmail: ", cookies.rememberedEmail);
          //}

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
              <input
                id="rememberPassword"
                name="rememberPassword"
                type="checkbox"
                className="block h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                onChange={() =>
                  // setInitialValues((prevValues) => ({
                  //   ...prevValues,
                  //   rememberPassword: e.target.checked,
                  // }))
                  setRememberPassword(!rememberPassword)
                }
                checked={rememberPassword}
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
            {isSubmitting ? (
              <Image
                src="/loadingSpinner.svg"
                alt="loading spinner"
                className="relative left-1/2"
                width={25}
                height={25}
              />
            ) : (
              "Log in"
            )}
          </button>

          {/* Conditionally render SuccessToaster component */}
          {showSuccessToast && (
            <SuccessToaster message={"Sign in successful!"} />
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
