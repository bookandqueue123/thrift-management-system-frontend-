


// "use client";
// import React, { useState } from "react";
// import { Star, ShoppingCart } from "lucide-react";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import Navbar from "@/modules/HomePage/NavBar";
// import Footer from "@/modules/HomePage/Footer";
// /** Copy or import your Product interface **/
// interface Product {
//   id: number;
//   name: string;
//   rating: number;
//   reviews: number;
//   image: string;
//   badge?: string | null;
//   category: string;
//   subcategory: string;
//   price: number;
// }

// /** Hardcoded product array for demo **/
// const ALL_PRODUCTS: Product[] = [
//   {
//     id: 1,
//     name: "WIRED OVER-EAR GAMING HEADPHONES WITH USB",
//     rating: 4.5,
//     reviews: 324,
//     image: "/market/Image8.png",
//     badge: null,
//     category: "Electronic Devices",
//     subcategory: "HEADPHONE",
//     price: 79.99,
//   },
//   {
//     id: 2,
//     name: "POLAROID 57-INCH PHOTO/VIDEO TRIPOD WITH DELUXE TRIPOD",
//     rating: 4.0,
//     reviews: 167,
//     image:
//       "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
//     badge: "25% OFF",
//     category: "Electronic Devices",
//     subcategory: "CAMERA & PHOTO",
//     price: 149.99,
//   },
//   {
//     id: 3,
//     name: "2020 APPLE MACBOOK PRO WITH APPLE M1 CHIP",
//     rating: 5.0,
//     reviews: 1456,
//     image: "/market/Image.png",
//     badge: null,
//     category: "Electronic Devices",
//     subcategory: "COMPUTER & LAPTOP",
//     price: 1299.99,
//   },
//   {
//     id: 4,
//     name: "4K UHD LED SMART TV WITH CHROMECAST BUILT-IN",
//     rating: 4.5,
//     reviews: 893,
//     image: "/market/Image6.png",
//     badge: "SALE",
//     category: "Electronic Devices",
//     subcategory: "TV & HOMES APPLIANCES",
//     price: 599.99,
//   },
//   {
//     id: 5,
//     name: "TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONES",
//     rating: 4.5,
//     reviews: 234,
//     image: "/market/Image8.png",
//     badge: "HOT",
//     category: "Electronic Devices",
//     subcategory: "HEADPHONE",
//     price: 29.99,
//   },
//   {
//     id: 6,
//     name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
//     rating: 5.0,
//     reviews: 530,
//     image: "/market/Image6.png",
//     badge: null,
//     category: "Electronic Devices",
//     subcategory: "SMARTPHONE",
//     price: 799.99,
//   },
//   {
//     id: 7,
//     name: "AMAZON BASICS HIGH-SPEED HDMI CABLE (18 GBPS, 4K/60HZ)",
//     rating: 4.5,
//     reviews: 1423,
//     image: "/market/Image5.png",
//     badge: "BEST DEALS",
//     category: "Electronic Devices",
//     subcategory: "COMPUTER ACCESSORIES",
//     price: 12.99,
//   },
//   {
//     id: 8,
//     name: "PORTABLE WASHING MACHINE, 11LBS CAPACITY MODEL",
//     rating: 4.0,
//     reviews: 316,
//     image: "/market/Image6.png",
//     badge: "Best Deals",
//     category: "Home & Garden",
//     subcategory: "KITCHEN APPLIANCES",
//     price: 289.99,
//   },
//   {
//     id: 9,
//     name: "WIRELESS GAMING MOUSE WITH RGB LIGHTING",
//     rating: 4.3,
//     reviews: 567,
//     image: "/market/Image5.png",
//     badge: null,
//     category: "Electronic Devices",
//     subcategory: "COMPUTER ACCESSORIES",
//     price: 45.99,
//   },
//   {
//     id: 10,
//     name: "BLUETOOTH SPEAKER WATERPROOF PORTABLE",
//     rating: 4.4,
//     reviews: 892,
//     image: "/market/Image8.png",
//     badge: "HOT",
//     category: "Electronic Devices",
//     subcategory: "MOBILE ACCESSORIES",
//     price: 39.99,
//   },
// ];

// /** Helper that returns an array of star icons **/
// function renderStars(rating: number) {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;
//   for (let i = 0; i < 5; i++) {
//     if (i < fullStars) {
//       stars.push(
//         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//       );
//     } else if (i === fullStars && hasHalfStar) {
//       // Still rendering a full star for any half
//       stars.push(
//         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//       );
//     } else {
//       stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
//     }
//   }
//   return <div className="flex space-x-0.5">{stars}</div>;
// }

// export default function ProductDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const productId = parseInt(params.id, 10);
//   const product = ALL_PRODUCTS.find((p) => p.id === productId);

//   if (!product) {
//     notFound();
//   }

//   // Pick up to 5 “similar” products in the same category
//   const similarProducts = ALL_PRODUCTS.filter(
//     (p) => p.category === product.category && p.id !== product.id
//   ).slice(0, 5);
   

//    const [quantity, setQuantity] = useState<number>(1);

//   const increment = () => {
//     setQuantity((prev) => prev + 1);
//   };

//   const decrement = () => {
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//         <Navbar/>
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
//         {/* Back Link */}
//         <div className="mb-6">
//           {/* Note: No inner <a> tag—just use Link directly */}
//           <Link
//             href="/"
//             className="text-sm text-gray-600 hover:underline"
//           >
//             &larr; Back to products
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left: Large Image */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
//             <div className="relative w-full h-80 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="max-w-full max-h-full object-contain"
//               />
//               {product.badge && (
//                 <div
//                   className={`absolute top-3 left-3 px-3 py-1 rounded text-sm font-semibold z-10 ${
//                     product.badge === "HOT"
//                       ? "bg-red-500 text-white"
//                       : product.badge === "SALE"
//                       ? "bg-green-500 text-white"
//                       : product.badge === "25% OFF"
//                       ? "bg-yellow-500 text-white"
//                       : "bg-gray-800 text-white"
//                   }`}
//                 >
//                   {product.badge}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Product Info */}
//           <div className="space-y-4">
//             {/* Title + Rating */}
//             <h1 className="text-2xl font-bold text-gray-800">
//               {product.name}
//             </h1>
//             <div className="flex items-center space-x-2">
//               {renderStars(product.rating)}
//               <span className="text-sm text-gray-500">
//                 ({product.reviews} reviews)
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-baseline space-x-2">
//               <span className="text-3xl font-extrabold text-orange-600">
//                 ${product.price.toFixed(2)}
//               </span>
//             </div>

//             {/* Example: Color / Size / Storage */}
//             <div className="space-y-4">
//               {/* Color */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-1">
//                   Color:
//                 </h3>
//                 <div className="flex space-x-2">
//                   <button className="w-6 h-6 rounded-full bg-black border-2 border-gray-300" />
//                   <button className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
//                   <button className="w-6 h-6 rounded-full bg-slate-400 border-2 border-gray-300" />
//                 </div>
//               </div>

//               {/* Size */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-1">
//                   Size:
//                 </h3>
//                 <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
//                   <option>Small</option>
//                   <option>Medium</option>
//                   <option>Large</option>
//                   <option>Extra Large</option>
//                 </select>
//               </div>

//               {/* Storage */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-1">
//                   Storage:
//                 </h3>
//                 <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
//                   <option>128 GB</option>
//                   <option>256 GB</option>
//                   <option>512 GB</option>
//                   <option>1 TB</option>
//                 </select>
//               </div>
//             </div>
                
          

// <div className="flex items-center space-x-4 mt-4">
//   {/* Quantity Selector (fixed height h-12) */}
//   <div className="flex items-center h-12 border border-gray-300 rounded">
//     {/* Decrement Button */}
//     <button
//       onClick={decrement}
//       className="h-full px-4 text-lg font-medium hover:bg-gray-100 transition"
//     >
//       −
//     </button>

//     {/* Quantity Display (leading zero if < 10) */}
//     <span className="h-full flex items-center px-4 text-sm font-medium">
//       {quantity < 10 ? `0${quantity}` : quantity}
//     </span>

//     {/* Increment Button */}
//     <button
//       onClick={increment}
//       className="h-full px-4 text-lg font-medium hover:bg-gray-100 transition"
//     >
//       +
//     </button>
//   </div>

//   {/* Add to Cart (same fixed height h-12) */}
//   <button className="flex-1 h-12 px-6 bg-[#fedc57] text-white rounded-lg font-medium hover:bg-yellow-500 transition flex items-center justify-center">
//     <ShoppingCart className="h-5 w-5 mr-2" />
//     Add to cart
//   </button>

//   {/* Buy Now (same fixed height h-12) */}
//   <button className="flex-1 h-12 px-6 border border-[#fedc57] text-[#fedc57] rounded-lg font-medium hover:bg-yellow-50 transition flex items-center justify-center">
//     Buy now
//   </button>
// </div>

//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="mt-12 bg-white rounded-lg border border-gray-200">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-4 px-6">
//               <button className="py-4 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
//                 Product Details
//               </button>
//               <button className="py-4 text-sm font-medium text-gray-600 hover:text-gray-800">
//                 Rating & Reviews
//               </button>
//               <button className="py-4 text-sm font-medium text-gray-600 hover:text-gray-800">
//                 FAQs
//               </button>
//             </nav>
//           </div>

//           {/* Only showing “Product Details” content by default */}
//           <div className="px-6 py-8 space-y-6">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Product Details
//             </h2>
//             <p className="text-gray-600 leading-relaxed">
//               This is where you elaborate on the product’s features. For example:
//               <ul className="list-disc list-inside mt-2 space-y-1">
//                 <li>13-inch Liquid Retina XDR display</li>
//                 <li>Up to 20 hours battery life</li>
//                 <li>8-core CPU, 10-core GPU, 16-core Neural Engine</li>
//                 <li>Magic Keyboard, Touch ID</li>
//               </ul>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna
//               eros. Cras vulputate, diam nec vestibulum pellentesque, purus ex
//               venenatis nisl, eu suscipit augue sapien in metus.
//             </p>

//             {/* Shipping Info */}
//             <div>
//               <h3 className="text-md font-semibold text-gray-800 mb-2">
//                 Shipping Information
//               </h3>
//               <ul className="space-y-1 text-gray-600 text-sm">
//                 <li>• Delivery: 2–5 business days</li>
//                 <li>• Shipping cost: Free for orders over $100</li>
//                 <li>• Return policy: 30 days money-back guarantee</li>
//               </ul>
//             </div>

//             {/* Vendor Details */}
//             <div>
//               <h3 className="text-md font-semibold text-gray-800 mb-2">
//                 Vendor Details
//               </h3>
//               <div className="text-gray-600 text-sm space-y-1">
//                 <p>
//                   <strong>Vendor Name:</strong> Acme Electronics Inc.
//                 </p>
//                 <p>
//                   <strong>Location:</strong> 123 Market St, San Francisco, CA
//                 </p>
//                 <p>
//                   <strong>Contact:</strong> vendor@acme-electronics.com
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Similar Products */}
//         {similarProducts.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Similar Products
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {similarProducts.map((p) => (
//                 <div
//                   key={p.id}
//                   className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition"
//                 >
//                   {/* Again, no inner <a>—just give Link its classes */}
//                   <Link
//                     href={`/product/${p.id}`}
//                     className="block"
//                   >
//                     <div className="relative w-full h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-2">
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="max-w-full max-h-full object-contain"
//                       />
//                       {p.badge && (
//                         <div
//                           className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold z-10 ${
//                             p.badge === "HOT"
//                               ? "bg-red-500 text-white"
//                               : p.badge === "SALE"
//                               ? "bg-green-500 text-white"
//                               : p.badge === "25% OFF"
//                               ? "bg-yellow-500 text-white"
//                               : "bg-gray-800 text-white"
//                           }`}
//                         >
//                           {p.badge}
//                         </div>
//                       )}
//                     </div>
//                     <h3 className="text-xs font-medium text-gray-800 line-clamp-2">
//                       {p.name}
//                     </h3>
//                     <div className="text-sm font-bold text-orange-600 mt-1">
//                       ${p.price.toFixed(2)}
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer/>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Navbar from "@/modules/HomePage/NavBar";
import Footer from "@/modules/HomePage/Footer";

/** Copy or import your Product interface **/
interface Product {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string | null;
  category: string;
  subcategory: string;
  price: number;
}

/** Hardcoded product array for demo **/
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "WIRED OVER-EAR GAMING HEADPHONES WITH USB",
    rating: 4.5,
    reviews: 324,
    image: "/market/Image8.png",
    badge: null,
    category: "Electronic Devices",
    subcategory: "HEADPHONE",
    price: 79.99,
  },
  {
    id: 2,
    name: "POLAROID 57-INCH PHOTO/VIDEO TRIPOD WITH DELUXE TRIPOD",
    rating: 4.0,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
    badge: "25% OFF",
    category: "Electronic Devices",
    subcategory: "CAMERA & PHOTO",
    price: 149.99,
  },
  {
    id: 3,
    name: "2020 APPLE MACBOOK PRO WITH APPLE M1 CHIP",
    rating: 5.0,
    reviews: 1456,
    image: "/market/Image.png",
    badge: null,
    category: "Electronic Devices",
    subcategory: "COMPUTER & LAPTOP",
    price: 1299.99,
  },
  {
    id: 4,
    name: "4K UHD LED SMART TV WITH CHROMECAST BUILT-IN",
    rating: 4.5,
    reviews: 893,
    image: "/market/Image6.png",
    badge: "SALE",
    category: "Electronic Devices",
    subcategory: "TV & HOMES APPLIANCES",
    price: 599.99,
  },
  {
    id: 5,
    name: "TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONES",
    rating: 4.5,
    reviews: 234,
    image: "/market/Image8.png",
    badge: "HOT",
    category: "Electronic Devices",
    subcategory: "HEADPHONE",
    price: 29.99,
  },
  {
    id: 6,
    name: "SAMSUNG ELECTRONICS SAMSUNG GALAXY S21 5G",
    rating: 5.0,
    reviews: 530,
    image: "/market/Image6.png",
    badge: null,
    category: "Electronic Devices",
    subcategory: "SMARTPHONE",
    price: 799.99,
  },
  {
    id: 7,
    name: "AMAZON BASICS HIGH-SPEED HDMI CABLE (18 GBPS, 4K/60HZ)",
    rating: 4.5,
    reviews: 1423,
    image: "/market/Image5.png",
    badge: "BEST DEALS",
    category: "Electronic Devices",
    subcategory: "COMPUTER ACCESSORIES",
    price: 12.99,
  },
  {
    id: 8,
    name: "PORTABLE WASHING MACHINE, 11LBS CAPACITY MODEL",
    rating: 4.0,
    reviews: 316,
    image: "/market/Image6.png",
    badge: "Best Deals",
    category: "Home & Garden",
    subcategory: "KITCHEN APPLIANCES",
    price: 289.99,
  },
  {
    id: 9,
    name: "WIRELESS GAMING MOUSE WITH RGB LIGHTING",
    rating: 4.3,
    reviews: 567,
    image: "/market/Image5.png",
    badge: null,
    category: "Electronic Devices",
    subcategory: "COMPUTER ACCESSORIES",
    price: 45.99,
  },
  {
    id: 10,
    name: "BLUETOOTH SPEAKER WATERPROOF PORTABLE",
    rating: 4.4,
    reviews: 892,
    image: "/market/Image8.png",
    badge: "HOT",
    category: "Electronic Devices",
    subcategory: "MOBILE ACCESSORIES",
    price: 39.99,
  },
   {
      id: 11,
      name: "PROFESSIONAL CAMERA WITH 4K VIDEO RECORDING",
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "CAMERA & PHOTO",
      price: 399.99
    },
     {
      id: 12,
      name: "WIRELESS SECURITY CAMERA SYSTEM",
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "CAMERA & PHOTO",
      price: 229.99
    },
       {
      id: 13,
      name: "DELL OPTIPLEX 7000x7480 All-IN-ONE COMPUTER MONITOR",
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "COMPUTER & LAPTOP",
      price: 899.99
    },
       {
      id: 14,
      name: "APPLE IPHONE 15 PRO MAX 256GB",
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "SMARTPHONE",
      price: 1199.99
    },
       {
      id: 15,
      name: "GAMING LAPTOP WITH RTX 4060 GRAPHICS",
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "COMPUTER & LAPTOP",
      price: 1299.99
    },
    {
      id: 16,
      name: "ULTRABOOK BUSINESS LAPTOP 16GB RAM",
      rating: 4.4,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "COMPUTER & LAPTOP",
      price: 899.99
    },
       {
      id: 17,
      name: "TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONE",
      rating: 4.4,
      reviews: 892,
      image: "/market/Image8.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "HEADPHONE",
      price: 39.99
    },
     {
      id: 11,
      name: "4K UHD LED SMART TV WITH CHROMECAST BUILT-IN",
      rating: 4.4,
      reviews: 892,
      image: "/market/camera.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
     {
      id: 12,
      name: "4K UHD LED SMART TV WITH CHROMECAST BUILT-IN",
      rating: 4.4,
      reviews: 892,
      image: "/market/camera.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
       {
      id: 13,
      name: "DELL OPTIPLEX 7000x7480 All-IN-ONE COMPUTER MONITOR",
      rating: 4.4,
      reviews: 892,
      image: "/market/dell.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
       {
      id: 14,
      name: "BLUETOOTH SPEAKER WATERPROOF PORTABLE",
      rating: 4.4,
      reviews: 892,
      image: "/market/iphonee.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
       {
      id: 15,
      name: "BLUETOOTH SPEAKER WATERPROOF PORTABLE",
      rating: 4.4,
      reviews: 892,
      image: "/market/laptop.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
    {
      id: 16,
      name: "BLUETOOTH SPEAKER WATERPROOF PORTABLE",
      rating: 4.4,
      reviews: 892,
      image: "/market/laptop.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
       {
      id: 17,
      name: "TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONE...",
      rating: 4.4,
      reviews: 892,
      image: "/market/ear.png",
      badge: "HOT",
      category: "Electronic Devices",
      subcategory: "MOBILE ACCESSORIES",
      price: 39.99
    },
];

/** Helper that returns an array of star icons **/
function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      // Still rendering a full star for any half
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
    }
  }
  return <div className="flex space-x-0.5">{stars}</div>;
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const productId = parseInt(params.id, 10);
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  // Pick up to 5 "similar" products in the same category
  const similarProducts = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 5);

  const [quantity, setQuantity] = useState<number>(1);

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Handler for Add to Cart button
  const handleAddToCart = () => {
    // Here you can add logic to save the item to cart (localStorage, context, etc.)
    // For now, we'll just navigate to the cart page
    
    // Optional: Save cart data to localStorage or context
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity,
    };

    // Get existing cart items from localStorage (if any)
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Navigate to cart page
    router.push('/cart/1');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:underline"
          >
            &larr; Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Large Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
            <div className="relative w-full h-80 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              {product.badge && (
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded text-sm font-semibold z-10 ${
                    product.badge === "HOT"
                      ? "bg-red-500 text-white"
                      : product.badge === "SALE"
                      ? "bg-green-500 text-white"
                      : product.badge === "25% OFF"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-4">
            {/* Title + Rating */}
            <h1 className="text-2xl font-bold text-gray-800">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-orange-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Example: Color / Size / Storage */}
            <div className="space-y-4">
              {/* Color */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Color:
                </h3>
                <div className="flex space-x-2">
                  <button className="w-6 h-6 rounded-full bg-black border-2 border-gray-300" />
                  <button className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
                  <button className="w-6 h-6 rounded-full bg-slate-400 border-2 border-gray-300" />
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Size:
                </h3>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </div>

              {/* Storage */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Storage:
                </h3>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option>128 GB</option>
                  <option>256 GB</option>
                  <option>512 GB</option>
                  <option>1 TB</option>
                </select>
              </div>
            </div>

         <div className="flex flex-col space-y-4 mt-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
  {/* Quantity Selector (fixed height h-12) */}
  <div className="flex items-center h-12 border border-gray-300 rounded">
    <button
      onClick={decrement}
      className="h-full px-4 text-lg font-medium hover:bg-gray-100 transition"
    >
      −
    </button>

    <span className="h-full flex items-center px-4 text-sm font-medium">
      {quantity < 10 ? `0${quantity}` : quantity}
    </span>

    <button
      onClick={increment}
      className="h-full px-4 text-lg font-medium hover:bg-gray-100 transition"
    >
      +
    </button>
  </div>

  {/* Add to Cart (same fixed height h-12) */}
  <button 
    onClick={handleAddToCart}
    className="h-12 px-6 bg-[#fedc57] text-white rounded-lg font-medium hover:bg-yellow-500 transition flex items-center justify-center sm:flex-1"
  >
    <ShoppingCart className="h-5 w-5 mr-2" />
    Add to cart
  </button>

  {/* Buy Now (same fixed height h-12) */}
  <button className="h-12 px-6 border border-[#fedc57] text-[#fedc57] rounded-lg font-medium hover:bg-yellow-50 transition flex items-center justify-center sm:flex-1">
    Buy now
  </button>
</div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-6">
              <button className="py-4 text-sm font-medium text-orange-600 border-b-2 border-orange-600">
                Product Details
              </button>
              <button className="py-4 text-sm font-medium text-gray-600 hover:text-gray-800">
                Rating & Reviews
              </button>
              <button className="py-4 text-sm font-medium text-gray-600 hover:text-gray-800">
                FAQs
              </button>
            </nav>
          </div>

          {/* Only showing "Product Details" content by default */}
          <div className="px-6 py-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Product Details
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This is where you elaborate on the product&apos;s features. For example:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>13-inch Liquid Retina XDR display</li>
                <li>Up to 20 hours battery life</li>
                <li>8-core CPU, 10-core GPU, 16-core Neural Engine</li>
                <li>Magic Keyboard, Touch ID</li>
              </ul>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel urna
              eros. Cras vulputate, diam nec vestibulum pellentesque, purus ex
              venenatis nisl, eu suscipit augue sapien in metus.
            </p>

            {/* Shipping Info */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Shipping Information
              </h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Delivery: 2–5 business days</li>
                <li>• Shipping cost: Free for orders over $100</li>
                <li>• Return policy: 30 days money-back guarantee</li>
              </ul>
            </div>

            {/* Vendor Details */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Vendor Details
              </h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p>
                  <strong>Vendor Name:</strong> Acme Electronics Inc.
                </p>
                <p>
                  <strong>Location:</strong> 123 Market St, San Francisco, CA
                </p>
                <p>
                  <strong>Contact:</strong> vendor@acme-electronics.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition"
                >
                  <Link
                    href={`/product/${p.id}`}
                    className="block"
                  >
                    <div className="relative w-full h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-w-full max-h-full object-contain"
                      />
                      {p.badge && (
                        <div
                          className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold z-10 ${
                            p.badge === "HOT"
                              ? "bg-red-500 text-white"
                              : p.badge === "SALE"
                              ? "bg-green-500 text-white"
                              : p.badge === "25% OFF"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          {p.badge}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="text-sm font-bold text-orange-600 mt-1">
                      ${p.price.toFixed(2)}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}