import { useAuth } from "@/api/hooks/useAuth";
import { customer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";

interface ShowModalProps{
    organisationId: string
}
export const ViewOrganisation = ({
    organisationId,
    
  }: ShowModalProps) => {
    // console.log(organisationId);
  
    const { client } = useAuth();
    const { data: customerInfo, isLoading: isLoadingCustomerInfo } = useQuery({
      queryKey: ["customerInfo"],
      queryFn: async () => {
        return client
          .get(`/api/user/${organisationId}`)
          .then((response: AxiosResponse<customer, any>) => {
            // console.log(response.data);
            return response.data;
          })
          .catch((error: AxiosError<any, any>) => {
            console.log(error.response ?? error.message);
            throw error;
          });
      },
    });

    console.log(customerInfo)
  
    return (
      <div>
        <div className="mx-auto mt-8 w-[100%] overflow-hidden rounded-md bg-white p-4 shadow-md">
          {/* Image and First Batch of Details Section */}
          <p className="mb-8 mt-2 text-xl font-bold">Customer Details</p>
          <div className="rounded-lg md:border">
            <div className="p-6 md:flex ">
              <div className="mr-6 md:w-1/6 ">
                <Image
                  src={customerInfo ? customerInfo?.photo : ""}
                  alt="Customer"
                  width={200}
                  height={100}
                  className="rounded-md"
                />
              </div>
              <div className="flex w-5/6 flex-wrap md:ml-4">
                <div className="mb-2 mt-2 w-full md:w-1/2">
                  <p className="font-semibold text-gray-600">
                    Name:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.organisationName : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">John Doe</p> */}
                </div>
                <div className="mb-2 w-full md:w-1/2  md:pl-8">
                  <p className="font-semibold text-gray-600">
                    Phone Number:{" "}
                    <span className="font-normal md:pl-8">
                      {customerInfo ? customerInfo.phoneNumber : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>
                <div className="mb-2 w-full md:w-1/2">
                  <p className="font-semibold text-gray-600">
                    Email Address:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.email : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">johndoe@example.com</p> */}
                </div>
                <div className="mb-2 w-full md:w-1/2 md:pl-8">
                  <p className="font-semibold text-gray-600">
                    Country of Residence:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.country : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">United States</p> */}
                </div>
                <div className="mb-4 w-full">
                  <p className="font-semibold text-gray-600">
                    Home Address:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.homeAddress : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123 Main St, City</p> */}
                </div>
              </div>
            </div>
  
            {/* Second Batch of Details Section */}
            <div className="p-6">
              <div className="mb-4 flex flex-wrap">
                <div className="w-full sm:w-1/3">
                  <p className="font-semibold text-gray-600">
                    State:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.state : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">California</p> */}
                </div>
                <div className="w-full sm:w-1/3">
                  <p className="font-semibold text-gray-600">
                    LGA:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.lga : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">Local Government Area</p> */}
                </div>
                <div className="w-full sm:w-1/3">
                  <p className="font-semibold text-gray-600">
                    City:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.city : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">City Name</p> */}
                </div>
              </div>
              <div className="mb-4 flex flex-wrap">
                <div className="w-full sm:w-1/3">
                  <p className="font-semibold text-gray-600">
                    NIN:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.nin : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">1234567890</p> */}
                </div>
                <div className="w-full sm:w-1/3">
                  <p className="font-semibold text-gray-600">
                    BVN:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.bvn : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">1234567890</p> */}
                </div>
              </div>
            </div>
          </div>
  
          
         
        </div>
      </div>
    );
  };
  