"use client";

import React from 'react'
import Image from 'next/image';
const ThriftSavings = () => {
  return (
    <section className="mb-16 p-6 px-[5%] style={{ backgroundColor: 'rgba(24, 18, 42, 1)', color: 'white' }">
           <h2 className="text-3xl font-bold mb-4" style={{ color: '#EAAB40' }}>
            Self-Serviced Smart Savings and Thrift Collection/Co-operative Society Management
           </h2>
           <p className="mb-4">
           In Nigeria, we have over 300,000 cooperative societies (with over 31 million members), including those utilizing the traditional &ldquo;ajo/esusu/adashe&rdquo; system.
           <br/>They contribute $1.2 billion yearly to Nigeria&apos;s GDP.
           <br/>
           However, these groups encounter hurdles such as manual record-keeping, transparency issues, and inefficient fund disbursement.
   <br/>These challenges impede financial growth and restrict access to credit and empowerment initiatives.
   <br/>Finkia provides secure and smart solution that enables thrift collectors and co-operative societies managers:
   
   
           </p>
           <ul className="list-disc list-inside space-y-2">
             <li>To manage process of saving of funds by customers, 
             </li>
             <li>Keeping of transaction records, 
             </li>
             <li>Management of funds,
             .</li>
             <li>And funds disbursement seamlessly.
             </li>
           </ul>
           <div className='mt-4 w-full '>
           <Image
           className='w-full'
           width={1000}
           height={1000}
           src="/FINKIA_BANNER2.png"
           alt='about banner'
           /></div>
         </section>
  )
}

export default ThriftSavings