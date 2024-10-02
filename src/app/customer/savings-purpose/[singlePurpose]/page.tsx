"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { FilterDropdown } from "@/components/Buttons";
import {
  addSelectedProduct,
  selectSelectedProducts,
  selectUserId,
} from "@/slices/OrganizationIdSlice";
import AmountFormatter from "@/utils/AmountFormatter";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const purpose = {
  name: "Annual Charity Marathon",
  description:
    "Participate in our annual charity marathon to support local causes. This event includes a 5K, 10K, and a half marathon. All levels of runners are welcome!",
  startDate: "2024-09-01",
  endDate: "2024-09-07",
  participants: 500,
  picture: "https://via.placeholder.com/150", // Replace with an actual image URL
  progress: 45, // 45% of the goal achieved
  userName: "Jane Smith",
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const { client } = useAuth();
  const selectedProducts = useSelector(selectSelectedProducts);

  const id = params.singlePurpose;

  const {
    data: SinglePurpose,
    isLoading: isLoadingPurpose,
    isError,
  } = useQuery({
    queryKey: ["purpose"],
    queryFn: async () => {
      return client
        .get(`/api/purpose/${params.singlePurpose}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  console.log(SinglePurpose?.customerBalances[userId]);

  const daysLeft = (endDate: string | number | Date) => {
    const today = new Date();
    const end = new Date(endDate);
    const timeDiff = Number(end) - Number(today);

    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const GoToPayment = () => {
    if (typeof id === "string" && !selectedProducts.includes(id)) {
      dispatch(addSelectedProduct(id));
      // Use setTimeout to wait for the Redux state to update before navigating
      setTimeout(() => {
        router.push(`/customer/savings-purpose/make-payment`);
      }, 0);
    } else {
      router.push(`/customer/savings-purpose/make-payment`);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Savings Purpose
        </p>
        <p className="text-sm capitalize text-ajo_offWhite">
          Turn Your Dreams into Reality with Finkia’s Savings Purpose,{" "}
          <span className="font-bold text-ajo_orange">
            Give Your money a new purpose!
          </span>
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-3">
          <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
            <input
              //   onChange={handleSearch}
              type="search"
              placeholder="Search"
              className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
            />
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle
                cx="8.60996"
                cy="8.10312"
                r="7.10312"
                stroke="#EAEAFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.4121 13.4121L16.9997 16.9997"
                stroke="#EAEAFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </form>
          <FilterDropdown
            placeholder="sort by"
            options={[
              "Timestamp",
              "Name",
              "Email",
              "Phone",
              "Channel",
              "Amount",
              "Status",
            ]}
          />
        </span>
        <div role="group" className="flex-col-2 flex justify-between "></div>
      </div>

      {!SinglePurpose ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div>
          <div className="relative mb-6 rounded-lg p-6 shadow-md">
            <div className="absolute left-0 top-0 flex h-[100%] w-full items-center justify-center rounded-lg bg-[#EBAE48] md:h-1/2 ">
              <h2 className="z-20 hidden text-2xl font-bold text-ajo_darkBlue md:mt-[-12rem] md:block">
                Savings Purpose
              </h2>
            </div>
            <div className="relative z-10 mx-1 mt-12 rounded-lg bg-purposeBg shadow-md">
              <div className="grid grid-cols-1 p-6 md:grid-cols-3">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold capitalize md:text-2xl md:font-bold">
                    {SinglePurpose.purposeName}
                  </h2>
                  <h2 className="my-2 text-xs font-semibold text-black">
                    Description
                  </h2>
                  <p className="text-xs">{SinglePurpose.description}</p>
                  <div className="my-4 flex ">
                    <p className="text-xs font-semibold text-black">
                      Start Date:
                      <br />{" "}
                      {!SinglePurpose.startDate
                        ? "Nill"
                        : extractDate(SinglePurpose.startDate)}
                    </p>
                    <p className="ml-16 mr-8 text-xs font-semibold text-black">
                      End Date: <br />{" "}
                      {!SinglePurpose.endDate
                        ? "Nill"
                        : extractDate(SinglePurpose.endDate)}
                    </p>
                  </div>
                  <p className="text-md font-normal md:text-xl md:font-semibold">
                    No of participants: <br />{" "}
                    {SinglePurpose.assignedCustomers.length}
                  </p>
                </div>
                <div className="mx-8 mb-4 flex flex-col items-center">
                  <div className="flex w-full justify-center">
                    <div className="flex  aspect-square w-full items-center justify-center rounded-full bg-gray-300">
                      <Image
                        src={SinglePurpose.imageUrl}
                        alt={SinglePurpose.purposeName}
                        width={200}
                        height={200}
                        className="mr-2  h-[100px] w-[100px] translate-x-2 transform object-cover sm:h-[200px] sm:w-[200px]"
                      />
                    </div>
                  </div>
                  <p className="my-6 text-center text-2xl font-bold">
                    NGN {AmountFormatter(SinglePurpose.amount)}
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="text-md mb-4 font-normal md:text-xl md:font-semibold">
                    Savings Progress
                  </h2>
                  <div className="relative mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-300">
                    <div
                      className="absolute left-0 top-0 h-full bg-blue-500"
                      style={{
                        width: `${((SinglePurpose?.customerBalances[userId]?.total - SinglePurpose?.customerBalances[userId]?.balance) / SinglePurpose?.customerBalances[userId]?.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-md font-normal md:text-xl md:font-semibold">
                    How many days left?
                  </p>
                  <p className="text-black">
                    {!SinglePurpose.endDate
                      ? "---"
                      : daysLeft(SinglePurpose.endDate) + " " + "days left"}
                  </p>
                  <div>
                    <h2 className="mt-4 text-sm font-semibold">
                      Promotional Code
                    </h2>
                    <input
                      type="text"
                      placeholder="Promo Code"
                      className="mb-2 w-full rounded-md border border-black bg-transparent p-2 text-black"
                    />
                  </div>
                  <div className="mb-2 mt-8 flex space-x-2">
                    <button
                      onClick={GoToPayment}
                      className="w-1/2 rounded-md bg-blue-500 p-2 text-white"
                    >
                      Make Full Payment
                    </button>
                    <button
                      onClick={GoToPayment}
                      className="w-1/2 rounded-md border border-black bg-transparent p-2 text-black"
                    >
                      Make Part Payment
                    </button>
                  </div>
                  <div className="mb-2 mt-8 flex justify-between space-x-2">
                    <p className="text-md font-normal md:text-xl md:font-semibold">
                      No of participants: <br />{" "}
                      {SinglePurpose.assignedCustomers.length}
                    </p>
                    <p className="text-md mr-4 font-normal md:text-xl md:font-semibold">
                      Merchant:
                      <br /> {SinglePurpose.organisation.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
