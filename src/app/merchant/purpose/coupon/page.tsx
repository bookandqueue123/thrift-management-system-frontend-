"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { CategoryFormValuesProps, permissionObject, ICouponProps } from "@/types";
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

const Categories = () => {
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
    <>
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
              "Action",
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
          {modalState && (
            <Modal
              setModalState={setModalState}
              title={
                modalToShow === "edit-coupon"
                  ? "Edit Category"
                  : modalToShow === "create-coupon"
                    ? "Create Coupon"
                    : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  <MutateCategory
                    categoryToBeEdited={categoryToBeEdited}
                    setCloseModal={setModalState}
                    setCategoryCreated={setIsCouponCreated}
                    setCategoryEdited={setIsCategoryEdited}
                    setModalContent={setModalContent}
                    actionToTake={modalToShow}
                  />
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Coupon ${modalToShow === "create-coupon" ? "Creation" : "Editing"} Successful, Check your mail to verify the coupon`}
                  errorTitle={`Coupon ${modalToShow === "create-coupon" ? "Creation" : "Editing"} Failed`}
                  status={isCouponCreated || isCategoryEdited ? "success" : "failed"}
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
  actionToTake: "create-coupon" | "edit-coupon" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setCategoryCreated: Dispatch<SetStateAction<boolean>>;
  setCategoryEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
}) => {
  const { client } = useAuth();
  const organisationId = useSelector(selectOrganizationId);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  
  const initialValues: ICouponProps = {
    name: '',
    description: '',
    amount: '',
    applyToPurpose: '',
    selectedCategories: [],
    selectedIndividualPurpose: '',
    applyToCustomers: '',
    selectedCustomerGroup: '',
    selectedIndividualCustomer: '',
    startTime: '',
    startDate: '',
    endTime: '',
    endDate: '',
    notifications: [],
    organisation: organisationId,
    _id: function (_id: any): string {
      throw new Error("Function not implemented.");
    }
  }
  
  const { data: categories, isLoading: isLoadingCategory } = useQuery(
    {
      queryKey: ["category"],
      queryFn: async () => {
        return client
          .get(`api/categories`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );


 



 

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

  

  const { mutate: CreateCoupon, isPending: isCreatingCoupon } = useMutation({
    mutationKey: ["create Coupon"],
    mutationFn: async (values: ICouponProps) => {
      return client.post(`/api/coupon`, values);
    },

    onSuccess(response) {
      
      setCategoryCreated(true);
      setModalContent("status");
      setTimeout(() => {
        // setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setCategoryCreated(false);
      setModalContent("status");
      
    },
  });

  const {
    data: allPurpose,
    isLoading: isLoadingAllPurpose,
    refetch,
  } = useQuery({
    queryKey: ["allpurpose"],
    queryFn: async () => {
      return client
        .get(
          `/api/purpose?organisation=${organisationId}`,
          {},
        )
        .then((response) => {
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
     
          throw error;
        });
    },
    staleTime: 5000,
  });

  const {
    data: GroupCustomers,
    isLoading: isGroupLoading,
    isError: isGroupError,
  } = useQuery({
    queryKey: ["groupCustomers", ],
    queryFn: async () => {
      return client
        .get(
          `/api/user?organisation=${organisationId}&userType=group`,
          {},
        )
        .then((response) => {
          
            return response.data;
        
        })
        .catch((error) => {
            console.log(error)
          throw error;
        });
    },
  });
  
  const {
    data: IndividualCustomers,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["Individual Customers", ],
    queryFn: async () => {
      return client
        .get(
          `/api/user?organisation=${organisationId}`,
          {},
        )
        .then((response) => {
          
            return response.data;
        
        })
        .catch((error) => {
            console.log(error)
          throw error;
        });
    },
  });



  const CouponFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    amount: Yup.number().required('Amount is required').min(0, 'Amount must be positive'),
    applyToPurpose: Yup.string().required('Selection is required'),
    applyToCustomers: Yup.string().required('Selection is required'),
    startTime: Yup.string().required('Start time is required'),
    startDate: Yup.date().required('Start date is required').nullable(),
    endTime: Yup.string().required('End time is required'),
    endDate: Yup.date().required('End date is required').nullable(),
    notifications: Yup.array().of(Yup.string())
  });


  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showIndividualPurposeSelect, setShowIndividualPurposeSelect] = useState(false);
  const [showGroupCustomerSelect, setShowGroupCustomerSelect] = useState(false);
  const [showIndividualCustomerSelect, setShowIndividualCustomerSelect] = useState(false);


  return (
    <div >
      {/* <h1 className="text-2xl font-bold mb-6">Create Coupon</h1> */}
      <Formik
        initialValues={initialValues}
        validationSchema={CouponFormSchema}
        onSubmit={(values) => {
          console.log('Form Values', values);
       CreateCoupon(values)
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
              <Field name="name" type="text" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
              <Field name="description" as="textarea" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-white">Amount</label>
              <Field name="amount" type="number" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
              <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Apply to Purpose</label>
              <div role="group" className="flex flex-col-3 justify-between ">
                <label className="block text-white">
                  <Field type="radio" name="applyToPurpose" value="all-purpose" onClick={() => { setShowCategorySelect(false); setShowIndividualPurposeSelect(false); }} />
                  <span className="ml-2">All purpose</span>
                </label>
                <label className="block text-white">
                  <Field type="radio" name="applyToPurpose" value="select-category" onClick={() => { setShowCategorySelect(true); setShowIndividualPurposeSelect(false); }} />
                  <span className="ml-2">Select category of purpose/item</span>
                </label>
                
                <label className="block text-white">
                  <Field type="radio" name="applyToPurpose" value="select-individual" onClick={() => { setShowCategorySelect(false); setShowIndividualPurposeSelect(true); }} />
                  <span className="ml-2">Select individual purpose/item</span>
                </label>
                
              </div>
              {showCategorySelect && (
                  <div className="mt-2">
                    <Field name="selectedCategories" as="select" className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Select Category</option>
                      {categories.map((category: { _id: string | number | readonly string[] | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
                        <option value={category._id}>{category.name}</option>
                      ))}
                     
                    </Field>
                  </div>
                )}
                {showIndividualPurposeSelect && (
                  <div className="mt-2">
                    <Field name="selectedIndividualPurpose" as="select" className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Select all purpose</option>
                      {allPurpose.map((purpose: { _id: string | number | readonly string[] | undefined; purposeName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
                        <option value={purpose._id}>{purpose.purposeName}</option>
                      ))}
                      
                      
                    </Field>
                  </div>
                )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Apply to Customers</label>
              <div role="group" className="flex flex-col-3 justify-between">
                <label className="block text-white">
                  <Field type="radio" name="applyToCustomers" value="all-customers" onClick={() => { setShowGroupCustomerSelect(false); setShowIndividualCustomerSelect(false); }} />
                  <span className="ml-2">All customers</span>
                </label>
                <label className="block text-white">
                  <Field type="radio" name="applyToCustomers" value="group-of-customers" onClick={() => { setShowGroupCustomerSelect(true); setShowIndividualCustomerSelect(false); }} />
                  <span className="ml-2">Group of customers</span>
                </label>
                
                <label className="block text-white">
                  <Field type="radio" name="applyToCustomers" value="individual-customer" onClick={() => { setShowGroupCustomerSelect(false); setShowIndividualCustomerSelect(true); }} />
                  <span className="ml-2">Individual customer</span>
                </label>
                
              </div>
              {showGroupCustomerSelect && (
                  <div className="mt-2">
                    <Field name="selectedCustomerGroup" as="select" className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Select group</option>
                      {GroupCustomers.map((group: { _id: string | number | readonly string[] | undefined; groupName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => (
                        <option value={group._id}>{group.groupName}</option>
                      ))}
      
          
                    </Field>
                  </div>
                )}
                {showIndividualCustomerSelect && (
                  <div className="mt-2">
                    <Field name="selectedIndividualCustomer" as="select" className="block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Select a customer</option>
                      {IndividualCustomers.map((IndividualCustomer: { firstName: any; lastName: any; }) => (
                        <option value="">{IndividualCustomer.firstName + IndividualCustomer.lastName}</option>
                      ))}
                      
                    </Field>
                  </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-white">Start Time</label>
                <Field name="startTime" type="time" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
                <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-white">Start Date</label>
                <Field name="startDate" type="date" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
                <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-white">End Time</label>
                <Field name="endTime" type="time" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
                <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-white">End Date</label>
                <Field name="endDate" type="date" className="bg-gray-50  border text-black text-sm rounded-md block w-full p-3 dark:bg-gray-700  dark:placeholder-black dark:text-white" />
                <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Notifications</label>
              <div role="group" className="flex flex-col-3 ">
                <label className="block text-white">
                  <Field type="checkbox" name="notifications" value="email" />
                  <span className="ml-2">Email</span>
                </label>
                <label className="block text-white px-4">
                  <Field type="checkbox" name="notifications" value="sms" />
                  <span className="ml-2">SMS</span>
                </label>
                <label className="block text-white">
                  <Field type="checkbox" name="notifications" value="whatsapp" />
                  <span className="ml-2">WhatsApp</span>
                </label>
              </div>
            </div>

            <div className="text-center">
            <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            // onClick={() => submitForm()}
            disabled={isSubmitting || isCreatingCoupon}
          >
            {isSubmitting || isCreatingCoupon  ? (
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default function Page() {
  return <Categories />;
}
// https://meet.google.com/pbt-gjcf-mdg
