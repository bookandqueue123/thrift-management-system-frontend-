"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import statesAndLGAs from "@/api/statesAndLGAs.json";
import Navbar from "@/modules/HomePage/NavBar";
import Footer from "@/modules/HomePage/Footer";
import { useAuth } from '@/api/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

interface PickupStation {
  id: string;
  name: string;
  address: string;
}

const PAGE_SIZE = 10;

const DeliveryPage = () => {
  const router = useRouter();
  const { client } = useAuth();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [available] = useState(true); // Always fetch available stations
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [availableStations, setAvailableStations] = useState<PickupStation[]>([]);

  // Get all states
  const states = statesAndLGAs[0]?.states || [];
  const cities = selectedState
    ? states.find((s: any) => s.name === selectedState)?.lgas || []
    : [];

  // Helper to map city to backend value (remove spaces)
  const getApiCity = (city: string) => city.replace(/\s+/g, '');

  // Fetch pickup stations from API
  const { data, isLoading } = useQuery({
    queryKey: ['pickup-stations', selectedCity, available, currentPage, searchQuery],
    queryFn: async () => {
      if (deliveryMode !== 'pickup' || !selectedCity) return { stations: [] };
      let url = `/api/pickup-stations?limit=${PAGE_SIZE}&page=${currentPage}`;
      if (selectedCity) url += `&city=${encodeURIComponent(getApiCity(selectedCity))}`;
      if (available) url += `&available=true`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await client.get(url);
      return res.data;
    },
    enabled: deliveryMode === 'pickup' && !!selectedCity
  });

  const pickupStations: PickupStation[] = data?.stations || [];

  // Fetch available stations using the new endpoint
  const fetchAvailableStations = async () => {
    try {
      let url = `/api/pickup-stations/available`;
      if (selectedCity) url += `?city=${encodeURIComponent(getApiCity(selectedCity))}`;
      const res = await client.get(url);
      // Map the response to include a readable address and numbering
      const stations = (res.data.data || []).map((station: any, idx: number) => ({
        id: station._id || station.id,
        name: `Station ${idx + 1} - ${station.name}`,
        address: `${station.address.street}, ${station.address.city}, ${station.address.state} ${station.address.zipCode}, ${station.address.country}`
      }));
      setAvailableStations(stations);
    } catch (e) {
      setAvailableStations([]);
    }
  };

  useEffect(() => {
    if (showAvailableOnly && deliveryMode === 'pickup' && selectedCity) {
      fetchAvailableStations();
    }
    // eslint-disable-next-line
  }, [showAvailableOnly, deliveryMode, selectedCity]);

  const handleContinue = () => {
    if (!selectedState || !selectedCity || !deliveryMode) {
      setError("Please select state, city, and delivery mode.");
      return;
    }
    if (deliveryMode === "pickup" && !selectedPickup) {
      setError("Please select a pickup station.");
      return;
    }
    setError("");
    // Save delivery info to localStorage or context as needed
    const deliveryInfo = {
      state: selectedState,
      city: selectedCity,
      deliveryMode,
      pickupStation: deliveryMode === "pickup" ? selectedPickup : null,
    };
    localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));
    router.push("/order-confimation");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Delivery Details</h1>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow border">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              className="w-full border rounded p-2"
              value={selectedState}
              onChange={e => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">Select State</option>
              {states.map((state: any) => (
                <option key={state.name} value={state.name}>{state.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City / LGA</label>
            <select
              className="w-full border rounded p-2"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">Select City/LGA</option>
              {cities.map((city: string) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Mode</label>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded border ${deliveryMode === "door" ? "bg-orange-500 text-white" : "bg-gray-100"}`}
                onClick={() => setDeliveryMode("door")}
                type="button"
              >
                Door Delivery
              </button>
              <button
                className={`px-4 py-2 rounded border ${deliveryMode === "pickup" ? "bg-orange-500 text-white" : "bg-gray-100"}`}
                onClick={() => setDeliveryMode("pickup")}
                type="button"
              >
                Pick Up
              </button>
            </div>
          </div>
          {deliveryMode === "pickup" && (
            <div>
              <label className="block text-sm font-medium mb-1">Select Pickup Station</label>
              <input
                type="text"
                placeholder="Search pickup stations"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border rounded p-2 mb-2 w-full"
              />
              <div className="mb-2 flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${!showAvailableOnly ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setShowAvailableOnly(false)}
                  type="button"
                >
                  All Stations
                </button>
                <button
                  className={`px-3 py-1 rounded ${showAvailableOnly ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setShowAvailableOnly(true)}
                  type="button"
                >
                  Available Stations
                </button>
              </div>
              {showAvailableOnly ? (
                availableStations.length === 0 ? (
                  <div className="text-gray-500 text-sm">No available stations found.</div>
                ) : (
                  <select
                    className="w-full border rounded p-2"
                    value={selectedPickup}
                    onChange={e => setSelectedPickup(e.target.value)}
                  >
                    <option value="">Select Pickup Station</option>
                    {availableStations.map(station => (
                      <option key={station.id} value={station.name}>{station.name} - {station.address}</option>
                    ))}
                  </select>
                )
              ) : (
                isLoading ? (
                  <div className="text-gray-500 text-sm">Loading stations...</div>
                ) : (
                  <select
                    className="w-full border rounded p-2"
                    value={selectedPickup}
                    onChange={e => setSelectedPickup(e.target.value)}
                  >
                    <option value="">Select Pickup Station</option>
                    {pickupStations.map(station => (
                      <option key={station.id} value={station.name}>{station.name} - {station.address}</option>
                    ))}
                  </select>
                )
              )}
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-between mt-6">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => router.push("/cart")}
              type="button"
            >
              Back to Cart
            </button>
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 font-semibold"
              onClick={handleContinue}
              type="button"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryPage; 