import React from 'react'
import Image from 'next/image'
const PhotoEditor = () => {
  return (
    <section className="mb-16 p-6 px-[5%] style={{ backgroundColor: 'rgba(24, 18, 42, 1)', color: 'white' }">
           <h2 className="text-3xl font-bold mb-4" style={{ color: '#EAAB40' }}> AI-Powered Photo Editor</h2>
           <p className="mb-4">
           While applying for school admissions, jobs and other opportunities via online-based platforms, many internet users do have challenge of customizing the backgrounds of required pictures or passport photographs.
   <br/>For marketing and other purposes, some internet users need to use custom backgrounds for their pictures meant to be shared on social media.
   <br/>With the use of Finkia&apos;s AI-powered photo editor, all the above-mentioned problems that some internet users experience can be solved in less than 3 minutes.
   
           </p>
           <ul className="list-disc list-inside space-y-2">
             <li>Quickly customize photo backgrounds for professional or personal use.</li>
             <li>Enhance productivity by streamlining photo editing tasks.</li>
           </ul>
           <div className='mt-4 w-full '>
           <Image
           className='w-full'
           width={1000}
           height={1000}
           src="/FINKIA_BANNER4.png"
           alt='about banner'
           /></div>
         </section>
  )
}

export default PhotoEditor