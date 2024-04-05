import React from 'react';

const Card = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
   
   <div className="flex flex-wrap mb-4 ml-4">
  <div className="w-full md:w-1/2 ">
    <p className="mb-4 m"><span className="font-semibold">Organisation Name: </span> <span className='text-[#7D7D7D] ml-6'>Raoatech NG</span></p>
    <p className="mb-4"><span className="font-semibold"> Applied %(lowest Range): <span className='text-[#7D7D7D] ml-6'>10%</span></span></p>
      <p className="mb-4"><span className="font-semibold">Applied %(Highest Range): <span className='text-[#7D7D7D] ml-6'>20%</span></span></p>
      <p className="mb-4"><span className="font-semibold">Applied Service Charge%: </span> <span className='text-[#7D7D7D] ml-6'>12%</span></p>
  </div>
  <div className="w-full md:w-1/2 ">
    <div className="md:text-left w-full md:flex justify-center">
        <div className=''>
            <p className="mb-4"><span className="font-semibold">Organisation ID: </span><span className='text-[#7D7D7D] ml-6'>1234567</span></p>
            
            <p className="mb-4"><span className="font-semibold">Admin Fee:(lowest): </span> <span className='text-[#7D7D7D] ml-6'>50000 NGN</span></p>
            <p className="mb-4"><span className="font-semibold">Admin Fee:(higest): </span> <span className='text-[#7D7D7D] ml-6'>50000 NGN</span></p>
            <p className="mb-4"><span className="font-semibold">Service Fee: </span> <span className='text-[#7D7D7D] ml-6'>50000 NGN</span></p>
        </div>
     
    </div>
    <div className="w-full hidden md:block"></div>
  </div>
</div>

        <div className='ml-4'>
            <p className='font-semibold'>Comment</p>
            <span className='text-[#7D7D7D]'>Lorem Ipsum dolor et Checking the connect, Checking the proxy and the firewall, Running Windows Network Diagnostics</span>
        </div>
    </div>
  );
};

export default Card;
