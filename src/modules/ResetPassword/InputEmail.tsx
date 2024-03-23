import { useAuth } from "@/api/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import * as Yup from "yup";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
});

const initialValues = {
  email: "",
};

const InputEmail: React.FC = () => {
  const router = useRouter()
  const { client } = useAuth();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (values: any) => {
    // Handle form submission here
    console.log(values);
  };

  const {
    mutate: ResetPassword,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["reset password"],
    mutationFn: async (values: {email: string}) => {
      return client.post(`/api/auth/forgot-password`, {
        email: values.email,
        
      });
    },

    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);
      console.log(response);
    //  router.push('/change-password')
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
    <>
      <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
        <div>
          <p className="text-center text-3xl font-bold text-white md:text-6xl">
            Forgot Password?
          </p>
          <p className="mt-2 text-center text-sm text-ajo_orange">
            Experience the power of seamless savings with Ajo.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              ResetPassword(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Email:
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error text-xs text-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "submitting..." : "Submit"}
                </button>

                {showSuccessToast && (
            <SuccessToaster message={"A link has been sent to your email!"} />
          )}
          {showErrorToast && errorMessage && errorMessage && (
            <ErrorToaster
              message={
                errorMessage ? errorMessage : "Failed"
              }
            />
          )}
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
};

export default InputEmail;
