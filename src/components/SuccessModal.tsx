import Image from "next/image";
import Modal from "./Modal";
import { CustomButton } from "./Buttons";
import { Dispatch, SetStateAction } from "react";

interface successModalProps{
    successText: string,
    title: string
    setShowModal: Dispatch<SetStateAction<boolean>>;
    // setShowParentModal: Dispatch<SetStateAction<boolean>>
}
export default function SuccessModal({successText, title, setShowModal, }: successModalProps){
    // function handleButtonClick(){
    //     setShowParentModal(false)
    //     setShowModal(false)
    //    }
    return(
        <div>
            <Modal
                title={title}
                setModalState={() =>setShowModal(false)}
            >
             <div className="mx-auto ml-[2%] mt-[10%] flex h-full flex-col items-center justify-center space-y-8">
            <Image
                src="/check-circle.svg"
                alt="check-circle"
                width={162}
                height={162}
                className="w-[6rem] md:w-[10rem]"
            />
            <p className="whitespace-nowrap text-ajo_offWhite">
                {successText}
            </p>
            <CustomButton
                type="button"
                label="Close"
                style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[40%]"
                onButtonClick={() => setShowModal(false)}
            />
            </div>
      </Modal>
        </div>
    )
}