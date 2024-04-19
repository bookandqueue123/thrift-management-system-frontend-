import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
const Modal = ({
  setModalState,
  title,
  children,
}: {
  setModalState: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: React.ReactNode;
}) => {
  const pathName = usePathname();

  return (
    <>
      <div className="fixed inset-0 bg-ajo_offWhite opacity-25"></div>
      <div
        className=""
        // onClick={() => setModalState(false)}
      >
        <div className="fixed inset-0 left-1/2 top-1/2 z-10 mx-auto h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg bg-[#090E2C] bg-[url('/squiggly.svg')] bg-cover bg-center bg-no-repeat pb-8 md:w-4/5">
          <div className="flex items-center justify-between overflow-hidden">
            <Image
              src="/Ajo.svg"
              alt="Ajo Logo"
              className="relative -left-[.5rem] -top-[.5rem] m-0 h-[50px] w-[50px] md:-left-[2rem] md:-top-[1rem] md:h-[100px] md:w-[100px] "
              width={100}
              height={100}
              loading="eager"
              tabIndex={-1}
            />

            <h3 className="text-xl font-semibold text-ajo_offWhite md:text-2xl">
              {title}
            </h3>

            <div
              onClick={() => setModalState(false)}
              className="mr-8 cursor-pointer"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                className="h-[16px] w-[16px] md:h-[32px] md:w-[32px]"
              >
                <path
                  d="M48 16L16 48M16 16L48 48"
                  stroke="#F2F0FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {pathName === "/superadmin/commission" ? (
            <div className="item-center mb-8 flex justify-center text-white">
              <p>
                To Set Up Commissions,{" "}
                <span className="text-[#EAAB40]">
                  Kindly fill in the details below:
                </span>
              </p>
            </div>
          ) : (
            ""
          )}

          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;

export const ModalConfirmation = ({
  responseMessage,
  status,
  successTitle,
  errorTitle,
}: {
  responseMessage: string;
  status: "success" | "failed" | undefined;
  successTitle: string;
  errorTitle: string;
}) => {
  return (
    <div className="mx-auto mt-[10%] flex h-full w-1/2 flex-col items-center justify-center space-y-8">
      {status !== undefined ? (
        <Image
          src={
            status === "success" ? "/check-circle.svg" : "/failed-icon-7.jpg"
          }
          alt="check-circle"
          width={162}
          height={162}
          className="w-[6rem] md:w-[10rem]"
        />
      ) : (
        "Loading...."
      )}
      <h1 className="text-white">
        {status !== undefined
          ? status === "success"
            ? successTitle
            : errorTitle
          : "Loading....."}
      </h1>
      <p className="whitespace-nowrap text-ajo_offWhite">{responseMessage}</p>
    </div>
  );
};
