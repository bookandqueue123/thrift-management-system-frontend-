// "use client";
// import { useAuth } from "@/api/hooks/useAuth";
// import RatingsReview from "@/modules/form/RatingsAndReview";
// import Footer from "@/modules/HomePage/Footer";
// import Navbar from "@/modules/HomePage/NavBar";
// import { selectToken } from "@/slices/OrganizationIdSlice";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   ShoppingCart,
//   Star,
// } from "lucide-react";
// import Link from "next/link";
// import { notFound, useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// interface Brand {
//   _id: string;
//   name: string;
// }

// interface Category {
//   _id: string;
//   name: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: Category | string;
//   brand: Brand | string;
//   imageUrl?: string | string[];
//   stock: number;
//   rating?: number;
//   reviews?: number;
//   badge?: string | null;
//   subcategory?: string;
//   doorDeliveryTermsAndCondition?: string;
//   pickupCentreTermsAndCondition?: string;
// }

// interface CartItem {
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//   };
//   name: string;
//   quantity: number;
//   price: number;
//   imageUrl: string;
//   _id: string;
// }

// interface CartResponse {
//   _id: string;
//   user: string;
//   items: CartItem[];
//   totalPrice: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// /** Helper functions to safely extract names **/
// function getBrandName(brand: Brand | string | undefined): string {
//   if (!brand) return "Unknown Brand";
//   if (typeof brand === "string") return brand;
//   return brand.name || "Unknown Brand";
// }

// function getCategoryName(category: Category | string | undefined): string {
//   if (!category) return "Unknown Category";
//   if (typeof category === "string") return category;
//   return category.name || "Unknown Category";
// }

// function getCategoryId(category: Category | string | undefined): string {
//   if (!category) return "";
//   if (typeof category === "string") return category;
//   return category._id || "";
// }

// function renderStars(rating = 4.5) {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;
//   for (let i = 0; i < 5; i++) {
//     if (i < fullStars) {
//       stars.push(
//         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
//       );
//     } else if (i === fullStars && hasHalfStar) {
//       // Still rendering a full star for any half
//       stars.push(
//         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
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
//   const router = useRouter();
//   const { client } = useAuth();
//   const queryClient = useQueryClient();
//   const [quantity, setQuantity] = useState<number>(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showRatings, setShowRatings] = useState(false);
//   const [isQuantityLoading, setIsQuantityLoading] = useState(false);

//   const token = useSelector(selectToken);
//   const paramsNode = useParams();
//   console.log(params.id);

//   React.useEffect(() => {
//     if (!token) {
//       router.push("/signin");
//     }
//   }, [token, router]);

//   const {
//     data: product,
//     isLoading: isLoadingProduct,
//     error,
//   } = useQuery<Product>({
//     queryKey: ["product", params.id],
//     queryFn: async () => {
//       const res = await client.get(`/api/products/${params.id}`);
//       return res.data;
//     },
//     enabled: !!params.id,
//   });

//   console.log("Product detail:", product);

//   const { data: allProducts, isLoading: isLoadingAllProducts } = useQuery<
//     Product[]
//   >({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await client.get("/api/products");
//       return res.data;
//     },
//   });

//   // Cart query
//   const {
//     data: cartData,
//     isLoading: isLoadingCart,
//     error: cartError,
//   } = useQuery<CartResponse>({
//     queryKey: ["cart"],
//     queryFn: async () => {
//       const res = await client.get("/api/cart");
//       return res.data;
//     },
//   });

//   // Set quantity based on cart data when it loads
//   useEffect(() => {
//     if (cartData && product) {
//       const cartItem = cartData.items.find(
//         (item) => item.product._id === product._id,
//       );
//       if (cartItem) {
//         setQuantity(cartItem.quantity);
//       } else {
//         setQuantity(0);
//       }
//     }
//   }, [cartData, product]);

//   const addToCartMutation = useMutation({
//     mutationFn: async ({
//       productId,
//       quantity,
//       price,
//     }: {
//       productId: string;
//       quantity: number;
//       price: number;
//     }) => {
//       const res = await client.post("/api/cart", {
//         productId,
//         quantity: quantity.toString(),
//         price: price,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//       // router.push("/cart");
//     },
//     onError: (error) => {
//       console.error("Error adding to cart:", error);
//     },
//   });

//   const decreaseQuantityMutation = useMutation({
//     mutationFn: async (productId: string) => {
//       const res = await client.patch(`/api/cart/${productId}/decrease`);
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["cart"] });
//     },
//     onError: (error) => {
//       console.error("Error decreasing quantity:", error);
//     },
//   });

//   // Handle loading state
//   if (isLoadingProduct) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
//           <div className="flex h-64 items-center justify-center">
//             <div className="text-lg text-gray-600">Loading product...</div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // Handle error state
//   if (error || !product) {
//     notFound();
//   }

//   // Pick up to 5 "similar" products in the same category
//   const currentCategoryId = getCategoryId(product.category);
//   const similarProducts =
//     allProducts
//       ?.filter(
//         (p) =>
//           getCategoryId(p.category) === currentCategoryId &&
//           p._id !== product._id,
//       )
//       .slice(0, 5) || [];

//   const increment = async () => {
//     if (!product) return;

//     setIsQuantityLoading(true);
//     try {
//       await addToCartMutation.mutateAsync({
//         productId: product._id,
//         quantity: 1,
//         price: product.price,
//       });
//     } catch (error) {
//       console.error("Failed to increase quantity:", error);
//     } finally {
//       setIsQuantityLoading(false);
//     }
//   };

//   const decrement = async () => {
//     if (!product || quantity <= 0) return;

//     setIsQuantityLoading(true);
//     try {
//       await decreaseQuantityMutation.mutateAsync(product._id);
//     } catch (error) {
//       console.error("Failed to decrease quantity:", error);
//     } finally {
//       setIsQuantityLoading(false);
//     }
//   };

//   // Handler for Add to Cart button
//   const handleAddToCart = async () => {
//     if (!product) return;

//     setIsAddingToCart(true);
//     try {
//       await addToCartMutation.mutateAsync({
//         productId: product._id,
//         quantity: 1,
//         price: product.price,
//       });
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // Handle different imageUrl formats
//   const getImageArray = () => {
//     if (product.imageUrl && Array.isArray(product.imageUrl)) {
//       return product.imageUrl.filter((url) => url); // Filter out empty strings
//     } else if (product.imageUrl && typeof product.imageUrl === "string") {
//       return [product.imageUrl];
//     }
//     return [];
//   };

//   const images = getImageArray();
//   const hasMultipleImages = images.length > 1;

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1,
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1,
//     );
//   };

//   const goToImage = (index: any) => {
//     setCurrentImageIndex(index);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-12">
//       <Navbar />
//       <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
//         {/* Back Link */}
//         <div className="mb-6">
//           <Link
//             href="/market-place"
//             className="text-sm text-gray-600 hover:underline"
//           >
//             &larr; Back to products
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//           {/* Left: Large Image */}
//           <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
//             <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
//               {images.length > 0 ? (
//                 <>
//                   <img
//                     src={images[currentImageIndex] || "/placeholder.svg"}
//                     alt={product.name}
//                     className="max-h-full max-w-full object-contain transition-opacity duration-300"
//                   />

//                   {/* Navigation Arrows - Only show if multiple images */}
//                   {hasMultipleImages && (
//                     <>
//                       <button
//                         onClick={prevImage}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
//                         aria-label="Previous image"
//                       >
//                         <ChevronLeft className="h-5 w-5 text-gray-600" />
//                       </button>

//                       <button
//                         onClick={nextImage}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
//                         aria-label="Next image"
//                       >
//                         <ChevronRight className="h-5 w-5 text-gray-600" />
//                       </button>
//                     </>
//                   )}

//                   {/* Dot Indicators - Only show if multiple images */}
//                   {hasMultipleImages && (
//                     <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
//                       {images.map((_, index) => (
//                         <button
//                           key={index}
//                           onClick={() => goToImage(index)}
//                           className={`h-2 w-2 rounded-full transition-all ${
//                             index === currentImageIndex
//                               ? "bg-white shadow-md"
//                               : "bg-white/50 hover:bg-white/75"
//                           }`}
//                           aria-label={`Go to image ${index + 1}`}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-lg text-gray-400">No image available</div>
//               )}

//               {/* Badge */}
//               {product.badge && (
//                 <div
//                   className={`absolute left-3 top-3 z-10 rounded px-3 py-1 text-sm font-semibold ${
//                     product.badge === "HOT"
//                       ? "bg-red-500 text-white"
//                       : product.badge === "SALE"
//                         ? "bg-green-500 text-white"
//                         : product.badge === "25% OFF"
//                           ? "bg-yellow-500 text-white"
//                           : "bg-gray-800 text-white"
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
//             <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

//             {/* Rating - Commented out since rating is not available yet */}
//             {/* <div className="flex items-center space-x-2">
//               {renderStars(product.rating)}
//               <span className="text-sm text-gray-500">
//                 ({product.reviews || 0} reviews)
//               </span>
//             </div> */}

//             {/* Price */}
//             <div className="flex items-baseline space-x-2">
//               <span className="text-3xl font-extrabold text-orange-600">
//                 ₦{product.price.toFixed(2)}
//               </span>
//             </div>

//             {/* Product Details */}
//             <div className="space-y-4">
//               {/* Brand */}
//               <div>
//                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
//                   Brand:
//                 </h3>
//                 <p className="text-gray-800">{getBrandName(product.brand)}</p>
//               </div>

//               {/* Category */}
//               <div>
//                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
//                   Category:
//                 </h3>
//                 <p className="text-gray-800">
//                   {getCategoryName(product.category)}
//                 </p>
//               </div>

//               {/* Stock */}
//               <div>
//                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
//                   Stock:
//                 </h3>
//                 <p className="text-gray-800">{product.stock} units available</p>
//               </div>

//               {/* Description */}
//               <div>
//                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
//                   Description:
//                 </h3>
//                 <p className="text-sm leading-relaxed text-gray-800">
//                   {product.description}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
//               {/* Quantity Selector (fixed height h-12) */}
//               <div className="flex h-12 items-center rounded border border-gray-300 bg-white">
//                 <button
//                   onClick={decrement}
//                   disabled={isQuantityLoading || quantity <= 0}
//                   className="h-full px-4 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {isQuantityLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     "−"
//                   )}
//                 </button>
//                 <div className="flex h-full items-center px-4">
//                   {isQuantityLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
//                   ) : (
//                     <span className="text-sm font-medium">
//                       {quantity < 10 ? `0${quantity}` : quantity}
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={increment}
//                   disabled={isQuantityLoading}
//                   className="h-full px-4 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {isQuantityLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     "+"
//                   )}
//                 </button>
//               </div>

//               {quantity === 0 ? (
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={isAddingToCart || addToCartMutation.isPending}
//                   className="flex h-12 items-center justify-center rounded-lg bg-[#fedc57] px-6 font-medium text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
//                 >
//                   <ShoppingCart className="mr-2 h-5 w-5" />
//                   {isAddingToCart || addToCartMutation.isPending
//                     ? "Adding..."
//                     : "Add to cart"}
//                 </button>
//               ) : (
//                 <div className="flex h-12 items-center justify-center rounded-lg bg-green-100 px-6 font-medium text-green-800 sm:flex-1">
//                   <span>In Cart ({quantity})</span>
//                 </div>
//               )}

//               {/* <button className="flex h-12 items-center justify-center rounded-lg border border-[#fedc57] px-6 font-medium text-[#fedc57] transition hover:bg-yellow-50 sm:flex-1">
//                 Buy now
//               </button> */}
//             </div>
//           </div>
//         </div>

//         <div className="mt-12 rounded-lg border border-gray-200 bg-white">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-4 px-6">
//               <button
//                 className={`py-4 text-sm font-medium ${!showRatings ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600 hover:text-gray-800"}`}
//                 onClick={() => setShowRatings(false)}
//               >
//                 Product Details
//               </button>
//               <button
//                 className={`py-4 text-sm font-medium ${showRatings ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600 hover:text-gray-800"}`}
//                 onClick={() => setShowRatings(true)}
//               >
//                 Rating & Reviews
//               </button>
//             </nav>
//           </div>

//           {showRatings ? (
//             <RatingsReview productId={product._id} />
//           ) : (
//             <div className="space-y-6 px-6 py-8" id="ratings-reviews-section">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Product Details
//               </h2>
//               <p className="leading-relaxed text-gray-600">
//                 {product.description}
//               </p>

//               <div>
//                 <h3 className="text-md mb-2 font-semibold text-gray-800">
//                   Product Specifications
//                 </h3>
//                 <ul className="space-y-1 text-sm text-gray-600">
//                   <li>• Brand: {getBrandName(product.brand)}</li>
//                   <li>• Category: {getCategoryName(product.category)}</li>
//                   <li>• Stock Available: {product.stock} units</li>
//                   <li>• Price: ₦{product.price.toFixed(2)}</li>
//                 </ul>
//               </div>

          
//             </div>
//           )}
//         </div>

//         {similarProducts.length > 0 && (
//           <div className="mt-12">
//             <h2 className="mb-4 text-xl font-semibold text-gray-800">
//               Similar Products
//             </h2>
//             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//               {similarProducts.map((p) => (
//                 <div
//                   key={p._id}
//                   className="rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-lg"
//                 >
//                   <Link href={`/product/${p._id}`} className="block">
//                     <div className="relative mb-2 flex h-32 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
//                       {p.imageUrl &&
//                       Array.isArray(p.imageUrl) &&
//                       p.imageUrl.length > 0 ? (
//                         <img
//                           src={p.imageUrl[0] || "/placeholder.svg"}
//                           alt={p.name}
//                           className="max-h-full max-w-full object-contain"
//                         />
//                       ) : p.imageUrl && typeof p.imageUrl === "string" ? (
//                         <img
//                           src={p.imageUrl || "/placeholder.svg"}
//                           alt={p.name}
//                           className="max-h-full max-w-full object-contain"
//                         />
//                       ) : (
//                         <div className="text-xs text-gray-400">No image</div>
//                       )}
//                       {p.badge && (
//                         <div
//                           className={`absolute left-2 top-2 z-10 rounded px-2 py-1 text-xs font-semibold ${
//                             p.badge === "HOT"
//                               ? "bg-red-500 text-white"
//                               : p.badge === "SALE"
//                                 ? "bg-green-500 text-white"
//                                 : p.badge === "25% OFF"
//                                   ? "bg-yellow-500 text-white"
//                                   : "bg-gray-800 text-white"
//                           }`}
//                         >
//                           {p.badge}
//                         </div>
//                       )}
//                     </div>
//                     <h3 className="line-clamp-2 text-xs font-medium text-gray-800">
//                       {p.name}
//                     </h3>
//                     <div className="mt-1 text-sm font-bold text-orange-600">
//                       ₦{p.price.toFixed(2)}
//                     </div>
//                     <div className="mt-1 text-xs text-gray-600">
//                       {getCategoryName(p.category)}
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }


// // "use client";
// // import { useAuth } from "@/api/hooks/useAuth";
// // import RatingsReview from "@/modules/form/RatingsAndReview";
// // import Footer from "@/modules/HomePage/Footer";
// // import Navbar from "@/modules/HomePage/NavBar";
// // import { selectToken } from "@/slices/OrganizationIdSlice";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import {
// //   ChevronLeft,
// //   ChevronRight,
// //   Loader2,
// //   ShoppingCart,
// //   Star,
// // } from "lucide-react";
// // import Link from "next/link";
// // import { notFound, useParams, useRouter } from "next/navigation";
// // import React, { useEffect, useState } from "react";
// // import { useSelector } from "react-redux";

// // interface Brand {
// //   _id: string;
// //   name: string;
// // }

// // interface Category {
// //   _id: string;
// //   name: string;
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   category: Category | string;
// //   brand: Brand | string;
// //   imageUrl?: string | string[];
// //   stock: number;
// //   rating?: number;
// //   reviews?: number;
// //   badge?: string | null;
// //   subcategory?: string;
// //   doorDeliveryTermsAndCondition?: string;
// //   pickupCentreTermsAndCondition?: string;
// // }

// // interface CartItem {
// //   product: {
// //     _id: string;
// //     name: string;
// //     price: number;
// //   };
// //   name: string;
// //   quantity: number;
// //   price: number;
// //   imageUrl: string;
// //   _id: string;
// // }

// // interface CartResponse {
// //   _id: string;
// //   user: string;
// //   items: CartItem[];
// //   totalPrice: number;
// //   createdAt: string;
// //   updatedAt: string;
// //   __v: number;
// // }

// // /** Helper functions to safely extract names **/
// // function getBrandName(brand: Brand | string | undefined): string {
// //   if (!brand) return "Unknown Brand";
// //   if (typeof brand === "string") return brand;
// //   return brand.name || "Unknown Brand";
// // }

// // function getCategoryName(category: Category | string | undefined): string {
// //   if (!category) return "Unknown Category";
// //   if (typeof category === "string") return category;
// //   return category.name || "Unknown Category";
// // }

// // function getCategoryId(category: Category | string | undefined): string {
// //   if (!category) return "";
// //   if (typeof category === "string") return category;
// //   return category._id || "";
// // }

// // function renderStars(rating = 4.5) {
// //   const stars = [];
// //   const fullStars = Math.floor(rating);
// //   const hasHalfStar = rating % 1 !== 0;
// //   for (let i = 0; i < 5; i++) {
// //     if (i < fullStars) {
// //       stars.push(
// //         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
// //       );
// //     } else if (i === fullStars && hasHalfStar) {
// //       // Still rendering a full star for any half
// //       stars.push(
// //         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
// //       );
// //     } else {
// //       stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
// //     }
// //   }
// //   return <div className="flex space-x-0.5">{stars}</div>;
// // }

// // export default function ProductDetailPage({
// //   params,
// // }: {
// //   params: { id: string };
// // }) {
// //   const router = useRouter();
// //   const { client } = useAuth();
// //   const queryClient = useQueryClient();
// //   const [quantity, setQuantity] = useState<number>(1);
// //   const [isAddingToCart, setIsAddingToCart] = useState(false);
// //   const [currentImageIndex, setCurrentImageIndex] = useState(0);
// //   const [showRatings, setShowRatings] = useState(false);
// //   const [isQuantityLoading, setIsQuantityLoading] = useState(false);

// //   const token = useSelector(selectToken);
// //   const paramsNode = useParams();
// //   console.log(params.id);

// //   React.useEffect(() => {
// //     if (!token) {
// //       router.push("/signin");
// //     }
// //   }, [token, router]);

// //   const {
// //     data: product,
// //     isLoading: isLoadingProduct,
// //     error,
// //   } = useQuery<Product>({
// //     queryKey: ["product", params.id],
// //     queryFn: async () => {
// //       const res = await client.get(`/api/products/${params.id}`);
// //       return res.data;
// //     },
// //     enabled: !!params.id,
// //   });

// //   console.log("Product detail:", product);

// //   const { data: allProducts, isLoading: isLoadingAllProducts } = useQuery<
// //     Product[]
// //   >({
// //     queryKey: ["products"],
// //     queryFn: async () => {
// //       const res = await client.get("/api/products");
// //       return res.data;
// //     },
// //   });

// //   // Cart query
// //   const {
// //     data: cartData,
// //     isLoading: isLoadingCart,
// //     error: cartError,
// //   } = useQuery<CartResponse>({
// //     queryKey: ["cart"],
// //     queryFn: async () => {
// //       const res = await client.get("/api/cart");
// //       return res.data;
// //     },
// //   });

// //   // Set quantity based on cart data when it loads
// //   useEffect(() => {
// //     if (cartData && product) {
// //       const cartItem = cartData.items.find(
// //         (item) => item.product._id === product._id,
// //       );
// //       if (cartItem) {
// //         setQuantity(cartItem.quantity);
// //       } else {
// //         setQuantity(0);
// //       }
// //     }
// //   }, [cartData, product]);

// //   const addToCartMutation = useMutation({
// //     mutationFn: async ({
// //       productId,
// //       quantity,
// //       price,
// //     }: {
// //       productId: string;
// //       quantity: number;
// //       price: number;
// //     }) => {
// //       const res = await client.post("/api/cart", {
// //         productId,
// //         quantity: quantity.toString(),
// //         price: price,
// //       });
// //       return res.data;
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["cart"] });
// //       // router.push("/cart");
// //     },
// //     onError: (error) => {
// //       console.error("Error adding to cart:", error);
// //     },
// //   });

// //   const decreaseQuantityMutation = useMutation({
// //     mutationFn: async (productId: string) => {
// //       const res = await client.patch(`/api/cart/${productId}/decrease`);
// //       return res.data;
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["cart"] });
// //     },
// //     onError: (error) => {
// //       console.error("Error decreasing quantity:", error);
// //     },
// //   });

// //   // Handle loading state
// //   if (isLoadingProduct) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <Navbar />
// //         <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
// //           <div className="flex h-64 items-center justify-center">
// //             <div className="text-lg text-gray-600">Loading product...</div>
// //           </div>
// //         </div>
// //         <Footer />
// //       </div>
// //     );
// //   }

// //   // Handle error state
// //   if (error || !product) {
// //     notFound();
// //   }

// //   // Check if product is out of stock
// //   const isOutOfStock = product.stock <= 0;
// //   // Check if user has reached stock limit in cart
// //   const hasReachedStockLimit = quantity >= product.stock;

// //   // Pick up to 5 "similar" products in the same category
// //   const currentCategoryId = getCategoryId(product.category);
// //   const similarProducts =
// //     allProducts
// //       ?.filter(
// //         (p) =>
// //           getCategoryId(p.category) === currentCategoryId &&
// //           p._id !== product._id,
// //       )
// //       .slice(0, 5) || [];

// //   const increment = async () => {
// //     if (!product || hasReachedStockLimit) return;

// //     setIsQuantityLoading(true);
// //     try {
// //       await addToCartMutation.mutateAsync({
// //         productId: product._id,
// //         quantity: 1,
// //         price: product.price,
// //       });
// //     } catch (error) {
// //       console.error("Failed to increase quantity:", error);
// //     } finally {
// //       setIsQuantityLoading(false);
// //     }
// //   };

// //   const decrement = async () => {
// //     if (!product || quantity <= 0) return;

// //     setIsQuantityLoading(true);
// //     try {
// //       await decreaseQuantityMutation.mutateAsync(product._id);
// //     } catch (error) {
// //       console.error("Failed to decrease quantity:", error);
// //     } finally {
// //       setIsQuantityLoading(false);
// //     }
// //   };

// //   // Handler for Add to Cart button
// //   const handleAddToCart = async () => {
// //     if (!product || isOutOfStock) return;

// //     setIsAddingToCart(true);
// //     try {
// //       await addToCartMutation.mutateAsync({
// //         productId: product._id,
// //         quantity: 1,
// //         price: product.price,
// //       });
// //     } catch (error) {
// //       console.error("Failed to add to cart:", error);
// //     } finally {
// //       setIsAddingToCart(false);
// //     }
// //   };

// //   // Handle different imageUrl formats
// //   const getImageArray = () => {
// //     if (product.imageUrl && Array.isArray(product.imageUrl)) {
// //       return product.imageUrl.filter((url) => url); // Filter out empty strings
// //     } else if (product.imageUrl && typeof product.imageUrl === "string") {
// //       return [product.imageUrl];
// //     }
// //     return [];
// //   };

// //   const images = getImageArray();
// //   const hasMultipleImages = images.length > 1;

// //   const nextImage = () => {
// //     setCurrentImageIndex((prevIndex) =>
// //       prevIndex === images.length - 1 ? 0 : prevIndex + 1,
// //     );
// //   };

// //   const prevImage = () => {
// //     setCurrentImageIndex((prevIndex) =>
// //       prevIndex === 0 ? images.length - 1 : prevIndex - 1,
// //     );
// //   };

// //   const goToImage = (index: any) => {
// //     setCurrentImageIndex(index);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 pb-12">
// //       <Navbar />
// //       <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
// //         {/* Back Link */}
// //         <div className="mb-6">
// //           <Link
// //             href="/market-place"
// //             className="text-sm text-gray-600 hover:underline"
// //           >
// //             &larr; Back to products
// //           </Link>
// //         </div>

// //         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
// //           {/* Left: Large Image */}
// //           <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
// //             <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
// //               {images.length > 0 ? (
// //                 <>
// //                   <img
// //                     src={images[currentImageIndex] || "/placeholder.svg"}
// //                     alt={product.name}
// //                     className="max-h-full max-w-full object-contain transition-opacity duration-300"
// //                   />

// //                   {/* Navigation Arrows - Only show if multiple images */}
// //                   {hasMultipleImages && (
// //                     <>
// //                       <button
// //                         onClick={prevImage}
// //                         className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
// //                         aria-label="Previous image"
// //                       >
// //                         <ChevronLeft className="h-5 w-5 text-gray-600" />
// //                       </button>

// //                       <button
// //                         onClick={nextImage}
// //                         className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
// //                         aria-label="Next image"
// //                       >
// //                         <ChevronRight className="h-5 w-5 text-gray-600" />
// //                       </button>
// //                     </>
// //                   )}

// //                   {/* Dot Indicators - Only show if multiple images */}
// //                   {hasMultipleImages && (
// //                     <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
// //                       {images.map((_, index) => (
// //                         <button
// //                           key={index}
// //                           onClick={() => goToImage(index)}
// //                           className={`h-2 w-2 rounded-full transition-all ${
// //                             index === currentImageIndex
// //                               ? "bg-white shadow-md"
// //                               : "bg-white/50 hover:bg-white/75"
// //                           }`}
// //                           aria-label={`Go to image ${index + 1}`}
// //                         />
// //                       ))}
// //                     </div>
// //                   )}
// //                 </>
// //               ) : (
// //                 <div className="text-lg text-gray-400">No image available</div>
// //               )}

// //               {/* Badge */}
// //               {product.badge && (
// //                 <div
// //                   className={`absolute left-3 top-3 z-10 rounded px-3 py-1 text-sm font-semibold ${
// //                     product.badge === "HOT"
// //                       ? "bg-red-500 text-white"
// //                       : product.badge === "SALE"
// //                         ? "bg-green-500 text-white"
// //                         : product.badge === "25% OFF"
// //                           ? "bg-yellow-500 text-white"
// //                           : "bg-gray-800 text-white"
// //                   }`}
// //                 >
// //                   {product.badge}
// //                 </div>
// //               )}

// //               {/* Out of Stock Overlay */}
// //               {isOutOfStock && (
// //                 <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
// //                   <span className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white">
// //                     OUT OF STOCK
// //                   </span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Right: Product Info */}
// //           <div className="space-y-4">
// //             {/* Title + Rating */}
// //             <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

// //             {/* Rating - Commented out since rating is not available yet */}
// //             {/* <div className="flex items-center space-x-2">
// //               {renderStars(product.rating)}
// //               <span className="text-sm text-gray-500">
// //                 ({product.reviews || 0} reviews)
// //               </span>
// //             </div> */}

// //             {/* Price */}
// //             <div className="flex items-baseline space-x-2">
// //               <span className="text-3xl font-extrabold text-orange-600">
// //                 ₦{product.price.toFixed(2)}
// //               </span>
// //             </div>

// //             {/* Stock Status */}
// //             <div className="mt-1">
// //               {isOutOfStock ? (
// //                 <span className="text-sm font-semibold text-red-600">
// //                   Out of stock
// //                 </span>
// //               ) : (
// //                 <div className="flex items-center">
// //                   <span className="text-sm text-gray-700">
// //                     {product.stock} units available
// //                   </span>
// //                   {product.stock <= 10 && (
// //                     <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
// //                       Low stock
// //                     </span>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Product Details */}
// //             <div className="space-y-4">
// //               {/* Brand */}
// //               <div>
// //                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
// //                   Brand:
// //                 </h3>
// //                 <p className="text-gray-800">{getBrandName(product.brand)}</p>
// //               </div>

// //               {/* Category */}
// //               <div>
// //                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
// //                   Category:
// //                 </h3>
// //                 <p className="text-gray-800">
// //                   {getCategoryName(product.category)}
// //                 </p>
// //               </div>

// //               {/* Description */}
// //               <div>
// //                 <h3 className="mb-1 text-sm font-semibold text-gray-700">
// //                   Description:
// //                 </h3>
// //                 <p className="text-sm leading-relaxed text-gray-800">
// //                   {product.description}
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
// //               {/* Quantity Selector (fixed height h-12) */}
// //               <div className="flex h-12 items-center rounded border border-gray-300 bg-white">
// //                 <button
// //                   onClick={decrement}
// //                   disabled={isQuantityLoading || quantity <= 0 || isOutOfStock}
// //                   className="h-full px-4 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
// //                 >
// //                   {isQuantityLoading ? (
// //                     <Loader2 className="h-4 w-4 animate-spin" />
// //                   ) : (
// //                     "−"
// //                   )}
// //                 </button>
// //                 <div className="flex h-full items-center px-4">
// //                   {isQuantityLoading ? (
// //                     <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
// //                   ) : (
// //                     <span className="text-sm font-medium">
// //                       {quantity < 10 ? `0${quantity}` : quantity}
// //                     </span>
// //                   )}
// //                 </div>
// //                 <button
// //                   onClick={increment}
// //                   disabled={isQuantityLoading || hasReachedStockLimit || isOutOfStock}
// //                   className="h-full px-4 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
// //                 >
// //                   {isQuantityLoading ? (
// //                     <Loader2 className="h-4 w-4 animate-spin" />
// //                   ) : (
// //                     "+"
// //                   )}
// //                 </button>
// //               </div>

// //               {quantity === 0 ? (
// //                 <button
// //                   onClick={handleAddToCart}
// //                   disabled={isAddingToCart || addToCartMutation.isPending || isOutOfStock}
// //                   className="flex h-12 items-center justify-center rounded-lg bg-[#fedc57] px-6 font-medium text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
// //                 >
// //                   <ShoppingCart className="mr-2 h-5 w-5" />
// //                   {isAddingToCart || addToCartMutation.isPending
// //                     ? "Adding..."
// //                     : isOutOfStock ? "Out of Stock" : "Add to cart"}
// //                 </button>
// //               ) : (
// //                 <div className="flex h-12 items-center justify-center rounded-lg bg-green-100 px-6 font-medium text-green-800 sm:flex-1">
// //                   <span>In Cart ({quantity})</span>
// //                 </div>
// //               )}

// //               {/* <button className="flex h-12 items-center justify-center rounded-lg border border-[#fedc57] px-6 font-medium text-[#fedc57] transition hover:bg-yellow-50 sm:flex-1">
// //                 Buy now
// //               </button> */}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mt-12 rounded-lg border border-gray-200 bg-white">
// //           <div className="border-b border-gray-200">
// //             <nav className="flex space-x-4 px-6">
// //               <button
// //                 className={`py-4 text-sm font-medium ${!showRatings ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600 hover:text-gray-800"}`}
// //                 onClick={() => setShowRatings(false)}
// //               >
// //                 Product Details
// //               </button>
// //               <button
// //                 className={`py-4 text-sm font-medium ${showRatings ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600 hover:text-gray-800"}`}
// //                 onClick={() => setShowRatings(true)}
// //               >
// //                 Rating & Reviews
// //               </button>
// //             </nav>
// //           </div>

// //           {showRatings ? (
// //             <RatingsReview productId={product._id} />
// //           ) : (
// //             <div className="space-y-6 px-6 py-8" id="ratings-reviews-section">
// //               <h2 className="text-lg font-semibold text-gray-800">
// //                 Product Details
// //               </h2>
// //               <p className="leading-relaxed text-gray-600">
// //                 {product.description}
// //               </p>

// //               <div>
// //                 <h3 className="text-md mb-2 font-semibold text-gray-800">
// //                   Product Specifications
// //                 </h3>
// //                 <ul className="space-y-1 text-sm text-gray-600">
// //                   <li>• Brand: {getBrandName(product.brand)}</li>
// //                   <li>• Category: {getCategoryName(product.category)}</li>
// //                   <li>• Stock Available: {product.stock} units</li>
// //                   <li>• Price: ₦{product.price.toFixed(2)}</li>
// //                 </ul>
// //               </div>

// //               {/* <div>
// //                 <h3 className="text-md mb-2 font-semibold text-gray-800">
// //                   Shipping Information
// //                 </h3>
// //                 <ul className="space-y-1 text-sm text-gray-600">
// //                   <li>• Delivery: 2–5 business days</li>
// //                   <li>• Shipping cost: Free for orders over $100</li>
// //                   <li>• Return policy: 30 days money-back guarantee</li>
// //                 </ul>
// //               </div> */}

// //               {/* <div>
// //                 <h3 className="text-md mb-2 font-semibold text-gray-800">
// //                   Vendor Details
// //                 </h3>
// //                 <div className="space-y-1 text-sm text-gray-600">
// //                   <p>
// //                     <strong>Vendor Name:</strong> {getBrandName(product.brand)}
// //                   </p>
// //                   <p>
// //                     <strong>Category:</strong> {getCategoryName(product.category)}
// //                   </p>
// //                   <p>
// //                     <strong>Product ID:</strong> {product._id}
// //                   </p>
// //                 </div>
// //               </div> */}
// //             </div>
// //           )}
// //         </div>

// //         {similarProducts.length > 0 && (
// //           <div className="mt-12">
// //             <h2 className="mb-4 text-xl font-semibold text-gray-800">
// //               Similar Products
// //             </h2>
// //             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
// //               {similarProducts.map((p) => (
// //                 <div
// //                   key={p._id}
// //                   className="rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-lg"
// //                 >
// //                   <Link href={`/product/${p._id}`} className="block">
// //                     <div className="relative mb-2 flex h-32 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
// //                       {p.imageUrl &&
// //                       Array.isArray(p.imageUrl) &&
// //                       p.imageUrl.length > 0 ? (
// //                         <img
// //                           src={p.imageUrl[0] || "/placeholder.svg"}
// //                           alt={p.name}
// //                           className="max-h-full max-w-full object-contain"
// //                         />
// //                       ) : p.imageUrl && typeof p.imageUrl === "string" ? (
// //                         <img
// //                           src={p.imageUrl || "/placeholder.svg"}
// //                           alt={p.name}
// //                           className="max-h-full max-w-full object-contain"
// //                         />
// //                       ) : (
// //                         <div className="text-xs text-gray-400">No image</div>
// //                       )}
// //                       {p.badge && (
// //                         <div
// //                           className={`absolute left-2 top-2 z-10 rounded px-2 py-1 text-xs font-semibold ${
// //                             p.badge === "HOT"
// //                               ? "bg-red-500 text-white"
// //                               : p.badge === "SALE"
// //                                 ? "bg-green-500 text-white"
// //                                 : p.badge === "25% OFF"
// //                                   ? "bg-yellow-500 text-white"
// //                                   : "bg-gray-800 text-white"
// //                           }`}
// //                         >
// //                           {p.badge}
// //                         </div>
// //                       )}
// //                     </div>
// //                     <h3 className="line-clamp-2 text-xs font-medium text-gray-800">
// //                       {p.name}
// //                     </h3>
// //                     <div className="mt-1 text-sm font-bold text-orange-600">
// //                       ₦{p.price.toFixed(2)}
// //                     </div>
// //                     <div className="mt-1 text-xs text-gray-600">
// //                       {getCategoryName(p.category)}
// //                     </div>
// //                   </Link>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // }



"use client";
import { useAuth } from "@/api/hooks/useAuth";
import RatingsReview from "@/modules/form/RatingsAndReview";
import Footer from "@/modules/HomePage/Footer";
import Navbar from "@/modules/HomePage/NavBar";
import { selectToken } from "@/slices/OrganizationIdSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category | string;
  brand: Brand | string;
  imageUrl?: string | string[];
  stock: number;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  subcategory?: string;
  doorDeliveryTermsAndCondition?: string;
  pickupCentreTermsAndCondition?: string;
}

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  _id: string;
}

interface CartResponse {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/** Helper functions to safely extract names **/
function getBrandName(brand: Brand | string | undefined): string {
  if (!brand) return "Unknown Brand";
  if (typeof brand === "string") return brand;
  return brand.name || "Unknown Brand";
}

function getCategoryName(category: Category | string | undefined): string {
  if (!category) return "Unknown Category";
  if (typeof category === "string") return category;
  return category.name || "Unknown Category";
}

function getCategoryId(category: Category | string | undefined): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category._id || "";
}

function renderStars(rating = 4.5) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
      );
    } else if (i === fullStars && hasHalfStar) {
      // Still rendering a full star for any half
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />,
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
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRatings, setShowRatings] = useState(false);
  const [isQuantityLoading, setIsQuantityLoading] = useState(false);

  const token = useSelector(selectToken);
  const paramsNode = useParams();
  console.log(params.id);

  React.useEffect(() => {
    if (!token) {
      router.push("/signin");
    }
  }, [token, router]);

  const {
    data: product,
    isLoading: isLoadingProduct,
    error,
  } = useQuery<Product>({
    queryKey: ["product", params.id],
    queryFn: async () => {
      const res = await client.get(`/api/products/${params.id}`);
      return res.data;
    },
    enabled: !!params.id,
  });

  console.log("Product detail:", product);

  const { data: allProducts, isLoading: isLoadingAllProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await client.get("/api/products");
      return res.data;
    },
  });

  // Cart query
  const {
    data: cartData,
    isLoading: isLoadingCart,
    error: cartError,
  } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  // Set quantity based on cart data when it loads
  useEffect(() => {
    if (cartData && product) {
      const cartItem = cartData.items.find(
        (item) => item.product?._id === product._id,
      );
      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else {
        setQuantity(0);
      }
    }
  }, [cartData, product]);

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
      price,
    }: {
      productId: string;
      quantity: number;
      price: number;
    }) => {
      const res = await client.post("/api/cart", {
        productId,
        quantity: quantity.toString(),
        price: price,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // router.push("/cart");
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    },
  });

  const decreaseQuantityMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await client.patch(`/api/cart/${productId}/decrease`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error decreasing quantity:", error);
    },
  });

  // Handle loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center">
            <div className="text-lg text-gray-600">Loading product...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error || !product) {
    notFound();
  }

  // Check if product is out of stock
  const isOutOfStock = product.stock <= 0;
  // Check if user has reached stock limit in cart
  const hasReachedStockLimit = quantity >= product.stock;

  // Pick up to 5 "similar" products in the same category
  const currentCategoryId = getCategoryId(product.category);
  const similarProducts =
    allProducts
      ?.filter(
        (p) =>
          getCategoryId(p.category) === currentCategoryId &&
          p._id !== product._id,
      )
      .slice(0, 5) || [];

  const increment = async () => {
    if (!product || hasReachedStockLimit) return;

    setIsQuantityLoading(true);
    try {
      await addToCartMutation.mutateAsync({
        productId: product._id,
        quantity: 1,
        price: product.price,
      });
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    } finally {
      setIsQuantityLoading(false);
    }
  };

  const decrement = async () => {
    if (!product || quantity <= 0) return;

    setIsQuantityLoading(true);
    try {
      await decreaseQuantityMutation.mutateAsync(product._id);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    } finally {
      setIsQuantityLoading(false);
    }
  };

  // Handler for Add to Cart button
  const handleAddToCart = async () => {
    if (!product || isOutOfStock) return;

    setIsAddingToCart(true);
    try {
      await addToCartMutation.mutateAsync({
        productId: product._id,
        quantity: 1,
        price: product.price,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle different imageUrl formats
  const getImageArray = () => {
    if (product.imageUrl && Array.isArray(product.imageUrl)) {
      return product.imageUrl.filter((url) => url); // Filter out empty strings
    } else if (product.imageUrl && typeof product.imageUrl === "string") {
      return [product.imageUrl];
    }
    return [];
  };

  const images = getImageArray();
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToImage = (index: any) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/market-place"
            className="text-sm text-gray-600 hover:underline"
          >
            &larr; Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Large Image */}
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-opacity duration-300"
                  />

                  {/* Navigation Arrows - Only show if multiple images */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white hover:shadow-lg"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </>
                  )}

                  {/* Dot Indicators - Only show if multiple images */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white shadow-md"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-lg text-gray-400">No image available</div>
              )}

              {/* Badge */}
              {product.badge && (
                <div
                  className={`absolute left-3 top-3 z-10 rounded px-3 py-1 text-sm font-semibold ${
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

              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                  <span className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-4">
            {/* Title + Rating */}
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-orange-600">
                ₦{product.price.toFixed(2)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mt-1">
              {isOutOfStock ? (
                <span className="text-sm font-semibold text-red-600">
                  Out of stock
                </span>
              ) : (
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    {product.stock} units available
                  </span>
                  {/* {product.stock <= 10 && (
                    <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      Low stock
                    </span>
                  )} */}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {/* Brand */}
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-700">
                  Brand:
                </h3>
                <p className="text-gray-800">{getBrandName(product.brand)}</p>
              </div>

              {/* Category */}
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-700">
                  Category:
                </h3>
                <p className="text-gray-800">
                  {getCategoryName(product.category)}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-700">
                  Description:
                </h3>
                <p className="text-sm leading-relaxed text-gray-800">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              {/* Quantity Selector (fixed height h-12) */}
              <div className="flex h-12 items-center rounded border border-gray-300 bg-white">
                <button
                  onClick={decrement}
                  disabled={isQuantityLoading || quantity <= 0 || isOutOfStock}
                  className="h-full px-4 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isQuantityLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "−"
                  )}
                </button>
                <div className="flex h-full items-center px-4">
                  {isQuantityLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  ) : (
                    <span className="text-sm font-medium">
                      {quantity < 10 ? `0${quantity}` : quantity}
                    </span>
                  )}
                </div>
                <button
                  onClick={increment}
                  disabled={isQuantityLoading || hasReachedStockLimit || isOutOfStock}
                  className="h-full px-4 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isQuantityLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "+"
                  )}
                </button>
              </div>

              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || addToCartMutation.isPending || isOutOfStock}
                  className="flex h-12 items-center justify-center rounded-lg bg-[#fedc57] px-6 font-medium text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAddingToCart || addToCartMutation.isPending
                    ? "Adding..."
                    : isOutOfStock ? "Out of Stock" : "Add to cart"}
                </button>
              ) : (
                <div className="flex h-12 items-center justify-center rounded-lg bg-green-100 px-6 font-medium text-green-800 sm:flex-1">
                  <span>In Cart ({quantity})</span>
                </div>
              )}

              {/* <button className="flex h-12 items-center justify-center rounded-lg border border-[#fedc57] px-6 font-medium text-[#fedc57] transition hover:bg-yellow-50 sm:flex-1">
                Buy now
              </button> */}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-6">
              <button
                className={`py-4 text-sm font-medium ${!showRatings ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600 hover:text-gray-800"}`}
                onClick={() => setShowRatings(false)}
              >
                Product Details
              </button>
              <button
                className={`py-4 text-sm font-medium ${showRatings ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600 hover:text-gray-800"}`}
                onClick={() => setShowRatings(true)}
              >
                Rating & Reviews
              </button>
            </nav>
          </div>

          {showRatings ? (
            <RatingsReview productId={product._id} />
          ) : (
            <div className="space-y-6 px-6 py-8" id="ratings-reviews-section">
              <h2 className="text-lg font-semibold text-gray-800">
                Product Details
              </h2>
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>

              <div>
                <h3 className="text-md mb-2 font-semibold text-gray-800">
                  Product Specifications
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Brand: {getBrandName(product.brand)}</li>
                  <li>• Category: {getCategoryName(product.category)}</li>
                  <li>• Stock Available: {product.stock} units</li>
                  <li>• Price: ₦{product.price.toFixed(2)}</li>
                </ul>
              </div>

            </div>
          )}
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {similarProducts.map((p) => (
                <div
                  key={p._id}
                  className="rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-lg"
                >
                  <Link href={`/product/${p._id}`} className="block">
                    <div className="relative mb-2 flex h-32 w-full items-center justify-center overflow-hidden rounded bg-gray-100">
                      {p.imageUrl &&
                      Array.isArray(p.imageUrl) &&
                      p.imageUrl.length > 0 ? (
                        <img
                          src={p.imageUrl[0] || "/placeholder.svg"}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : p.imageUrl && typeof p.imageUrl === "string" ? (
                        <img
                          src={p.imageUrl || "/placeholder.svg"}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                      {p.badge && (
                        <div
                          className={`absolute left-2 top-2 z-10 rounded px-2 py-1 text-xs font-semibold ${
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
                    <h3 className="line-clamp-2 text-xs font-medium text-gray-800">
                      {p.name}
                    </h3>
                    <div className="mt-1 text-sm font-bold text-orange-600">
                      ₦{p.price.toFixed(2)}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      {getCategoryName(p.category)}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}