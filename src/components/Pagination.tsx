"use client";
import Link from "next/link";
import { useState } from "react";

const PaginationBar = ({ apiResponse, updatePagination }: { apiResponse: any[]; updatePagination?: () => void; }) => {
  const totalPages = apiResponse.length;
  const [currentPage, setCurrentPage] = useState(1);

  const renderPageLinks = () => {
    return [...Array(totalPages)].map((_, index) => {
      const pageNumber = index + 1;

      const pageLinkClass =
        pageNumber === currentPage
          ? "px-4 py-2 text-sm font-semibold text-white hover:bg-ajo_blue focus:bg-ajo_blue rounded-md"
          : "px-4 py-2 text-sm font-semibold text-ajo_offWhite";

      const handlePageClick = () => {
        setCurrentPage(pageNumber);
        // updatePagination();
      };

      return (
        <button
          key={pageNumber}
          type="button"
          className={pageLinkClass}
          onClick={handlePageClick}
        >
          {pageNumber}
        </button>
      );
    });
  };

  return (
    <div className="mt-6 flex w-full items-center justify-center">
      <nav className="flex items-center" aria-label="Pagination">
        <button
          type="button"
          // onClick={updatePagination()}
          className="px-2 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100 rounded-md"
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {renderPageLinks()}
        <button
          onClick={updatePagination()}
          className="px-2 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100 rounded-md"
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default PaginationBar;
