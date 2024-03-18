// components/WithdrawalForm.tsx
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

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

const WithdrawalForm = () => {
  return (
    <div className="flex  bg-red-500">
      <Formik
        initialValues={{
          accountName: "",
          selectedAccountPurpose: "",
          amount: 0,
          narration: "",
        }}
        validationSchema={WithdrawalFormScema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Form className="bg-red w-full rounded-lg p-8">
          <div className="flex flex-col space-y-4 ">
            <div className="flex space-x-4  ">
              <div className="w-1/2 p-4">
                <label htmlFor="accountName" className="block font-medium">
                  Account Name
                </label>
                <Field
                  type="text"
                  id="accountName"
                  name="accountName"
                  className="mt-1 w-full  rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="accountName"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="w-1/2 p-4">
                <label
                  htmlFor="selectedAccountPurpose"
                  className="block font-medium"
                >
                  Selected Account Purpose
                </label>
                <Field
                  type="text"
                  id="selectedAccountPurpose"
                  name="selectedAccountPurpose"
                  className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                />
                <ErrorMessage
                  name="selectedAccountPurpose"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="w-1/2 p-4">
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
            <div className="flex flex-row space-x-4 border">
              {/* <div className="flex space-x-4 "> */}
              <div className="w-[1/2]">
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
              <div className="flex flex-row space-x-4">
                <div className="w-3/4">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
                    //   disabled={isSubmitting}
                  >
                    {" "}
                    submit
                    {/* {isSubmitting ? 'Logging in...' : 'Log in'} */}
                  </button>
                </div>
              </div>
            </div>{" "}
            {/* </div> */}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default WithdrawalForm;
