import React, { useState } from "react";


export const SearchInput = ({ onSearch }: {onSearch: (value: any) => void}) => {
  // const [searchedCharcter, setSearchedCharacter] = useState()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setSearchedCharacter(value);
    // Call the callback function passed from the parent
    onSearch(value);
  }
  return (
    <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
      <input
      onChange={(e) => handleChange(e)}
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
  );
};


