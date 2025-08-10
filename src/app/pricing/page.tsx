"use client";
import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import { CustomButton } from "@/components/Buttons";
import Modal from "@/components/Modal";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import {
  selectToken,
  selectUser,
  selectUserId,
} from "@/slices/OrganizationIdSlice";
import AmountFormatter from "@/utils/AmountFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";

import { Key, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

interface initialValuesProps {
  promoCode: string;
}

export default function Pricing() {
  const { client } = useAuth();
  const token = useSelector(selectToken);

  const user = useSelector(selectUser);

  const router = useRouter();

  const userId = useSelector(selectUserId);

  const [selectedOption, setSelectedOption] = useState("price");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const [errorMessage, setErrormessage] = useState("");
  const [host, setHost] = useState("");
  const [environmentName, setEnvironmentName] = useState("");
  const [goToPayment, setGoToPayment] = useState(false);
  const [referralName, setReferralName] = useState(""); // Initialize the state for referralName
  const [servicePackage, setServicePackage] = useState<any>({});
  const [duration, setDuration] = useState("");
  // Handle the input value change
  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setReferralName(e.target.value); // Update the state when the input value changes
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setHost(url.host);
    }

    if (host === "www.finkia.com.ng") {
      setEnvironmentName("production");
    } else if (host === "www.staging.finkia.com.ng") {
      setEnvironmentName("staging");
    } else {
      setEnvironmentName("localhost");
    }
  }, [host]);

  const {
    data: packages,
    isLoading: isUserLoading,
    isError: getGroupError,
    refetch,
  } = useQuery({
    queryKey: ["all Packages"],
    queryFn: async () => {
      return client
        .get(`/api/service-package?userType=${user?.role}`, {})
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
    promoCode: Yup.string().required("Promo code is required"),
  });

  // Form submission
  // const handleSubmit = (values: { promoCode: string }) => {
  //   console.log("Submitted Promo Code:", values.promoCode);
  //   // Submit the promo code to the backend or process it further
  // };

  const { mutate: handleSubmit, isPending: isSubmittingCode } = useMutation({
    mutationKey: ["create role"],
    mutationFn: async (values: initialValuesProps) => {
      console.log(values);
      return client.post(`/api/service-package/apply-promocode`, {
        promoCode: values.promoCode,
        userId,
      });
    },
    onSuccess(response) {
      setShowSuccessToast(true);
      if (user.role === "organisation") {
        router.replace("/merchant");
      } else {
        router.replace("/customer");
      }
      // setTimeout(() => {
      //   setCloseModal(false);
      // }, 5000);
    },

    onError(error: any) {
      console.log(error);
      setErrormessage(error.response.data.message);
      setShowErrorToast(true);
      // setRoleCreated(false);
      // setModalContent("status");
    },
  });
  const gotoReferralModal = async (
    servicePackage: {
      _id: Key | null | undefined;
      groupName: string;
      service: any[];
      actualFee: {
        actualMonthlyFee: any;
        actualQuarterlyFee: any;
        actualYearlyFee: any;
      };
      totals: { totalMonthly: any; totalQuarterly: any; totalYearly: any };
    },
    duration: string,
  ) => {
    setServicePackage(servicePackage);
    setDuration(duration);
    setShowModal(true);
  };
  const handlePricing = async () =>
    // servicePackage: {
    //   _id: Key | null | undefined;
    //   groupName: string;
    //   service: any[];
    //   actualFee: {
    //     actualMonthlyFee: any;
    //     actualQuarterlyFee: any;
    //     actualYearlyFee: any;
    //   };
    //   totals: { totalMonthly: any; totalQuarterly: any; totalYearly: any };
    // },
    // duration: string,
    {
      try {
        const packageId = servicePackage._id;
        const paymentPlan = duration;
        const email = user.email;
        const environment = environmentName;
        const paymentFor = "pricing";
        const phoneNumber = user.phoneNumber;
        const customerName = user.firstName + user.lastName;
        const accountNumber = user.accountNumber;
        const redirectURL = `pricing/payment-callback?role=${user.role}`;
        let amount;
        if (duration === "monthly") {
          amount = servicePackage.actualFee.actualMonthlyFee;
        } else if (duration === "quarterly") {
          amount = servicePackage.actualFee.actualQuarterlyFee;
        } else {
          amount = servicePackage.actualFee.actualYearlyFee;
        }
        console.log(amount);
        const response = await axios.post(
          `${apiUrl}api/pay/flw/subscription-payment`,

          {
            referralName,
            redirectURL,
            environment,
            paymentFor,
            userId,
            packageId,
            paymentPlan,
            amount,
            phoneNumber,
            email,
            customerName,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.status === "success") {
          window.location.href = response.data.data.link;
        }
      } catch (error) {
        console.error(error);
      }
    };

  const { data: allGateways, isLoading: isLoadingAllGateways } = useQuery({
    queryKey: ["all gateways"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/payment-gateway`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  const initialValues: initialValuesProps = {
    promoCode: "",
  };
  return (
    <div className="min-h-screen w-full  bg-ajo_darkBlue  px-4 py-12 md:px-16">
      {showModal ? (
        <Modal title="Referral Name" setModalState={setShowModal}>
          <div className="mx-auto w-full max-w-md">
            <label
              htmlFor="referralName"
              className="block text-sm font-medium text-white"
            >
              Referral Name
            </label>
            <input
              type="text"
              id="referralName"
              name="referralName"
              value={referralName} // Bind input value to referralName state
              onChange={handleChange} // Call handleChange on user input
              placeholder="Enter referral name"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#EAAB40] focus:outline-none focus:ring-[#EAAB40] sm:text-sm"
            />

            <div className="mt-4 flex justify-center space-x-4">
              {/* Back Button */}
              <button
                className="rounded-md bg-ajo_blue px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Back
              </button>

              {/* Skip Button */}
              <button
                className="rounded-md bg-ajo_blue px-4 py-2 font-semibold text-white hover:bg-yellow-500"
                onClick={handlePricing}
              >
                Skip
              </button>

              {/* Proceed Button */}
              <button
                className="rounded-md bg-ajo_blue px-4 py-2 font-semibold text-white hover:bg-green-600"
                onClick={handlePricing}
              >
                Proceed
              </button>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
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
          Promo Code
        </label>
      </div>
      {selectedOption === "price" && (
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Pricing: Pay for What You Use Only
              </h2>
              {/* <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400 whitespace-nowrap">
            Here at Flowbite we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic growth.
          </p> */}
            </div>

            {packages?.map(
              (servicePackage: {
                description: string;
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
                  <p className="my-2 w-full whitespace-normal break-words pt-4 text-xl font-bold capitalize text-[#EAAB40] md:ml-8 md:text-3xl">
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
                            <span>
                              {service === "savings"
                                ? "Savings(Ajo/Esusu/Adashe)"
                                : service === "purpose"
                                  ? "Sell and Buy Products(via purposeful savings)"
                                  : service}
                            </span>
                          </li>
                        </ul>
                      ))}
                      <p>{servicePackage.description}</p>

                      <div className="my-4 flex items-center justify-center">
                        <span className="mr-2 whitespace-nowrap text-2xl font-bold">{`N${AmountFormatter(servicePackage.actualFee.actualMonthlyFee)}`}</span>
                        <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                        <span className="text-md ml-1 whitespace-nowrap font-normal line-through">{`N${servicePackage.totals.totalMonthly}`}</span>
                      </div>

                      <CustomButton
                        type="button"
                        label="Get Started"
                        style="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                        onButtonClick={() =>
                          gotoReferralModal(servicePackage, "monthly")
                        }
                      />

                      {/* <a
                        href="#"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:text-white  dark:focus:ring-blue-900"
                      >
                        Get started
                      </a> */}
                    </div>

                    <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow xl:p-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <h3 className="mb-4 text-2xl font-semibold">Quarterly</h3>
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
                            <span>
                              {" "}
                              {service === "savings"
                                ? "Savings(Ajo/Esusu/Adashe)"
                                : service === "purpose"
                                  ? "Sell and Buy Products(via purposeful savings)"
                                  : service}
                            </span>
                          </li>
                        </ul>
                      ))}
                      <p>{servicePackage.description}</p>

                      <div className="my-4 flex items-center justify-center">
                        <span className="mr-2 whitespace-nowrap text-2xl font-bold">{`N${AmountFormatter(servicePackage.actualFee.actualQuarterlyFee)}`}</span>
                        <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                          /3 Month
                        </span>
                        <span className="text-md ml-1 whitespace-nowrap font-normal line-through">{`N${servicePackage.totals.totalQuarterly}`}</span>
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
                        onButtonClick={() =>
                          gotoReferralModal(servicePackage, "quarterly")
                        }
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
                            <span>
                              {" "}
                              {service === "savings"
                                ? "Savings(Ajo/Esusu/Adashe)"
                                : service === "purpose"
                                  ? "Sell and Buy Products(via purposeful savings)"
                                  : service}
                            </span>
                          </li>
                        </ul>
                      ))}
                      <p>{servicePackage.description}</p>

                      <div className="my-4 flex items-center justify-center">
                        <span className="mr-2 whitespace-nowrap text-2xl font-bold">{`N${AmountFormatter(servicePackage.actualFee.actualYearlyFee)}`}</span>
                        <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                          yearly
                        </span>
                        <span className="text-md ml-1 whitespace-nowrap font-normal line-through">{`N${servicePackage.totals.totalYearly}`}</span>
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
                        onButtonClick={() =>
                          gotoReferralModal(servicePackage, "yearly")
                        }
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
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
              }}
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

                  {showSuccessToast && (
                    <SuccessToaster message={"Subscription successful!"} />
                  )}

                  {showErrorToast && errorMessage && errorMessage && (
                    <ErrorToaster
                      message={
                        errorMessage ? errorMessage : "Error subscribing"
                      }
                    />
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
