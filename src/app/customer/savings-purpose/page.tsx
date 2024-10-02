"use client";

import { useAuth } from "@/api/hooks/useAuth";

import { FilterDropdown } from "@/components/Buttons";
import ProtectedRoute from "@/components/ProtectedRoute";
import PurposeCarousel from "@/modules/merchant/SavingPurposeCarousel";
import {
  selectOrganizationId,
  updateSelectedProducts,
} from "@/slices/OrganizationIdSlice";
import { useQuery } from "@tanstack/react-query";
import { SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function Page() {
  const dispatch = useDispatch();
  const organisationId = useSelector(selectOrganizationId);
  const [mercantNumber, setMerchantNumber] = useState("");
  const { client } = useAuth();
  const {
    data: organisation,
    isLoading: isLoadingAllPurpose,
    refetch: refetchAllPurpose,
  } = useQuery({
    queryKey: ["organisation"],
    queryFn: async () => {
      return client
        .get(`/api/user/${organisationId}`, {})
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw error;
        });
    },
    staleTime: 5000,
  });
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    organisation?.generalSpace === "Yes" ? "general" : "inhouse",
  );

  useEffect(() => {
    localStorage.removeItem("selectedProducts");
    // Optionally, you can dispatch an action to update the Redux state as well
    dispatch(updateSelectedProducts([]));
  });
  const handleGeneralClick = () => {
    setSelectedCategory("general");
    localStorage.removeItem("selectedProducts");
    // Optionally, you can dispatch an action to update the Redux state as well
    dispatch(updateSelectedProducts([])); // Clear the Redux sta
  };

  const handleInhouseClick = () => {
    setSelectedCategory("inhouse");
    localStorage.removeItem("selectedProducts");
    // Optionally, you can dispatch an action to update the Redux state as well
    dispatch(updateSelectedProducts([]));
  };

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setMerchantNumber(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value); // Update the state with the selected option
    console.log("Selected filter:", value); // You can use this value for sorting or other logic
  };

  return (
    <ProtectedRoute requirePurpose>
      <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
        <div className="mb-4 space-y-2">
          <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
            Savings Purpose
          </p>
          <p className="text-sm capitalize text-ajo_offWhite">
            Turn Your Dreams into Reality with Finkia’s Savings Purpose,{" "}
            <span className="font-bold text-ajo_orange">
              Give Your money a new purpose!
            </span>
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3">
            <form className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
              <input
                onChange={handleSearch}
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
              onChange={handleFilterChange} // Pass the handler as a prop
            />
          </span>
          <div role="group" className="flex-col-2 flex justify-between ">
            <label className="block text-white">
              <input type="radio" name="applyToPurpose" value="all-purpose" />
              <span className="ml-2">View Ongoing Purposes/ Items</span>
            </label>
            <label className="ml-4 block text-white">
              <input
                type="radio"
                name="applyToPurpose"
                value="select-category"
              />
              <span className="ml-2">View my achieved Purposes/ Items</span>
            </label>
          </div>
        </div>

        <div className="text-white">
          {organisation?.generalSpace === "Yes" ? (
            <label>
              <input
                type="radio"
                name="category"
                value="general"
                checked={selectedCategory === "general"}
                onChange={() => handleGeneralClick()}
              />
              <span className="ml-2">General</span>
            </label>
          ) : (
            ""
          )}
          <label className="ml-8">
            <input
              type="radio"
              name="category"
              value="inhouse"
              checked={selectedCategory === "inhouse"}
              onChange={() => handleInhouseClick()}
            />
            <span className="ml-2">Inhouse</span>
          </label>
        </div>

        <div>
          <PurposeCarousel
            merchantNumber={mercantNumber}
            categoryToshow={selectedCategory}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
