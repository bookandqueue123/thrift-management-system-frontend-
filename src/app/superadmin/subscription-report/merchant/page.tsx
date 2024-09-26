"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import { StatusIndicator } from "@/components/StatusIndicator";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { customer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, useState } from "react";
import { CiExport } from "react-icons/ci";
import { useSelector } from "react-redux";

const SubscriptionReport = () => {
  const PAGE_SIZE = 5;
  const organisationId = useSelector(selectOrganizationId);

  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { client } = useAuth();

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-user" | "create-user" | "view-user" | ""
  >("");
  const [isUserCreated, setIsUserCreated] = useState(false);

  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );

  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };

  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response: AxiosResponse<customer[], any>) => {
          setFilteredUsers(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          throw error;
        });
    },
    staleTime: 5000,
  });
  console.log(allUsers);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // setSearchResult(e.target.value);

    if (allUsers) {
      const filtered = allUsers.filter((item) =>
        String(item.firstName || item.lastName).includes(
          String(e.target.value),
        ),
      );
      // Update the filtered data state
      setFilteredUsers(filtered);
    }
  };
  const handleDateFilter = () => {
    // Filter the data based on the date range
    if (allUsers) {
      const filtered = allUsers.filter((item) => {
        const itemDate = new Date(item.createdAt); // Convert item date to Date object
        const startDateObj = new Date(fromDate);
        const endDateObj = new Date(toDate);

        return itemDate >= startDateObj && itemDate <= endDateObj;
      });

      // Update the filtered data state
      setFilteredUsers(filtered);
    }
  };

  const paginatedRoles = filteredUsers?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allUsers) {
    totalPages = Math.ceil(allUsers.length / PAGE_SIZE);
  }

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Subscription Report
        </p>
      </div>
      <section>
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <FilterDropdown options={["Account Number"]} />

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
          <CustomButton
            type="button"
            label="Create User"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
            onButtonClick={() => {
              setModalState(true);
              setModalToShow("create-user");
              setModalContent("form");
              setIsUserCreated(false);
            }}
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="mb-2 text-base font-medium text-white">Super Users</p>

          <button className="flex rounded border border-white bg-transparent px-4 py-2 text-sm font-medium text-white hover:border-transparent hover:bg-blue-500 hover:text-white">
            Export as CSV{" "}
            <span className="ml-2 mt-1">
              <CiExport />
            </span>
          </button>
        </div>

        <div>
          <TransactionsTable
            headers={[
              "S/N",
              "Merchant",
              "Account Number",
              "Subscription Package",
              "Phone Number",
              "Address",
              "No of Assigned Org",
              "Action",
            ]}
            content={
              filteredUsers.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Subscription yet
                  </p>
                </tr>
              ) : (
                paginatedRoles?.map((user, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.organisationName || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.accountNumber || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.subscriptions.find(
                        (subscription: { isActive: boolean }) =>
                          subscription.isActive === true,
                      )?.name || "No active subscription"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.phoneNumber || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.homeAddress || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.assignedUser.length}
                    </td>
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {user.assignedOrgName || "----"}
                    </td> */}

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusIndicator
                        label={`Actions`}
                        clickHandler={() => {
                          setOpenDropdown(index + 1);
                          if (index + 1 === openDropdown) {
                            toggleDropdown(openDropdown);
                          } else {
                            toggleDropdown(index + 1);
                          }
                        }}
                        dropdownEnabled
                        dropdownContents={{
                          labels: ["View User", "Edit User"],
                          actions: [
                            () => {
                              setModalState(true);
                              setModalToShow("view-user");
                            },
                            () => {
                              setModalToShow("edit-user");
                              setModalState(true);
                            },
                          ],
                        }}
                        openDropdown={openDropdown}
                        toggleDropdown={toggleDropdown}
                        currentIndex={index + 1}
                      />
                    </td>
                  </tr>
                ))
              )
            }
          />
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={
                modalToShow === "edit-user"
                  ? "Edit User"
                  : modalToShow === "create-user"
                    ? "Create Super User"
                    : modalToShow === "view-user"
                      ? "View Super User"
                      : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  {
                    modalToShow === "view-user"
                      ? "a"
                      : // <ViewUser userId={userToBeEdited} />
                        ""
                    //     <MutateUser
                    //       setCloseModal={setModalState}
                    //       setUserMutated={setIsUserMutated}
                    //       actionToTake={modalToShow}
                    //       setUserCreated={setIsUserCreated}
                    //       setUserEdited={setIsUserEdited}
                    //       setModalContent={setModalContent}
                    //       setMutationResponse={setMutationResponse}
                    //       userToBeEdited={userToBeEdited}
                    //     />
                    //
                  }
                </div>
              ) : (
                ""
                // <ModalConfirmation
                //   successTitle={`User ${modalToShow === "create-user" ? "Creation" : modalToShow === "edit-user" ? "Editing": ""} Successful`}
                //   errorTitle={`User ${modalToShow === "create-user" ? "Creation" : "Editing"} Failed`}
                //   status={isUserCreated || isUserEdited ? "success" : "failed"}
                //   responseMessage={mutationResponse}
                // />
              )}
            </Modal>
          )}
          <PaginationBar
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
};
export default SubscriptionReport;
