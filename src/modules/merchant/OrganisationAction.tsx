import { useState } from "react";
import { StatusIndicator } from "@/components/StatusIndicator";
import { NoBackgroundModal } from "@/components/Modal";
import { ViewOrganisation } from "./ViewOrganisation";
import { EditOrganisation } from "./EditOrganisation";
//import { EditCustomer, SavingsSettings, ViewCustomer } from "@/modules/merchant/customer/CustomerPage";



export interface OrganisationActionProps{
    index: number,
    organisationId: string
}
export default function OrganisationAction({index, organisationId}: OrganisationActionProps){
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
                    "View Organisations",
                    "Edit Organisations",
                    "Savings Settings",
                    "Disable/Enable",
                    ],
                    actions: [
                    () => {
                        setModalState(true);
                        setModalContent("form");
                        setModalToShow("view");
                        setCustomerToBeEdited(organisationId);
                        console.log("View Customer");
                    },
                    () => {
                        setModalToShow("edit");
                        setModalState(true);
                        setModalContent("form");

                        setCustomerToBeEdited(organisationId);
                    },
                    () => {
                        setModalState(true);
                        setModalToShow("savings");
                        setModalContent("form");
                        setCustomerToBeEdited(organisationId);
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
                <ViewOrganisation
                  organisationId={customerToBeEdited}
                //   setContent={setModalContent}
                //   content={
                //     modalContent === "confirmation" ? "confirmation" : "form"
                //   }
                //   closeModal={setModalState}
                />
              ) : modalToShow === "savings" ? (
                <ViewOrganisation
                  organisationId={customerToBeEdited}
                //   setContent={setModalContent}
                //   content={
                //     modalContent === "confirmation" ? "confirmation" : "form"
                //   }
                //   closeModal={setModalState}
                />
              ) : modalToShow === "edit" ? (
                <EditOrganisation
                  organisationId={customerToBeEdited}
                //   setContent={setModalContent}
                //   content={
                //     modalContent === "confirmation" ? "confirmation" : "form"
                //   }
                //   closeModal={setModalState}
                />
              ) : (
                ""
              )}
            </NoBackgroundModal>
          )}
        </div>
    )
}