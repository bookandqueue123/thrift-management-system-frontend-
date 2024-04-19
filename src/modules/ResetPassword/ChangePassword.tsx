import { useAuth } from "@/api/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import * as Yup from "yup";
import SuccessToaster, { ErrorToaster } from "@/components/toast";

const PasswordChangeSchema = Yup.object().shape({
  // temporaryPassword: Yup.string().required("Temporary Password is required"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

interface ChangePasswordProps{
  newPassword: string
}
export default function ChangePassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const { client } = useAuth();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    mutate: ResetPassword,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["reset password", token],
    mutationFn: async (values: ChangePasswordProps) => {
      return client.post(`/api/auth/reset-password/${token}`, {
        password: values.newPassword,
        
      });
    },

    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);
      console.log(response);
      router.push('signin')
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
    <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
      <div>
        <p className="text-center text-3xl font-bold text-white md:text-6xl">
          Change Password
        </p>
        <p className="mt-2 text-center text-sm text-ajo_orange">
          Experience the power of seamless savings with Ajo.
        </p>
        <Formik
          initialValues={{
            temporaryPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={PasswordChangeSchema}
          onSubmit={(values) => {
            console.log(values);
            ResetPassword(values)
          }}
        >
          <Form className="space-y-4">
            {/* <div>
              <label
                htmlFor="temporaryPassword"
                className="m-0 text-xs font-medium text-white"
              >
                Temporary Password
              </label>
              <Field
                type="password"
                id="temporaryPassword"
                name="temporaryPassword"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="temporaryPassword"
                component="div"
                className="text-red-500"
              />
            </div> */}

            <div>
              <label
                htmlFor="newPassword"
                className="m-0 text-xs font-medium text-white"
              >
                New Password
              </label>
              <Field
                type="password"
                id="newPassword"
                name="newPassword"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="m-0 text-xs font-medium text-white"
              >
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
            >
              Next
            </button>

            {showSuccessToast && (
            <SuccessToaster message={"Password Reset Successfully"} />
          )}
          {showErrorToast && errorMessage && errorMessage && (
            <ErrorToaster
              message={
                errorMessage ? errorMessage : "Error creating organization"
              }
            />
          )}
          </Form>
        </Formik>
      </div>
    </section>
  );
}
