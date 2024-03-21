// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// const Kyc = () => {
//   const router = useRouter();
//   const [kycSection, setKycSection] = useState<
//     "personal" | "next of kin" | "identification" | "final"
//   >("personal");
//   const [filledSection, setFilledSection] = useState<string[]>([]);

//   const socials = ["facebook", "linkedin", "instagram", "twitter", "envelope"];

//   const handleSectionComplete = (section: string) => {
//     // check if the section is already in the filledSection array
//     if (!filledSection.includes(section)) {
//       // if not, add it to the array and update the state
//       setFilledSection([...filledSection, section]);
//     }
//     // then, move to the next section
//     switch (section) {
//       case "personal":
//         setKycSection("next of kin");
//         break;
//       case "next of kin":
//         setKycSection("identification");
//         break;
//       case "identification":
//         setKycSection("final");
//         break;
//       default:
//         break;
//     }
//   };

//   console.log("after:", filledSection);

//   const getIndicatorColor = (previousSection: string) => {
//     const color = {
//       borderColor: "border-ajo_orange",
//       bgColor: "bg-ajo_orange",
//       textColor: "text-ajo_orange",
//     };
//     return filledSection.includes(previousSection)
//       ? color
//       : {
//           borderColor: "border-ajo_offWhite",
//           bgColor: "bg-ajo_offWhite",
//           textColor: "text-ajo_offWhite",
//         };
//   };

//   const prevSection =
//     kycSection === "next of kin"
//       ? "personal"
//       : kycSection === "identification"
//         ? "next of kin"
//         : "identification";

//   const { borderColor, bgColor, textColor } = getIndicatorColor(prevSection);
//   console.log(getIndicatorColor(prevSection));
//   return (
//     <>
//       <div className="mx-auto mb-10 mt-8 w-[90%] align-middle">
//         <div className="mx-[10%] flex items-center gap-x-2">
//           <div
//             id="kyc1"
//             className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
//           >
//             <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
//           </div>

//           <span
//             className={`flex-grow border-t-[1px] border-dashed ${borderColor}`}
//           ></span>
//           <div
//             id="kyc2"
//             className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
//           >
//             <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
//           </div>
//           <span
//             className={`flex-grow border-t-[1px] border-dashed ${borderColor}`}
//           ></span>
//           <div
//             id="kyc3"
//             className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
//           >
//             <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label
//             htmlFor="kyc1"
//             className={`text-center text-xs font-semibold ${textColor}`}
//           >
//             Personal Details
//           </label>

//           <label
//             htmlFor="kyc2"
//             className={`text-center text-xs font-semibold ${textColor}`}
//           >
//             Next of Kin Details
//           </label>
//           <label
//             htmlFor="kyc3"
//             className={`text-center text-xs font-semibold ${textColor}`}
//           >
//             Identification Details
//           </label>
//         </div>
//       </div>
//       <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
//         {kycSection === "personal" && (
//           <div className="mb-8">
//             <div className="mb-3">
//               <label
//                 htmlFor="resident-country"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Country of Residence
//               </label>
//               <input
//                 id="resident-country"
//                 name="resident-country"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="state"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 State
//               </label>
//               <input
//                 id="state"
//                 name="state"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="LGA"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Local Government Area (LGA)
//               </label>
//               <input
//                 id="LGA"
//                 name="LGA"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="city"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 City/ Town
//               </label>
//               <input
//                 id="city"
//                 name="city"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="landmark"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Popular market/bus park/religion centre/event centre/place in
//                 your locality.
//               </label>
//               <input
//                 id="landmark"
//                 name="landmark"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>
//           </div>
//         )}
//         {kycSection === "next of kin" && (
//           <div className="mb-8">
//             <div className="mb-3">
//               <label
//                 htmlFor="next-of-kin"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Next Of Kin
//               </label>
//               <input
//                 id="next-of-kin"
//                 name="next-of-kin"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="relationship"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Relationship to Next of Kin
//               </label>
//               <input
//                 id="relationship"
//                 name="relationship"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="kin-phone"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Next of Kin Phone number
//               </label>
//               <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
//                 <span className="flex h-full select-none items-center gap-2 text-gray-400 sm:text-sm">
//                   <svg
//                     width="20"
//                     height="16"
//                     viewBox="0 0 20 16"
//                     fill="none"
//                     className="h-100 f-100"
//                   >
//                     <path
//                       d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
//                       fill="white"
//                     />
//                     <path
//                       d="M1 2.05C1 1.60817 1.35817 1.25 1.8 1.25H6.29677C6.7386 1.25 7.09677 1.60817 7.09677 2.05V13.95C7.09677 14.3918 6.7386 14.75 6.29677 14.75H1.8C1.35817 14.75 1 14.3918 1 13.95V2.05ZM12.9032 2.05C12.9032 1.60817 13.2614 1.25 13.7032 1.25H18.2C18.6418 1.25 19 1.60817 19 2.05V13.95C19 14.3918 18.6418 14.75 18.2 14.75H13.7032C13.2614 14.75 12.9032 14.3918 12.9032 13.95V2.05Z"
//                       fill="#186648"
//                     />
//                     <path
//                       d="M1 1.45C1 1.33954 1.08954 1.25 1.2 1.25H18.8C18.9105 1.25 19 1.33954 19 1.45V14.55C19 14.6605 18.9105 14.75 18.8 14.75H1.2C1.08954 14.75 1 14.6605 1 14.55V1.45Z"
//                       stroke="#131313"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   +234
//                 </span>
//                 <input
//                   id="kin-phone"
//                   name="kin-phone"
//                   type="tel"
//                   className=" bg-transparent outline-none"
//                 />
//               </div>
//             </div>

//             <div className="mb-3">
//               <label
//                 htmlFor="kin-home-address"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Home address
//               </label>
//               <input
//                 id="kin-home-address"
//                 name="kin-home-address"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>
//           </div>
//         )}
//         {kycSection === "identification" && (
//           <div className="mb-8">
//             <div className="mb-3">
//               <label
//                 htmlFor="passport-photo"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Passport Photograph (Maximum 2.0 MB)
//               </label>
//               <div
//                 id="passport-photo"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] px-6 py-10 text-[#7D7D7D]"
//               >
//                 <label
//                   htmlFor="passport-upload"
//                   className="flex cursor-pointer flex-col items-center align-middle text-[#7D7D7D]"
//                 >
//                   <svg
//                     width="48"
//                     height="48"
//                     viewBox="0 0 48 48"
//                     fill="none"
//                     className=""
//                   >
//                     <path
//                       d="M23 31.154V13.854L18.34 18.514L16.924 17.076L24 10L31.076 17.076L29.662 18.516L25 13.854V31.154H23ZM13.23 38C12.31 38 11.542 37.692 10.926 37.076C10.3087 36.4587 10 35.69 10 34.77V29.924H12V34.77C12 35.0767 12.128 35.3587 12.384 35.616C12.6413 35.872 12.9233 36 13.23 36H34.77C35.0767 36 35.3587 35.872 35.616 35.616C35.872 35.3587 36 35.0767 36 34.77V29.924H38V34.77C38 35.69 37.692 36.458 37.076 37.074C36.4587 37.6913 35.69 38 34.77 38H13.23Z"
//                       fill="#7D7D7D"
//                     />
//                   </svg>
//                   <p className="">Select file in JPEG or PNG format.</p>
//                   <input
//                     id="passport-upload"
//                     name="passport-upload"
//                     type="file"
//                     className="sr-only"
//                     accept=".png,.jpg,.jpeg"
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="identification-doc"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Select Identification Document type
//               </label>
//               <select
//                 id="identification-doc"
//                 name="identification-doc"
//                 className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] "
//               >
//                 <option>International Passport</option>
//                 <option>Utility Bill</option>
//               </select>
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="identity-doc"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Identification Document Upload
//               </label>
//               <div
//                 id="identity-doc"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6] px-6 py-10 text-[#7D7D7D]"
//               >
//                 <label
//                   htmlFor="identityDoc-upload"
//                   className="flex cursor-pointer flex-col items-center align-middle text-[#7D7D7D]"
//                 >
//                   <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
//                     <path
//                       d="M23 31.154V13.854L18.34 18.514L16.924 17.076L24 10L31.076 17.076L29.662 18.516L25 13.854V31.154H23ZM13.23 38C12.31 38 11.542 37.692 10.926 37.076C10.3087 36.4587 10 35.69 10 34.77V29.924H12V34.77C12 35.0767 12.128 35.3587 12.384 35.616C12.6413 35.872 12.9233 36 13.23 36H34.77C35.0767 36 35.3587 35.872 35.616 35.616C35.872 35.3587 36 35.0767 36 34.77V29.924H38V34.77C38 35.69 37.692 36.458 37.076 37.074C36.4587 37.6913 35.69 38 34.77 38H13.23Z"
//                       fill="#7D7D7D"
//                     />
//                   </svg>
//                   <p className="">Select file in JPEG or PNG format.</p>
//                   <input
//                     id="identityDoc-upload"
//                     name="identityDoc-upload"
//                     type="file"
//                     className="sr-only"
//                     accept=".png,.jpg,.jpeg"
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="nin"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 NIN number
//               </label>
//               <input
//                 id="nin"
//                 name="nin"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="bvn"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 BVN number
//               </label>
//               <input
//                 id="bvn"
//                 name="bvn"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>
//             <div className="mb-3">
//               <label
//                 htmlFor="bank-acct-no"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Bank Account Number (All withdrawals will be made into this
//                 account)
//               </label>
//               <input
//                 id="bank-acct-no"
//                 name="bank-acct-no"
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
//               />
//             </div>
//           </div>
//         )}
//         {kycSection === "final" && (
//           <div className="mb-8">
//             <div className="mb-4">
//               <label
//                 htmlFor="organization-choice"
//                 className="m-0 text-xs font-medium text-white"
//               >
//                 Select Organisation i.e Thrift Collector/ manager of esusu or
//                 adashe
//               </label>
//               <select
//                 id="organization-choice"
//                 name="organization-choice"
//                 className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D] "
//                 required
//               >
//                 <option>Raoatech</option>
//                 <option>Iya Moria</option>
//                 <option>Lagos Thrift</option>
//                 <option>First Savers Cooperative</option>
//               </select>
//             </div>

//             <div className="rounded-lg border-0 bg-[#F3F4F6] px-3 py-4">
//               <div className="flex items-center justify-between text-xs font-semibold md:text-sm">
//                 <span className="flex items-center gap-2">
//                   <Image
//                     src="/raoatech.png"
//                     alt="raoatech logo"
//                     width={36}
//                     height={36}
//                     loading="lazy"
//                   />
//                   <h6>Raoatech Financial Services</h6>
//                 </span>
//                 <Image
//                   src="/Badge.svg"
//                   alt="approval badge"
//                   width={20}
//                   height={20}
//                   loading="lazy"
//                 />
//               </div>

//               <p className="pt-2 text-sm">
//                 <span className="text-sm font-semibold ">About: </span>
//                 Lorem ipsum dolor sit amet consectetur. Faucibus diam congue
//                 laoreet aliquam nisl urna ut amet. Ut tortor etiam viverra enim.
//                 Diam diam id placerat tristique nunc in. Enim feugiat praesent
//                 ullamcorper interdum
//               </p>

//               <div className="flex items-center justify-between gap-2">
//                 <span>
//                   <Image
//                     src="/people.svg"
//                     alt="approval badge"
//                     width={20}
//                     height={20}
//                     loading="lazy"
//                     className="me-2 inline"
//                   />
//                   <span className="text-sm font-semibold">21640 Users</span>
//                 </span>
//                 <span className="flex items-center gap-2">
//                   {socials.map((name, index) => (
//                     <Link href={`https://www.${name}.com`} key={index}>
//                       <Image
//                         src={`/${name}.svg`}
//                         alt="approval badge"
//                         width={16}
//                         height={16}
//                         loading="lazy"
//                       />
//                     </Link>
//                   ))}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="flex items-center justify-between gap-4">
//           <button
//             type="button"
//             className="flex  w-[30%] items-center  justify-center gap-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-ajo_blue hover:bg-ajo_offWhite focus:bg-ajo_offWhite"
//             onClick={() => {
//               kycSection === "final"
//                 ? setKycSection("identification")
//                 : kycSection === "identification"
//                   ? setKycSection("next of kin")
//                   : kycSection === "next of kin"
//                     ? setKycSection("personal")
//                     : router.push("/signup/customer");
//             }}
//           >
//             <svg
//               width="14"
//               height="13"
//               viewBox="0 0 19 16"
//               fill="none"
//               className="hidden md:block"
//             >
//               <path
//                 d="M18.5 7.987L0.711 8M7.488 1L0.5 8L7.488 15"
//                 stroke="#2D55FB"
//               />
//             </svg>
//             Previous
//           </button>
//           {kycSection !== "final" ? (
//             <button
//               type="button"
//               className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
//               onClick={() => handleSectionComplete(kycSection)}
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
//               onClick={(e) => e.preventDefault()}
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// };

// export default Kyc;

"use client";
import { useAuth } from "@/api/hooks/useAuth";
import SuccessToaster, { ErrorToaster } from "@/components/toast";
import { selectOrganizationId, selectUser } from "@/slices/OrganizationIdSlice";
import { CountryAndStateProps, StateProps, UpdateKycProps, getOrganizationProps } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatesAndLGAs from "@/api/statesAndLGAs.json"
import * as Yup from "yup";

const Kyc = () => {
  
  const userId = useSelector(selectUser)
  
  const searchParams = useSearchParams();
  
  const id = searchParams.get("id");

  const { client } = useAuth();
  const router = useRouter();
//   useEffect(() => {
//     console.log("first load")
//     // This effect will run when the component is mounted or updated
//     setTimeout(() => {
//       router.push(`/signup/customer/kyc?id=${id}`); // Reload the page
//       console.log("refreshing")
//     }, 3000)
    
// }, [router, id]);




  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStateArray, setselectedStateArray] = useState<StateProps[]>([]);
  const [selectedState, setSelectedState] = useState("")
  const [selectedLGA, setSelectedLGA] = useState('');
  const organizationId = useSelector(selectOrganizationId);
  const [selectedLGAArray, setSelectesLGAArray] = useState<string[]>([])
  
 
  
  const [kycSection, setKycSection] = useState<
    "personal" | "next of kin" | "identification" | "final"
  >("personal");

  const [filledSection, setFilledSection] = useState<string[]>([]);


  const initialValues: UpdateKycProps = {
    country: "",
    state: "",
    lga: "",
    city: "",
    popularMarket: "",
    nok: "",
    nokRelationship: "",
    nokPhone: "",
    homeAddress: "",
    photo: null,
    meansOfID: "",
    meansOfIDPhoto: null,
    nin: "",
    bvn: "",
    bankAcctNo: "",
    organisation: "",
    userType: "individual",
  };

  const MyEffectComponent = ({ formikValues }: {formikValues: any}) => {
    useEffect(() => {
      // This function will run whenever the value of 'formikValues.myField' changes
      setSelectedCountry(formikValues.country);
      setSelectedState(formikValues.state)
    }, [formikValues]); // Add 'formikValues.myField' as a dependency
  
    return null; // Since this is a utility component, it doesn't render anything
  };
  

  useEffect(() => {
    const filteredStates = StatesAndLGAs.find(country => country.country === selectedCountry)?.states || [];

    
    setselectedStateArray(filteredStates)
    
  }, [selectedCountry])

  useEffect(() => {
    // Find the Country object in the dataset
    const CountryObject = StatesAndLGAs.find(countryData => countryData.country === selectedCountry);
    if (CountryObject) {
      const stateObject = CountryObject.states.find(state => state.name === selectedState);
      // If state is found, return its LGAs
      if (stateObject) {
        console.log(stateObject.lgas)
        setSelectesLGAArray(stateObject.lgas);
      } else {
        // If state is not found, return an empty array
       
      }
    } 
  }, [selectedCountry, selectedState])
  function getLGAsByState(stateName:string) {
    // Find the Country object in the dataset
    const CountryObject = StatesAndLGAs.find(countryData => countryData.country === selectedCountry);
  
    // If Country object is found, find the state by its name
    if (CountryObject) {
      const stateObject = CountryObject.states.find(state => state.name === stateName);
      // If state is found, return its LGAs
      if (stateObject) {
        console.log(stateObject.lgas)
        setSelectesLGAArray(stateObject.lgas);
      } else {
        // If state is not found, return an empty array
        return [];
      }
    } else {
      // If Nigeria object is not found, return null or handle the error accordingly
      return null;
    }
  }
  // useEffect(() => {
  //   const filteredLG
  // })

  const {
    mutate: kycUpdate,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ["kyc update",],
    mutationFn: async (values: UpdateKycProps) => {
      const formData = new FormData();

      // Append all the fields to the formData
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("lga", values.lga);
      formData.append("city", values.city);
      formData.append("popularMarket", values.popularMarket);
      formData.append("nok", values.nok);
      formData.append("nokRelationship", values.nokRelationship);
      formData.append("nokPhone", values.nokPhone);
      formData.append("homeAddress", values.homeAddress);
      formData.append("userType", values.userType);
      formData.append("organisation", organizationId);
      formData.append("nin", values.nin);
      formData.append("bvn", values.bvn);
      formData.append("meansOfID", values.meansOfID);
      formData.append("bankAcctNo", values.bankAcctNo);
      // Append images
      if (values.photo) {
        formData.append("photo", values.photo[0]); // Assuming photo is an array of File objects
      }
      // if (values.meansOfID) {
      //   formData.append("meansOfID", values.meansOfID[0]);
      // }
      if (values.meansOfIDPhoto) {
        formData.append("meansOfIDPhoto", values.meansOfIDPhoto[0]);
      }

      console.log(formData);
      // Make the API call with formData
      return client.put(`/api/user/${userId}`, formData);
    },

    onSuccess(response) {
      router.push("/customer");
      console.log(response);
      setShowSuccessToast(true);
      setSuccessMessage((response as any).response.data.message);
    },

    onError(error: AxiosError<any, any>) {
      setShowErrorToast(true);
      setErrorMessage(error.response?.data.message);
    },
  });

  const {
    data: organizations,
    isLoading: isUserLoading,
    isError: getGroupError,
  } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: async () => {
      return client
        .get(`/api/user?role=organisation`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  });

  const socials = ["facebook", "linkedin", "instagram", "twitter", "envelope"];
  const handleSectionComplete = () => {
    switch (kycSection) {
      case "personal":
        setKycSection("next of kin");
        break;
      case "next of kin":
        setKycSection("identification");
        break;
      // case "identification":
      //   setKycSection("final");
      //   break;
      default:
        break;
    }
  };

  const getIndicatorColor = (previousSection: string) => {
    const color = {
      borderColor: "border-ajo_orange",
      bgColor: "bg-ajo_orange",
      textColor: "text-ajo_orange",
    };
    return filledSection.includes(previousSection)
      ? color
      : {
          borderColor: "border-ajo_offWhite",
          bgColor: "bg-ajo_offWhite",
          textColor: "text-ajo_offWhite",
        };
  };
  const prevSection =
    kycSection === "next of kin"
      ? "personal"
      : kycSection === "identification"
        ? "next of kin"
        : "identification";
  const { borderColor, bgColor, textColor } = getIndicatorColor(prevSection);
  // console.log(getIndicatorColor(prevSection));

  // console.log(kycSection);
  // if (!id) {
  //   // If id is not available yet, display loading indicator
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <div className="mx-auto mb-10 mt-8 w-[90%] align-middle">
        <div className="mx-[10%] flex items-center gap-x-2">
          <div
            id="kyc1"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>

          <span
            className={`teal-500 flex-grow border-t-[1px] border-dashed ${borderColor}`}
          ></span>
          <div
            id="kyc2"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>
          <span
            className={`flex-grow border-t-[1px] border-dashed ${borderColor}`}
          ></span>
          <div
            id="kyc3"
            className={`mb-1 flex h-4 w-4 items-center justify-center rounded-lg border ${borderColor} bg-ajo_offWhite`}
          >
            <div className={`h-2 w-2  rounded-lg ${bgColor}`}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="kyc1"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Personal Details
          </label>

          <label
            htmlFor="kyc2"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Next of Kin Details
          </label>
          <label
            htmlFor="kyc3"
            className={`text-center text-xs font-semibold ${textColor}`}
          >
            Identification Details
          </label>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          country: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
          lga: Yup.string().required("Required"),
          city: Yup.string().required("Required"),
          popularMarket: Yup.string().required("Required"),
          nok: Yup.string().required("Required"),
          nokRelationship: Yup.string().required("Required"),
          nokPhone: Yup.string().required("Required"),
          homeAddress: Yup.string().required("Required"),
          photo: Yup.mixed().required("Required"),
          meansOfID: Yup.string().required("Required"),
          meansOfIDPhoto: Yup.mixed().required("Required"),
          nin: Yup.string().optional(),
          bvn: Yup.string().optional(),
          bankAcctNo: Yup.string().required("Required"),
          // organisation: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            kycUpdate(values);
            console.log(values);
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting, handleChange, handleSubmit, values, errors, setFieldValue }) => (
          <Form
            className="mt-8"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            name="image"
          >
            {kycSection === "personal" && (
              <>
                {/* Personal Details Fields */}
                <div className="mb-8">
                  <div className="mb-3">
                    <label
                      htmlFor="country"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Country of Residence
                    </label>
                    <Field
                      onChange={handleChange}
                      as='select'
                      isInvalid={!!errors.country}
                      name="country"
                      id="country"
                      // type="text"
                      placeholder="country"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    >
                      <option>Select Country</option>
                      {StatesAndLGAs && StatesAndLGAs.map((countries) => (
                        <option key={countries.country} value={countries.country}>
                        {countries.country }
                      </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  {/* Add more fields for personal details */}

                  <div className="mb-3">
                    <label
                      htmlFor="state"
                      className="m-0 text-xs font-medium text-white"
                    >
                      State
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      // type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    >
                      <option>Select State</option>
                      
                      {selectedStateArray && selectedStateArray.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="lga"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Local Government Area (lga)
                    </label>
                    <Field
                      as="select"
                      id="lga"
                      name="lga"
                      // type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    >
                      <option>Select LGA</option>

                      {selectedLGAArray && selectedLGAArray.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                      {/* {selectedLGAArray && selectedStateArray.map((lga) => (
                        <option>

                        </option>
                      )) } */}
                    </Field>
                    <ErrorMessage
                      name="lga"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="city"
                      className="m-0 text-xs font-medium text-white"
                    >
                      City/Town
                    </label>
                    <Field
                      name="city"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="popularMarket"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Popular market/bus park/religion centre/event centre/place
                      in your locality
                    </label>
                    <Field
                      name="popularMarket"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="popularMarket"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
              </>
            )}

            {kycSection === "next of kin" && (
              <>
                {/* Next of Kin Details Fields */}
                <div className="mb-8">
                  <div className="mb-3">
                    <label
                      htmlFor="nok"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Next Of Kin
                    </label>
                    <Field
                      name="nok"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="nok"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  {/* Add more fields for next of kin details */}
                  <div className="mb-3">
                    <label
                      htmlFor="nokRelationship"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Relationship to Next of Kin
                    </label>
                    <Field
                      name="nokRelationship"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="nokRelationship"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="nokPhoneNumber"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Next of Kin Phone number
                    </label>
                    <div className="mt-1 flex w-full items-center gap-2 rounded-lg border-0  bg-[#F3F4F6] p-3 text-[#7D7D7D]">
                      <Field
                        name="nokPhone"
                        id="kin-phone"
                        type="tel"
                        className=" bg-transparent outline-none"
                      />
                    </div>
                    <ErrorMessage
                      name="nokPhoneNumber"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="homeAddress"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Home address
                    </label>
                    <Field
                      name="homeAddress"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="homeAddress"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
              </>
            )}

            {kycSection === "identification" && (
              <>
                {/* Identification Details Fields */}
                <div className="mb-8">
                  {/* <div className="mb-3">
        <label htmlFor="photo" className="m-0 text-xs font-medium text-white">Passport Photograph (Maximum 2.0 MB)</label>
        <Field name="photo" type="file" className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]" />
        <ErrorMessage name="photo" component="div" className="text-red-500 text-xs" />
      </div> */}

                  <div className="">
                    <label
                      htmlFor="photo"
                      className="text-md block font-medium text-white"
                    >
                      Photo
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                      <input
                        type="file"
                        name="photo"
                        id="photo"
                        className="hidden"
                        onChange={(e) => setFieldValue("photo", e.target.files)}
                        accept="image/*"
                      />
                      <label htmlFor="photo" className="cursor-pointer">
                        <p className="text-center text-white">
                          Drag n drop an image here, or click to select one
                        </p>
                      </label>
                      {values.photo && values.photo[0] && (
                        <Image
                          src={URL.createObjectURL(values.photo[0])}
                          alt="Product"
                          className="max-w-full"
                          style={{ maxWidth: "100%" }}
                          width={100}
                          height={100}
                        />
                      )}
                    </div>
                    <div className="text-xs text-red-600">
                      <ErrorMessage name="photo" />
                    </div>
                  </div>

                  <div className="mb-3 mt-4">
                    <label
                      htmlFor="meansOfID"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Select Identification Document type
                    </label>
                    <Field
                      as="select"
                      name="meansOfID"
                      className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
                    >
                      <option value="International Passport">
                        International Passport
                      </option>
                      <option value="Utility Bill">Utility Bill</option>
                      <option value="Utility Bill">NIN</option>
                      <option value="Utility Bill">Drivers License</option>
                      <option value="Utility Bill">Voters Card</option>
                      <option value="Utility Bill">Association Membership ID</option>
                      <option value="Utility Bill">School ID</option>
                    </Field>
                    <ErrorMessage
                      name="meansOfID"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label
                      htmlFor="meansOfIDPhoto"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Identification Document Upload
                    </label>
                    <Field
                      name="meansOfIDPhoto"
                      type="file"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="meansOfIDPhoto"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div> */}

                  <div className="mb-3">
                    <label
                      htmlFor="image"
                      className="text-md block font-medium text-white"
                    >
                      {!values.meansOfID ? "Means  of Id" : values.meansOfID}{" "}
                      Photo
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                      <input
                        type="file"
                        name="image"
                        id="image"
                        className="hidden"
                        onChange={(e) =>
                          setFieldValue("meansOfIDPhoto", e.target.files)
                        }
                        accept="image/*"
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        <p className="text-center text-white">
                          Drag n drop an image here, or click to select one
                        </p>
                      </label>
                      {values.meansOfIDPhoto && values.meansOfIDPhoto[0] && (
                        <Image
                          src={URL.createObjectURL(values.meansOfIDPhoto[0])}
                          alt="Product"
                          className="max-w-full"
                          style={{ maxWidth: "100%" }}
                          width={100}
                          height={100}
                        />
                      )}
                    </div>
                    <div className="text-xs text-red-600">
                      <ErrorMessage name="meansOfIDPhoto" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="nin"
                      className="m-0 text-xs font-medium text-white"
                    >
                      NIN number
                    </label>
                    <Field
                      name="nin"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="nin"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="bvn"
                      className="m-0 text-xs font-medium text-white"
                    >
                      BVN number
                    </label>
                    <Field
                      name="bvn"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="bvn"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="bankAcctNo"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Bank Account Number (All withdrawals will be made into
                      this account)
                    </label>
                    <Field
                      name="bankAcctNo"
                      type="text"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    />
                    <ErrorMessage
                      name="bankAcctNo"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                </div>
              </>
            )}

            {kycSection === "final" && (
              <>
                {/* Final Section Fields */}
                <div className="mb-8">
                  <div className="mb-4">
                    <label
                      htmlFor="organisation"
                      className="m-0 text-xs font-medium text-white"
                    >
                      Select Organisation i.e Thrift Collector/ manager of esusu
                      or adashe
                    </label>
                    <Field
                      as="select"
                      id="organization"
                      name="organization"
                      className="mt-1 w-full rounded-lg border-0 bg-[#F3F4F6]  p-3 text-[#7D7D7D]"
                    >
                      <option value="">Select Organization</option>
                      {organizations?.map((org: getOrganizationProps) => (
                        <option key={org._id} value={org._id}>
                          {org.organisationName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="organisation"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                  <div className="rounded-lg border-0 bg-[#F3F4F6] px-3 py-4">
                    <div className="flex items-center justify-between text-xs font-semibold md:text-sm">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/raoatech.png"
                          alt="raoatech logo"
                          width={36}
                          height={36}
                          loading="lazy"
                        />
                        <h6>Raoatech Financial Services</h6>
                      </span>
                      <Image
                        src="/Badge.svg"
                        alt="approval badge"
                        width={20}
                        height={20}
                        loading="lazy"
                      />
                    </div>
                    <p className="pt-2 text-sm">
                      <span className="text-sm font-semibold ">About: </span>
                      Lorem ipsum dolor sit amet consectetur. Faucibus diam
                      congue laoreet aliquam nisl urna ut amet. Ut tortor etiam
                      viverra enim. Diam diam id placerat tristique nunc in.
                      Enim feugiat praesent ullamcorper interdum
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        <Image
                          src="/people.svg"
                          alt="approval badge"
                          width={20}
                          height={20}
                          loading="lazy"
                          className="me-2 inline"
                        />
                        <span className="text-sm font-semibold">
                          21640 Users
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        {socials.map((name, index) => (
                          <Link href={`https://www.${name}.com`} key={index}>
                            <Image
                              src={`/${name}.svg`}
                              alt="approval badge"
                              width={16}
                              height={16}
                              loading="lazy"
                            />
                          </Link>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="flex  w-[30%] items-center  justify-center gap-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-ajo_blue hover:bg-ajo_offWhite focus:bg-ajo_offWhite"
                onClick={() => {
                  kycSection === "final"
                    ? setKycSection("identification")
                    : kycSection === "identification"
                      ? setKycSection("next of kin")
                      : kycSection === "next of kin"
                        ? setKycSection("personal")
                        : router.push("/signup/customer");
                }}
              >
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 19 16"
                  fill="none"
                  className="hidden md:block"
                >
                  <path
                    d="M18.5 7.987L0.711 8M7.488 1L0.5 8L7.488 15"
                    stroke="#2D55FB"
                  />
                </svg>
                Previous
              </button>
              {kycSection !== "identification" ? (
                <button
                  type="button"
                  className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                  onClick={() => handleSectionComplete()}
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-md bg-ajo_blue py-3 text-sm font-semibold text-white  hover:bg-indigo-500 focus:bg-indigo-500"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              )}
            </div>
            {/* <SuccessToaster message="hey" /> */}
            {showSuccessToast && (
              <SuccessToaster message={"Profile completed successfull!"} />
            )}
            {showErrorToast && errorMessage && errorMessage && (
              <ErrorToaster
                message={
                  errorMessage ? errorMessage : "Error completing profile"
                }
              />
            )}
            <MyEffectComponent formikValues={values} />
          </Form>
        )}
      </Formik>
    </>
  );
};

function KYCFallBack(){
  return <>Loading...</>
}

export const dynamic = 'force-dynamic'
export default function Page(){
  return(
    <div>
      <Suspense fallback={<KYCFallBack/>}>
      <Kyc/>
    </Suspense>
    </div>

  )
}

