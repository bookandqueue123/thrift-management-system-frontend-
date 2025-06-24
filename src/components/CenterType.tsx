"use client"


import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const CenterType = () => {
    
       const router = useRouter();
      const [centerType, setCenterType] = useState("NewCenter");

        const handleSubmit = (event: any) => {
    event.preventDefault();

    if (centerType === "NewCenter") {
      router.push("/superadmin/getpick-station");
    } else if (centerType === "Merchant") {
      router.push("/superadmin/existing-merchant");
    }
  };

  return (
   <div className="max-w-md mx-auto my-8 p-4 border border-gray-300 rounded-md">
        <h1 className="text-xl font-bold mb-4 text-ajo_offWhite">Create Pick-Up Center</h1>
        <form  onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="inline-flex items-center text-ajo_offWhite">
              <input
                type="radio"
                name="centerType"
                value="NewCenter"
                checked={centerType === "NewCenter"}
                onChange={() => setCenterType("NewCenter")}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">New Center</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center text-ajo_offWhite">
              <input
                type="radio"
                name="centerType"
                value="Merchant"
                checked={centerType === "Merchant"}
                onChange={() => setCenterType("Merchant")}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Choose existing-merchant</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 hover:bg-yellow-600 text-white rounded-md"
          >
            Continue
          </button>
        </form>
      </div>
  )
}

export default CenterType