import Image from "next/image";

export default function ProductService(){
    return(
        <div className="mx-[4%] mt-24 mb-8">
            <h2 className="text-3xl text-white font-bold">
            Products/ Services
            </h2>
           
            <div className=" md:grid grid-cols-2   my-12">
    
                <div className=" p-4 max-w-sm bg-[#EAAB40] rounded-lg ">
                
                    <Image
                        width={500}
                        height={500}
                        className="rounded-t-lg"
                        src="/product-service1.svg" alt=""
                    />
                        
                </div>

                <div className=" flex text-white flex-col flex-start md:ml-4 mt-4 md:mt-[4%]">
                    <p className="text-2xl  font-bold">01.</p>
                    <p className="py-4">Personalized Savings Plans</p>
                </div>
            </div>

            <div className=" md:grid grid-cols-2   my-12">
                <div className="hidden md:flex text-white md:mr-16 flex-col flex-start md:ml-4 mt-4 md:mt-[4%]">
                    <p className="text-2xl  font-bold ">02.</p>
                    <p className="py-4">Thrift Savings for petty traders/ Artisans- popularly known as Ajo, Esusu or Adashe.</p>
                </div>

                <div className=" p-4 max-w-sm bg-[#2F54FB] rounded-lg ">
                
                    <Image
                        width={500}
                        height={500}
                        className="rounded-t-lg"
                        src="/product-service2.svg" alt=""
                    />
                        
                </div>

                <div className="md:hidden flex text-white flex-col flex-start md:ml-4 mt-4 md:mt-[4%]">
                    <p className="text-2xl  font-bold">02.</p>
                    <p className="py-4">Thrift Savings p.k.a Ajo</p>
                </div>

                
            </div>

            
           
        </div>
    )
}