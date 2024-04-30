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

  return (
    <div className="flex justify-center mt-3">
      <div className="flex items-center justify-center space-x-2">
        <button
          className="rounded-md px-2 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
          onClick={goToPreviousPage}
        >
          <MdKeyboardArrowLeft color="#F2F0FF" />
        </button>
        <button
          className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-ajo_offWhite hover:bg-ajo_blue hover:text-white focus:bg-ajo_blue"
          onClick={() => setCurrentPage(currentPage)}
        >
          {currentPage}
        </button>

        <button
          className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-ajo_offWhite hover:bg-ajo_blue hover:text-white focus:bg-ajo_blue"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
        <button
          className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-ajo_offWhite hover:bg-ajo_blue hover:text-white focus:bg-ajo_blue"
          onClick={() => setCurrentPage(currentPage + 2)}
        >
          {currentPage + 2}
        </button>

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
