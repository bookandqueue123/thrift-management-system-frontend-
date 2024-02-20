"use client";
import { Dispatch, SetStateAction, useState } from "react";

export const StatusIndicator = ({
  label,
  clickHandler,
  dropdownEnabled,
  dropdownContents,
  openDropdown,
  toggleDropdown,
  currentIndex,
}: {
  label: string;
  clickHandler?: () => void;
  dropdownEnabled?: boolean;
  dropdownContents?: { labels: string[]; actions: (() => void)[] };
  openDropdown?: number;
  toggleDropdown?: (val: number) => void;
  currentIndex?: number;
}) => {
  // const [currentlyOpened, setCurrentlyOpened] = useState(0);
  const getIndicatorStyles = (label: string) => {
    switch (label.toLowerCase()) {
      case "pending":
        return {
          bgClass: "bg-pendingBg",
          textClass: "text-pendingText",
          btn: "",
        };
      case "success":
        return {
          bgClass: "bg-successBg",
          textClass: "text-successText",
          btn: "",
        };
      case "failed":
        return {
          bgClass: "bg-failedBg",
          textClass: "text-errorText",
          btn: "",
        };
      default:
        return {
          bgClass: "bg-pendingBg",
          textClass: "text-ajo_offWhite",
          btn: "cursor-pointer hover:border-ajo_blue hover:border focus:border-ajo_blue focus:border",
        };
    }
  };

  const { bgClass, textClass, btn } = getIndicatorStyles(label);
  return (
    <div className="relative">
      <div
        className={`${bgClass} rounded-lg px-3 py-2  ${btn} flex items-center gap-x-4 border border-transparent md:max-w-28`}
        onClick={() => {
          clickHandler?.();
        }}
      >
        <p
          className={`text-sm font-medium ${textClass} text-center capitalize`}
        >
          {label}
        </p>
        {dropdownEnabled && (
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.709563 2.21L3.29956 4.8C3.68956 5.19 4.31956 5.19 4.70956 4.8L7.29956 2.21C7.92956 1.58 7.47956 0.5 6.58956 0.5H1.40956C0.519563 0.5 0.0795632 1.58 0.709563 2.21Z"
              fill="#F2F0FF"
            />
          </svg>
        )}
      </div>
      {openDropdown === currentIndex && dropdownEnabled && (
        <div className="absolute right-[20%] top-[105%] z-20 rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
          {dropdownContents?.labels?.map((option, index) => (
            <p
              key={index}
              onClick={() => {
                // setCurrentlyOpened(openDropdown + 1);
                toggleDropdown?.(openDropdown ?? 0);
                dropdownContents.actions[index]();
              }}
              className={` block cursor-pointer px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
