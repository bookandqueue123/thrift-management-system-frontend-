import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

export default function ContactUs({
  bg,
  contactMail,
  contactPhone,
}: {
  bg?: string;
  contactPhone: string;
  contactMail: string;
}) {
  const pathName = usePathname();
  const isHomepage = pathName === "/";
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div className="relative" id="contact-us">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/contactusbg.svg')`,
        }}
      ></div>
      {/* Yellow overlay */}
      <div className="absolute inset-0  opacity-50"></div>
      {/* Content */}
      <div
        className={`relative z-10 p-8 ${isHomepage ? "text-white" : "text-black"} ml-[4%]`}
      >
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-4 text-lg">Send us a message.</p>

        <Formik
          initialValues={{
            email: "",
            name: "Customer",
            phoneNumber: "",
            rememberPassword: false,
            message: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is Required"),
            name: Yup.string().required("name is required"),
            phoneNumber: Yup.string().required("phone number is required"),
            rememberPassword: Yup.string()
              .required("You have to agree to the policies")
              .oneOf(["true"], "You have to agree to the policies"),
            message: Yup.string().required("You have to agree to the policies"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setTimeout(() => {
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8">
              <div className="justify-between  md:flex">
                <div className="md:w-[50%]">
                  <div className="mb-8">
                    <div className="mb-3">
                      <div>
                        <label
                          htmlFor="text"
                          className="m-0 text-xs font-medium text-white"
                        >
                          Name
                        </label>
                      </div>

                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D] md:w-[100%]"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>

                    <div className="mb-3">
                      <div>
                        <label
                          htmlFor="email"
                          className="m-0 text-xs font-medium text-white"
                        >
                          Email
                        </label>
                      </div>

                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D] md:w-[100%]"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="m-0 text-xs font-medium text-white"
                          >
                            Phone Number
                          </label>
                        </div>
                      </div>
                      <Field
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        // autoComplete="current-password"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D] md:w-[100%]"
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-xs text-red-500"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="message"
                            className="m-0 text-xs font-medium text-white"
                          >
                            Message
                          </label>
                        </div>
                      </div>
                      <Field
                        id="message"
                        name="message"
                        // type="text"
                        as="textarea"
                        // autoComplete="current-password"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D] md:w-[100%]"
                      />
                      <ErrorMessage
                        name="message"
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
                        I agree to Privacy Policy Terms
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 rounded-md bg-ajo_blue px-8 py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
                <div className="item-center align-center flex flex-col justify-center  space-y-8 text-left md:w-[50%] md:px-16">
                  <div className="text-white">
                    <h2 className="text-4xl font-bold">Office Address</h2>
                    <p className="pt-4">
                      1A, Hughes Avenue, Alagomeji, Yaba, Lagos, Nigeria.
                    </p>
                  </div>
                  <div className="text-white">
                    <h2 className="text-4xl font-bold">Telephone</h2>
                    <p className="pt-4">{contactPhone}</p>
                  </div>
                  <div className="text-white">
                    <h2 className="text-4xl font-bold">Email Address</h2>
                    <p className="pt-4"> {contactMail}</p>
                  </div>
                </div>
              </div>

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
      </div>
    </div>
  );
}
