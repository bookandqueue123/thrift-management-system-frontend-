import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const Modal = ({
  setModalState,
  title,
  children,
}: {
  setModalState: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black opacity-25"></div>
      <div
        className="fixed inset-0 z-10 flex items-center justify-center"
        // onClick={() => setModalState(false)}
      >
        <div className="w-4/5 rounded-lg bg-[#090E2C] bg-[url('/squiggly.svg')] bg-cover bg-center bg-no-repeat pb-8">
          <div className="flex w-full items-center justify-between overflow-hidden">
            <Image
              src="/Ajo.svg"
              alt="Ajo Logo"
              className="relative -left-[2rem] -top-[1rem] m-0"
              width={100}
              height={100}
              loading="eager"
              tabIndex={-1}
            />
            <h3 className="text-2xl font-semibold text-ajo_offWhite">
              {title}
            </h3>
            <div
              onClick={() => setModalState(false)}
              className="mr-8 cursor-pointer"
            >
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
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
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
