// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import statesAndLGAs from "@/api/statesAndLGAs.json";
// import Navbar from "@/modules/HomePage/NavBar";
// import Footer from "@/modules/HomePage/Footer";
// import { useAuth } from '@/api/hooks/useAuth';
// import { useQuery } from '@tanstack/react-query';
// import Modal from '@/components/Modal';
// import TransactionsTable from '@/components/Tables';

// interface PickupStation {
//   id: string;
//   name: string;
//   address: string;
// }

// interface CartItem {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     doorDeliveryTermsAndCondition?: string;
//     pickupCentreTermsAndCondition?: string;
//   };
//   name: string;
//   quantity: number;
//   price: number;
//   imageUrl?: string;
// }

// const PAGE_SIZE = 10;

// const DeliveryPage = () => {
//   const router = useRouter();
//   const { client } = useAuth();
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [deliveryMode, setDeliveryMode] = useState("");
//   const [selectedPickup, setSelectedPickup] = useState("");
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [available] = useState(true); // Always fetch available stations
//   const [showAvailableOnly, setShowAvailableOnly] = useState(false);
//   const [availableStations, setAvailableStations] = useState<PickupStation[]>([]);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [modalContent, setModalContent] = useState({ title: '', content: '' });

//   // Fetch cart items to get product terms and conditions
//   const { data: cartData } = useQuery({
//     queryKey: ['cart'],
//     queryFn: async () => {
//       const res = await client.get('/api/cart');
//       return res.data;
//     },
//   });

//   const cartItems: CartItem[] = cartData?.items || [];

//   // Get all states
//   const states = statesAndLGAs[0]?.states || [];
//   const cities = selectedState
//     ? states.find((s: any) => s.name === selectedState)?.lgas || []
//     : [];

//   // Helper to map city to backend value (remove spaces)
//   const getApiCity = (city: string) => city.replace(/\s+/g, '');

//   // Fetch pickup stations from API
//   const { data, isLoading } = useQuery({
//     queryKey: ['pickup-stations', selectedCity, available, currentPage, searchQuery],
//     queryFn: async () => {
//       if (deliveryMode !== 'pickup' || !selectedCity) return { stations: [] };
//       let url = `/api/pickup-stations?limit=${PAGE_SIZE}&page=${currentPage}`;
//       if (selectedCity) url += `&city=${encodeURIComponent(getApiCity(selectedCity))}`;
//       if (available) url += `&available=true`;
//       if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
//       const res = await client.get(url);
//       return res.data;
//     },
//     enabled: deliveryMode === 'pickup' && !!selectedCity
//   });

//   const pickupStations: PickupStation[] = data?.stations || [];

//   // Fetch available stations using the new endpoint
//   const fetchAvailableStations = async () => {
//     try {
//       let url = `/api/pickup-stations/available`;
//       if (selectedCity) url += `?city=${encodeURIComponent(getApiCity(selectedCity))}`;
//       const res = await client.get(url);
//       // Map the response to include a readable address and numbering
//       const stations = (res.data.data || []).map((station: any, idx: number) => ({
//         id: station._id || station.id,
//         name: `Station ${idx + 1} - ${station.name}`,
//         address: `${station.address.street}, ${station.address.city}, ${station.address.state} ${station.address.zipCode}, ${station.address.country}`
//       }));
//       setAvailableStations(stations);
//     } catch (e) {
//       setAvailableStations([]);
//     }
//   };

//   const handleViewTerms = (type: 'door' | 'pickup') => {
//     // Get terms from the first product in cart (assuming all products have same terms)
//     const firstProduct = cartItems[0]?.product;

//     if (type === 'door') {
//       const doorTerms = firstProduct?.doorDeliveryTermsAndCondition || 'No door delivery terms and conditions available for this product.';
//       setModalContent({
//         title: 'Door Delivery Terms and Conditions',
//         content: doorTerms,
//       });
//     } else {
//       const pickupTerms = firstProduct?.pickupCentreTermsAndCondition || 'No pickup terms and conditions available for this product.';
//       setModalContent({
//         title: 'Pickup Terms and Conditions',
//         content: pickupTerms,
//       });
//     }
//     setShowTermsModal(true);
//   };

//   useEffect(() => {
//     if (showAvailableOnly && deliveryMode === 'pickup' && selectedCity) {
//       fetchAvailableStations();
//     }
//     // eslint-disable-next-line
//   }, [showAvailableOnly, deliveryMode, selectedCity]);

//   const handleContinue = () => {
//     if (!selectedState || !selectedCity || !deliveryMode) {
//       setError("Please select state, city, and delivery mode.");
//       return;
//     }
//     if (deliveryMode === "pickup" && !selectedPickup) {
//       setError("Please select a pickup station.");
//       return;
//     }
//     setError("");
//     // Save delivery info to localStorage
//     const deliveryInfo = {
//       state: selectedState,
//       city: selectedCity,
//       deliveryMode,
//       pickupStation: deliveryMode === "pickup" ? selectedPickup : null,
//     };
//     localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));

//     // Navigate to order confirmation - the component will fetch fresh cart data from API
//     router.push("/order-confimation");
//   };

//   const deliveryHeaders = [
//     'S/N',
//     'Product',
//     'Description',
//     'Product ID',
//     'Order ID',
//     'Date/Time Ordered',
//     "Confirm Order's Arrival",
//     "Take Product's Picture",
//     "Take Rider's Picture",
//     'Confirm Receipt of Product in Good Condition',
//   ];

//   const mockDeliveries = [
//     {
//       sn: 1,
//       product: 'Phone',
//       description: 'Samsung Galaxy S21',
//       productId: 'P123',
//       orderId: 'O456',
//       dateOrdered: '2023-06-23 10:00',
//     },

//   ];

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 pb-12">
//         <Navbar />
//         <div className="max-w-2xl mx-auto px-4 py-8">
//           <h1 className="text-2xl font-bold mb-6">Delivery details</h1>
//           <div className="space-y-4 bg-white p-6 rounded-lg shadow border">
//             <div>
//               <label className="block text-sm font-medium mb-1">State</label>
//               <select
//                 className="w-full border rounded p-2"
//                 value={selectedState}
//                 onChange={e => {
//                   setSelectedState(e.target.value);
//                   setSelectedCity("");
//                 }}
//               >
//                 <option value="">Select State</option>
//                 {states.map((state: any) => (
//                   <option key={state.name} value={state.name}>{state.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">City / LGA</label>
//               <select
//                 className="w-full border rounded p-2"
//                 value={selectedCity}
//                 onChange={e => setSelectedCity(e.target.value)}
//                 disabled={!selectedState}
//               >
//                 <option value="">Select City/LGA</option>
//                 {cities.map((city: string) => (
//                   <option key={city} value={city}>{city}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Choose Your Prefered  Mode Of Delivery</label>
//               <div className="space-y-4">
//                 <div
//                   className={`p-4 rounded border cursor-pointer ${deliveryMode === "door" ? "border-orange-500 bg-orange-50" : "border-gray-300"}`}
//                   onClick={() => setDeliveryMode("door")}
//                 >
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         name="deliveryMode"
//                         checked={deliveryMode === 'door'}
//                         onChange={() => setDeliveryMode('door')}
//                         className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
//                       />
//                       <span className="ml-3 font-medium">Door Delivery</span>
//                     </div>
//                     <span className="font-bold">$0.00</span>
//                   </div>
//                   <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleViewTerms('door'); }} className="text-sm text-blue-600 hover:underline ml-7">
//                     View terms and conditions
//                   </a>
//                 </div>
//                 <div
//                   className={`p-4 rounded border cursor-pointer ${deliveryMode === "pickup" ? "border-orange-500 bg-orange-50" : "border-gray-300"}`}
//                   onClick={() => setDeliveryMode("pickup")}
//                 >
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         name="deliveryMode"
//                         checked={deliveryMode === 'pickup'}
//                         onChange={() => setDeliveryMode('pickup')}
//                         className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
//                       />
//                       <span className="ml-3 font-medium">Pick Up</span>
//                     </div>
//                     <span className="font-bold">$21.00</span>
//                   </div>
//                   <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleViewTerms('pickup'); }} className="text-sm text-blue-600 hover:underline ml-7">
//                     View terms and conditions
//                   </a>
//                 </div>
//               </div>
//             </div>
//             {deliveryMode === "pickup" && (
//               <div>
//                 <label className="block text-sm font-medium mb-1">Select Pickup center</label>
//                 <input
//                   type="text"
//                   placeholder="Search pickup stations"
//                   value={searchQuery}
//                   onChange={e => setSearchQuery(e.target.value)}
//                   className="border rounded p-2 mb-2 w-full"
//                 />
//                 <div className="mb-2 flex gap-2">
//                   <button
//                     className={`px-3 py-1 rounded ${!showAvailableOnly ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     onClick={() => setShowAvailableOnly(false)}
//                     type="button"
//                   >
//                     All centers
//                   </button>
//                   <button
//                     className={`px-3 py-1 rounded ${showAvailableOnly ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     onClick={() => setShowAvailableOnly(true)}
//                     type="button"
//                   >
//                     Available centers
//                   </button>
//                 </div>
//                 {showAvailableOnly ? (
//                   availableStations.length === 0 ? (
//                     <div className="text-gray-500 text-sm">No available center found.</div>
//                   ) : (
//                     <select
//                       className="w-full border rounded p-2"
//                       value={selectedPickup}
//                       onChange={e => setSelectedPickup(e.target.value)}
//                     >
//                       <option value="">Select Pickup Station</option>
//                       {availableStations.map(station => (
//                         <option key={station.id} value={station.name}>{station.name} - {station.address}</option>
//                       ))}
//                     </select>
//                   )
//                 ) : (
//                   isLoading ? (
//                     <div className="text-gray-500 text-sm">Loading center&apos;...</div>
//                   ) : (
//                     <select
//                       className="w-full border rounded p-2"
//                       value={selectedPickup}
//                       onChange={e => setSelectedPickup(e.target.value)}
//                     >
//                       <option value="">Select Pickup center</option>
//                       {pickupStations.map(station => (
//                         <option key={station.id} value={station.name}>{station.name} - {station.address}</option>
//                       ))}
//                     </select>
//                   )
//                 )}
//               </div>
//             )}
//             {error && <div className="text-red-600 text-sm">{error}</div>}
//             <div className="flex justify-between mt-6">
//               <button
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
//                 onClick={() => router.push("/cart")}
//                 type="button"
//               >
//                 Back to cart
//               </button>
//               <button
//                 className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 font-semibold"
//                 onClick={handleContinue}
//                 type="button"
//               >
//                 Continue
//               </button>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//       {showTermsModal && (
//         <Modal
//           setModalState={setShowTermsModal}
//           title={modalContent.title}
//         >
//           <div className="whitespace-pre-wrap  text-ajo_offWhite">{modalContent.content}</div>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default DeliveryPage;

"use client";
import { useAuth } from "@/api/hooks/useAuth";
import statesAndLGAs from "@/api/statesAndLGAs.json";
import Modal from "@/components/Modal";
import Footer from "@/modules/HomePage/Footer";
import Navbar from "@/modules/HomePage/NavBar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PickupStation {
  id: string;
  name: string;
  address: string;
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
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [available] = useState(true); // Always fetch available stations
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [availableStations, setAvailableStations] = useState<PickupStation[]>(
    [],
  );
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  // Fetch cart items
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  const cartItems: CartItem[] = cartData?.items || [];

  // Get all states
  const states = statesAndLGAs[0]?.states || [];
  const cities = selectedState
    ? states.find((s: any) => s.name === selectedState)?.lgas || []
    : [];

  // Helper to map city to backend value (remove spaces)
  const getApiCity = (city: string) => city.replace(/\s+/g, "");

  // Fetch pickup stations from API
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

  const pickupStations: PickupStation[] = data?.stations || [];

  // Fetch available stations using the new endpoint
  const fetchAvailableStations = async () => {
    try {
      let url = `/api/pickup-stations/available`;
      if (selectedCity)
        url += `?city=${encodeURIComponent(getApiCity(selectedCity))}`;
      const res = await client.get(url);
      // Map the response to include a readable address and numbering
      const stations = (res.data.data || []).map(
        (station: any, idx: number) => ({
          id: station._id || station.id,
          name: `Station ${idx + 1} - ${station.name}`,
          address: `${station.address.street}, ${station.address.city}, ${station.address.state} ${station.address.zipCode}, ${station.address.country}`,
        }),
      );
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

    // If no terms found at all, show default message
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
    if (deliveryMode === "pickup" && !selectedPickup) {
      setError("Please select a pickup station.");
      return;
    }
    setError("");
    // Save delivery info to localStorage
    const deliveryInfo = {
      state: selectedState,
      city: selectedCity,
      deliveryMode,
      pickupStation: deliveryMode === "pickup" ? selectedPickup : null,
    };
    localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));

    // Navigate to order confirmation - the component will fetch fresh cart data from API
    router.push("/order-confimation");
  };

  const deliveryHeaders = [
    "S/N",
    "Product",
    "Description",
    "Product ID",
    "Order ID",
    "Date/Time Ordered",
    "Confirm Order's Arrival",
    "Take Product's Picture",
    "Take Rider's Picture",
    "Confirm Receipt of Product in Good Condition",
  ];

  const mockDeliveries = [
    {
      sn: 1,
      product: "Phone",
      description: "Samsung Galaxy S21",
      productId: "P123",
      orderId: "O456",
      dateOrdered: "2023-06-23 10:00",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">Delivery details</h1>
          <div className="space-y-4 rounded-lg border bg-white p-6 shadow">
            <div>
              <label className="mb-1 block text-sm font-medium">State</label>
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
                    <span className="font-bold">$0.00</span>
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
                    <span className="font-bold">$21.00</span>
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

            {deliveryMode === "pickup" && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Select Pickup center
                </label>
                <input
                  type="text"
                  placeholder="Search pickup stations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2 w-full rounded border p-2"
                />
                <div className="mb-2 flex gap-2">
                  <button
                    className={`rounded px-3 py-1 ${!showAvailableOnly ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setShowAvailableOnly(false)}
                    type="button"
                  >
                    All centers
                  </button>
                  <button
                    className={`rounded px-3 py-1 ${showAvailableOnly ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setShowAvailableOnly(true)}
                    type="button"
                  >
                    Available centers
                  </button>
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
                          {station.name} - {station.address}
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
                        {station.name} - {station.address}
                      </option>
                    ))}
                  </select>
                )}
              </div>
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

export default DeliveryPage;
