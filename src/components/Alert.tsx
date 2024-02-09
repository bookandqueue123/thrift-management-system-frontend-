import Link from 'next/link'
import React from 'react'

const Alert = ({ content, buttonLabel, endpoint, variant }: { content: string; buttonLabel: string; endpoint: string; variant: 'success' | 'error' }) => {
 const getAlertStyle = (label: string) => {
   switch (variant) {
     case "error":
       return {
         bgClass: "bg-failedBg",
         textClass: "text-errorText",
         borderColor: "border-errorText"
       };
     case "success":
       return {
         bgClass: "bg-successBg",
         textClass: "text-successText",
         borderColor: "border-successText"
       };
   }
 };
 
  const {bgClass, textClass, borderColor} = getAlertStyle(variant)
  
  return (
    <div
      className={`${bgClass} ${borderColor} flex items-center justify-between rounded-lg border-2 px-8 py-4 mb-4`}
    >
      <p className={`${textClass} text-sm text-ajo_offWhite`}>{content}</p>
      <Link
        href={endpoint}
        className={`${bgClass} rounded-md px-4 py-2 text-sm font-semibold capitalize text-ajo_offWhite`}
      >
        {buttonLabel}
      </Link>
    </div>
  );
}

export default Alert