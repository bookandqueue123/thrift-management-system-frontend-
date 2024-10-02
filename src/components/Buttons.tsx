import React from "react";

import { ChangeEvent } from "react";

export const FilterDropdown = ({
  label,
  options,
  placeholder,
  onChange, // Accept onChange as a prop
}: {
  label?: string;
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void; // Define the type for onChange
}) => {
  // Function to handle the selection change
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value); // Call onChange with the selected value
    }
  };

  return (
    <>
      {label && (
        <label htmlFor="filter" className="m-0 text-xs font-medium text-white">
          {label}
        </label>
      )}
      <div className="cursor-pointer rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
        <select
          id="filter"
          name="filter"
          className="w-full cursor-pointer bg-transparent text-ajo_offWhite text-opacity-60 outline-none hover:outline-none focus:outline-none"
          defaultValue={"Filter"}
          onChange={handleSelectChange} // Attach the onChange handler
        >
          <option disabled defaultValue={"Filter"} className="hidden">
            {placeholder ? placeholder : "Filter"}
          </option>
          {options.map((option) => (
            <option
              className="cursor-pointer bg-[rgba(34,28,62,.9)] px-4 py-4 text-sm capitalize hover:text-ajo_darkBlue"
              key={option}
              value={option} // Set the value for the option
            >
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export const CustomButton = ({
  type,
  style,
  onButtonClick,
  label,
  disabled,
}: {
  type: "button" | "submit";
  style: string;
  onButtonClick?: (() => void) | ((e: React.FormEvent) => void);
  label: string | React.ReactElement;
  disabled?: boolean;
}) => {
  return (
    <button
      type={type}
      className={style}
      onClick={onButtonClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
