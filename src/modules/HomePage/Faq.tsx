
export default function FAQ(){
    return (
      <div>
        <div className="mx-4 my-8 mt-16 text-white md:mx-[4%]">
          <h1 className="p-5 text-3xl font-bold"> FAQ’s</h1>
          <p className="p-5 text-sm">About saving with us</p>
          <div
            className="mt-8"
            id="accordion-collapse"
            data-accordion="collapse"
          >
            <h2 id="accordion-collapse-heading-1">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-t-xl p-5 font-medium  text-white     rtl:text-right"
                data-accordion-target="#accordion-collapse-body-1"
                aria-expanded="true"
                aria-controls="accordion-collapse-body-1"
              >
                <span>What is Finkia?</span>
                <svg
                  data-accordion-icon
                  className="h-3 w-3 shrink-0 rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>

            <div
              id="accordion-collapse-body-1"
              className="hidden"
              aria-labelledby="accordion-collapse-heading-1"
            >
              <div className="p-5  ">
                <p className="mb-2 text-gray-400 dark:text-white">
                  FINKIA is a thrift management system that enables thrift
                  collectors to collect different types of savings from their
                  customers easily, through different payment channels, and
                  manage financial records efficiently and properly. It uses
                  artificial intelligence to understand financial behavioral
                  patterns of each customer to determine saving culture and
                  loan-repayment ability of the customer.
                </p>
              </div>
            </div>
            <h2 id="accordion-collapse-heading-2">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 
                    p-5 font-medium text-white
                        
                        rtl:text-right"
                data-accordion-target="#accordion-collapse-body-2"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-2"
              >
                <span>How does Finkia work?</span>
                <svg
                  data-accordion-icon
                  className="h-3 w-3 shrink-0 rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id="accordion-collapse-body-2"
              className="hidden"
              aria-labelledby="accordion-collapse-heading-2"
            >
              <div className="p-5  dark:border-gray-700">
                <p className="text-left text-gray-400 md:mr-[2%] dark:text-gray-400">
                  FINKIA is a thrift management system that enables thrift
                  collectors to collect different types of savings from their
                  customers easily, through different payment channels, and
                  manage financial records efficiently and properly. It uses
                  artificial intelligence to understand financial behavioral
                  patterns of each customer to determine saving culture and
                  loan-repayment ability of the customer. The platform also
                  helps individuals to cultivate good savings habit.
                </p>
              </div>
            </div>

            <h2 id="accordion-collapse-heading-3">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-4 font-medium text-white md:p-5 rtl:text-right"
                data-accordion-target="#accordion-collapse-body-3"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-3"
              >
                <span className=" ">Who can benefit from using Finkia??</span>
                <svg
                  data-accordion-icon
                  className="h-3 w-3 shrink-0 rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id="accordion-collapse-body-3"
              className="hidden"
              aria-labelledby="accordion-collapse-heading-3"
            >
              <div className="p-5 ">
                <p className="mb-2 text-left text-gray-400 md:mr-[2%] dark:text-gray-400">
                  FINKIA is a thrift management system that enables thrift
                  collectors to collect different types of savings from their
                  customers easily, through different payment channels, and
                  manage financial records efficiently and properly. It uses
                  artificial intelligence to understand financial behavioral
                  patterns of each customer to determine saving culture and
                  loan-repayment ability of the customer. The platform also
                  helps individuals to cultivate good savings habit.
                </p>
              </div>
            </div>

            <h2 id="accordion-collapse-heading-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-5 font-medium text-white rtl:text-right"
                data-accordion-target="#accordion-collapse-body-4"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-4"
              >
                <span>Is Finkia free to use??</span>
                <svg
                  data-accordion-icon
                  className="h-3 w-3 shrink-0 rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id="accordion-collapse-body-4"
              className="hidden"
              aria-labelledby="accordion-collapse-heading-4"
            >
              <div className="p-5 ">
                <p className="mb-2 text-left text-gray-400 md:mr-[2%] dark:text-gray-400">
                  FINKIA is a thrift management system that enables thrift
                  collectors to collect different types of savings from their
                  customers easily, through different payment channels, and
                  manage financial records efficiently and properly. It uses
                  artificial intelligence to understand financial behavioral
                  patterns of each customer to determine saving culture and
                  loan-repayment ability of the customer. The platform also
                  helps individuals to cultivate good savings habit.
                </p>
              </div>
            </div>

            <h2 id="accordion-collapse-heading-5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-5 font-medium text-white rtl:text-right"
                data-accordion-target="#accordion-collapse-body-5"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-5"
              >
                <span>Is my money safe with Finkia??</span>
                <svg
                  data-accordion-icon
                  className="h-3 w-3 shrink-0 rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id="accordion-collapse-body-5"
              className="hidden"
              aria-labelledby="accordion-collapse-heading-5"
            >
              <div className="p-5 ">
                <p className="mb-2 text-left text-gray-400 md:mr-[2%] dark:text-gray-400">
                  FINKIA is a thrift management system that enables thrift
                  collectors to collect different types of savings from their
                  customers easily, through different payment channels, and
                  manage financial records efficiently and properly. It uses
                  artificial intelligence to understand financial behavioral
                  patterns of each customer to determine saving culture and
                  loan-repayment ability of the customer. The platform also
                  helps individuals to cultivate good savings habit.
                </p>
              </div>
            </div>

            <h2 id="accordion-collapse-heading-6">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-5 font-medium text-white rtl:text-right"
                data-accordion-target="#accordion-collapse-body-6"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-6"
              >
                <span>How can I get Started with Finkia??</span>
                <svg
                  data-accordion-icon
                  className="h-3 w-3 shrink-0 rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id="accordion-collapse-body-6"
              className="hidden"
              aria-labelledby="accordion-collapse-heading-6"
            >
              <div className="p-5 ">
                <p className="mb-2 text-left text-gray-400 md:mr-[2%] dark:text-gray-400">
                  FINKIA is a thrift management system that enables thrift
                  collectors to collect different types of savings from their
                  customers easily, through different payment channels, and
                  manage financial records efficiently and properly. It uses
                  artificial intelligence to understand financial behavioral
                  patterns of each customer to determine saving culture and
                  loan-repayment ability of the customer. The platform also
                  helps individuals to cultivate good savings habit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}