'use client'
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
    <div>
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
           
            setTimeout(() => {
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8" id="contactUs-content">
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
                    The Waterside, 5 Admiralty Rd, off Admiralty Way, Lekki Phase 1, Lagos State, Nigeria.
                    </p>
                    <p className="pt-4">
                    1A, Huges Avenue, Alagomeji, Yaba, Lagos State Nigeria
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

      <div className="text-white">
  <h2 className="text-4xl font-bold">Location</h2>
  <div className="relative pt-4">
    {/* Google Map */}
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.5693780704933!2d3.4674196740454484!3d6.449290824023231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf551f145e5cd%3A0x2b343ed91116a6b!2sThe%20waterside%20venue%20lekki!5e0!3m2!1sen!2sng!4v1734969019097!5m2!1sen!2sng"
      width="100%"
      height="1000"
      style={{ border: 0 }}
      allowFullScreen={true}
      loading="lazy"
    ></iframe>

    {/* Location Icon */}
    {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="h-10 w-10 text-red-600"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 4.63 7 13 7 13s7-8.37 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    </div> */}
  </div>
</div>

    </div>
  );
}

