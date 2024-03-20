import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
});

const initialValues = {
  email: "",
};

const InputEmail: React.FC = () => {
  const handleSubmit = (values: any) => {
    // Handle form submission here
    console.log(values);
  };

  return (
    <>
      <section className="bg-ajo_darkBlue px-4 pb-10 pt-8 md:flex md:h-screen md:w-1/2 md:items-center md:justify-center md:px-8">
        <div>
          <p className="text-center text-3xl font-bold text-white md:text-6xl">
            Forgot Password?
          </p>
          <p className="mt-2 text-center text-sm text-ajo_orange">
            Experience the power of seamless savings with Ajo.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="m-0 text-xs font-medium text-white"
                  >
                    Email:
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] p-3 text-[#7D7D7D]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error text-xs text-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500 "
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "submitting..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
};

export default InputEmail;
