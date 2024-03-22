import { useRouter } from "next/navigation";
import { CustomButton } from "./Buttons";


const ResponseModal = ({heading, message, route}: {heading: string, message: string, route: string}) => {
    const router = useRouter()
    return (
      <div className="flex flex-col justify-center items-center text-white mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {heading}
        </h1>
        <p className="text-lg text-gray-400 mb-8 text-center">
          {message}
        </p>

        
        <CustomButton
            type="button"
            label="Complete Your Profile"
            style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500"
             onButtonClick={() => router.push(route)}
          />
       
      </div>
    );
  };
export default ResponseModal