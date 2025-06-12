// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Navbar from "@/modules/HomePage/NavBar"; // Assuming you have this component
// import Footer from "@/modules/HomePage/Footer"; // Assuming you have this component
// import PayInBitsForm from "@/modules/form/Pay-inBit";

// // Define a type for a cart item, similar to your Product interface but with quantity
// interface CartItem {
//   id: number;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
// }

// // Dummy data for cart items, mimicking the screenshot
// const DUMMY_CART_ITEMS: CartItem[] = [
//   {
//     id: 1,
//     name: "WIRED OVER-EAR GAMING HEADPHONES WITH USB",
//     quantity: 2,
//     image: "/market/Image8.png",
//     price: 79.99,
//   },
//   {
//     id: 2,
//     name: "POLAROID 57-INCH PHOTO/VIDEO TRIPOD WITH DELUXE TRIPOD",
 
//     image:
//       "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
//        quantity: 2,
//     price: 149.99,
//   },
//   {
//     id: 3,
//     name: "2020 APPLE MACBOOK PRO WITH APPLE M1 CHIP",
//      quantity: 2,
//     image: "/market/Image.png",
   
//     price: 1299.99,
//   },
//   {
//     id: 4,
//     name: "4K UHD LED SMART TV WITH CHROMECAST BUILT-IN",
//      quantity: 2,
//     image: "/market/Image6.png",
//     price: 599.99,
//   },
//   {
//     id: 5,
//     name: "TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONES",
//     image: "/market/Image8.png",
//     quantity: 2,
//     price: 29.99,
//   },
//   {
//     id: 6,
//     name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
//     image: "/market/Image6.png",
//     quantity: 2,
//     price: 799.99,
//   },
//   {
//     id: 7,
//     name: "AMAZON BASICS HIGH-SPEED HDMI CABLE (18 GBPS, 4K/60HZ)",
//     image: "/market/Image5.png",
//     price: 12.99,
//      quantity: 2,
//   },
//   {
//     id: 8,
//     name: "PORTABLE WASHING MACHINE, 11LBS CAPACITY MODEL",
//     image: "/market/Image6.png",
//     price: 19.00,
//     quantity: 2,
//   },
//   {
//     id: 9,
//     name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
//     image: "/market/Image6.png",
//     price: 19.00,
//     quantity: 2,
//   },
//   {
//     id: 10,
//     name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
//     image: "/market/Image6.png",
//     price: 19.00,
//     quantity: 2,
//   },
// ];

// export default function CartPage({ params }: { params: { id: string } }) {
//     const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [deliveryOption, setDeliveryOption] = useState<"door" | "pickup">("door");
//   const [paymentMode, setPaymentMode] = useState<"full" | "bits">("full");
//   const [isLoading, setIsLoading] = useState(true);
//    const [showPayInBitsForm, setShowPayInBitsForm] = useState(false)
//     const [selectedItem, setSelectedItem] = useState<CartItem | null>(null)
//   // Load cart items from localStorage on component mount
//   useEffect(() => {
//     const loadCartItems = () => {
//       try {
//         const savedCart = localStorage.getItem('cart');
//         if (savedCart) {
//           const parsedCart = JSON.parse(savedCart);
//           setCartItems(parsedCart);
//         } else {
//           // Use dummy data if no cart exists
//           setCartItems(DUMMY_CART_ITEMS);
//         }
//       } catch (error) {
//         console.error('Error loading cart from localStorage:', error);
//         // Fallback to dummy data
//         setCartItems(DUMMY_CART_ITEMS);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCartItems();
//   }, []);

//   // Save cart items to localStorage whenever cartItems changes
//   useEffect(() => {
//     if (!isLoading && cartItems.length > 0) {
//       localStorage.setItem('cart', JSON.stringify(cartItems));
//     }
//   }, [cartItems, isLoading]);

//   // Calculate subtotal for an item
//   const calculateItemSubtotal = (item: CartItem) => {
//     return item.price * item.quantity;
//   };

//   // Calculate total for all items
//   const calculateTotal = () => {
//     const itemsTotal = cartItems.reduce(
//       (sum, item) => sum + calculateItemSubtotal(item),
//       0
//     );
//     // Add pickup fee if applicable
//     return itemsTotal + (deliveryOption === "pickup" ? 21.0 : 0);
//   };

//   // Handlers for quantity changes
//   const handleQuantityChange = (id: number, delta: number) => {
//     setCartItems((prevItems) =>
//       prevItems
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   // Handler to remove an item
//   const handleRemoveItem = (id: number) => {
//     setCartItems((prevItems) => {
//       const updatedItems = prevItems.filter((item) => item.id !== id);
//       // Update localStorage immediately
//       localStorage.setItem('cart', JSON.stringify(updatedItems));
//       return updatedItems;
//     });
//   };

//   // Handler to clear entire cart
//   const handleClearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem('cart');
//   };
   
//     const handlePaymentModeChange = (mode: "full" | "bits") => {
//     setPaymentMode(mode);
//     if (mode === "bits") {
//       // Show the PayInBits form and set the first item as selected
//       // You can modify this logic to let user select which item they want to pay in bits
//       setSelectedItem(cartItems.length > 0 ? cartItems[0] : null);
//       setShowPayInBitsForm(true);
//     }
//   };

//   // Handler for checkout
//   const handleCheckout = () => {
//     if (paymentMode === "bits") {
//       // Show PayInBits form for checkout
//       setSelectedItem(cartItems.length > 0 ? cartItems[0] : null);
//       setShowPayInBitsForm(true);
//     } else {
//       // Handle full payment checkout
//       console.log("Processing full payment checkout...");
//       // Add your full payment logic here
//     }
//   };
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pb-12">
//         <Navbar />
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-center items-center h-64">
//             <div className="text-lg text-gray-600">Loading cart...</div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//       <Navbar />
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Cart</h1>
//           {cartItems.length > 0 && (
//             <button
//               onClick={handleClearCart}
//               className="text-red-600 hover:text-red-800 text-sm font-medium"
//             >
//               Clear Cart
//             </button>
//           )}
//         </div>

//         {cartItems.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="text-gray-500 text-lg mb-4">Your cart is empty</div>
//             <Link
//               href="/"
//               className="inline-block bg-[#fedc57] text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left Column: Delivery Details and Payment Mode */}
//             <div className="lg:col-span-1 space-y-6">
//               {/* Delivery Details */}
//               <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                   Delivery Details
//                 </h2>

//                 <div className="space-y-4">
//                   <div>
//                     <label
//                       htmlFor="location"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Choose your Location
//                     </label>
//                     <select
//                       id="location"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//                     >
//                       <option>Lagos, Nigeria</option>
//                       <option>Abuja, Nigeria</option>
//                       <option>Port Harcourt, Nigeria</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="area"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Area
//                     </label>
//                     <select
//                       id="area"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//                     >
//                       <option>Ikeja</option>
//                       <option>Lekki</option>
//                       <option>Victoria Island</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="address"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       id="address"
//                       placeholder="Input Address"
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//                     />
//                   </div>

//                   <div className="pt-2">
//                     <p className="text-sm font-medium text-gray-700 mb-2">
//                       Choose Your Preferred Mode of Delivery
//                     </p>
//                     <div className="space-y-3">
//                       <label className="flex items-center justify-between cursor-pointer">
//                         <div className="flex items-center">
//                           <input
//                             type="radio"
//                             name="delivery"
//                             value="door"
//                             checked={deliveryOption === "door"}
//                             onChange={() => setDeliveryOption("door")}
//                             className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
//                           />
//                           <span className="ml-2 text-sm text-gray-700">
//                             Door Delivery
//                           </span>
//                         </div>
//                         <span className="text-sm font-semibold text-gray-800">
//                           $0.00
//                         </span>
//                       </label>

//                       <label className="flex items-center justify-between cursor-pointer">
//                         <div className="flex items-center">
//                           <input
//                             type="radio"
//                             name="delivery"
//                             value="pickup"
//                             checked={deliveryOption === "pickup"}
//                             onChange={() => setDeliveryOption("pickup")}
//                             className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
//                           />
//                           <span className="ml-2 text-sm text-gray-700">
//                             Pick Up
//                           </span>
//                         </div>
//                         <span className="text-sm font-semibold text-gray-800">
//                           $21.00
//                         </span>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 pt-4 mt-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-bold text-gray-800">
//                         Total
//                       </span>
//                       <span className="text-2xl font-extrabold text-gray-800">
//                         ${calculateTotal().toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

             

//                 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                   Payment Mode
//                 </h2>
//                 <div className="space-y-3">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="full"
//                       checked={paymentMode === "full"}
//                       onChange={() => handlePaymentModeChange("full")}
//                       className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       100% Full Payment
//                     </span>
//                   </label>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="bits"
//                       checked={paymentMode === "bits"}
//                       onChange={() => handlePaymentModeChange("bits")}
//                       className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       Pay Little-by-Little
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               <button 
//                 onClick={handleCheckout}
//                 className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
//               >
//                 {paymentMode === "bits" ? "proceed to Checkout" : "Checkout"}
//               </button>
//             </div>

//             {/* Right Column: Product List */}
//             <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Price
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Subtotal
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {cartItems.map((item) => (
//                       <tr key={item.id}>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-16 w-16">
//                               <img
//                                 className="h-16 w-16 object-contain"
//                                 src={item.image}
//                                 alt={item.name}
//                               />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {item.name}
//                               </div>
//                               <div className="text-xs text-blue-600">
//                                 ${item.price.toFixed(2)}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="flex items-center border border-gray-300 rounded w-24">
//                             <button
//                               onClick={() => handleQuantityChange(item.id, -1)}
//                               className="px-2 py-1 text-sm font-medium hover:bg-gray-100"
//                             >
//                               −
//                             </button>
//                             <span className="flex-1 text-center text-sm font-medium">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() => handleQuantityChange(item.id, 1)}
//                               className="px-2 py-1 text-sm font-medium hover:bg-gray-100"
//                             >
//                               +
//                             </button>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
//                           ${item.price.toFixed(2)}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
//                           ${calculateItemSubtotal(item).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => handleRemoveItem(item.id)}
//                             className="text-gray-400 hover:text-red-600"
//                           >
//                             ✕ Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//         <PayInBitsForm
//         isOpen={showPayInBitsForm}
//         onClose={() => setShowPayInBitsForm(false)}
//         selectedItem={selectedItem || undefined}
//       />
//       <Footer />
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/modules/HomePage/NavBar"; // Assuming you have this component
import Footer from "@/modules/HomePage/Footer"; // Assuming you have this component
import PayInBitsForm from "@/modules/form/Pay-inBit";

// Define a type for a cart item, similar to your Product interface but with quantity
interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// Dummy data for cart items, mimicking the screenshot
const DUMMY_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "WIRED OVER-EAR GAMING HEADPHONES WITH USB",
    quantity: 2,
    image: "/market/Image8.png",
    price: 79.99,
  },
  {
    id: 2,
    name: "POLAROID 57-INCH PHOTO/VIDEO TRIPOD WITH DELUXE TRIPOD",
 
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
       quantity: 2,
    price: 149.99,
  },
  {
    id: 3,
    name: "2020 APPLE MACBOOK PRO WITH APPLE M1 CHIP",
     quantity: 2,
    image: "/market/Image.png",
   
    price: 1299.99,
  },
  {
    id: 4,
    name: "4K UHD LED SMART TV WITH CHROMECAST BUILT-IN",
     quantity: 2,
    image: "/market/Image6.png",
    price: 599.99,
  },
  {
    id: 5,
    name: "TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONES",
    image: "/market/Image8.png",
    quantity: 2,
    price: 29.99,
  },
  {
    id: 6,
    name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
    image: "/market/Image6.png",
    quantity: 2,
    price: 799.99,
  },
  {
    id: 7,
    name: "AMAZON BASICS HIGH-SPEED HDMI CABLE (18 GBPS, 4K/60HZ)",
    image: "/market/Image5.png",
    price: 12.99,
     quantity: 2,
  },
  {
    id: 8,
    name: "PORTABLE WASHING MACHINE, 11LBS CAPACITY MODEL",
    image: "/market/Image6.png",
    price: 19.00,
    quantity: 2,
  },
  {
    id: 9,
    name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
    image: "/market/Image6.png",
    price: 19.00,
    quantity: 2,
  },
  {
    id: 10,
    name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
    image: "/market/Image6.png",
    price: 19.00,
    quantity: 2,
  },
];

export default function CartPage({ params }: { params: { id: string } }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryOption, setDeliveryOption] = useState<"door" | "pickup">("door");
  const [paymentMode, setPaymentMode] = useState<"full" | "bits">("full");
  const [isLoading, setIsLoading] = useState(true);
   const [showPayInBitsForm, setShowPayInBitsForm] = useState(false)
    const [selectedItem, setSelectedItem] = useState<CartItem | null>(null)
  
  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        } else {
          // Use dummy data if no cart exists
          setCartItems(DUMMY_CART_ITEMS);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Fallback to dummy data
        setCartItems(DUMMY_CART_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  // Save cart items to localStorage whenever cartItems changes
  useEffect(() => {
    if (!isLoading && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  // Calculate subtotal for an item
  const calculateItemSubtotal = (item: CartItem) => {
    return item.price * item.quantity;
  };

  // Calculate total for all items
  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + calculateItemSubtotal(item),
      0
    );
    // Add pickup fee if applicable
    return itemsTotal + (deliveryOption === "pickup" ? 21.0 : 0);
  };

  // Calculate minimum deposit (20% of total)
  const calculateMinimumDeposit = () => {
    const twentyPercent = calculateTotal() * 0.2;
    return twentyPercent < 400 ? 400 : twentyPercent;
  };

  // Format minimum deposit display
  const getMinimumDepositDisplay = () => {
    const twentyPercent = calculateTotal() * 0.2;
    if (twentyPercent < 400) {
      return `${calculateMinimumDeposit().toFixed(2)} (minimum of $400)`;
    }
    return `${calculateMinimumDeposit().toFixed(2)}`;
  };

  // Handlers for quantity changes
  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Handler to remove an item
  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      // Update localStorage immediately
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Handler to clear entire cart
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };
   
    const handlePaymentModeChange = (mode: "full" | "bits") => {
    setPaymentMode(mode);
    if (mode === "bits") {
      // Show the PayInBits form and set the first item as selected
      // You can modify this logic to let user select which item they want to pay in bits
      setSelectedItem(cartItems.length > 0 ? cartItems[0] : null);
      setShowPayInBitsForm(true);
    }
  };

  // Handler for checkout
  const handleCheckout = () => {
    if (paymentMode === "bits") {
      // Show PayInBits form for checkout
      setSelectedItem(cartItems.length > 0 ? cartItems[0] : null);
      setShowPayInBitsForm(true);
    } else {
      // Handle full payment checkout
      console.log("Processing full payment checkout...");
      // Add your full payment logic here
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading cart...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">Your cart is empty</div>
            <Link
              href="/"
              className="inline-block bg-[#fedc57] text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Delivery Details and Payment Mode */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delivery Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Delivery Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Choose your Location
                    </label>
                    <select
                      id="location"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option>Lagos, Nigeria</option>
                      <option>Abuja, Nigeria</option>
                      <option>Port Harcourt, Nigeria</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Area
                    </label>
                    <select
                      id="area"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option>Ikeja</option>
                      <option>Lekki</option>
                      <option>Victoria Island</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      placeholder="Input Address"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Choose Your Preferred Mode of Delivery
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="delivery"
                            value="door"
                            checked={deliveryOption === "door"}
                            onChange={() => setDeliveryOption("door")}
                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Door Delivery
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          $0.00
                        </span>
                      </label>

                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="delivery"
                            value="pickup"
                            checked={deliveryOption === "pickup"}
                            onChange={() => setDeliveryOption("pickup")}
                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Pick Up
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          $21.00
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">
                        Total
                      </span>
                      <span className="text-2xl font-extrabold text-gray-800">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Mode
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="full"
                      checked={paymentMode === "full"}
                      onChange={() => handlePaymentModeChange("full")}
                      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      100% Full Payment
                    </span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bits"
                      checked={paymentMode === "bits"}
                      onChange={() => handlePaymentModeChange("bits")}
                      className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <div className="ml-2 flex items-center">
                      <span className="text-sm text-gray-700">Pay in Bits</span>
                      <div className="ml-2 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">?</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Show payment details when "Pay in Bits" is selected */}
                {paymentMode === "bits" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border w-full">
                    <div className="space-y-3 w-full">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-gray-600">Minimum Deposit Amount:</span>
                        <span className="text-sm font-semibold text-gray-800">
                          $ 400
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-gray-600 pr-2">Maximum Repayment Timeline:</span>
                        <span className="text-sm font-semibold text-gray-800 text-right">3 Months</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                {paymentMode === "bits" ? "Proceed to Checkout" : "Checkout"}
              </button>
            </div>

            {/* Right Column: Product List */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 object-contain"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-xs text-blue-600">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center border border-gray-300 rounded w-24">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="px-2 py-1 text-sm font-medium hover:bg-gray-100"
                            >
                              −
                            </button>
                            <span className="flex-1 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="px-2 py-1 text-sm font-medium hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ${calculateItemSubtotal(item).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            ✕ Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
        <PayInBitsForm
        isOpen={showPayInBitsForm}
        onClose={() => setShowPayInBitsForm(false)}
        selectedItem={selectedItem || undefined}
      />
      <Footer />
    </div>
  );
}