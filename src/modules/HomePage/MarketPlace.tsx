"use client";
import React, { useState, useMemo } from 'react';
import { Search, Star, Heart, ShoppingCart, Grid, Filter, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";

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
    <div className=" rounded-2xl bg-gradient-to-br from-[#2C2648] to-[#000000]  text-white p-6 m-4">
      <h1 className="text-2xl font-bold mb-2">MarketPlace</h1>
      <p className="text-white">Discover products, brands, categories. Any and Everything.</p>
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
    'ALL PRICE',
    'UNDER $20',
    '$25 TO $100',
    '$100 TO $300',
    '$300 TO $500',
    '$500 TO $1,000',
    '$1,000 TO $10,000'
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-white border-r border-gray-200 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Filters</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">CATEGORY</h3>
            {isLoadingCategories ? (
              <div>Loading categories...</div>
            ) : categoriesData?.map((category: any, idx: number) => (
              <label
                key={category._id}
                className={`flex items-center px-3 py-2 rounded cursor-pointer mb-1 transition-colors ${
                  idx === 0
                    ? 'bg-[#EAAB40] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            ))}
          </div>
          {/* Price Range (unchanged, hardcoded) */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">PRICE RANGE</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range} className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    name="priceRange"
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">{range}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Brands */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">BRANDS</h3>
            {isLoadingBrands ? (
              <div>Loading brands...</div>
            ) : brandsData?.map((brand: any) => (
              <label key={brand._id} className="flex items-center px-3 py-2 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand._id)}
                  onChange={() => onBrandChange(brand._id)}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-600">{brand.name}</span>
              </label>
            ))}
          </div>
          {/* Tags */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {isLoadingTags ? (
                <div>Loading tags...</div>
              ) : tagsData?.map((tag: any) => (
                <span
                  key={tag._id}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full cursor-pointer hover:bg-gray-200"
                >
                  {tag.name}
                </span>
              ))}
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
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative mb-4">
        <Link href={`/product/${product._id}`} className="block">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            {product.imageUrl ? (
              <img
                src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="text-gray-400 text-sm">No image available</div>
            )}
          </div>
        </Link>
        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-600">
              -{product.discount}%
            </span>
          </div>
        )}
        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      {/* Product Info */}
      <div>
        <Link href={`/product/${product._id}`} className="block">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 hover:text-orange-600">
            {product.name}
          </h3>
        </Link>
        {/* Price and Discount */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-orange-600">
            ₦{product.price.toLocaleString()}
          </span>
          {product.discount && product.discount > 0 && product.costBeforeDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₦{product.costBeforeDiscount.toLocaleString()}
            </span>
          )}
        </div>
        {/* Stock Left */}
        <div className="text-xs text-gray-500 mb-1">
          {product.stock} items left
        </div>
        {/* Category Badge */}
        <div className="mt-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {typeof product.category === 'object'
              ? product.category?.name || product.category?._id || ''
              : product.category}
          </span>
        </div>
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
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch products from API
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await client.get('/api/products');
      return res.data;
    },
  });

  // Fetch categories, brands, tags from API
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await client.get('/api/products-categories');
      return res.data.data;
    },
  });
  const { data: brandsData = [], isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await client.get('/api/brands');
      return res.data.data;
    },
  });
  const { data: tagsData = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await client.get('/api/tags');
      return res.data.data;
    },
  });

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof product.category === 'object'
          ? product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
          : product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(
          typeof product.category === 'object'
            ? product.category._id
            : product.category
        )
      );
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubcategories.includes(product.subcategory || '')
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategories, selectedSubcategories, selectedBrands]);

  // Pagination
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const removeFilter = (type: 'category' | 'subcategory' | 'brand', value: string) => {
    if (type === 'category') {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    } else if (type === 'subcategory') {
      setSelectedSubcategories(prev => prev.filter(s => s !== value));
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== value));
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
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading products. Please try again.</div>
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
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>

            {/* Clear Filters Button */}
            {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedBrands.length > 0 || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedBrands.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(categoryId => {
                const cat = categoriesData.find((c: any) => c._id === categoryId);
                return (
                  <span
                    key={categoryId}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                  >
                    {cat ? cat.name : categoryId}
                    <button
                      onClick={() => removeFilter('category', categoryId)}
                      className="ml-1 hover:text-orange-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {selectedSubcategories.map(subId => {
                let subName = subId;
                for (const cat of categoriesData) {
                  const found = cat.children?.find((sub: any) => sub._id === subId);
                  if (found) {
                    subName = found.name;
                    break;
                  }
                }
                return (
                  <span
                    key={subId}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {subName}
                    <button
                      onClick={() => removeFilter('subcategory', subId)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {selectedBrands.map(brandId => {
                const brand = brandsData.find((b: any) => b._id === brandId);
                return (
                  <span
                    key={brandId}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {brand ? brand.name : brandId}
                    <button
                      onClick={() => removeFilter('brand', brandId)}
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
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products?.length || 0} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded ${
                    currentPage === page
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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