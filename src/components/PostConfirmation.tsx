import { postSavingsResponse } from "@/types";
import { CustomButton } from "./Buttons";

const PostConfirmation = ({
    postingResponse,
    status,
  }: {
    postingResponse: postSavingsResponse | undefined;
    status: "success" | "failed" | undefined;
  }) => {
    console.log(postingResponse)
    const postingCreation: string | undefined = Date();
    const formattedPostingDate = new Date(postingCreation);
    const timeOfPosting = formattedPostingDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format
      timeZone: "UTC",
    });
  
    const postingStartDate: string | undefined = Date();
    const formattedPostingStartDate = new Date(postingStartDate);
    const formattedStartDate = formattedPostingStartDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    );
  
    const postingEndDate: string | undefined = Date();
    const formattedPostingEndDate = new Date(postingEndDate);
    const formattedEndDate = formattedPostingEndDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return (
      <div className="mx-auto max-w-screen-lg bg-ajo_offWhite py-8 px-4 md:px-8 lg:px-16 xl:px-24">
        <p className="mb-8 text-center text-3xl font-bold text-black">Posting</p>
        <div className="space-y-4">
          {/* Rest of the code remains the same */}

          <div className="mx-auto flex ">
            <p className="text-sm font-semibold text-[#7D7D7D]">
              Transaction Id:
            </p>
            <p className="text-sm text-[#7D7D7D]">{postingResponse?._id}</p>
          </div>
        </div>
        <div className="mx-auto my-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-4 md:px-0">
          <CustomButton
            type="button"
            label="Download"
            style="rounded-md bg-ajo_offWhite border border-ajo_blue py-3 px-9 text-sm text-ajo_blue hover:text-ajo_offWhite focus:text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-1/2"
            // onButtonClick={() => onSubmit("confirmation")}
          />
          <CustomButton
            type="button"
            label="Share"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-1/2"
            // onButtonClick={() => onSubmit("confirmation")}
          />
        </div>
        <div className="bg-ajo_orange px-4 md:px-8 py-4">
          <p className="text-center text-xs font-medium text-ajo_offWhite">
            For further enquiries and assistance kindly send a mail
            ajo@raoatech.com or call +23497019767
          </p>
        </div>
      </div>
    );
  };
