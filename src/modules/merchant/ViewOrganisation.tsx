import { useAuth } from "@/api/hooks/useAuth";
import { Organisation, customer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Image from "next/image";
import Link from "next/link";

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
          .then((response: AxiosResponse<Organisation, any>) => {
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
            <div className="p-6  ">
              {/* <div className="mr-6 md:w-1/6 ">
                <Image
                  src={customerInfo ? customerInfo?.photo : ""}
                  alt="Customer"
                  width={200}
                  height={100}
                  className="rounded-md"
                />
              </div> */}
              <div className="md:grid grid-cols-3 ">
                <div className="mb-2 mt-2 w-full">
                  <p className="font-semibold text-gray-600">
                    Name:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.organisationName : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">John Doe</p> */}
                </div>
                <div className="mb-2 mt-2 w-full">
                  <p className="font-semibold text-gray-600">
                    Id:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.accountNumber : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">John Doe</p> */}
                </div>
                <div className="mb-2 w-full  ">
                  <p className="font-semibold text-gray-600">
                    Phone Number:{" "}
                    <span className="font-normal md:pl-8">
                      {customerInfo ? customerInfo.phoneNumber : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123-456-7890</p> */}
                </div>
                <div className="mb-2 w-full">
                  <p className="font-semibold text-gray-600">
                    Email Address:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.email : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">johndoe@example.com</p> */}
                </div>

                <div className="mb-2 w-full">
                  <p className="font-semibold text-gray-600">
                    Business Email Address:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.businessEmailAdress : ""}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">johndoe@example.com</p> */}
                </div>
                <div className="mb-2 w-full ">
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
                    Office Address 1:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.officeAddress1 : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123 Main St, City</p> */}
                </div>
                <div className="mb-4 w-full">
                  <p className="font-semibold text-gray-600">
                    Office Address 2:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.officeAddress2 : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123 Main St, City</p> */}
                </div>

                <div className="mb-4 w-full">
                  <p className="font-semibold text-gray-600">
                    Region:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.region : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123 Main St, City</p> */}
                </div>

                <div className="mb-4 w-full">
                  <p className="font-semibold text-gray-600">
                    Trading Name:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.tradingName : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">123 Main St, City</p> */}
                </div>

                <div className="mb-4 w-full">
                  <p className="font-semibold text-gray-600">
                    Website:{" "}
                    <span className="font-normal">
                    <Link target="_blank" href={customerInfo && customerInfo.website ? `http://${customerInfo.website}` : ""}>
                      {customerInfo && customerInfo.website ? customerInfo.website : "N/A"}
                    </Link>

                      
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
                    Nigeria:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.country : "N/A"}
                    </span>
                  </p>
                  {/* <p className="text-gray-900">Local Government Area</p> */}
                </div>
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
                    Description:{" "}
                    <span className="font-normal">
                      {customerInfo ? customerInfo.description : "N/A"}
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
  