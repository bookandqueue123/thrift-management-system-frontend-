// "use client";
// import { useAuth } from "@/api/hooks/useAuth";
// import { useQuery } from "@tanstack/react-query";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   Heart,
//   Search,
//   Star,
//   X,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useMemo, useState } from "react";

// // Updated Type Definitions to match API response
// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string | { _id: string; name: string };
//   brand: string;
//   imageUrl?: string | string[];
//   stock: number;
//   rating?: number;
//   reviews?: number;
//   badge?: string | null;
//   subcategory?: string;
//   discount?: number;
//   costBeforeDiscount?: number;
// }

// interface Category {
//   name: string;
//   subcategories: string[];
// }

// interface Brand {
//   name: string;
//   checked: boolean;
// }

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedCategories: string[];
//   selectedSubcategories: string[];
//   selectedBrands: string[];
//   onCategoryChange: (category: string) => void;
//   onSubcategoryChange: (subcategory: string) => void;
//   onBrandChange: (brandId: string) => void;
//   categoriesData: any[];
//   isLoadingCategories: boolean;
//   brandsData: any[];
//   isLoadingBrands: boolean;
//   tagsData: any[];
//   isLoadingTags: boolean;
// }

// interface ProductCardProps {
//   product: Product;
// }

// // Header Component
// interface CartResponse {
//   items: Array<{
//     id: string;
//     quantity: number;
//     // Add other cart item properties as needed
//   }>;
//   total: number;
//   // Add other cart response properties as needed
// }

// const Header: React.FC = () => {
//   const router = useRouter();
//   const { client } = useAuth();

//   // Cart data fetching
//   const {
//     data: cartData,
//     isLoading,
//     error,
//   } = useQuery<CartResponse>({
//     queryKey: ["cart"],
//     queryFn: async () => {
//       const res = await client.get("/api/cart");
//       return res.data;
//     },
//   });

//   // Calculate total items in cart
//   const cartItemCount =
//     cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

//   const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
//     // Debug logging
//     console.log("Cart button clicked!", e);
//     console.log("Event target:", e.target);
//     console.log("Current target:", e.currentTarget);

//     // Prevent any potential event bubbling issues
//     e.preventDefault();
//     e.stopPropagation();

//     // Navigate to cart
//     router.push("/cart");
//   };

//   // Debug function to test if button is reachable
//   const handleMouseEnter = (): void => {
//     console.log("Mouse entered cart button - button is reachable");
//   };

//   return (
//     <div className="relative m-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2C2648] via-[#1a1a2e] to-[#000000] p-6 text-white shadow-xl">
//       {/* Background Pattern - Ensure it doesn't block clicks */}
//       <div className="pointer-events-none absolute inset-0 opacity-5">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
//       </div>

//       <div className="relative flex items-center justify-between">
//         {/* Left Section - Title and Description */}
//         <div className="flex-1">
//           <h1 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
//             MarketPlace
//           </h1>
//           <p className="text-lg text-gray-200 lg:text-xl">
//             Discover products, brands, categories. Any and Everything.
//           </p>
//         </div>

//         {/* Right Section - Cart */}
//         <div className="relative z-10 ml-6 flex items-center">
//           <button
//             type="button"
//             onClick={handleCartClick}
//             onMouseEnter={handleMouseEnter}
//             className="group relative cursor-pointer rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
//             aria-label="Shopping cart"
//             style={{
//               pointerEvents: "auto",
//               position: "relative",
//               zIndex: 100,
//             }}
//           >
//             {/* Cart Icon */}
//             <svg
//               className="pointer-events-none h-7 w-7 text-white transition-colors group-hover:text-gray-100"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
//               />
//             </svg>

//             {/* Cart Badge */}
//             {!isLoading && cartItemCount > 0 && (
//               <span className="pointer-events-none absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg ring-2 ring-white/20">
//                 {cartItemCount > 99 ? "99+" : cartItemCount}
//               </span>
//             )}

//             {/* Loading indicator */}
//             {isLoading && (
//               <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/30">
//                 <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
//               </span>
//             )}
//           </button>

//           {/* Cart Text (Desktop Only) */}
//           <div className="pointer-events-none ml-3 hidden md:block">
//             <div className="text-sm font-medium text-white">Cart</div>
//             <div className="text-xs text-gray-300">
//               {isLoading ? (
//                 <span className="animate-pulse">Loading...</span>
//               ) : error ? (
//                 <span className="text-red-300">Error</span>
//               ) : cartItemCount === 0 ? (
//                 "Empty"
//               ) : cartItemCount === 1 ? (
//                 "1 item"
//               ) : (
//                 `${cartItemCount} items`
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Decorative Elements - Ensure they don't block clicks */}
//       <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl"></div>
//       <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-xl"></div>
//     </div>
//   );
// };

// // Sidebar Component
// const Sidebar: React.FC<SidebarProps> = ({
//   isOpen,
//   onClose,
//   selectedCategories,
//   selectedSubcategories,
//   selectedBrands,
//   onCategoryChange,
//   onSubcategoryChange,
//   onBrandChange,
//   categoriesData,
//   isLoadingCategories,
//   brandsData,
//   isLoadingBrands,
//   tagsData,
//   isLoadingTags,
// }) => {
//   const priceRanges: string[] = [
//     "ALL PRICE",
//     "UNDER $20",
//     "$25 TO $100",
//     "$100 TO $300",
//     "$300 TO $500",
//     "$500 TO $1,000",
//     "$1,000 TO $10,000",
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
//           onClick={onClose}
//         />
//       )}
//       {/* Sidebar */}
//       <div
//         className={`
//         fixed inset-y-0 left-0 z-50 w-80
//         transform overflow-y-auto border-r border-gray-200 bg-white
//         transition-transform duration-300 ease-in-out lg:static
//         ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//       `}
//       >
//         {/* Mobile Close Button */}
//         <div className="flex items-center justify-between border-b p-4 lg:hidden">
//           <h2 className="font-semibold">Filters</h2>
//           <button onClick={onClose}>
//             <X className="h-6 w-6" />
//           </button>
//         </div>
//         <div className="space-y-6 p-4">
//           {/* Categories */}
//           <div>
//             <h3 className="mb-3 font-semibold text-gray-800">CATEGORY</h3>
//             {isLoadingCategories ? (
//               <div>Loading categories...</div>
//             ) : (
//               categoriesData?.map((category: any, idx: number) => (
//                 <label
//                   key={category._id}
//                   className={`mb-1 flex cursor-pointer items-center rounded px-3 py-2 transition-colors ${
//                     idx === 0
//                       ? "bg-[#EAAB40] text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedCategories.includes(category._id)}
//                     onChange={() => onCategoryChange(category._id)}
//                     className="mr-2 rounded"
//                   />
//                   <span className="text-sm font-medium">{category.name}</span>
//                 </label>
//               ))
//             )}
//           </div>
//           {/* Price Range (unchanged, hardcoded) */}
//           <div>
//             <h3 className="mb-3 font-semibold text-gray-800">PRICE RANGE</h3>
//             <div className="space-y-2">
//               {priceRanges.map((range) => (
//                 <label key={range} className="flex cursor-pointer items-center">
//                   <input type="radio" name="priceRange" className="mr-2" />
//                   <span className="text-sm text-gray-600">{range}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//           {/* Brands */}
//           <div>
//             <h3 className="mb-3 font-semibold text-gray-800">BRANDS</h3>
//             {isLoadingBrands ? (
//               <div>Loading brands...</div>
//             ) : (
//               brandsData?.map((brand: any) => (
//                 <label
//                   key={brand._id}
//                   className="mb-1 flex cursor-pointer items-center px-3 py-2"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedBrands.includes(brand._id)}
//                     onChange={() => onBrandChange(brand._id)}
//                     className="mr-2 rounded"
//                   />
//                   <span className="text-sm text-gray-600">{brand.name}</span>
//                 </label>
//               ))
//             )}
//           </div>
//           {/* Tags */}
//           <div>
//             <h3 className="mb-3 font-semibold text-gray-800">TAGS</h3>
//             <div className="flex flex-wrap gap-2">
//               {isLoadingTags ? (
//                 <div>Loading tags...</div>
//               ) : (
//                 tagsData?.map((tag: any) => (
//                   <span
//                     key={tag._id}
//                     className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200"
//                   >
//                     {tag.name}
//                   </span>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Product Card Component
// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const router = useRouter();
//   const renderStars = (rating: number = 4.5): JSX.Element[] => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//       stars.push(
//         <Star
//           key={i}
//           className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//         />,
//       );
//     }
//     return stars;
//   };

//   const handleImageError = () => {
//     // Handle image error - could set a fallback image
//   };

//   const handleImageLoad = () => {
//     // Handle image load success
//   };
   
//   const handleRedirect = (id: string) => {
//     router.push(`/product/${product._id}`);
//   };

//   return (
//     <div
//       onClick={() => handleRedirect(product._id)}
//       className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg"
//     >
//       {/* Product Image */}
//       {/* <Link href={`/product/${product._id}`} className="block"> */}
//       <div className="relative mb-4">
//         <div className="flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-90">
//           {product.imageUrl ? (
//             <img
//               src={
//                 Array.isArray(product.imageUrl)
//                   ? product.imageUrl[0]
//                   : product.imageUrl
//               }
//               alt={product.name}
//               className="h-full w-full object-contain"
//               onError={handleImageError}
//               onLoad={handleImageLoad}
//             />
//           ) : (
//             <div className="text-sm text-gray-400">No image available</div>
//           )}
//         </div>

//         {/* Discount Badge */}
//         {product.discount && product.discount > 0 && (
//           <div className="absolute left-2 top-2">
//             <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
//               -{product.discount}%
//             </span>
//           </div>
//         )}
//         {/* Wishlist Button */}
//         <button className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-50">
//           <Heart className="h-4 w-4 text-gray-400" />
//         </button>
//       </div>
//       {/* Product Info */}
//       <div>
//         <Link href={`/product/${product._id}`} className="block">
//           <h3 className="mb-2 line-clamp-2 font-medium text-gray-800 hover:text-orange-600">
//             {product.name}
//           </h3>
//         </Link>
//         {/* Price and Discount */}
//         <div className="mb-2 flex items-center gap-2">
//           <span className="text-lg font-bold text-orange-600">
//             ₦{product.price.toLocaleString()}
//           </span>
//           {product.discount &&
//             product.discount > 0 &&
//             product.costBeforeDiscount && (
//               <span className="text-sm text-gray-400 line-through">
//                 ₦{product.costBeforeDiscount.toLocaleString()}
//               </span>
//             )}
//         </div>
//         {/* Stock Left */}
       
//         {/* <div className="mb-1 text-xs text-gray-500">
//           {product.stock} items left
//         </div>
//         */}
//          {product.stock <= 0 && (
//           <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
//             <span className="text-white font-bold text-lg px-3 py-1 bg-red-500 rounded-full">
//               OUT OF STOCK
//             </span>
//           </div>
//         )}
       
//         <div className="mt-2">
//           <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
//             {typeof product.category === "object"
//               ? product.category?.name || product.category?._id || ""
//               : product.category}
//           </span>
//         </div>
//       </div>{" "}
//       {/* </Link> */}
//     </div>
//   );
// };

// // Main Component
// const MarketplaceInterface: React.FC = () => {
//   const { client } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
//     [],
//   );
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // Fetch products from API
//   const {
//     data: products,
//     isLoading,
//     error,
//   } = useQuery<Product[]>({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await client.get("/api/products");
//       return res.data;
//     },
//   });

//   // Fetch categories, brands, tags from API
//   const { data: categoriesData = [], isLoading: isLoadingCategories } =
//     useQuery({
//       queryKey: ["product-categories"],
//       queryFn: async () => {
//         const res = await client.get("/api/products-categories");
//         return res.data.data;
//       },
//     });
//   const { data: brandsData = [], isLoading: isLoadingBrands } = useQuery({
//     queryKey: ["brands"],
//     queryFn: async () => {
//       const res = await client.get("/api/brands");
//       return res.data.data;
//     },
//   });
//   const { data: tagsData = [], isLoading: isLoadingTags } = useQuery({
//     queryKey: ["tags"],
//     queryFn: async () => {
//       const res = await client.get("/api/tags");
//       return res.data.data;
//     },
//   });

//   // Filter products based on search and filters
//   const filteredProducts = useMemo(() => {
//     if (!products) return [];

//     let filtered = products;

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (product) =>
//           product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           (typeof product.category === "object"
//             ? product.category.name
//                 .toLowerCase()
//                 .includes(searchQuery.toLowerCase())
//             : product.category
//                 .toLowerCase()
//                 .includes(searchQuery.toLowerCase())),
//       );
//     }

//     // Category filter
//     if (selectedCategories.length > 0) {
//       filtered = filtered.filter((product) =>
//         selectedCategories.includes(
//           typeof product.category === "object"
//             ? product.category._id
//             : product.category,
//         ),
//       );
//     }

//     // Subcategory filter
//     if (selectedSubcategories.length > 0) {
//       filtered = filtered.filter((product) =>
//         selectedSubcategories.includes(product.subcategory || ""),
//       );
//     }

//     // Brand filter
//     if (selectedBrands.length > 0) {
//       filtered = filtered.filter((product) =>
//         selectedBrands.includes(product.brand),
//       );
//     }

//     return filtered;
//   }, [
//     products,
//     searchQuery,
//     selectedCategories,
//     selectedSubcategories,
//     selectedBrands,
//   ]);

//   // Pagination
//   const productsPerPage = 12;
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
//   const startIndex = (currentPage - 1) * productsPerPage;
//   const endIndex = startIndex + productsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, endIndex);

//   const handleCategoryChange = (category: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category)
//         ? prev.filter((c) => c !== category)
//         : [...prev, category],
//     );
//     setCurrentPage(1);
//   };

//   const handleSubcategoryChange = (subcategory: string) => {
//     setSelectedSubcategories((prev) =>
//       prev.includes(subcategory)
//         ? prev.filter((s) => s !== subcategory)
//         : [...prev, subcategory],
//     );
//     setCurrentPage(1);
//   };

//   const handleBrandChange = (brandId: string) => {
//     setSelectedBrands((prev) =>
//       prev.includes(brandId)
//         ? prev.filter((b) => b !== brandId)
//         : [...prev, brandId],
//     );
//     setCurrentPage(1);
//   };

//   const clearAllFilters = () => {
//     setSelectedCategories([]);
//     setSelectedSubcategories([]);
//     setSelectedBrands([]);
//     setSearchQuery("");
//     setCurrentPage(1);
//   };

//   const removeFilter = (
//     type: "category" | "subcategory" | "brand",
//     value: string,
//   ) => {
//     if (type === "category") {
//       setSelectedCategories((prev) => prev.filter((c) => c !== value));
//     } else if (type === "subcategory") {
//       setSelectedSubcategories((prev) => prev.filter((s) => s !== value));
//     } else {
//       setSelectedBrands((prev) => prev.filter((b) => b !== value));
//     }
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number): void => {
//     setCurrentPage(page);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="flex h-64 items-center justify-center">
//           <div className="text-lg text-gray-600">Loading products...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="flex h-64 items-center justify-center">
//           <div className="text-lg text-red-600">
//             Error loading products. Please try again.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="flex">
//         {/* Sidebar */}
//         <Sidebar
//           isOpen={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//           selectedCategories={selectedCategories}
//           selectedSubcategories={selectedSubcategories}
//           selectedBrands={selectedBrands}
//           onCategoryChange={handleCategoryChange}
//           onSubcategoryChange={handleSubcategoryChange}
//           onBrandChange={handleBrandChange}
//           categoriesData={categoriesData}
//           isLoadingCategories={isLoadingCategories}
//           brandsData={brandsData}
//           isLoadingBrands={isLoadingBrands}
//           tagsData={tagsData}
//           isLoadingTags={isLoadingTags}
//         />

//         {/* Main Content */}
//         <div className="flex-1 p-4">
//           {/* Search and Filters Bar */}
//           <div className="mb-6 flex flex-col gap-4 lg:flex-row">
//             {/* Search Bar */}
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
//               />
//             </div>

//             {/* Mobile Filter Button */}
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 lg:hidden"
//             >
//               <Filter className="h-5 w-5" />
//               Filters
//             </button>

//             {/* Clear Filters Button */}
//             {(selectedCategories.length > 0 ||
//               selectedSubcategories.length > 0 ||
//               selectedBrands.length > 0 ||
//               searchQuery) && (
//               <button
//                 onClick={clearAllFilters}
//                 className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
//               >
//                 Clear all filters
//               </button>
//             )}
//           </div>

//           {/* Active Filters */}
//           {(selectedCategories.length > 0 ||
//             selectedSubcategories.length > 0 ||
//             selectedBrands.length > 0) && (
//             <div className="mb-6 flex flex-wrap gap-2">
//               {selectedCategories.map((categoryId) => {
//                 const cat = categoriesData.find(
//                   (c: any) => c._id === categoryId,
//                 );
//                 return (
//                   <span
//                     key={categoryId}
//                     className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800"
//                   >
//                     {cat ? cat.name : categoryId}
//                     <button
//                       onClick={() => removeFilter("category", categoryId)}
//                       className="ml-1 hover:text-orange-600"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 );
//               })}
//               {selectedSubcategories.map((subId) => {
//                 let subName = subId;
//                 for (const cat of categoriesData) {
//                   const found = cat.children?.find(
//                     (sub: any) => sub._id === subId,
//                   );
//                   if (found) {
//                     subName = found.name;
//                     break;
//                   }
//                 }
//                 return (
//                   <span
//                     key={subId}
//                     className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
//                   >
//                     {subName}
//                     <button
//                       onClick={() => removeFilter("subcategory", subId)}
//                       className="ml-1 hover:text-blue-600"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 );
//               })}
//               {selectedBrands.map((brandId) => {
//                 const brand = brandsData.find((b: any) => b._id === brandId);
//                 return (
//                   <span
//                     key={brandId}
//                     className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
//                   >
//                     {brand ? brand.name : brandId}
//                     <button
//                       onClick={() => removeFilter("brand", brandId)}
//                       className="ml-1 hover:text-green-600"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 );
//               })}
//             </div>
//           )}

//           {/* Results Count */}
//           <div className="mb-6 flex items-center justify-between">
//             <p className="text-gray-600">
//               Showing {filteredProducts.length} of {products?.length || 0}{" "}
//               products
//             </p>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">Sort by:</span>
//               <select className="rounded border border-gray-300 px-2 py-1 text-sm">
//                 <option>Featured</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//                 <option>Newest</option>
//               </select>
//             </div>
//           </div>

//           {/* Products Grid */}
//           {currentProducts.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//               {currentProducts.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <div className="py-12 text-center">
//               <p className="text-lg text-gray-500">
//                 No products found matching your criteria.
//               </p>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-8 flex items-center justify-center gap-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`rounded border px-3 py-2 ${
//                       currentPage === page
//                         ? "border-orange-500 bg-orange-500 text-white"
//                         : "border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ),
//               )}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketplaceInterface;
// export { ProductCard };


"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  Search,
  Star,
  X,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, createContext, useContext } from "react";

// Create Cart Context
interface CartContextType {
  addToCart: (productId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { client } = useAuth();

  const addToCart = async (productId: string, quantity: number) => {
    try {
      // Fetch product stock first
      const productRes = await client.get(`/api/products/${productId}`);
      const product = productRes.data;
      
      if (product.stock <= 0) {
        alert("This product is out of stock!");
        return;
      }
      
      if (quantity > product.stock) {
        alert(`Only ${product.stock} items available!`);
        return;
      }
      
      // Add to cart if validation passes
      await client.post("/api/cart/add", { productId, quantity });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <CartContext.Provider value={{ addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Updated Type Definitions to match API response
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | { _id: string; name: string };
  brand: string;
  imageUrl?: string | string[];
  stock: number;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  subcategory?: string;
  discount?: number;
  costBeforeDiscount?: number;
}

interface Category {
  name: string;
  subcategories: string[];
}

interface Brand {
  name: string;
  checked: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedBrands: string[];
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onBrandChange: (brandId: string) => void;
  categoriesData: any[];
  isLoadingCategories: boolean;
  brandsData: any[];
  isLoadingBrands: boolean;
  tagsData: any[];
  isLoadingTags: boolean;
}

interface ProductCardProps {
  product: Product;
}

// Header Component
interface CartResponse {
  items: Array<{
    id: string;
    quantity: number;
  }>;
  total: number;
}

const Header: React.FC = () => {
  const router = useRouter();
  const { client } = useAuth();

  // Cart data fetching
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("/api/cart");
      return res.data;
    },
  });

  // Calculate total items in cart
  const cartItemCount =
    cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/cart");
  };

  return (
    <div className="relative m-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2C2648] via-[#1a1a2e] to-[#000000] p-6 text-white shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative flex items-center justify-between">
        {/* Left Section - Title and Description */}
        <div className="flex-1">
          <h1 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
            MarketPlace
          </h1>
          <p className="text-lg text-gray-200 lg:text-xl">
            Discover products, brands, categories. Any and Everything.
          </p>
        </div>

        {/* Right Section - Cart */}
        <div className="relative z-10 ml-6 flex items-center">
          <button
            type="button"
            onClick={handleCartClick}
            className="group relative cursor-pointer rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-7 w-7 text-white transition-colors group-hover:text-gray-100" />
            
            {/* Cart Badge */}
            {!isLoading && cartItemCount > 0 && (
              <span className="pointer-events-none absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg ring-2 ring-white/20">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/30">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
              </span>
            )}
          </button>

          {/* Cart Text (Desktop Only) */}
          <div className="pointer-events-none ml-3 hidden md:block">
            <div className="text-sm font-medium text-white">Cart</div>
            <div className="text-xs text-gray-300">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : error ? (
                <span className="text-red-300">Error</span>
              ) : cartItemCount === 0 ? (
                "Empty"
              ) : cartItemCount === 1 ? (
                "1 item"
              ) : (
                `${cartItemCount} items`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl"></div>
      <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-xl"></div>
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  selectedSubcategories,
  selectedBrands,
  onCategoryChange,
  onSubcategoryChange,
  onBrandChange,
  categoriesData,
  isLoadingCategories,
  brandsData,
  isLoadingBrands,
  tagsData,
  isLoadingTags,
}) => {
  const priceRanges: string[] = [
    "ALL PRICE",
    "UNDER $20",
    "$25 TO $100",
    "$100 TO $300",
    "$300 TO $500",
    "$500 TO $1,000",
    "$1,000 TO $10,000",
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80
        transform overflow-y-auto border-r border-gray-200 bg-white
        transition-transform duration-300 ease-in-out lg:static
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between border-b p-4 lg:hidden">
          <h2 className="font-semibold">Filters</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-6 p-4">
          {/* Categories */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">CATEGORY</h3>
            {isLoadingCategories ? (
              <div>Loading categories...</div>
            ) : (
              categoriesData?.map((category: any, idx: number) => (
                <label
                  key={category._id}
                  className={`mb-1 flex cursor-pointer items-center rounded px-3 py-2 transition-colors ${
                    idx === 0
                      ? "bg-[#EAAB40] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => onCategoryChange(category._id)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </label>
              ))
            )}
          </div>
          {/* Price Range */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">PRICE RANGE</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range} className="flex cursor-pointer items-center">
                  <input type="radio" name="priceRange" className="mr-2" />
                  <span className="text-sm text-gray-600">{range}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Brands */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">BRANDS</h3>
            {isLoadingBrands ? (
              <div>Loading brands...</div>
            ) : (
              brandsData?.map((brand: any) => (
                <label
                  key={brand._id}
                  className="mb-1 flex cursor-pointer items-center px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand._id)}
                    onChange={() => onBrandChange(brand._id)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm text-gray-600">{brand.name}</span>
                </label>
              ))
            )}
          </div>
          {/* Tags */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {isLoadingTags ? (
                <div>Loading tags...</div>
              ) : (
                tagsData?.map((tag: any) => (
                  <span
                    key={tag._id}
                    className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    {tag.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating: number = 4.5): JSX.Element[] => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />,
      );
    }
    return stars;
  };

  const handleRedirect = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <div
      onClick={() => handleRedirect(product._id)}
      className={`rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg ${
        product.stock <= 0 ? "opacity-70" : ""
      }`}
    >
      <div className="relative mb-4">
        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black bg-opacity-70 pointer-events-none">
            <span className="px-3 py-1 text-lg font-bold text-white bg-red-500 rounded-full">
              OUT OF STOCK
            </span>
          </div>
        )}

        <div className="flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-90">
          {product.imageUrl ? (
            <img
              src={
                Array.isArray(product.imageUrl)
                  ? product.imageUrl[0]
                  : product.imageUrl
              }
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-sm text-gray-400">No image available</div>
          )}
        </div>

        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
              -{product.discount}%
            </span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div>
        <h3 className="mb-2 line-clamp-2 font-medium text-gray-800 hover:text-orange-600">
          {product.name}
        </h3>
        
        {/* Price and Discount */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold text-orange-600">
            ₦{product.price.toLocaleString()}
          </span>
          {product.discount &&
            product.discount > 0 &&
            product.costBeforeDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.costBeforeDiscount.toLocaleString()}
              </span>
            )}
        </div>
        
        {/* Stock Left */}
        <div className="mb-1 text-xs text-gray-500">
          {product.stock} items left
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAddingToCart}
          className={`mt-3 w-full rounded-lg py-2 text-sm font-medium transition-colors ${
            product.stock <= 0
              ? "cursor-not-allowed bg-gray-400 text-gray-700"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {product.stock <= 0 
            ? "Out of Stock" 
            : isAddingToCart 
              ? "Adding..." 
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

// Main Component
const MarketplaceInterface: React.FC = () => {
  const { client } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch products from API
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await client.get("/api/products");
      return res.data;
    },
  });

  // Fetch categories, brands, tags from API
  const { data: categoriesData = [], isLoading: isLoadingCategories } =
    useQuery({
      queryKey: ["product-categories"],
      queryFn: async () => {
        const res = await client.get("/api/products-categories");
        return res.data.data;
      },
    });
  const { data: brandsData = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await client.get("/api/brands");
      return res.data.data;
    },
  });
  const { data: tagsData = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await client.get("/api/tags");
      return res.data.data;
    },
  });

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof product.category === "object"
            ? product.category.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : product.category
                .toLowerCase()
                .includes(searchQuery.toLowerCase())),
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(
          typeof product.category === "object"
            ? product.category._id
            : product.category,
        ),
      );
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSubcategories.includes(product.subcategory || ""),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand),
      );
    }

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
  ]);

  // Pagination
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory],
    );
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((b) => b !== brandId)
        : [...prev, brandId],
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const removeFilter = (
    type: "category" | "subcategory" | "brand",
    value: string,
  ) => {
    if (type === "category") {
      setSelectedCategories((prev) => prev.filter((c) => c !== value));
    } else if (type === "subcategory") {
      setSelectedSubcategories((prev) => prev.filter((s) => s !== value));
    } else {
      setSelectedBrands((prev) => prev.filter((b) => b !== value));
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-red-600">
            Error loading products. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategories={selectedCategories}
          selectedSubcategories={selectedSubcategories}
          selectedBrands={selectedBrands}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onBrandChange={handleBrandChange}
          categoriesData={categoriesData}
          isLoadingCategories={isLoadingCategories}
          brandsData={brandsData}
          isLoadingBrands={isLoadingBrands}
          tagsData={tagsData}
          isLoadingTags={isLoadingTags}
        />

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Search and Filters Bar */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 lg:hidden"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>

            {/* Clear Filters Button */}
            {(selectedCategories.length > 0 ||
              selectedSubcategories.length > 0 ||
              selectedBrands.length > 0 ||
              searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 ||
            selectedSubcategories.length > 0 ||
            selectedBrands.length > 0) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const cat = categoriesData.find(
                  (c: any) => c._id === categoryId,
                );
                return (
                  <span
                    key={categoryId}
                    className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800"
                  >
                    {cat ? cat.name : categoryId}
                    <button
                      onClick={() => removeFilter("category", categoryId)}
                      className="ml-1 hover:text-orange-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {selectedSubcategories.map((subId) => {
                let subName = subId;
                for (const cat of categoriesData) {
                  const found = cat.children?.find(
                    (sub: any) => sub._id === subId,
                  );
                  if (found) {
                    subName = found.name;
                    break;
                  }
                }
                return (
                  <span
                    key={subId}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {subName}
                    <button
                      onClick={() => removeFilter("subcategory", subId)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {selectedBrands.map((brandId) => {
                const brand = brandsData.find((b: any) => b._id === brandId);
                return (
                  <span
                    key={brandId}
                    className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                  >
                    {brand ? brand.name : brandId}
                    <button
                      onClick={() => removeFilter("brand", brandId)}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products?.length || 0}{" "}
              products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="rounded border border-gray-300 px-2 py-1 text-sm">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-500">
                No products found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`rounded border px-3 py-2 ${
                      currentPage === page
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MarketplaceWithProvider() {
  return (
    <CartProvider>
      <MarketplaceInterface />
    </CartProvider>
  );
}
export { ProductCard };