// components/WithdrawalForm.tsx
import { ErrorMessage, Field, Form, Formik,  } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { selectOrganizationId } from "@/slices/OrganizationIdSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { allSavingsResponse, savingsFilteredById } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuccessToaster, { ErrorToaster } from "@/components/toast";


const WithdrawalFormScema = Yup.object().shape({
  accountName: Yup.string().required("Account Name is required"),
  selectedAccountPurpose: Yup.string().required(
    "Selected Account Purpose is required",
  ),
  amount: Yup.number()
    .required("Amount is required")
    .min(0, "Amount must be greater than or equal to 0"),
  narration: Yup.string(),
});

interface withdrawValuesProps

{
    accountName?: string,
  amount: number, 
  selectedAccountPurpose: string
  narration?: string
}
const WithdrawalForm = () => {

  const initialValues:withdrawValuesProps = {
    accountName: "",
    selectedAccountPurpose: "",
    amount: 0,
    narration: "",
  }
  const router = useRouter()
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedNameId, setSelectNameId] = useState("")
  const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);
  const { client } = useAuth();
  const organizationId = useSelector(selectOrganizationId);
  const {
    data: allUsers,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["allgroups",],
    queryFn: async () => {
      return client
        .get(
          `/api/user?organisation=${organizationId}`,
          {},
        )
        .then((response) => {
         
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });

  const { data: allSavings, isLoading: isLoadingAllSavings } = useQuery({
    queryKey: ["allSavings"],
    staleTime: 5000,
    queryFn: async () => {
      return client
        .get(`/api/saving/get-savings?organisation=${organizationId}`)
        .then((response: AxiosResponse<allSavingsResponse, any>) => {
          
          return response.data;
        })
        .catch((error: AxiosError<any, any>) => {
          console.log(error.response);
          throw error;
        });
    },
  });


  const MyEffectComponent = ({ formikValues }: {formikValues: any}) => {
    useEffect(() => {
      // This function will run whenever the value of 'formikValues.myField' changes
      setSelectNameId(formikValues.accountName);
    }, [formikValues.accountName]); // Add 'formikValues.myField' as a dependency
  
    return null; // Since this is a utility component, it doesn't render anything
  };


  const {
    mutate: WithdrawerMutation,
    isPending: isWithdrawalPending,
    isError: isWithdrawalError,
  } = useMutation({
    mutationKey: ["withdrawal mutation"],
    mutationFn: async (values :withdrawValuesProps) => {
      console.log(values)
      return client.post(`/api/withdrawal/${organizationId}`, {
        amount: values.amount,
        savingId: values.selectedAccountPurpose
    
    });
    },

    onSuccess(response: AxiosResponse<any, any>) {
      
      setShowSuccessToast(true);
      console.log(response);
      
      setSuccessMessage((response as any).response.data.message);

      setTimeout(() => {}, 3500);
    },

    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
      // setErrorMessage(error.data)
    },
  });
  
  useEffect(() => {
    if(allSavings?.savings){
      const filtered = allSavings.savings.filter(
        (item) => item.user._id === selectedNameId,
      )
      setFilteredArray(filtered)
    }
  }, [allSavings?.savings, selectedNameId])



  return (
    <div className="flex  bg-pendingBg  mb-8 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={WithdrawalFormScema}
        onSubmit={(values, { setSubmitting }) => {
          WithdrawerMutation(values)
          console.log(values);
          setSubmitting(false)
        }}
      >
        
        {({ values, handleChange, isSubmitting}) => (
          <>
          <Form className="bg-red w-full rounded-lg p-4">
          <div className="flex flex-col  text">
          <div className="text-white">
            <div className="sm:flex sm:space-x-4">
              <div className="w-full sm:w-1/2 md:p-4">
                <label htmlFor="accountName" className="block font-medium">
                  Account Name
                </label>
                <Field
                // onChange={handleAccountNameChange}
                onChange={handleChange} 
                  as="select" 
                  // type="text"
                  id="accountName"
                  name="accountName"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                >
                  
                
                  <option value="">Select Account Name</option>
                  {allUsers?.map((users: any) => (
                    <option key={users._id} value={users._id}>
                      {users.firstName} {users.lastName} {users.groupName}
                    </option>
                  ))}
                
  
                </Field>
                <ErrorMessage
                  name="accountName"
                  component="div"
                  className="text-red-500"
                />
              </div>
  
              <div className="w-full sm:w-1/2 md:p-4">
                <label htmlFor="selectedAccountPurpose" className="block font-medium">
                  Selected Account Purpose
                </label>
                <Field
                  as='select'
                  // type="text"
                  id="selectedAccountPurpose"
                  name="selectedAccountPurpose"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                >
                  <option value="">Select Account Name</option>
                  {filteredArray && filteredArray?.map((savings: any) => (
                    <option key={savings._id} value={savings._id}>
                      {savings.purposeName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="selectedAccountPurpose"
                  component="div"
                  className="text-red-500"
                />
              </div>
  
              <div className="w-full sm:w-1/2 md:p-4">
                <label htmlFor="amount" className="block font-medium">
                  Amount
                </label>
                <Field
                  type="number"
                  id="amount"
                  name="amount"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
          </div>
   
  
          <div className="text-white">
            <div className="sm:flex sm:space-x-4 ">
              <div className="w-full sm:w-3/4 md:p-4">
                <label htmlFor="narration" className="block font-medium">
                  Narration
                </label>
                <Field
                  type="text"
                  id="narration"
                  name="narration"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="narration"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="w-full sm:w-1/2 md:p-4 mt-6">
                <button
                  type="submit"
                  className="w-full mt-1 rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:bg-indigo-500"
                 disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                {showSuccessToast && (
            <SuccessToaster message={"Withdrawal successfull!"} />
          )}
          {showErrorToast && errorMessage && errorMessage && (
            <ErrorToaster
              message={
                errorMessage ? errorMessage : "Error creating Withdrawal"
              }
            />
          )}

              </div>
            </div>
          </div>
  
  
  
  
          </div>
            <MyEffectComponent formikValues={values} />
          </Form>
          </>

        )}
      </Formik>
    </div>
  );
};

export default WithdrawalForm;

