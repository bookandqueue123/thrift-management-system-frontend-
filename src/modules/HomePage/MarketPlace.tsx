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
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

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
const Header: React.FC = () => {
  return (
    <div className=" m-4 rounded-2xl bg-gradient-to-br from-[#2C2648]  to-[#000000] p-6 text-white">
      <h1 className="mb-2 text-2xl font-bold">MarketPlace</h1>
      <p className="text-white">
        Discover products, brands, categories. Any and Everything.
      </p>
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
          {/* Price Range (unchanged, hardcoded) */}
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

  const handleImageError = () => {
    // Handle image error - could set a fallback image
  };

  const handleImageLoad = () => {
    // Handle image load success
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg">
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative mb-4">
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
                onError={handleImageError}
                onLoad={handleImageLoad}
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
          {/* Wishlist Button */}
          <button className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        {/* Product Info */}
        <div>
          <Link href={`/product/${product._id}`} className="block">
            <h3 className="mb-2 line-clamp-2 font-medium text-gray-800 hover:text-orange-600">
              {product.name}
            </h3>
          </Link>
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
          {/* Category Badge */}
          <div className="mt-2">
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {typeof product.category === "object"
                ? product.category?.name || product.category?._id || ""
                : product.category}
            </span>
          </div>
        </div>{" "}
      </Link>
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

export default MarketplaceInterface;
export { ProductCard };
