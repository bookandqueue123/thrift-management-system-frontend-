"use client";

import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { CustomerSignUpProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber: Yup.string()
    .matches(
      /^(?:\+234\d{10}|\d{11})$/,
      "Phone number must start with +234 and be 14 characters long or start with 0 and be 11 characters long",
    )
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  homeAddress: Yup.string().required("Home Address is required"),
});

const CreateCustomer = ({
  setUserCreated,
  organizationId,
}: {
  setUserCreated: Dispatch<SetStateAction<boolean>>;
  organizationId: string;
}) => {
  const initialValues: CustomerSignUpProps = {
    firstName: "",
    lastName: "",
    otherName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: organizationId,
  };

  const { client } = useAuth();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const {
    mutate: CustomerSignUp,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["customer sign up"],
    mutationFn: async (values: CustomerSignUpProps) => {
      return client.post(`/api/auth/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        otherName: values.otherName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        role: "customer",
        organisation: values.organization,
      });
    },
    onSuccess(response: AxiosResponse<any, any>) {
      setUserCreated(true);
      setShowSuccessToast(true);
      setSuccessMessage(response.data.message);
      console.log(response);
      // router.push(`/signin`);
    },
    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(
        error.response?.data.message || "Error creating organization",
      );
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        console.log("creating customer");
        CustomerSignUp(values);
        setTimeout(() => {
          setShowSuccessToast(false);
          setShowErrorToast(false);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="mt-8">
          <div className="mb-8">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="mb-3 w-1/2">
                <label
                  htmlFor="firstName"
                  className="m-0 text-xs font-medium text-white"
                >
                  First Name{" "}
                  <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-3 w-1/2">
                <label
                  htmlFor="lastName"
                  className="m-0 text-xs font-medium text-white"
                >
                  Last Name{" "}
                  <span className="font-base font-semibold text-[#FF0000]">
                    *
                  </span>
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="otherName"
                className="m-0 text-xs font-medium text-white"
              >
                Other Names
              </label>
              <Field
                id="otherName"
                name="otherName"
                type="text"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="phoneNumber"
                className="m-0 text-xs font-medium text-white"
              >
                Phone Number{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className="bg-transparent outline-none"
                />
              </div>
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="m-0 text-xs font-medium text-white"
              >
                Email address{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="m-0 text-xs font-medium text-white"
              >
                Password{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="m-0 text-xs font-medium text-white"
              >
                Confirm Password{" "}
                <span className="font-base font-semibold text-[#FF0000]">
                  *
                </span>
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>
          {/* Submit Button */}

          <button
            type="submit"
            className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {/* Toast Messages */}
          {showSuccessToast && (
            <SuccessToaster
              message={successMessage || "Account Created successfully!"}
            />
          )}
          {showErrorToast && (
            <ErrorToaster
              message={errorMessage || "Error creating organization"}
            />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CreateCustomer;
