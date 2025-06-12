


"use client";
import React, { useState, useMemo } from 'react';
import { Search, Star, Heart, ShoppingCart, Grid, Filter, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Type Definitions
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
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
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
  onCategoryChange, 
  onSubcategoryChange 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Electronic Devices': true
  });

  const categories: Category[] = [
    { name: 'Electronic Devices', subcategories: [
      'COMPUTER & LAPTOP',
      'COMPUTER ACCESSORIES', 
      'SMARTPHONE',
      'HEADPHONE',
      'MOBILE ACCESSORIES',
      'GAMING CONSOLE',
      'CAMERA & PHOTO',
      'TV & HOMES APPLIANCES',
      'WATCHES & ACCESSORIES',
      'GPS & NAVIGATION',
      'WARABLE TECHNOLOGY',
      'TOZO T6 TRUE WIRELESS EARBUDS BLUETOOTH HEADPHONE'
    ]},
    { name: 'Home & Garden', subcategories: [
      'FURNITURE',
      'HOME DECOR',
      'KITCHEN APPLIANCES',
      'CLEANING SUPPLIES',
      'GARDEN TOOLS'
    ]},
    { name: 'Fashion', subcategories: [
      'CLOTHING',
      'SHOES',
      'ACCESSORIES',
      'JEWELRY',
      'BAGS'
    ]}
  ];

  const priceRanges: string[] = [
    'ALL PRICE',
    'UNDER $20',
    '$25 TO $100',
    '$100 TO $300',
    '$300 TO $500',
    '$500 TO $1,000',
    '$1,000 TO $10,000'
  ];

  const brands: Brand[] = [
    { name: 'APPLE', checked: true },
    { name: 'GOOGLE', checked: true },
    { name: 'MICROSOFT', checked: false },
    { name: 'SAMSUNG', checked: false },
    { name: 'DELL', checked: false },
    { name: 'HP', checked: true },
    { name: 'SYMPHONY', checked: false },
    { name: 'XIAOMI', checked: false },
    { name: 'SONY', checked: false },
    { name: 'PANASONIC', checked: true },
    { name: 'LG', checked: false },
    { name: 'INTEL', checked: false },
    { name: 'ONE PLUS', checked: false }
  ];

  const tags: string[] = [
    'GAME', 'IPHONE', 'TV',
    'ASUS LAPTOPS', 'MACBOOK',
    'SSD', 'GRAPHICS CARD',
    'POWER BANK', 'SMART TV',
    'SPEAKER', 'TABLET',
    'MICROWAVE', 'SAMSUNG'
  ];

  const toggleCategory = (categoryName: string): void => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

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
            {categories.map((category) => (
              <div key={category.name} className="mb-3">
                 <div 
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
                    category.name === 'Electronic Devices' 
                      ? 'bg-[#EAAB40] text-white' 
                      : selectedCategories.includes(category.name) 
                        ? 'bg-orange-400 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleCategory(category.name)}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${
                    expandedCategories[category.name] ? 'rotate-180' : ''
                  }`} />
                </div>
           
                <label className="flex items-center mt-2 px-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => onCategoryChange(category.name)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm text-gray-600">Select entire category</span>
                </label>

                {expandedCategories[category.name] && (
                  <div className="mt-2 space-y-1">
                    {category.subcategories.map((sub) => (
                      <label key={sub} className="flex items-center pl-6 py-1 cursor-pointer hover:bg-gray-50">
                        <input 
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub)}
                          onChange={() => onSubcategoryChange(sub)}
                          className="mr-2 rounded text-orange-400"
                        />
                        <span className={`text-sm ${
                          selectedSubcategories.includes(sub) 
                            ? 'text-orange-600 font-medium' 
                            : 'text-gray-600'
                        }`}>
                          {sub}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">PRICE RANGE</h3>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-2 bg-gray-200 rounded-full flex-1 relative">
                  <div className="absolute left-1/4 w-1/2 h-full bg-orange-400 rounded-full"></div>
                  <div className="absolute left-1/4 w-3 h-3 bg-orange-400 rounded-full -top-0.5 border-2 border-white"></div>
                  <div className="absolute right-1/4 w-3 h-3 bg-orange-400 rounded-full -top-0.5 border-2 border-white"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="MIN PRICE" 
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <input 
                  type="text" 
                  placeholder="MAX PRICE" 
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range} className="flex items-center space-x-2 text-sm">
                  <input type="radio" name="price" className="text-orange-400" />
                  <span className="text-gray-600">{range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">POPULAR BRANDS</h3>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <label key={brand.name} className="flex items-center space-x-2 text-xs">
                  <input 
                    type="checkbox" 
                    defaultChecked={brand.checked}
                    className="text-orange-400 rounded"
                  />
                  <span className={brand.checked ? 'text-orange-400' : 'text-gray-600'}>
                    {brand.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">POPULAR TAG</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full cursor-pointer hover:bg-orange-100 hover:text-orange-600"
                >
                  {tag}
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
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-gray-300" />);
      }
    }
    return stars;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow relative">
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold z-10 ${
          product.badge === 'HOT' ? 'bg-red-500 text-white' :
          product.badge === 'SALE' ? 'bg-green-500 text-white' :
          product.badge === '25% OFF' ? 'bg-yellow-500 text-white' :
          'bg-gray-800 text-white'
        }`}>
          {product.badge}
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative mb-3">
            <Link href={`/product/${product.id}`} className="block w-full h-32">
          <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
            {!imageError ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 text-xs text-center p-2">
                <div className="text-2xl mb-1">📷</div>
                <div>Image not found</div>
              </div>
            )}
          </div>
        </Link>
        {/* <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 text-xs text-center p-2">
              <div className="text-2xl mb-1">📷</div>
              <div>Image not found</div>
            </div>
          )}
        </div> */}
        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50">
          <Heart className="h-4 w-4 text-gray-400" />
        </button>
        <button className="absolute bottom-2 right-2 p-1 bg-orange-400 text-white rounded-full hover:bg-orange-500">
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-2">
        {renderStars(product.rating)}
        <span className="text-xs text-gray-500">({product.reviews})</span>
      </div>

      {/* Product Name */}
     <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
        <Link href={`/product/${product.id}`} className="hover:underline">
          {product.name}
        </Link>
      </h3>

      {/* Price */}
      <div className="text-lg font-bold text-orange-600">
        ${product.price}
      </div>

      {/* Category Badge */}
      <div className="mt-2">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {product.subcategory}
        </span>
      </div>
    </div>
  );
};

// Main Component
const MarketplaceInterface: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const products: Product[] = [
    {
      id: 1,
      name: "WIRED OVER-EAR GAMING HEADPHONES WITH USB",
      rating: 4.5,
      reviews: 324,
      image: "/market/Image8.png",
      badge: null,
      category: "Electronic Devices",
      subcategory: "HEADPHONE",
      price: 79.99
    },
    {
      id: 2,
      name: "POLAROID 57-INCH PHOTO/VIDEO TRIPOD WITH DELUXE TRIPOD",
      rating: 4.0,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      badge: "25% OFF",
      category: "Electronic Devices",
      subcategory: "CAMERA & PHOTO",
      price: 149.99
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
      price: 1299.99
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
      price: 599.99
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
      price: 29.99
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
      price: 799.99
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
      price: 12.99
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
      price: 289.99
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
      price: 45.99
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
  ];

  // Filter products based on selected categories, subcategories, and search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);

      // Subcategory filter
      const matchesSubcategory = selectedSubcategories.length === 0 || 
        selectedSubcategories.includes(product.subcategory);

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [products, selectedCategories, selectedSubcategories, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSearchQuery('');
  };

  const removeFilter = (type: 'category' | 'subcategory', value: string) => {
    if (type === 'category') {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    } else {
      setSelectedSubcategories(prev => prev.filter(s => s !== value));
    }
  };

  const totalPages: number = Math.ceil(filteredProducts.length / 8);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  // Get products for current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * 8,
    currentPage * 8
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          selectedCategories={selectedCategories}
          selectedSubcategories={selectedSubcategories}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
        />
        
        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Search and Filter Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="SEARCH FOR ANYTHING..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Sort and Filter */}
              <div className="flex items-center space-x-4">
                <button 
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">SORT BY:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>MOST POPULAR</option>
                    <option>PRICE: LOW TO HIGH</option>
                    <option>PRICE: HIGH TO LOW</option>
                    <option>NEWEST</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Active Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">ACTIVE FILTERS:</span>
              
              {/* Category Filters */}
              {selectedCategories.map(category => (
                <span 
                  key={category}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center"
                >
                  {category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('category', category)}
                  />
                </span>
              ))}
              
              {/* Subcategory Filters */}
              {selectedSubcategories.map(subcategory => (
                <span 
                  key={subcategory}
                  className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full flex items-center"
                >
                  {subcategory}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter('subcategory', subcategory)}
                  />
                </span>
              ))}
              
              {/* Clear All Button */}
              {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200"
                >
                  Clear All
                </button>
              )}
              
              <span className="text-sm text-gray-600 ml-auto">
                {filteredProducts.length} RESULTS FOUND.
              </span>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button 
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 rounded-full text-sm font-medium ${
                          page === currentPage
                            ? 'bg-orange-400 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceInterface;