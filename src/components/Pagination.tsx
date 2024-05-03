"use client";
import { SetStateAction } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const PaginationBar = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (value: SetStateAction<number>) => void;
}) => {
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  let startPage: number;
  if (totalPages <= 3) {
    // If there are 3 or fewer total pages, show all page numbers
    startPage = 1;
  } else {
    // If there are more than 3 total pages, calculate the start page
    if (currentPage === 1) {
      startPage = 1;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 2;
    } else {
      startPage = currentPage - 1;
    }
  }

  const pageNumbers = Array.from(
    { length: 3 },
    (_, index) => startPage + index,
  ).filter((pageNumber) => pageNumber <= totalPages);

  const isDisabled = (pageNumber: number) => pageNumber > totalPages;

  return (
    <div className="mt-3 flex justify-center">
      <div className="flex items-center justify-center space-x-2">
        <button
          className="rounded-md px-2 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
          onClick={goToPreviousPage}
        >
          <MdKeyboardArrowLeft color="#F2F0FF" />
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            disabled={isDisabled(pageNumber)}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-ajo_offWhite ${pageNumber === currentPage ? "bg-ajo_blue" : "bg-transparent"} hover:bg-gray-700 hover:opacity-100`}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="rounded-md px-2 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
          onClick={goToNextPage}
        >
          <MdKeyboardArrowRight color="#F2F0FF" />
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
