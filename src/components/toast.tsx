import { toast } from "react-toastify";

const SuccessToaster = ({message}: {message: string}) => {
   console.log('toast')
  toast.success(message, {
    position: "top-right",
    autoClose: 7000, // Close the toaster after 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  return null; // This component doesn't render anything, it just displays a toast
};

export const ErrorToaster = ({ message} : {message: string}) => {
    toast.error(message, {
      position: "bottom-center", // Change position to center bottom
      autoClose: 5000, // Close the toaster after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  
    return null; // This component doesn't render anything, it just displays a toast
  };

  
export default SuccessToaster;
