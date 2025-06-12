// // components/FinkiaAbout.js
// const FinkiaAbout = () => {
//     const features = [
//       {
//         id: 1,
//         title: "01",
//         description: "Online sales of products/services",
//       },
//       {
//         id: 2,
//         title: "02",
//         description: "AI-powered photo editor",
//       },
//       {
//         id: 3,
//         title: "03",
//         description: "Bills collection and management",
//       },
//       {
//         id: 4,
//         title: "04",
//         description: "Self-serviced smart savings and thrift collection/co-operative society management.",
//       },
//     ];
  
//     return (
//       <section className="bg-white py-10">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
//             What&apos;s Finkia About?
//           </h2>
//           <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
//             FINKIA is an AI-powered, business-process management and productivity-enhancing platform that comes with:
//           </p>
  
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature) => (
//               <div
//                 key={feature.id}
//                 className="bg-[#F4F1EC] rounded-lg shadow-md p-6 text-center"
//               >
//                 <h3 className="text-4xl font-bold text-amber-500 mb-4">
//                   {feature.title}
//                 </h3>
//                 <p className="text-[#80663B]">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   };
  
//   export default FinkiaAbout;
  

// components/AboutSection.tsx
import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          {/* Left: Heading + Description */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">About Us</h2>
            <p className="text-gray-700 leading-relaxed">
              FINKIA is an AI-powered, business- <br/>
              process management and <br/>
              productivity-enhancing platform that <br/> comes
              with;
            </p>
          </div>

          {/* Right: Four Enlarged Info Boxes */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Box 1 */}
            <div className="bg-[#EAF2FA] rounded-lg p-8 h-56 flex flex-col">
              <span className="text-5xl font-bold text-[#2C2648] mb-3">01</span>
              <p className="text-gray-700 text-lg">
                Online sales of products/services
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-[#EAF2FA] rounded-lg p-8 h-56 flex flex-col">
              <span className="text-5xl font-bold text-[#2C2648] mb-3">02</span>
              <p className="text-gray-700 text-lg">
                AI-powered photo editor
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-[#EAF2FA] rounded-lg p-8 h-56 flex flex-col">
              <span className="text-5xl font-bold text-[#2C2648] mb-3">03</span>
              <p className="text-gray-700 text-lg">
                Bills collection and management
              </p>
            </div>

            {/* Box 4 */}
            <div className="bg-[#EAF2FA] rounded-lg p-8 h-56 flex flex-col">
              <span className="text-5xl font-bold text-[#2C2648] ">04</span>
              <p className="text-gray-700 text-lg">
                Self-serviced smart savings and thrift collection/ co-operative society management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
