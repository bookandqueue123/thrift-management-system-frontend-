"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { createRoleProps, permissionObject, roleResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Formik } from "formik";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";

const Roles = () => {
  const PAGE_SIZE = 10;
  const organisationId = useSelector(selectOrganizationId);
  const { userPermissions, permissionsMap } = usePermissions();

  const [isRoleCreated, setIsRoleCreated] = useState(false);
  const [isRoleEdited, setIsRoleEdited] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-role" | "create-role" | ""
  >("");
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [roleToBeEdited, setRoleToBeEdited] = useState("");

  const {
    data: allRoles,
    isLoading: isLoadingAllRoles,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      return client
        .get(`/api/industry`, {})
        .then((response: AxiosResponse<roleResponse[], any>) => {
    
          setFilteredRoles(response.data);
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });

 

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
    if (allRoles) {

      const searchQuery = e.target.value.trim().toLowerCase();
      const filtered = allRoles.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFilteredRoles(filtered);
    }
  };

  const paginatedRoles = filteredRoles?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allRoles) {
    totalPages = Math.ceil(allRoles.length / PAGE_SIZE);
  }

  useEffect(() => {
    // Calling refetch to rerun the allRoles query
    refetch();
  }, [isRoleCreated, isRoleEdited, refetch]);

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Roles
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
              userPermissions.includes(permissionsMap["create-role"]))) && (
            <CustomButton
              type="button"
              label="Create a Role"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-role");
                setModalContent("form");
                setIsRoleCreated(false);
              }}
            />
          )}
          
            <CustomButton
              type="button"
              label="Create an Industry"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-role");
                setModalContent("form");
                setIsRoleCreated(false);
              }}
            />
         
        </div>

        <p className="mb-2 text-base font-medium text-white">
          Existing Roles List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Name",
             
           
              "Action",
            ]}
            content={
              filteredRoles.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Roles yet
                  </p>
                </tr>
              ) : (
                paginatedRoles?.map((role: roleResponse, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.name || "----"}
                    </td>

                  
                    

                    <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                     
                        <Image
                          src="/pencil.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => {
                            setModalToShow("edit-role");
                            setModalState(true);
                            setRoleToBeEdited(role._id);
                            setModalContent("form");
                            setIsRoleEdited(false);
                          }}
                          className="cursor-pointer"
                        />
                  
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
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={
                modalToShow === "edit-role"
                  ? "Edit Role"
                  : modalToShow === "create-role"
                    ? "Create a Role"
                    : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  <MutateRole
                    roleToBeEdited={roleToBeEdited}
                    setCloseModal={setModalState}
                    setRoleCreated={setIsRoleCreated}
                    setRoleEdited={setIsRoleEdited}
                    setModalContent={setModalContent}
                    actionToTake={modalToShow}
                  />
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`Role ${modalToShow === "create-role" ? "Creation" : "Editing"} Failed`}
                  status={isRoleCreated || isRoleEdited ? "success" : "failed"}
                  responseMessage=""
                />
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

const MutateRole = ({
    setRoleEdited,
    setRoleCreated,
    setCloseModal,
    actionToTake,
    setModalContent,
    roleToBeEdited,
  }: {
    roleToBeEdited: string;
    actionToTake: "create-role" | "edit-role" | "";
    setCloseModal: Dispatch<SetStateAction<boolean>>;
    setRoleCreated: Dispatch<SetStateAction<boolean>>;
    setRoleEdited: Dispatch<SetStateAction<boolean>>;
    setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
  }) => {
    const { client } = useAuth();
    const [name, setName] = useState('');
    const [natureOfBusiness, setNatureOfBusiness] = useState<string[]>(['']);
    const [businessType, setBusinessType] = useState<'Registered' | 'Unregistered'>('Registered');
    const [submittedData, setSubmittedData] = useState<{
      name: string;
      natureOfBusiness: string[];
      businessType: 'Registered' | 'Unregistered';
    } | null>(null);
  
    useEffect(() => {
      if (actionToTake === "edit-role" && roleToBeEdited) {
        const fetchIndustry = async () => {
          try {
            const response = await client.get(`/api/industry/${roleToBeEdited}`);
            const data = response.data;
            setName(data.name);
            setNatureOfBusiness(data.natureOfBusiness);
            setBusinessType(data.businessType);
          } catch (error) {
            console.error(error);
          }
        };
  
        fetchIndustry();
      }
    }, [actionToTake, roleToBeEdited]);
  
    const handleNatureOfBusinessChange = (index: number, value: string) => {
      setNatureOfBusiness((prev) => {
        const newNatureOfBusiness = [...prev];
        newNatureOfBusiness[index] = value;
        return newNatureOfBusiness;
      });
    };
  
    const addNatureOfBusiness = () => {
      setNatureOfBusiness((prev) => [...prev, '']);
    };
  
    const removeNatureOfBusiness = (index: number) => {
      setNatureOfBusiness((prev) => prev.filter((_, i) => i !== index));
    };
  
    const { mutate: handleMutation, isPending, isError } = useMutation({
      mutationKey: [actionToTake === "create-role" ? "create industry" : "update industry", name],
      mutationFn: async () => {
        if (actionToTake === "create-role") {
          return client.post(`/api/industry`, {
            name: name,
            natureOfBusiness: natureOfBusiness,
            businessType: businessType
          });
        } else if (actionToTake === "edit-role") {
          return client.put(`/api/industry/${roleToBeEdited}`, {
            name: name,
            natureOfBusiness: natureOfBusiness,
            businessType: businessType
          });
        }
      },
      onSuccess(response:any) {
        if (actionToTake === "create-role") {
          setRoleCreated(true);
        } else if (actionToTake === "edit-role") {
          setRoleEdited(true);
        }
        setSubmittedData(response.data);
        setModalContent("status");
        setTimeout(() => {
          setCloseModal(false);
        }, 5000);
      },
      onError(error: AxiosError<any, any>) {
        console.error(error);
        if (actionToTake === "create-role") {
          setRoleCreated(false);
        } else if (actionToTake === "edit-role") {
          setRoleEdited(false);
        }
        setModalContent("status");
      },
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      handleMutation();
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
        >
          <h2 className="text-2xl font-bold mb-4">
            {actionToTake === "edit-role" ? "Edit Industry" : "Create Industry"}
          </h2>
  
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Industry Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nature of Business
            </label>
            {natureOfBusiness.map((nature, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={nature}
                  onChange={(e) => handleNatureOfBusinessChange(index, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeNatureOfBusiness(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNatureOfBusiness}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add another
            </button>
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Registered"
                  checked={businessType === 'Registered'}
                  onChange={() => setBusinessType('Registered')}
                  className="form-radio"
                />
                <span className="ml-2">Registered</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Unregistered"
                  checked={businessType === 'Unregistered'}
                  onChange={() => setBusinessType('Unregistered')}
                  className="form-radio"
                />
                <span className="ml-2">Unregistered</span>
              </label>
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {actionToTake === "edit-role" ? "Update" : "Submit"}
          </button>
        </form>
  
        {submittedData && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <h3 className="text-xl font-bold">
              Industry {actionToTake === "edit-role" ? "Updated" : "Created"} Successfully
            </h3>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Nature of Business:</strong></p>
            <ul>
              {submittedData.natureOfBusiness.map((nature, index) => (
                <li key={index}>{nature}</li>
              ))}
            </ul>
            <p><strong>Business Type:</strong> {submittedData.businessType}</p>
          </div>
        )}
      </div>
    );
  };
  

export default function Page() {
  return <Roles />;
}
