"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
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
    
          setFilteredCategories(response.data);
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
          {(user?.role === "organisation" ||
            (user?.role === "staff" &&
              userPermissions.includes(permissionsMap["create-category"]))) && (
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
          )}
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
                      {(user?.role === "organisation" ||
                        (user?.role === "staff" &&
                          userPermissions.includes(
                            permissionsMap["edit-category"],
                          ))) && (
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
  categoryToBeEdited: string
  actionToTake: "create-category" | "edit-category" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setCategoryCreated: Dispatch<SetStateAction<boolean>>;
  setCategoryEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
}) => {
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  
  
  const { data: category, isLoading: isLoadingCategory } = useQuery(
    {
      queryKey: ["category"],
      queryFn: async () => {
        return client
          .get(`api/categories/${categoryToBeEdited}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );

 



 
  const initialValues: CategoryFormValuesProps = actionToTake === 'edit-category' ? {
    name: category?.name ?? "",
    description: category?.description ?? "",
  } : 
  {
    name: "",
    description: "",
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .max(50, 'Name must be 50 characters or less')
      .required('Name is required'),
    description: Yup.string()
      .max(200, 'Description must be 200 characters or less')
      .required('Description is required'),
  });
  const { data: allPermissions, isLoading: isLoadingAllPermissions } = useQuery(
    {
      queryKey: ["allPermissions"],
      queryFn: async () => {
        return client
          .get("api/permission")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );

  

  const { mutate: CreateCategory, isPending: isCreatingRole } = useMutation({
    mutationKey: ["create category"],
    mutationFn: async (values: CategoryFormValuesProps) => {
      return client.post(`/api/categories`, {
        name: values.name,
        description: values.description,
        
      });
    },

    onSuccess(response) {
      
      setCategoryCreated(true);
      setModalContent("status");
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setCategoryCreated(false);
      setModalContent("status");
      
    },
  });

  const { mutate: editCategory, isPending: isEditingRole } = useMutation({
    mutationKey: ["edit Category"],
    mutationFn: async (values: CategoryFormValuesProps) => {
      return client.put(`/api/categories/${categoryToBeEdited}`, {
        name: values.name,
        description: values.description,
       
      });
    },

    onSuccess(response) {
      setCategoryEdited(true);
      setModalContent("status");

      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setCategoryEdited(false);
      setModalContent("status");


    },
  });

  

  return (
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          if (actionToTake === "create-category") {
            console.log("creating Category.....................");
            CreateCategory(values);
          } else {
            console.log("editing role.....................");
            editCategory(values);
          }

          setSubmitting(false);
        }, 800);
      }}
  >
    {({ isSubmitting, values, submitForm }) => (
      <Form>
       <div className='p-[5%] bg-ajo_purple'>
       <div >
          <label htmlFor="name" className='text-white'>Name</label>
          <Field
          value={values.name}
           type="text"
            id="name" 
            name="name" 
            className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white "
            />
          <ErrorMessage className='text-red-500' name="name" component="div" />
        </div>

        <div className='my-[3%]'> 
          <label className='text-white' htmlFor="description">Description</label>
          <Field 
          values={values.description}
          as="textarea" 
          id="description" 
          name="description" 
          className="w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-sm text-[#7D7D7D]"
          />
          <ErrorMessage className='text-red-500' name="description" component="div" />
        </div>

        <div className="flex justify-center md:w-[100%] mb-8">
        <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            onClick={() => submitForm()}
            disabled={isSubmitting || isCreatingRole}
          >
            {isSubmitting || isCreatingRole || isEditingRole ? (
              <Image
                src="/loadingSpinner.svg"
                alt="loading spinner"
                className="relative left-1/2"
                width={25}
                height={25}
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
       </div>
      </Form>
    )}
  </Formik>
  );
};

export default function Page() {
  return <Categories />;
}
// https://meet.google.com/pbt-gjcf-mdg
