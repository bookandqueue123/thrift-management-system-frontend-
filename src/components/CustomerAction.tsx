import { useState } from "react";
import { StatusIndicator } from "./StatusIndicator";
import Modal, { NoBackgroundModal } from "./Modal";
import { EditCustomer, SavingsSettings, ViewCustomer } from "@/modules/merchant/customer/CustomerPage";



export interface CustomerActionProps{
    index: number,
    customerId: string
}
export default function CustomerAction({index, customerId}: CustomerActionProps){
    const [modalState, setModalState] = useState(false);
    const [modalContent, setModalContent] = useState<"form" | "confirmation">(
      "form",
    );
    const [modalToShow, setModalToShow] = useState<
      "view" | "savings" | "edit" | "create-customer" | ""
    >("");
    const [customerToBeEdited, setCustomerToBeEdited] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number>(0);
    
    const toggleDropdown = (val: number) => {
        if (openDropdown === val) {
          setOpenDropdown(0);
        } else {
          setOpenDropdown(val);
        }
      };
    return(
        <div>
            <StatusIndicator
                label={`Actions`}
                clickHandler={() => {
                    setOpenDropdown(index + 1);
                    if (index + 1 === openDropdown) {
                    toggleDropdown(openDropdown);
                    } else {
                    toggleDropdown(index + 1);
                    }
                }}
                dropdownEnabled
                dropdownContents={{
                    labels: [
                    "View Customer",
                    "Edit Customer",
                    "Savings Settings",
                    "Disable/Enable",
                    ],
                    actions: [
                    () => {
                        setModalState(true);
                        setModalContent("form");
                        setModalToShow("view");
                        setCustomerToBeEdited(customerId);
                        console.log("View Customer");
                    },
                    () => {
                        setModalToShow("edit");
                        setModalState(true);
                        setModalContent("form");
                        setCustomerToBeEdited(customerId);
                    },
                    () => {
                        setModalState(true);
                        setModalToShow("savings");
                        setModalContent("form");
                        setCustomerToBeEdited(customerId);
                    },
                    () => {
                        console.log("Disable/Enable");
                    },
                    ],
                }}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
                currentIndex={index + 1}
            />

        {modalState && (
            <NoBackgroundModal
              setModalState={setModalState}
              title={
                modalContent === "confirmation"
                  ? ""
                  : modalToShow === "view"
                    ? "View Customer"
                    : modalToShow === "edit"
                      ? "Edit Customer"
                      : modalToShow === "savings"
                        ? "Savings Set Up"
                        : ""
              }
            >
              {modalToShow === "view" ? (
                <ViewCustomer
                  customerId={customerToBeEdited}
                  setContent={setModalContent}
                  content={
                    modalContent === "confirmation" ? "confirmation" : "form"
                  }
                  closeModal={setModalState}
                />
              ) : modalToShow === "savings" ? (
                <SavingsSettings
                  customerId={customerToBeEdited}
                  setContent={setModalContent}
                  content={
                    modalContent === "confirmation" ? "confirmation" : "form"
                  }
                  closeModal={setModalState}
                />
              ) : modalToShow === "edit" ? (
                <EditCustomer
                  customerId={customerToBeEdited}
                  setContent={setModalContent}
                  content={
                    modalContent === "confirmation" ? "confirmation" : "form"
                  }
                  closeModal={setModalState}
                />
              ) : (
                ""
              )}
            </NoBackgroundModal>
          )}
        </div>
    )
}