'use client'
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const MyForm = () => {
  const validationSchema = Yup.object().shape({
    bankName: Yup.string().required('Bank name is required'),
    acctNo: Yup.string().required('Account number is required'),
    account_bank: Yup.string().required('Account bank is required'),
    split_value: Yup.number().required('Split value is required').positive('Split value must be positive'),
    split_type: Yup.string().required('Split type is required'),
  });

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    // Handle form submission
    console.log(values);
    setSubmitting(false);
  };

  return (
    <div>
        <p className="mb-4  mt-8 text-white last:text-[16px] md:text-[18px]">
            BUSINESS ACCOUNT DETAILS
        </p>
   
        <Formik
        initialValues={{
            bankName: '',
            acctNo: '',
            account_bank: '',
            split_value: '',
            split_type: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        >
        {({ isSubmitting }) => (
            <Form className="max-w-md mx-auto">
            <div className="mb-4">
                <label htmlFor="bankName" className="m-0 text-xs font-medium text-white">
                Bank Name
                </label>
                <Field
                type="text"
                id="bankName"
                name="bankName"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage name="bankName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
                <label htmlFor="acctNo" className="m-0 text-xs font-medium text-white">
                Account Number
                </label>
                <Field
                type="text"
                id="acctNo"
                name="acctNo"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage name="acctNo" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
                <label htmlFor="account_bank" className="m-0 text-xs font-medium text-white">
                Account Bank
                </label>
                <Field
                type="text"
                id="account_bank"
                name="account_bank"
                className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                />
                <ErrorMessage name="account_bank" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
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

            <div className="mb-4">
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

            <button type="submit" disabled={isSubmitting} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Submit
            </button>
            </Form>
        )}
        </Formik>
    </div>
  );
};

export default MyForm;
