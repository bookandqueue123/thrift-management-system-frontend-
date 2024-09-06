"use client";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import TransactionsTable from "@/components/Tables";
import { useRouter } from "next/navigation";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { FaFileDownload } from "react-icons/fa";
import { MdDelete, MdModeEditOutline } from "react-icons/md";

import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import PaginationBar from "@/components/Pagination";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import CreateOranisationGroupForm from "@/modules/superAdmin/CreateOrganisationGroupForm";
import EditOrganisationGroup from "@/modules/superAdmin/EditGroup";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { OrganisationGroupsProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";

export default function SuperAdminCustomer() {
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const { client } = useAuth();
  const router = useRouter();
  const token = useSelector(selectToken);
  const PAGE_SIZE = 5;
  const [showModal, setShowModal] = useState(false);
  const [removeParentModal, setRemoveParentModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isGroupCreated, setIsGroupCreated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState(false);
  const [modalContent, setModalContent] = useState<"form" | "confirmation">(
    "form",
  );
  const [modalToShow, setModalToShow] = useState<
    "edit-group" | "create-group" | "view-group" | ""
  >("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupToBeEdited, setGroupToBeEdited] = useState("");

  const [isGroupEdited, setIsGroupEdited] = useState(false);
  const [mutationResponse, setMutationResponse] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const {
    data: organizationsGroups,
    isLoading: isUserLoading,
    isError: getGroupError,
    refetch,
  } = useQuery({
    queryKey: ["allOrganizationsGroup"],
    queryFn: async () => {
      return client
        .get(`/api/user?userType=group`, {})
        .then((response) => {
          setFilteredGroups(response.data);
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });
  useEffect(() => {
    // Calling refetch to rerun the allCoupons query
    refetch();
  }, [showSuccessToast, refetch]);
  const paginatedGroups = filteredGroups?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (organizationsGroups) {
    totalPages = Math.ceil(organizationsGroups.length / PAGE_SIZE);
  }

  const handleFromDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setToDate(event.target.value);

    //  handleDateFilter();
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (organizationsGroups) {
      const searchQuery = e.target.value.trim().toLowerCase();
      const filtered = organizationsGroups.filter((item: { groupName: any }) =>
        item.groupName.toLowerCase().includes(searchQuery),
      );
      // Update the filtered data state
      setFilteredGroups(filtered);
    }
  };

  const handleDateFilter = () => {
    if (organizationsGroups) {
      const startDateObj = new Date(fromDate);
      let endDateObj = new Date(toDate);

      // Adjust the endDateObj to the end of the day
      endDateObj.setHours(23, 59, 59, 999);

      if (isNaN(startDateObj.getTime())) {
        console.error("Invalid fromDate:", fromDate);
        return;
      }

      if (isNaN(endDateObj.getTime())) {
        console.error("Invalid toDate:", toDate);
        return;
      }

      const filtered = organizationsGroups.filter(
        (item: { createdAt: string | number | Date }) => {
          const itemDate = new Date(item.createdAt); // Convert item date to Date object
          return itemDate >= startDateObj && itemDate <= endDateObj;
        },
      );

      setFilteredGroups(filtered);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      handleDateFilter();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    // Calling refetch to rerun the allRoles query
    refetch();
  }, [isGroupCreated, refetch]);

  const handleExport = async () => {
    try {
      const response = await fetch(`${apiUrl}api/user/export-groupp`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "group.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to export users:", response);
      }
    } catch (error) {
      console.error("An error occurred while exporting users:", error);
    }
  };

  const handleExcelExport = async () => {
    try {
      const response = await fetch(
        `${apiUrl}api/user/export-superadmin-customer`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "group.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to export users:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while exporting users:", error);
    }
  };

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
    mutationKey: ["deleteGroup"],
    mutationFn: async (groupId: string) => {
      return client.delete(`/api/user/${groupId}`);
    },
    onSuccess(response: AxiosResponse<any, any>) {
      setShowSuccessToast(true);
      console.log(response);
      console.log("deleted Successfully");

      // setIsDeleted(true);
      // setShowSuccessToast(true);
      // setSuccessMessage(
      // `${response.data.deletedUser.groupName} group has been deleted`,
      // );
    },
    onError(error: any) {
      console.log(error);
      setShowErrorToast(true);
      // setIsDeleted(false);
      // console.error(error.response?.data.message ?? error.message);
      // setShowErrorToast(true);
      // setErrorMessage(error.response?.data.message);
    },
  });

  const handleDelete = (groupId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this group?",
    );
    if (confirmDelete) {
      deleteGroup(groupId); // Call the delete function passed as a prop
    }
  };
  return (
    <div>
      {!removeParentModal && showModal ? (
        <Modal setModalState={setShowModal} title="Create Organisation Group">
          <CreateOranisationGroupForm
            setIsGroupCreated={setIsGroupCreated}
            closeModal={setShowModal}
          />
        </Modal>
      ) : (
        ""
      )}
      <div className="mb-4 space-y-2">
        <p className="text-3xl font-bold text-ajo_offWhite text-opacity-60">
          Groups
        </p>
      </div>

      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            {/* <SearchInput onSearch={() => ("")}/> */}
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
            label="Create Group"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setShowModal(true);
              // router.push("/superadmin/group/create-group")
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
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />

            <p className="mx-2 text-white">to</p>
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex">
            <button
              onClick={handleExport}
              className="mr-4 flex rounded border border-white bg-transparent px-4 py-2 font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white"
            >
              Export as CSV{" "}
              <span className="ml-2 mt-1">
                <CiExport />
              </span>
            </button>
            <button
              onClick={handleExcelExport}
              className="relative rounded-md border-none bg-transparent px-4 py-2 text-white"
            >
              <u>Export as Excel</u>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xl text-white">Existing Group List</p>
        </div>

        <TransactionsTable
          headers={[
            "Group Name",
            // "Account Name",
            // "Account Number",
            // "Bank Name,",
            // "Group Type",
            "Total Group Member",
            "Action",
          ]}
          content={
            filteredGroups.length === 0 ? (
              <tr className="h-[3rem]">
                <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                  No Roles yet
                </p>
              </tr>
            ) : (
              paginatedGroups?.map(
                (group: OrganisationGroupsProps, index: number) => (
                  <tr className="" key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {group.groupName}
                    </td>
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {group.account_name}
                  </td> */}
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {group.account_number}
                  </td> */}
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {group.bank_name} customers
                  </td> */}
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {group.group_type}
                  </td> */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm ">
                      {group.organisations.length} Members
                    </td>

                    <td className="flex whitespace-nowrap px-6 py-4 text-sm">
                      <div className="">
                        <MdModeEditOutline
                          onClick={() => {
                            setModalToShow("edit-group");
                            setModalState(true);
                            setGroupToBeEdited(group._id);
                          }}
                        />
                      </div>
                      <div className="mx-6">
                        <MdDelete onClick={() => handleDelete(group._id)} />
                      </div>
                      <div className="">
                        <FaFileDownload />
                      </div>
                    </td>
                  </tr>
                ),
              )
            )
          }
        />
        {showSuccessToast && <SuccessToaster message={"Sign in successful!"} />}
        {showErrorToast && <ErrorToaster message={"Error deleting group"} />}

        {modalState && (
          <Modal
            setModalState={setModalState}
            title={modalToShow === "edit-group" ? "Edit Group" : ""}
          >
            {modalContent === "form" ? (
              <div className="px-[10%]">
                {modalToShow === "view-group" ? (
                  ""
                ) : (
                  <EditOrganisationGroup
                    organisationGroups={organizationsGroups}
                    setCloseModal={setModalState}
                    setGroupMutated={setIsGroupEdited}
                    actionToTake={modalToShow}
                    groupToBeEdited={groupToBeEdited}
                    setGroupEdited={setIsGroupEdited}
                    setModalContent={setModalContent}
                    setMutationResponse={setMutationResponse}
                  />
                )}
              </div>
            ) : (
              <ModalConfirmation
                successTitle={`Role ${modalToShow === "create-group" ? "Creation" : "Editing"} Successful`}
                errorTitle={`Role ${modalToShow === "create-group" ? "Creation" : "Editing"} Failed`}
                status={isGroupCreated || isGroupEdited ? "success" : "failed"}
                responseMessage={mutationResponse}
              />
            )}
          </Modal>
        )}

        <PaginationBar
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
