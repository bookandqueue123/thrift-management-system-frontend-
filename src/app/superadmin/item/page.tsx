"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { FilterDropdown } from "@/components/Buttons";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { DateDuration } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { CiExport } from "react-icons/ci";
import { useSelector } from "react-redux";
import { UrlObject } from "url";

export default function Purpose() {
  const { client } = useAuth();

  const PAGE_SIZE = 5;
  const organisationId = useSelector(selectOrganizationId);
  const [filteredPurposes, setFilteredPurposes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: allPurpose } = useQuery({
    queryKey: ["allPurpose"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/purpose`)
        .then((response) => {
          setFilteredPurposes(response.data);
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  const paginatedPurposes = filteredPurposes?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  let totalPages = 0;
  if (allPurpose) {
    totalPages = Math.ceil(allPurpose?.length / PAGE_SIZE);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="min-w-16 truncate text-sm font-semibold text-ajo_offWhite">
          Purpose/Item
        </p>
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
      </div>

      <div className="">
        <label
          htmlFor="fromDate"
          className="mb-2 text-sm font-semibold text-white"
        >
          Select range from:
        </label>
        <div className="justify-between space-y-2 md:flex">
          <div className="flex items-center">
            <input
              id="fromDate"
              type="date"
              //   value={fromDate}
              //   onChange={handleFromDateChange}
              className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
            />

            <label htmlFor="toDate" className="mx-2 text-white">
              to
            </label>
            <input
              id="toDate"
              type="date"
              //   value={toDate}
              //   onChange={handleToDateChange}
              className="rounded-lg bg-[rgba(255,255,255,0.1)] p-3 text-ajo_offWhite caret-ajo_offWhite dark:[color-scheme:dark]"
            />
          </div>

          <div className="mt-4 flex">
            <button
              // onClick={handleExport}
              className="mr-4 flex rounded border border-ajo_offWhite bg-transparent px-4 py-2 font-medium text-ajo_offWhite hover:border-transparent hover:bg-blue-500 hover:text-ajo_offWhite"
            >
              Export as CSV{" "}
              <span className="ml-2 mt-1">
                <CiExport />
              </span>
            </button>
            <button
              // onClick={handleExcelExport}
              className="relative rounded-md border-none bg-transparent px-4 py-2 text-white"
            >
              <u>Export as Excel</u>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <p className="mt-8 pl-2 text-xs text-ajo_offWhite">
          *Please Scroll sideways to view all content
        </p>
        <div className="mt-8">
          <TransactionsTable
            headers={[
              "S/N",
              "Item/Purpose",
              "Purpose/item Id Number",
              "Description",
              "Merchant",

              "Total Customers(buyer)",
              "Amount(by Merchant)",
              "Commission %",
              "Platform Fee (% of c)",
              "Discount",

              "Total Amount",
              "Total platform fee",
              "General Space(Yes/No)",
              "Category",
              "Picture",
              "Visibility Duration",
              "Promo",
              "Sharing",
            ]}
            content={
              <>
                {paginatedPurposes &&
                  paginatedPurposes.map(
                    (
                      purpose: {
                        purposeName:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        uniqueCode:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        description:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        organisation: {
                          organisationName:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | PromiseLikeOfReactNode
                            | null
                            | undefined;
                          purposeCommission:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | PromiseLikeOfReactNode
                            | null
                            | undefined;
                          generalSpace:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | PromiseLikeOfReactNode
                            | null
                            | undefined;
                        };
                        assignedCustomers: string | any[];
                        amountWithoutCharge:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        amount:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        promoPercentage:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        totalPlatformFee:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        category: {
                          name:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | PromiseLikeOfReactNode
                            | null
                            | undefined;
                        };
                        imageUrl: string | UrlObject;
                        visibilityEndDate: string | number | Date;
                        visibilityStartDate: string | number | Date;
                        promocode: any;
                        referralBonus: any;
                      },
                      index: number,
                    ) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm ">
                          {purpose.purposeName}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.uniqueCode}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm ">
                          {purpose.description}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.organisation.organisationName}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.assignedCustomers.length}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.amountWithoutCharge}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.organisation.purposeCommission}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {Number(purpose.amount) -
                            Number(purpose.amountWithoutCharge)}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.promoPercentage}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.amount}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.totalPlatformFee}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.organisation.generalSpace}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.category.name}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.imageUrl ? (
                            <Link target="_blank" href={purpose.imageUrl}>
                              <button
                                style={{
                                  borderRadius: "5px",
                                  padding: "8px",
                                  paddingRight: "16px",
                                  paddingLeft: "16px",
                                  backgroundColor: "#F2F2F2",
                                  color: "black",
                                }}
                                //  onClick={() => router.push(purpose.imageUrl)}
                              >
                                View Picture
                              </button>
                            </Link>
                          ) : (
                            "No Evidence"
                          )}
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {DateDuration(
                            purpose.visibilityEndDate,
                            purpose.visibilityStartDate,
                          )}{" "}
                          day(s)
                        </td>
                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.promocode || "N/A"}
                        </td>

                        <td className="text-capitalize whitespace-nowrap px-6 py-4 text-sm">
                          {purpose.referralBonus || "N/A"}
                        </td>
                      </tr>
                    ),
                  )}
              </>
            }
          />
          <div className="flex justify-center">
            <PaginationBar
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
            {/* <PaginationBar apiResponse={DummyCustomers} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
