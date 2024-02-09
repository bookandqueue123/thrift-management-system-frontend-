"use client";
import React from "react";

export const FilterDropdown = ({
  label,
  options,
}: {
  label?: string;
  options: string[];
}) => {
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
        >
          <option disabled defaultValue={"Filter"} className="hidden">
            Filter
          </option>
          {options.map((option) => (
            <option
              className="cursor-pointer bg-[rgba(34,28,62,.9)] px-4 py-4 text-sm capitalize hover:text-ajo_darkBlue"
              key={option}
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
}: {
  type: "button" | "submit";
  style: string;
  onButtonClick: () => void;
  label: string;
}) => {
  return (
    <button
      type={type}
      className={style}
      onClick={onButtonClick}
    >
      {label}
    </button>
  );
};
