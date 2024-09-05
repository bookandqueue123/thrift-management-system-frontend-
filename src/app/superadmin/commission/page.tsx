"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal from "@/components/Modal";
import TransactionsTable from "@/components/Tables";
import CreateCommissionForm from "@/modules/superAdmin/CreateCommission";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { CiExport } from "react-icons/ci";

const mockData = [
  {
    organisation: "ABC Corporation",
    organisationIdNo: "123456",
    Appliedlowest: 1000,
    AdminFeeLowest: 50,
    Apliedhigest: 5000,
    AdminFeeHiest: 100,
    AppliedServiceCharge: 0.5,
    serviceCharge: 20,
    comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    action: "View",
  },
  {
    organisation: "XYZ Corp",
    organisationIdNo: "789012",
    Appliedlowest: 2000,
    AdminFeeLowest: 70,
    Apliedhigest: 6000,
    AdminFeeHiest: 120,
    AppliedServiceCharge: 0.7,
    serviceCharge: 25,
    comment:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    action: "Edit",
  },
  {
    organisation: "Example Corp",
    organisationIdNo: "345678",
    Appliedlowest: 1500,
    AdminFeeLowest: 60,
    Apliedhigest: 5500,
    AdminFeeHiest: 110,
    AppliedServiceCharge: 0.6,
    serviceCharge: 22,
    comment:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    action: "Delete",
  },
];

export default function SuperAdminCustomer() {
  const router = useRouter();
  const { client } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number>(0);

  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "view" | "savings" | "edit" | "create-customer" | ""
  >("");
  const [customerToBeEdited, setCustomerToBeEdited] = useState({});
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  const {
    data: organisations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizationsGroup"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  return (
    <div>
      {showModal ? (
        <Modal setModalState={setShowModal} title="Commission">
          <CreateCommissionForm />
        </Modal>
      ) : (
        ""
      )}
      <div className="mb-4 space-y-2">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Commisssion
        </p>
      </div>

      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            {/* <SearchInput onSearch={() => ("")}/> */}
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                // onChange={handleSearch}
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
          <CustomButton
            type="button"
            label="Create Commission"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setShowModal(true);
              //   setModalState(true);
              //   setModalContent("form");
            }}
          />
        </div>

        <div className="my-8 justify-between md:flex">
          <div className="flex items-center">
            <p className="font-lg mr-2 text-white">Select range from:</p>
            <input
              type="date"
              //   value={fromDate}
              //     onChange={handleFromDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />

            <p className="mx-2 text-white">to</p>
            <input
              type="date"
              //   value={toDate}
              //   onChange={handleToDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex">
            <button className="mr-4 flex rounded border border-white bg-transparent px-4 py-2 font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white">
              Export as CSV{" "}
              <span className="ml-2 mt-1">
                <CiExport />
              </span>
            </button>
            <button className="relative rounded-md border-none bg-transparent px-4 py-2 text-white">
              <u>Export as Excel</u>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xl text-white">Commission List</p>
        </div>

        <TransactionsTable
          headers={[
            "S/N",
            "Organisation",
            "Organisation ID No",
            // "Applied % (lowest range)",
            "Admin Fee (Lowest range)",
            // "Applied %(Highest range)",
            // "Admin Fee (Highest range)",
            // "Applied Service Charge %",
            "Service Charge",
            "Purpose/item commission",
            "Comment",
            "Action",
          ]}
          content={organisations?.map((organisation: { organisation: any; organisationName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; accountNumber: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; adminFee: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; serviceFee: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; purposeCommission: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> }, index: number) => (
            <tr className="" key={index}>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                >
                  {index + 1}
                </Link>
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                >
                  {organisation.organisationName}
                </Link>
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.accountNumber}
                </Link>
              </td>
              {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.Appliedlowest}
                </Link>
              </td> */}
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.adminFee}
                </Link>
              </td>
              {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.Apliedhigest}
                </Link>
              </td> */}
              {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.AdminFeeHiest}
                </Link>
              </td> */}

              {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.AppliedServiceCharge}
                </Link>
              </td> */}
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.serviceFee}
                </Link>
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {organisation.purposeCommission}
                </Link>
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                >
                  {/* {organisation.comment} */}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <Link
                  href={`/superadmin/commission/${organisation.organisation}`}
                  key={index}
                ></Link>
              </td>
            </tr>
          ))}
        />
      </section>
    </div>
  );
}
