"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser, selectUserId } from "@/slices/OrganizationIdSlice";
import { CategoryFormValuesProps, permissionObject, roleResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
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

const Categories = () => {
  const PAGE_SIZE = 10;
  const organisationId = useSelector(selectOrganizationId);
  const { userPermissions, permissionsMap } = usePermissions();

  const [isCategoryCreated, setIsCategoryCreated] = useState(false);
  const [isCategoryEdited, setIsCategoryEdited] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-category" | "create-category" | ""
  >("");
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [categoryToBeEdited, setCategoryToBeEdited] = useState("");

  const {
    data: allCatgories,
    isLoading: isLoadingAllCategories,
    refetch,
  } = useQuery({
    queryKey: ["allCatgories"],
    queryFn: async () => {
      return client
        .get(`/api/categories?organisation=${organisationId}`, {})
        .then((response: AxiosResponse<roleResponse[], any>) => {
    
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {

          throw error;
        });
    },
    staleTime: 5000,
  });

  useEffect(() => {
    const superadminCategories = allCatgories?.filter(category => category.ownerRole === 'superadmin');
        

        setFilteredCategories(superadminCategories || []);
  }, [allCatgories])

 

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
    if (allCatgories) {

      const searchQuery = e.target.value.trim().toLowerCase();
      const filtered = allCatgories.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFilteredCategories(filtered);
    }
  };

  const paginatedCategories = filteredCategories?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allCatgories) {
    totalPages = Math.ceil(allCatgories.length / PAGE_SIZE);
  }

  useEffect(() => {
    // Calling refetch to rerun the allCatgories query
    refetch();
  }, [isCategoryCreated, isCategoryEdited, refetch]);

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Categories
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
         
            <CustomButton
              type="button"
              label="Create a Category"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-category");
                setModalContent("form");
                setIsCategoryCreated(false);
              }}
            />
        
        </div>

        <p className="mb-2 text-base font-medium text-white">
          Existing Categories List
        </p>

        <div>
          <TransactionsTable
            headers={[
              "Category Name",
              "Description",
              "Action",
            ]}
            content={
              filteredCategories.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Categories yet
                  </p>
                </tr>
              ) : (
                paginatedCategories?.map((role: roleResponse, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.name || "----"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {role.description || "----"}
                    </td>
                    
                    <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                      
                        <Image
                          src="/pencil.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => {
                            setModalToShow("edit-category");
                            setModalState(true);
                            setCategoryToBeEdited(role._id);
                            setModalContent("form");
                            setIsCategoryEdited(false);
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
                modalToShow === "edit-category"
                  ? "Edit Category"
                  : modalToShow === "create-category"
                    ? "Create a Category"
                    : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  <MutateCategory
                    categoryToBeEdited={categoryToBeEdited}
                    setCloseModal={setModalState}
                    setCategoryCreated={setIsCategoryCreated}
                    setCategoryEdited={setIsCategoryEdited}
                    setModalContent={setModalContent}
                    actionToTake={modalToShow}
                  />
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Category ${modalToShow === "create-category" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`Category ${modalToShow === "create-category" ? "Creation" : "Editing"} Failed`}
                  status={isCategoryCreated || isCategoryEdited ? "success" : "failed"}
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

const MutateCategory = ({
    setCategoryEdited,
    setCategoryCreated,
    setCloseModal,
    actionToTake,
    setModalContent,
    categoryToBeEdited,
  }: {
    categoryToBeEdited: string;
    actionToTake: "create-category" | "edit-category" | "";
    setCloseModal: Dispatch<SetStateAction<boolean>>;
    setCategoryCreated: Dispatch<SetStateAction<boolean>>;
    setCategoryEdited: Dispatch<SetStateAction<boolean>>;
    setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
  }) => {
    const { client } = useAuth();
    const userId = useSelector(selectUserId)
    

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submittedData, setSubmittedData] = useState<{
      name: string;
      description: string;
    } | null>(null);
  
    useEffect(() => {
      if (actionToTake === "edit-category" && categoryToBeEdited) {
        const fetchCategory = async () => {
          try {
            const response = await client.get(`/api/categories/${categoryToBeEdited}`);
            const data = response.data;
    
            setName(data.name);
            setDescription(data.description);
          } catch (error) {
            console.error(error);
          }
        };
  
        fetchCategory();
      }
    }, [actionToTake, categoryToBeEdited]);
  
    const { mutate: handleMutation, isPending, isError } = useMutation({
      mutationKey: [actionToTake === "create-category" ? "create category" : "update category", name],
      mutationFn: async () => {
        if (actionToTake === "create-category") {
          return client.post(`/api/categories`, {
            name: name,
            description: description,
            ownerRole: "superadmin",
             ownerId: userId
          });
        } else if (actionToTake === "edit-category") {
          return client.put(`/api/categories/${categoryToBeEdited}`, {
            name: name,
            description: description,
          });
        }
      },
      onSuccess(response: any) {
        if (actionToTake === "create-category") {
          setCategoryCreated(true);
        } else if (actionToTake === "edit-category") {
          setCategoryEdited(true);
        }
        setSubmittedData(response.data);
        setModalContent("status");
        setTimeout(() => {
          setCloseModal(false);
        }, 5000);
      },
      onError(error: AxiosError<any, any>) {
        console.error(error);
        if (actionToTake === "create-category") {
          setCategoryCreated(false);
        } else if (actionToTake === "edit-category") {
          setCategoryEdited(false);
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
            {actionToTake === "edit-category" ? "Edit Category" : "Create Category"}
          </h2>
  
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {actionToTake === "edit-category" ? "Update" : "Submit"}
          </button>
        </form>
  
        {submittedData && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <h3 className="text-xl font-bold">
              Category {actionToTake === "edit-category" ? "Updated" : "Created"} Successfully
            </h3>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Description:</strong> {submittedData.description}</p>
          </div>
        )}
      </div>
    );
  };
  

  
  

export default function Page() {
  return <Categories />;
}

