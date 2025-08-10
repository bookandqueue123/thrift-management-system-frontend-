"use client";
import { useAuth } from "@/api/hooks/useAuth";
import statesAndLGAs from "@/api/statesAndLGAs.json";
import Modal from "@/components/Modal";
import Footer from "@/modules/HomePage/Footer";
import Navbar from "@/modules/HomePage/NavBar";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

interface PickupStation {
  id: string;
  name: string;
  address: string;
  amount?: { value?: number; currency?: string }; // <-- Add this line
}

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    doorDeliveryTermsAndCondition?: string;
    pickupCentreTermsAndCondition?: string;
  };
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Product {
  _id: string;
  name: string;
  doorDeliveryTermsAndCondition: string;
  pickupCentreTermsAndCondition: string;
  [key: string]: any;
}

const PAGE_SIZE = 10;

const DeliveryPage = () => {
  const router = useRouter();
  const { client } = useAuth();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [available] = useState(true); // Always fetch available stations
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [availableStations, setAvailableStations] = useState<PickupStation[]>(
    [],
  );
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  const cartItems: CartItem[] = cartData?.items || [];

  const states = statesAndLGAs[0]?.states || [];
  const cities = selectedState
    ? states.find((s: any) => s.name === selectedState)?.lgas || []
    : [];

  const getApiCity = (city: string) => city.replace(/\s+/g, "");

  const { data, isLoading } = useQuery({
    queryKey: [
      "pickup-stations",
      selectedCity,
      available,
      currentPage,
      searchQuery,
    ],
    queryFn: async () => {
      if (deliveryMode !== "pickup" || !selectedCity) return { stations: [] };
      let url = `/api/pickup-stations?limit=${PAGE_SIZE}&page=${currentPage}`;
      if (selectedCity)
        url += `&city=${encodeURIComponent(getApiCity(selectedCity))}`;
      if (available) url += `&available=true`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await client.get(url);
      return res.data;
    },
    enabled: deliveryMode === "pickup" && !!selectedCity,
  });

  // Map pickup stations for 'All centers' (ensure amount is always present and defaults to 0 NGN if missing)
 const pickupStations = useMemo(() => {
  return (data?.data || data?.stations || []).map(function (station: any, idx: number) {
    let amount = station.amount;
    if (!amount || typeof amount.value !== "number") {
      amount = {
        value: 0,
        currency: amount && amount.currency ? amount.currency : "₦",
      };
    }
    return {
      id: station._id || station.id,
      name: `Station ${idx + 1} - ${station.name}`,
      address:
        station.fullAddress ||
        `${station.address.street}, ${station.address.city}, ${station.address.state} ${station.address.zipCode}, ${station.address.country}`,
      amount,
    };
  });
}, [data]);

  const fetchAvailableStations = async () => {
    try {
      let url = `/api/pickup-stations/available`;
      if (selectedCity)
        url += `?city=${encodeURIComponent(getApiCity(selectedCity))}`;
      const res = await client.get(url);

      const stations = (res.data.data || []).map(function (
        station: any,
        idx: number,
      ) {
        let amount = station.amount;
        if (!amount || typeof amount.value !== "number") {
          amount = {
            value: 0,
            currency: amount && amount.currency ? amount.currency : "₦",
          };
        }
        return {
          id: station._id || station.id,
          name: `Station ${idx + 1} - ${station.name}`,
          address:
            station.fullAddress ||
            `${station.address.street}, ${station.address.city}, ${station.address.state} ${station.address.zipCode}, ${station.address.country}`,
          amount,
        };
      });
      setAvailableStations(stations);
    } catch (e) {
      setAvailableStations([]);
    }
  };

  // Fetch all products from API
  const { data: allProducts, isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await client.get("/api/products");
      return res.data;
    },
  });

  const handleViewTerms = async (type: "door" | "pickup") => {
    if (cartItems.length === 0) {
      setModalContent({
        title:
          type === "door"
            ? "Door Delivery Terms and Conditions"
            : "Pickup Terms and Conditions",
        content: "No products in cart to display terms and conditions.",
      });
      setShowTermsModal(true);
      return;
    }

    if (!allProducts || allProducts.length === 0) {
      setModalContent({
        title:
          type === "door"
            ? "Door Delivery Terms and Conditions"
            : "Pickup Terms and Conditions",
        content: "Unable to load terms and conditions at this time.",
      });
      setShowTermsModal(true);
      return;
    }

    // Get unique product IDs from cart
    const productIds = [...new Set(cartItems.map((item) => item.product._id))];

    // Filter products that are in the cart
    const cartProducts = allProducts.filter((product) =>
      productIds.includes(product._id),
    );

    if (cartProducts.length === 0) {
      setModalContent({
        title:
          type === "door"
            ? "Door Delivery Terms and Conditions"
            : "Pickup Terms and Conditions",
        content: "No matching products found for terms and conditions.",
      });
      setShowTermsModal(true);
      return;
    }

    // Collect all terms and conditions with better formatting
    const allTerms: string[] = [];

    cartProducts.forEach((product, index) => {
      const terms =
        type === "door"
          ? product.doorDeliveryTermsAndCondition
          : product.pickupCentreTermsAndCondition;
      const productNumber = index + 1;

      if (terms && terms.trim()) {
        allTerms.push(`${productNumber}. ${product.name}\n\n${terms}`);
      } else {
        allTerms.push(
          `${productNumber}. ${product.name}\n\nNo ${type === "door" ? "door delivery" : "pickup"} terms and conditions specified for this product.`,
        );
      }
    });

    if (allTerms.length === 0) {
      allTerms.push(
        `No ${type === "door" ? "door delivery" : "pickup"} terms and conditions available for the products in your cart.`,
      );
    }

    setModalContent({
      title:
        type === "door"
          ? "🚚 Door Delivery Terms and Conditions"
          : "📦 Pickup Terms and Conditions",
      content: allTerms.join("\n\n" + "─".repeat(50) + "\n\n"),
    });
    setShowTermsModal(true);
  };

  useEffect(() => {
    if (showAvailableOnly && deliveryMode === "pickup" && selectedCity) {
      fetchAvailableStations();
    }
    // eslint-disable-next-line
  }, [showAvailableOnly, deliveryMode, selectedCity]);

  const handleContinue = () => {
    if (!selectedState || !selectedCity || !deliveryMode) {
      setError("Please select state, city, and delivery mode.");
      return;
    }
    if (deliveryMode === "door" && !deliveryAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }
    if (deliveryMode === "pickup" && !selectedPickup) {
      setError("Please select a pickup station.");
      return;
    }
    setError("");
    let pickupStationAmount = null;
    if (deliveryMode === "pickup" && selectedPickup) {
      const station = (
        showAvailableOnly ? availableStations : pickupStations
      ).find((s: { name: string; }) => s.name === selectedPickup);
      pickupStationAmount = station?.amount || null;
    }
    const deliveryInfo = {
      state: selectedState,
      city: selectedCity,
      deliveryMode,
      pickupStation: deliveryMode === "pickup" ? selectedPickup : null,
      pickupStationAmount:
        deliveryMode === "pickup" ? pickupStationAmount : null,
      deliveryAddress: deliveryMode === "door" ? deliveryAddress : null,
    };
    localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));
    router.push(`/order-confimation?mode=${mode}`);
  };
  

   const filterStations = (stations: PickupStation[], query: string) => {
    if (!query.trim()) return stations;
    
    const searchTerm = query.toLowerCase();
    return stations.filter(station => 
      station.name.toLowerCase().includes(searchTerm) ||
      station.address.toLowerCase().includes(searchTerm)
    );
  };

  const handleStationSelect = (station: PickupStation) => {
    setSelectedPickup(station.name);
    setSearchQuery(station.name.split(' - ').slice(1).join(' - '));
    setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    if (selectedPickup && !searchQuery) {
      const stationDisplayName = selectedPickup.split(' - ').slice(1).join(' - ');
      setSearchQuery(stationDisplayName);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedPickup("");
    setIsDropdownOpen(false);
  };
  
  const filteredStations = useMemo(() => {
  const stations = showAvailableOnly ? availableStations : pickupStations;
  return filterStations(stations, searchQuery);
}, [searchQuery, availableStations, pickupStations, showAvailableOnly]);


  //  useEffect(() => {
  //   const stations = showAvailableOnly ? availableStations : pickupStations;
  //   setFilteredStations(filterStations(stations, searchQuery));
  // }, [searchQuery, availableStations, pickupStations, showAvailableOnly]);

  // const deliveryHeaders = [
  //   "S/N",
  //   "Product",
  //   "Description",
  //   "Product ID",
  //   "Order ID",
  //   "Date/Time Ordered",
  //   "Confirm Order's Arrival",
  //   "Take Product's Picture",
  //   "Take Rider's Picture",
  //   "Confirm Receipt of Product in Good Condition",
  // ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">Delivery details</h1>
          <div className="space-y-4 rounded-lg border bg-white p-6 shadow">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Choose Your Preferred Mode Of Delivery
              </label>
              <div className="space-y-4">
                <div
                  className={`cursor-pointer rounded border p-4 ${deliveryMode === "door" ? "border-orange-500 bg-orange-50" : "border-gray-300"}`}
                  onClick={() => setDeliveryMode("door")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={deliveryMode === "door"}
                        onChange={() => setDeliveryMode("door")}
                        className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-3 font-medium">Door Delivery</span>
                    </div>
                    <span className="font-bold">₦0.00</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewTerms("door");
                    }}
                    className="ml-7 text-sm text-blue-600 hover:underline disabled:opacity-50"
                    disabled={isLoadingProducts}
                  >
                    {isLoadingProducts
                      ? "Loading terms..."
                      : "View terms and conditions"}
                  </button>
                </div>

                <div
                  className={`cursor-pointer rounded border p-4 ${deliveryMode === "pickup" ? "border-orange-500 bg-orange-50" : "border-gray-300"}`}
                  onClick={() => setDeliveryMode("pickup")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={deliveryMode === "pickup"}
                        onChange={() => setDeliveryMode("pickup")}
                        className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-3 font-medium">Pick Up</span>
                    </div>
                    <span className="font-bold">
                      {deliveryMode === "pickup" && selectedPickup
                        ? (() => {
                            const station = (
                              showAvailableOnly
                                ? availableStations
                                : pickupStations
                            ).find((s: { name: string; }) => s.name === selectedPickup);
                            return station &&
                              typeof station.amount?.value === "number"
                              ? `${station.amount.value} ${station.amount.currency || ""}`
                              : "₦0";
                          })()
                        : "₦0.00"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewTerms("pickup");
                    }}
                    className="ml-7 text-sm text-blue-600 hover:underline disabled:opacity-50"
                    disabled={isLoadingProducts}
                  >
                    {isLoadingProducts
                      ? "Loading terms..."
                      : "View terms and conditions"}
                  </button>
                </div>
              </div>
            </div>

            {/* Only show the following fields after a delivery mode is selected */}
            {deliveryMode && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    State
                  </label>
                  <select
                    className="w-full rounded border p-2"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity("");
                    }}
                  >
                    <option value="">Select State</option>
                    {states.map((state: any) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    City / LGA
                  </label>
                  <select
                    className="w-full rounded border p-2"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                  >
                    <option value="">Select City/LGA</option>
                    {cities.map((city: string) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {deliveryMode === "door" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border p-2"
                      placeholder="Enter your delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}

                {deliveryMode === "pickup" && (
  <div>
    <label className="mb-1 block text-sm font-medium">
      Select pickup centre
    </label>
    
    {/* Searchable Input */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search pickup stations by name or address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full rounded border p-2 pr-8"
      />
      
      {/* Clear button */}
      {(searchQuery || selectedPickup) && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
      
      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Loading centers...</div>
          ) : filteredStations.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">
              {searchQuery ? 'No centers found matching your search.' : 'No centers available.'}
            </div>
          ) : (
            filteredStations.map((station) => (
              <div
                key={station.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  selectedPickup === station.name ? 'bg-orange-50 border-orange-200' : ''
                }`}
                onClick={() => handleStationSelect(station)}
              >
                <div className="font-medium text-sm">
                  {station.name.split(' - ').slice(1).join(' - ')}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {station.address}
                </div>
                <div className="text-xs font-semibold text-orange-600 mt-1">
                  {station.amount && typeof station.amount.value === "number"
                    ? `${station.amount.currency || '₦'}${station.amount.value}`
                    : "₦0"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    
    {/* Selected station display */}
    {selectedPickup && !isDropdownOpen && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
        <span className="text-green-800 font-medium">Selected: </span>
        <span className="text-green-700">
          {selectedPickup.split(' - ').slice(1).join(' - ')}
        </span>
      </div>
    )}
  </div>
)}

                {/* {deliveryMode === "pickup" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Select Pickup center
                    </label>
                   
                    <div className="mb-2 flex gap-2">
                      
                    </div>

                    {showAvailableOnly ? (
                      availableStations.length === 0 ? (
                        <div className="text-sm text-gray-500">
                          No available center found.
                        </div>
                      ) : (
                        <select
                          className="w-full rounded border p-2"
                          value={selectedPickup}
                          onChange={(e) => setSelectedPickup(e.target.value)}
                        >
                          <option value="">Select Pickup Station</option>
                          {availableStations.map((station) => (
                            <option key={station.id} value={station.name}>
                              {station.name} - {station.address} -{" "}
                              {station.amount &&
                              typeof station.amount.value === "number"
                                ? `${station.amount.value} ${station.amount.currency || ""}`
                                : "0 ₦"}
                            </option>
                          ))}
                        </select>
                      )
                    ) : isLoading ? (
                      <div className="text-sm text-gray-500">
                        Loading centers...
                      </div>
                    ) : (
                      <select
                        className="w-full rounded border p-2"
                        value={selectedPickup}
                        onChange={(e) => setSelectedPickup(e.target.value)}
                      >
                        <option value="">Select Pickup center</option>
                        {pickupStations.map((station) => (
                          <option key={station.id} value={station.name}>
                            {station.name} - {station.address} -{" "}
                            {station.amount &&
                            typeof station.amount.value === "number"
                              ? `${station.amount.value} ${station.amount.currency || ""}`
                              : "0 ₦"}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )} */}
              </>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="mt-6 flex justify-between">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                onClick={() => router.push("/cart")}
                type="button"
              >
                Back to cart
              </button>
              <button
                className="rounded bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
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

      {showTermsModal && (
        <Modal setModalState={setShowTermsModal} title={modalContent.title}>
          <div className=" max-h-96 overflow-y-auto rounded-lg p-6">
            <div className="whitespace-pre-wrap font-medium  leading-relaxed text-white">
              {modalContent.content}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default function Delivery() {
  return (
    <Suspense>
      <DeliveryPage />
    </Suspense>
  );
}
