// import Image from "next/image";
// import { usePathname } from "next/navigation";

// interface AboutProps{
//     bg?:string
//     aboutText: string
//     data: dataProps[]
    
// }
// interface dataProps{
//         text: string
//         firstImageSrc: string,
//         secondImageSrc: string
// }

// //the data props should contain 2 images when it is being used on the prmary homepage else one single image
// export default function AboutUs({bg, aboutText, data}:AboutProps ){
//     const pathName = usePathname()

//     const isHomepage = pathName === "/"
    
    
//     return(
//         <div id="about-content" className={`${bg === "white" ? 'text-black': "text-white"} ${bg === "white" ? "bg-[#E3E7FA]": ""} py-12 px-[4%] md:px-[4%]   mt-16`}>
//             <h2 className="text-3xl font-bold">About us</h2>
//             <p className="my-8 md:mr-[4%] text-left whitespace-pre-line">
//                 {aboutText}
//             </p>
//             <p className={`mt-2 ${!isHomepage ? 'hidden' : 'block'}`}>Finkia achieves this by:</p>

        //   jj
//             {/* This component isn't meant to show on any other page except the homepage. scope might change later */}
//             <div className={`mt-2 `}>
//                 {data.map((item, index) => (
//                     <div key={index} className="md:flex justify-between mb-[30%] md:mb-[10%]">
//                     <div className="mt-8">
//                         <Image
//                         alt="text item"
//                         src="/about-text.svg"
//                         width={30}
//                         height={30}
//                         />
//                         <p className="font-bold text-xl mt-4 md:mt-8">{item.text}</p>
//                     </div>

//                     {isHomepage ? 
//                       <div className=" mt-8 md:mt-0 flex relative md:mr-[10%]">
//                       <div className="">
//                       {/* First image */}
//                       <Image 
//                           width="500"
//                           height={100}
//                           src={item.firstImageSrc} 
//                           alt="First Image" 
//                           className="w-48 h-auto" />
//                       </div>
//                       <div className="">
//                       {/* Second image */}
//                       <Image 
//                           width="100"
//                           height={100}
//                           src={item.secondImageSrc} 
//                           alt="Second Image" 
//                           className="w-48 h-auto absolute top-[50%] left-[30%] md:top-[50%] md:left-[75%]" />
//                       </div>
//                   </div>
//                   :
//                   <div className="mt-8 md:mt-0 md:w-[50%]">
//                     <Image
//                         width={600}
//                         height={200}
//                         src={item.firstImageSrc} 
//                         alt="First Image" 
//                         className=""
//                     />
//                   </div>
//                 }
                  
//                     </div>
//                 ))}
//                 </div>
           
//         </div>
//     )
// }

'use client';

import Image from 'next/image';
import React from 'react';

export default function AboutUs() {
  return (
    <div className="p-6 px-[5%]" style={{ backgroundColor: 'rgba(24, 18, 42, 1)', color: 'white' }}>
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold" style={{ color: 'white' }}>Welcome to Finkia</h1>
        <p className="mt-4 ">
          An AI-powered business-process management and productivity-enhancing platform.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#EAAB40' }}>
          1. Online Sales of Products/Services by Different Merchants to Different Customers Globally
        </h2>
        <p className="mb-4">
          Business owners (small or large enterprises) want a secure platform that provides custom features enabling
          them to sell their products/services globally.<br/> Finkia provides these features to make online sales seamless
          for both merchants and customers.
        </p>
        <h4 className="text-2xl font-semibold mb-3" style={{ color: '#EAAB40' }}>Paying Little-by-Little Feature</h4>
        <p className="mb-4">
        The current economic situation has reduced all organisations&apos; customers&apos; purchasing power drastically and many businesses are struggling to sell their products/services. These customers want means of paying little by little for some essential products/services without putting themselves under financial pressure. Finkia provides this feature.
        <br/>
        Some of the Finkia&apos;s benefits include but not limited to:

        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Connecting customers to the right organizations that offer the products/services they need.
          </li>
          <li>Helping customers to save over different periods of times or make payment little by little over different periods of times to get essential products/services without putting themselves under any financial pressures.
          </li>
          <li>Transparency: No loss of payment records that is very common in traditional method of paying for goods/services on installment basis. Both customers and organizations have real-time easy access to all transactions’ records just like bank account’s transactions history.
          </li>
          <li>Helping organizations(merchants/partners) to get more paying customers.
          </li>
          <li>Helping organization reduce cost of acquiring new paying customers.
          </li>
        </ul>

        <Image
        width={1000}
        height={1000}
        src="/FINKIA_BANNER1.png"
        alt='about banner'
        />
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#EAAB40' }}>
          2. Self-Serviced Smart Savings and Thrift Collection/Co-operative Society Management
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
        <Image
        width={1000}
        height={1000}
        src="/FINKIA_BANNER2.png"
        alt='about banner'
        />
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#EAAB40' }}>3. Bills Collection and Management</h2>
        <p className="mb-4">
        Organisations (such as schools, parent-teacher associations, professional bodies, government-owned agencies, e.t.c) with large numbers of customers (e.g. students, parents, members, clients e.t.c) and large volume of transactions find it difficult to track all payment transactions and generate insightful reports that:
</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Boost operational efficiency </li>
          <li>Boost Revenue</li>
          <li>Block financial operational loopholes that lead to loose of revenues due to high level of human intervention in the payment process and other areas of revenue generation.
          </li>
        </ul>
        <p>Finkia provides solutions to all the above-mentioned problems.</p>
        <Image
        width={1000}
        height={1000}
        src="/FINKIA_BANNER3.png"
        alt='about banner'
        />
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#EAAB40' }}>4. AI-Powered Photo Editor</h2>
        <p className="mb-4">
        While applying for school admissions, jobs and other opportunities via online-based platforms, many internet users do have challenge of customizing the backgrounds of required pictures or passport photographs.
<br/>For marketing and other purposes, some internet users need to use custom backgrounds for their pictures meant to be shared on social media.
<br/>With the use of Finkia&apos;s AI-powered photo editor, all the above-mentioned problems that some internet users experience can be solved in less than 3 minutes.

        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Quickly customize photo backgrounds for professional or personal use.</li>
          <li>Enhance productivity by streamlining photo editing tasks.</li>
        </ul>
        <Image
        width={1000}
        height={1000}
        src="/FINKIA_BANNER4.png"
        alt='about banner'
        />
      </section>

      <footer className="text-center mt-16">
        <p className="text-sm" style={{ color: '#EAAB40' }}>&copy; 2024 Finkia. All rights reserved.</p>
      </footer>
    </div>
  );
}
