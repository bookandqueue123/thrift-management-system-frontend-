"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import { CustomButton, FilterDropdown } from "@/components/Buttons";
import Modal, { ModalConfirmation } from "@/components/Modal";
import PaginationBar from "@/components/Pagination";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { createGatewayProps, createRoleProps, permissionObject, roleResponse } from "@/types";
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

const PaymentGateway = () => {
  const PAGE_SIZE = 10;
  const organisationId = useSelector(selectOrganizationId);
  const { userPermissions, permissionsMap } = usePermissions();

  const [isPaymentGatewayCreated, setIsPaymentGatewayCreated] = useState(false);
  const [isPaymentGatewayEdited, setIsPaymentGatewayEdited] = useState(false);
  const [filteredPaymentGateways, setFilteredPaymentGateways] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  

  const { client } = useAuth();
  const user = useSelector(selectUser);

  const [modalState, setModalState] = useState(false);
  const [modalToShow, setModalToShow] = useState<
    "edit-payment-gateway" | "create-payment-gateway" | ""
  >("");
  const [modalContent, setModalContent] = useState<"status" | "form" | "">(
    "form",
  );
  const [gatewayToBeEdited, setPaymentGatewayToBeEdited] = useState("");

  const {
    data: allGateways,
    isLoading: isLoadingAllGatallGateways,
    refetch,
  } = useQuery({
    queryKey: ["allGateways"],
    queryFn: async () => {
      return client
        .get(`api/payment-gateway`, {})
        .then((response) => {
    
          setFilteredPaymentGateways(response.data);
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
    if (allGateways) {

      const searchQuery = e.target.value.trim().toLowerCase();
      const filtered = allGateways.filter((item: { name: string; }) =>
        item.name.toLowerCase().includes(searchQuery)
      );
      setFilteredPaymentGateways(filtered);
    }
  };

  const paginatedPaymentGateways = filteredPaymentGateways?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  let totalPages = 0;
  if (allGateways) {
    totalPages = Math.ceil(allGateways.length / PAGE_SIZE);
  }

  useEffect(() => {
    // Calling refetch to rerun the allGateways query
    refetch();
  }, [isPaymentGatewayCreated, isPaymentGatewayEdited, refetch]);

  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-xl font-bold text-ajo_offWhite text-opacity-60">
          Superadmin fee
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
          
            {/* <CustomButton
              type="button"
              label="Create a Role"
              style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
              onButtonClick={() => {
                setModalState(true);
                setModalToShow("create-payment-gateway");
                setModalContent("form");
                setIsPaymentGatewayCreated(false);
              }}
            /> */}
        
        </div>

        <p className="mb-2 text-base font-medium text-white">
          Existing Gateway
        </p>

        <div>
          <TransactionsTable
            headers={[
                "S/N",
              "Payment Gateway",
              "Assign Superadmin Fee(Fixed)",
              "Assign Superadmin Fee(% based)",
              "Action",
            ]}
            content={
              filteredPaymentGateways.length === 0 ? (
                <tr className="h-[3rem]">
                  <p className="relative left-[80%] mt-3 text-center text-sm font-semibold text-ajo_offWhite md:left-[180%]">
                    No Payment Gateway yet
                  </p>
                </tr>
              ) : (
                paginatedPaymentGateways?.map((Gateway, index) => (
                  <tr className="" key={index + 1}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {Gateway.name || "----"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {Gateway.fixedFee || "----"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {Gateway.percentageFee || "----"}
                    </td>
                    {/* <td className="whitespace-nowrap px-6 py-4 text-sm capitalize"> */}
                      
                      {/* {allPermissions
                        ?.filter((permission) =>
                          Gateway.permissions.some(
                            (eachPermission) =>
                              eachPermission._id === permission._id,
                          ),
                        )
                        .map((filteredPermission) => (
                          <ul key={filteredPermission._id}>
                            <li className="my-1 list-disc marker:text-ajo_offWhite">
                              {filteredPermission.title.replaceAll("-", " ")}
                            </li>
                          </ul>
                        )) || "----"}
                    </td> */}

                    <td className="flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                      
                        <Image
                          src="/pencil.svg"
                          alt="pencil"
                          width={20}
                          height={20}
                          onClick={() => {
                            setModalToShow("edit-payment-gateway");
                            setModalState(true);
                            setPaymentGatewayToBeEdited(Gateway._id);
                            setModalContent("form");
                            setIsPaymentGatewayEdited(false);
                          }}
                          className="cursor-pointer"
                        />
                    
                      <Image
                        src="/trash.svg"
                        alt="pencil"
                        width={20}
                        height={20}
                        // onClick={() => deleteGroup(Gateway._id)}
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
                modalToShow === "edit-payment-gateway"
                  ? "Edit Gateway"
                  : modalToShow === "create-payment-gateway"
                    ? "Create a Gateway"
                    : ""
              }
            >
              {modalContent === "form" ? (
                <div className="px-[10%]">
                  <MutateGateway
                    gatewayToBeEdited={gatewayToBeEdited}
                    setCloseModal={setModalState}
                    setGatewayCreated={setIsPaymentGatewayCreated}
                    setGatewayEdited={setIsPaymentGatewayEdited}
                    setModalContent={setModalContent}
                    actionToTake={modalToShow}
                  />
                </div>
              ) : (
                <ModalConfirmation
                  successTitle={`Gateway ${modalToShow === "create-payment-gateway" ? "Creation" : "Editing"} Successful`}
                  errorTitle={`Gateway ${modalToShow === "create-payment-gateway" ? "Creation" : "Editing"} Failed`}
                  status={isPaymentGatewayCreated || isPaymentGatewayEdited ? "success" : "failed"}
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

const MutateGateway = ({
  setGatewayEdited,
  setGatewayCreated,
  setCloseModal,
  actionToTake,
  setModalContent,
  gatewayToBeEdited,
}: {
  gatewayToBeEdited: string
  actionToTake: "create-payment-gateway" | "edit-payment-gateway" | "";
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setGatewayCreated: Dispatch<SetStateAction<boolean>>;
  setGatewayEdited: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<"" | "status" | "form">>;
}) => {
  const { client } = useAuth();
  console.log(gatewayToBeEdited)
  const organisationId = useSelector(selectOrganizationId);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  
  
  const { data: gateway, isLoading: isLoadingGateway } = useQuery(
    {
      queryKey: ["gateway"],
      queryFn: async () => {
        return client
          .get(`api/payment-gateway/${gatewayToBeEdited}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  );


 console.log(gateway)

  useEffect(() => {
    if(actionToTake === "edit-payment-gateway"){
      if (gateway?.permissions) {
      const permissionsIds = gateway?.permissions?.map((permissions: { _id: any }) => permissions._id);
      setAssignedPermissions(permissionsIds || []);
    }
    }
    else{
      setAssignedPermissions([])
    }
    
  }, [gateway, actionToTake]);

 
  const initialValues: createGatewayProps = actionToTake === 'edit-payment-gateway' ? {
    name: gateway?.name ?? "",
 
    feeType: gateway?.feeType ?? "",
    fixedFee: gateway?.fixedFee ?? "",
    percentageFee: gateway?.percentageFee?? "",

    
  } : 
  {
    name: "",
    feeType: "",
    fixedFee: "",
    percentageFee:"",
   
  }
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

  

  const { mutate: createGateway, isPending: isCreatingRole } = useMutation({
    mutationKey: ["create role"],
    mutationFn: async (values: createGatewayProps) => {
      return client.post(`api/payment-gateway`, {
        name: values.name,
       
    
      });
    },

    onSuccess(response) {
      
      setGatewayCreated(true);
      setModalContent("status");
      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setGatewayCreated(false);
      setModalContent("status");

    },
  });

  const { mutate: editRole, isPending: isEditingGateway } = useMutation({
    mutationKey: ["edit role"],
    mutationFn: async (values: createGatewayProps) => {
     
      return client.put(`api/payment-gateway/${gatewayToBeEdited}`, {
        name: values.name,
        feeType: values.feeType,
        percetageFee: values.feeType === "fixedFee" ? '' : values.percentageFee,
        fixedFee: values.feeType === "fixedFee" ? values.fixedFee : '',
      });
    },

    onSuccess(response) {
      setGatewayEdited(true);
      setModalContent("status");

      setTimeout(() => {
        setCloseModal(false);
      }, 5000);
    },

    onError(error: AxiosError<any, any>) {
      setGatewayEdited(false);
      setModalContent("status");


    },
  });

  

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={Yup.object({
        name: Yup.string().required("Required"),
        feeType: Yup.string().required('Required'),
    fixedFee: Yup.number()
        .nullable()
        .when('feeType', (feeType: any, schema) => {
            return feeType === 'fixedFee'
                ? schema.required('Fixed Fee is required when Fixed Fee is selected')
                : schema.nullable();
        }),
    percentage: Yup.number()
        .nullable()
        .when('feeType', (feeType: any, schema) => {
            return feeType === 'percentage'
                ? schema.required('Percentage is required when Percentage is selected')
                : schema.nullable();
        }),
      })}
      onSubmit={(values, { setSubmitting }) => {
       
        setTimeout(() => {
          if (actionToTake === "create-payment-gateway") {
            console.log("creating role.....................");
            createGateway(values);
          } else {
            console.log("editing role.....................");
            editRole(values);
          }

          setSubmitting(false);
        }, 800);
      }}
    >
      {({
        isSubmitting,
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldValue,
        submitForm,
      }) => (
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="mb-10 w-full rounded-md bg-white px-[5%] py-[3%]">
            <div className="space-y-3">
              <div className="">
                <label
                  htmlFor="name"
                  className="m-0 text-xs font-medium text-ajo_darkBlue"
                >
                  Role Name / Title
                </label>
                <Field
                  onChange={handleChange}
                  name="name"
                  type="text"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              <div  className="space-y-3">
                <label className="m-0 text-xs font-medium text-ajo_darkBlue">
                    <Field type="radio" name="feeType" value="fixedFee" />
                    Fixed Fee
                </label>
                <label className="ml-4 m-0 text-xs font-medium text-ajo_darkBlue">
                    <Field type="radio" name="feeType" value="percentageFee" />
                    Percentage
                </label>
                <ErrorMessage name="feeType" component="div" />
              </div>

                {values.feeType === 'fixedFee' && (
                    <div>
                        <label>Fixed Fee</label>
                        <Field className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300" type="number" name="fixedFee" />
                        <ErrorMessage name="fixedFee" component="div" />
                    </div>
                )}

                {values.feeType === 'percentageFee' && (
                    <div>
                        <label>Percentage</label>
                        <Field className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] outline-gray-300" type="number" name="percentageFee" />
                        <ErrorMessage name="percentageFee" component="div" />
                    </div>
                )}

              
                   
               
            </div>
          </div>
          <button
            type="submit"
            className="w-1/2 rounded-md bg-ajo_blue py-3 text-sm font-semibold  text-white hover:bg-indigo-500 focus:bg-indigo-500"
            onClick={() => submitForm()}
            disabled={isSubmitting || isCreatingRole}
          >
            {isSubmitting || isCreatingRole || isEditingGateway ? (
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
        </form>
      )}
    </Formik>
  );
};

export default function Page() {
  return <PaymentGateway />;
}
