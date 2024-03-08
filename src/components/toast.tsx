import { useEffect } from "react";
import { toast } from "react-toastify";

const SuccessToaster = ({ message }: { message: string }) => {
  useEffect(() => {
    
    toast.success(message, {
      position: "top-right",
      autoClose: 5000, // Close the toaster after 7 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, [message]); // Run the effect whenever the message changes

  return null; // This component doesn't render anything, it just displays a toast
};


export const ErrorToaster = ({ message} : {message: string}) => {
  useEffect(() => {
     toast.error(message, {
      position: "bottom-center", // Change position to center bottom
      autoClose: 3000, // Close the toaster after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, [message])
   
  
    return null; // This component doesn't render anything, it just displays a toast
  };

  
export default SuccessToaster;
