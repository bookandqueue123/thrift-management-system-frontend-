"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const AvatarDropdown = ({ logoutFn, avatarImg, routeOptions }: { logoutFn?: () => void; avatarImg: string; routeOptions: string[]; }) => {
  const [AvatarMenuIsOpen, setAvatarMenuIsOpen] = useState(false);

  return (
    <div className="pr-2 md:pl-11">
      {/* <!-- Profile dropdown --> */}
      <button
        type="button"
        className="flex items-center gap-x-2 rounded-full"
        onClick={() => setAvatarMenuIsOpen(!AvatarMenuIsOpen)}
      >
        <Image
          className="h-6 w-6 rounded-full"
          src={avatarImg}
          alt="user image"
          width={24}
          height={24}
        />
        <svg width="10" height="5" viewBox="0 0 12 7" fill="none">
          <path
            d="M1 1L6 6L11 1"
            stroke="#BDBDBD"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Open user menu</span>
      </button>
      {AvatarMenuIsOpen && (
        <div className="absolute right-0 top-14 z-10 mt-2 w-48  rounded-md bg-white bg-opacity-20 py-1 shadow-lg">
          {routeOptions.map((route, index) => {
            if (route.toLowerCase() === 'sign out' && logoutFn) {
              return (
                <a
                  key={route}
                  onClick={logoutFn}
                  className={`cursor-pointer block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                >
                  {route}
                </a>
              );
            } else {
              return (
                <Link
                  key={route}
                  href={`/customer/${route.toLowerCase()}`}
                  className={`block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                >
                  {route}
                </Link>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;


export const MultiSelectDropdown = ({ options, placeholder, label }: { options: string[]; placeholder: string; label: string; }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (e: { target: { name: any; value: any; }; }) => {
   const {value} = e.target
   !selectedOptions.includes(value) &&
     setSelectedOptions((prev) => [...prev, value]);
 };

  const handleRemoveOption = (option: string) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((item) => item !== option),
    );
  };

  return (
    <div className="items-center gap-6 md:flex">
      <label
        htmlFor="addCustomers"
        className="m-0 w-[20%] whitespace-nowrap text-xs font-medium text-white"
      >
        {label}
      </label>
      <div className="w-full">
        <select
          id="addCustomers"
          className="bg-right-20 mt-1 w-full cursor-pointer appearance-none  rounded-lg border-0 bg-[#F3F4F6] bg-[url('../../public/arrow_down.svg')] bg-[95%_center] bg-no-repeat p-3 text-[#7D7D7D]"
          onChange={handleOptionChange}
          value={selectedOptions}
        >
          <option className="hidden lowercase">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="space-x-1 space-y-2">
          {selectedOptions.map((option) => (
            <div
              key={option}
              className="inline-flex items-center space-x-1 rounded-lg bg-blue-100 px-2 py-1 text-sm"
            >
              <span className="text-sm font-medium">{option}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove"
                onClick={() => handleRemoveOption(option)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};