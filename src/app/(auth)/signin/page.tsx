"use client";
import { useAuth } from "@/api/hooks/useAuth";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { signInProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

import { setAuthData } from "@/slices/OrganizationIdSlice";
import { useDispatch, useSelector } from "react-redux";

import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";


// export const metadata = {
//   title: 'SignIn',
//   description: 'Login to your account',
// };

const SignInForm = () => {
  const { client } = useAuth();
  const organizationId = useSelector(selectOrganizationId);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    mutate: UserSignIn,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["set Savings"],
    mutationFn: async (values: signInProps) => {
      return client.post(`/api/auth/login`, {
        emailOrPhoneNumber: values.email,
        password: values.password,
      });
    },

    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);

      console.log(response);

      if (response.data.role === "customer") {
        if(user){
          router.push(`/customer`);
        }
        
      } else if (response.data.role === "organisation") {
        router.push("/merchant");
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

      console.log(organizationId);

      console.log(user);

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
      initialValues={{
        email: "",
        userCategory: "Customer",
        password: "",
        rememberPassword: false,
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is Required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
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

            {/* <div className="mb-3">
            <label htmlFor="userCategory" className="m-0 text-xs font-medium text-white">
              User Category
            </label>
            <Field
              as="select"
              id="userCategory"
              name="userCategory"
              className="bg-right-20 mt-1 w-full cursor-pointer appearance-none rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
            >
              <option value="Customer">Customer</option>
              <option value="Merchant">Merchant</option>
            </Field>
          </div> */}

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
          <Link href="/">
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
