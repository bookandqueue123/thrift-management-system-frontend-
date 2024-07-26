"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { CategoryFormValuesProps, permissionObject, ICouponProps } from "@/types";
import { extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import {    
  ChangeEvent,
  Dispatch,
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const Coupon = () => {
  const PAGE_SIZE = 10;
  const organisationId = useSelector(selectOrganizationId);
  const { userPermissions, permissionsMap } = usePermissions();

  const [isCouponCreated, setIsCouponCreated] = useState(false);
  const [isCategoryEdited, setIsCategoryEdited] = useState(false);
  const [filteredCoupons, setFilteredCoupons] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-coupon" | "create-coupon" | ""
  >("");
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [categoryToBeEdited, setCategoryToBeEdited] = useState("");

  const {
    data: allCoupons,
    isLoading: isLoadingAllCoupons,
    refetch,
  } = useQuery({
    queryKey: ["allCoupons"],
    queryFn: async () => {
      return client
        .get(`/api/coupon?organisation=${organisationId}`, {})
        .then((response: AxiosResponse<ICouponProps[], any>) => {
    
          setFilteredCoupons(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });

  console.log(allCoupons)

 

  const { data: allPermissions } = useQuery({
    queryKey: ["allPermissions"],
    queryFn: async () => {
      return client
        .get("api/permission")
        .then((response: AxiosResponse<permissionObject[], any>) => {
          return response.data;
        })
        .catch((error: AxiosResponse<any, any>) => {
          throw error;
        });
    },
  });
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (allCoupons) {

      const searchQuery = e.target.value.trim().toLowerCase();
      const filtered = allCoupons.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFilteredCoupons(filtered);
    }
  };

  const paginatedCoupons = filteredCoupons?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allCoupons) {
    totalPages = Math.ceil(allCoupons.length / PAGE_SIZE);
  }

  useEffect(() => {
    // Calling refetch to rerun the allCoupons query
    refetch();
  }, [isCouponCreated, isCategoryEdited, refetch]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Coupons
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <FilterDropdown options={["Role Name"]} />

            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                onChange={handleSearch}
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
          </span>
          {(user?.role === "organisation" ||
            (user?.role === "staff" &&
              userPermissions.includes(permissionsMap["create-coupon"]))) && (
            <CustomButton
              type="button"
              label="Create a Coupon"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-coupon");
                setModalContent("form");
                setIsCouponCreated(false);
              }}
            />
          )}
        </div>

        <p className="mb-2 text-base font-medium text-white">
          Existing Coupons List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Category Name",
              "Coupon Code",
              "Description",
              "Amount",
              "Start Time and Date",
              "End Time and Date",
              "Status",
              
            ]}
            content={
              filteredCoupons.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Coupons yet
                  </p>
                </tr>
              ) : (
                paginatedCoupons?.map((role: ICouponProps, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.name || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.couponCode || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.description || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.amount || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(role.startDate)} {extractTime(role.startTime)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {extractDate(role.endDate)} {extractTime(role.endTime)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      status
                    </td>
                    <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                      {(user?.role === "organisation" ||
                        (user?.role === "staff" &&
                          userPermissions.includes(
                            permissionsMap["edit-coupon"],
                          ))) && (
                        <Image
                          src="/pencil.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => {
                            setModalToShow("edit-coupon");
                            setModalState(true);
                             setCategoryToBeEdited(role._id);
                            setModalContent("form");
                            setIsCategoryEdited(false);
                          }}
                          className="cursor-pointer"
                        />
                      )}
                      <Image
                        src="/trash.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                        // onClick={() => deleteGroup(role._id)}
                        className="cursor-pointer"
                      />
                      <Image
                        src="/archive.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                        onClick={() => {}}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              )
            }
          />
         
          <PaginationBar
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </section>
    </div>
  );
};

export default Coupon