"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Key, SetStateAction, useState } from "react";
import * as Yup from "yup";
export default function Pricing() {
  const { client } = useAuth();
  const [selectedOption, setSelectedOption] = useState("price");
  const {
    data: packages,
    isLoading: isUserLoading,
    isError: getGroupError,
    refetch,
  } = useQuery({
    queryKey: ["all Packages"],
    queryFn: async () => {
      return client
        .get(`/api/service-package`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  const handleOptionChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
  };

  const validationSchema = Yup.object({
    promoCode: Yup.string()
      .required("Promo code is required")
      .matches(
        /^[A-Za-z0-9]{6,10}$/,
        "Promo code must be 6-10 alphanumeric characters",
      ),
  });

  // Form submission
  const handleSubmit = (values: { promoCode: string }) => {
    console.log("Submitted Promo Code:", values.promoCode);
    // Submit the promo code to the backend or process it further
  };
  const handlePricing = () => {
    console.log(123);
  };
  return (
    <div>
      <div className="mb-4">
        <label className="mr-4 text-white">
          <input
            type="radio"
            value="price"
            checked={selectedOption === "price"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          Price
        </label>
        <label className="text-white">
          <input
            type="radio"
            value="promo"
            checked={selectedOption === "promo"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          Promo
        </label>
      </div>
      {selectedOption === "price" && (
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Designed for businesses like yours
              </h2>
              {/* <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Here at Flowbite we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic growth.
          </p> */}
            </div>

            {packages?.map(
              (servicePackage: {
                _id: Key | null | undefined;
                groupName: string;

                service: any[];
                actualFee: {
                  actualMonthlyFee: any;
                  actualQuarterlyFee: any;
                  actualYearlyFee: any;
                };
                totals: {
                  totalMonthly: any;
                  totalQuarterly: any;
                  totalYearly: any;
                };
              }) => (
                <div key={servicePackage._id} className="my-4">
                  {" "}
                  <p className="my-2 ml-8 text-5xl font-extrabold">
                    {servicePackage.groupName}
                  </p>
                  <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
                    <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow xl:p-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <h3 className="mb-4 text-2xl font-semibold">Monthly</h3>
                      {servicePackage.service.map((service: string) => (
                        <ul
                          role="list"
                          className="mb-8 space-y-4 text-left"
                          key={service}
                        >
                          <li className="flex items-center space-x-3">
                            <svg
                              className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            <span>{service}</span>
                          </li>
                        </ul>
                      ))}

                      <div className="my-8 flex items-baseline justify-center">
                        <span className="mr-2 text-5xl font-extrabold">{`N${servicePackage.actualFee.actualMonthlyFee}`}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                        <span className="mr-2 text-2xl font-normal line-through">{`N${servicePackage.totals.totalMonthly}`}</span>
                      </div>

                      <CustomButton
                        type="button"
                        label="Get Started"
                        style="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                        onButtonClick={() => handlePricing()}
                      />

                      {/* <a
                        href="#"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                      >
                        Get started
                      </a> */}
                    </div>

                    <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow xl:p-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <h3 className="mb-4 text-2xl font-semibold">Quartely</h3>
                      {servicePackage.service.map((service: string) => (
                        <ul
                          role="list"
                          className="mb-8 space-y-4 text-left"
                          key={service}
                        >
                          <li className="flex items-center space-x-3">
                            <svg
                              className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            <span>{service}</span>
                          </li>
                        </ul>
                      ))}
                      <div className="my-8 flex items-baseline justify-center">
                        <span className="mr-2 text-5xl font-extrabold">{`N${servicePackage.actualFee.actualQuarterlyFee}`}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          /6 Month
                        </span>
                        <span className="mr-2 text-2xl font-normal line-through">{`N${servicePackage.totals.totalQuarterly}`}</span>
                      </div>

                      {/* <a
                        href="#"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                      >
                        Get started
                      </a> */}
                      <CustomButton
                        type="button"
                        label="Get Started"
                        style="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                        onButtonClick={() => handlePricing}
                      />
                    </div>

                    <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow xl:p-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <h3 className="mb-4 text-2xl font-semibold">Yearly</h3>
                      {servicePackage.service.map((service: string) => (
                        <ul
                          role="list"
                          className="mb-8 space-y-4 text-left"
                          key={service}
                        >
                          <li className="flex items-center space-x-3">
                            <svg
                              className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            <span>{service}</span>
                          </li>
                        </ul>
                      ))}
                      <div className="my-8 flex items-baseline justify-center">
                        <span className="mr-2 text-5xl font-extrabold">{`N${servicePackage.actualFee.actualYearlyFee}`}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          /year
                        </span>
                        <span className="mr-2 text-2xl font-normal line-through">{`N${servicePackage.totals.totalYearly}`}</span>
                      </div>

                      {/* <a
                        href="#"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                      >
                        Get started
                      </a> */}
                      <CustomButton
                        type="button"
                        label="Get Started"
                        style="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                        onButtonClick={() => handlePricing}
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}
      {selectedOption === "promo" && (
        <div className="flex h-screen items-center justify-center">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-center text-2xl font-bold">
              Enter Promo Code
            </h2>
            <Formik
              initialValues={{ promoCode: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="promoCode"
                      className="block text-sm font-medium"
                    >
                      Promo Code
                    </label>
                    <Field
                      type="text"
                      name="promoCode"
                      id="promoCode"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your promo code"
                    />
                    <ErrorMessage
                      name="promoCode"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
