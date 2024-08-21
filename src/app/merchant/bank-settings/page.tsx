'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useAuth } from '@/api/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import Modal, { ModalConfirmation } from '@/components/Modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


interface bankProps{
    bankName: any,
    bankAccountNumber: string,
    split_value: string
    split_type: string
}
interface bankNameProps{
    label: string; value: string ;
}

const MyForm = () => {
    const {client} = useAuth()
    const router = useRouter()
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
   
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    
    const initialValues: bankProps = {
        bankName: null,
        bankAccountNumber: '',
        split_value: '100',
        split_type: 'percentage',
      }
    const validationSchema = Yup.object().shape({
      bankName: Yup.object().required('Bank name is required').nullable(),
      bankAccountNumber: Yup.string().required('Account number is required'),
      split_value: Yup.number().required('Split value is required').positive('Split value must be positive'),
      split_type: Yup.string().required('Split type is required'),
    });
  
    const handleSubmit = (values: { bankName: { value: any; }; }, { setSubmitting, }: any) => {
      // Adjust to send only the necessary values
      const formData: any = {
        ...values,
        // bankName: values.bankName.label,
        account_bank: values.bankName.value,
      };
 
      CreateSubAccount(formData)
      setSubmitting(false);
    };
  
    const { data: AllBanks, isLoading: isLoadingBanks } = useQuery({
      queryKey: ['banks'],
      queryFn: async () => {
        return client
          .get('api/pay/flw/get-banks')
          .then((response) => response.data)
          .catch((error) => {
            throw error;
          });
      },
    });
  
    const bankOptions = AllBanks?.map((bank: { name: any; code: any; }) => ({
      label: bank.name,
      value: bank.code,
    })) || [];

    const {
        mutate: CreateSubAccount,
        isPending,
        isError,
      } = useMutation({
        mutationKey: ["create subaccount"],
        mutationFn: async (values) => {
         
          return client.post(`/api/pay/flw/create-subaccounts`, values);
        },
        onSuccess(response) {
          
            setSuccessMessage(response.data.message)
            setShowSuccessModal(true)
           
            setTimeout(() => {
                router.push(`/merchant`)
            }, 1000)
        },
        onError(error: any) {
            
        setErrorMessage(error.response.data.message)
       
         setShowErrorModal(true)
        },

      });
    
    return (
        <div>
            {showErrorModal ? 
            <Modal
                title='Sub account creation failed'
                setModalState={setShowErrorModal}

            >
                <ModalConfirmation
                successTitle={'Failed'}
                errorTitle='Failed'
                responseMessage={errorMessage}
                status='failed'

                />
            </Modal>
              
            : '' }

            {showSuccessModal ? 
            <Modal
                title='Sub account creation is Successful'
                setModalState={setShowSuccessModal}

            >
                <ModalConfirmation
                successTitle={'Success'}
                errorTitle=''
                responseMessage={successMessage}
                status='success'

                />
            </Modal>
              
            : '' }
          
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                <Form className="max-w-md mx-auto">
                    <p className="mb-4  mt-8 text-white last:text-[16px] md:text-[18px]">
                        BUSINESS ACCOUNT DETAILS
                    </p>
                    <div className="mb-4">
                    <label htmlFor="bankName" className="m-0 text-xs font-medium text-white">
                        Bank Name
                    </label>
                    <Select
                        id="bankName"
                        name="bankName"
                        options={bankOptions}
                        isLoading={isLoadingBanks}
                        onChange={(option) => {
                        setFieldValue('bankName', option);
                        setFieldValue('account_bank', option?.value);
                        }}
                        value={values.bankName}
                        placeholder="Select a bank"
                        isSearchable
                    />
                    <ErrorMessage name="bankName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
        
                    <div className="mb-4">
                    <label htmlFor="bankAccountNumber" className="m-0 text-xs font-medium text-white">
                        Account Number
                    </label>
                    <Field
                        type="text"
                        id="bankAccountNumber"
                        name="bankAccountNumber"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage name="bankAccountNumber" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
        
                    <div className="mb-4 hidden">
                    <label htmlFor="account_bank" className="m-0 text-xs font-medium text-white">
                        Account Bank
                    </label>
                    <Field
                        type="text"
                        id="account_bank"
                        name="account_bank"
                        readOnly
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D] bg-gray-100"
                        value={values.bankName ? values.bankName.value : ''}
                    />
                    <ErrorMessage name="account_bank" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
        
                    <div className="mb-4 hidden">
                    <label htmlFor="split_value" className="m-0 text-xs font-medium text-white">
                        Split Value
                    </label>
                    <Field
                        type="number"
                        id="split_value"
                        name="split_value"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage name="split_value" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
        
                    <div className="mb-4 hidden">
                    <label htmlFor="split_type" className="m-0 text-xs font-medium text-white">
                        Split Type
                    </label>
                    <Field
                        type="text"
                        id="split_type"
                        name="split_type"
                        className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage name="split_type" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
        
                    <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {isSubmitting || isPending ? (
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
                </Form>
                )}
            </Formik>
      </div>
    );
  };
  
  export default MyForm;