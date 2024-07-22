'use client'

import { FilterDropdown } from "@/components/Buttons"
import PurposeCarousel from "@/modules/merchant/SavingPurposeCarousel"

export default function Page(){
    return(
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
            <div className="mb-4 space-y-2">
                <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
                    Savings Purpose
                </p>
                <p className="text-sm capitalize text-ajo_offWhite">
                Turn Your Dreams into Reality with Finkia’s Savings Purpose,  <span className="text-ajo_orange font-bold">Give Your money a new purpose!</span>
                
                </p>
            </div>

            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
           
                <span className="flex items-center gap-3">
                <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
                    <input
                    //   onChange={handleSearch}
                    type="search"
                    placeholder="Search"
                    className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
                    />
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <circle
                        cx="8.60996"
                        cy="8.10312"
                        r="7.10312"
                        stroke="#EAEAFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.4121 13.4121L16.9997 16.9997"
                        stroke="#EAEAFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                </form>
                <FilterDropdown
                    placeholder="sort by"
                    options={[
                    "Timestamp",
                    "Name",
                    "Email",
                    "Phone",
                    "Channel",
                    "Amount",
                    "Status",
                    ]}
                />
                </span>
                <div role="group" className="flex flex-col-2 justify-between ">
                <label className="block text-white">
                  <input type="radio" name="applyToPurpose" value="all-purpose" />
                  <span className="ml-2">View Ongoing Purposes/ Items</span>
                </label>
                <label className="block text-white ml-4">
                  <input type="radio" name="applyToPurpose" value="select-category"  />
                  <span className="ml-2">View my achieved Purposes/ Items</span>
                </label>
                
                
                
              </div>
          </div>

          <div>
            <PurposeCarousel/>
          </div>

        </div>
    )
}