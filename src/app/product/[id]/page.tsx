"use client";
import React, { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";
import Navbar from "@/modules/HomePage/NavBar";
import Footer from "@/modules/HomePage/Footer";

/** Updated Product interface to match API response **/
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl?: string;
  stock: number;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  subcategory?: string;
}

/** Helper that returns an array of star icons **/
function renderStars(rating: number = 4.5) {
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
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch single product
  const { data: product, isLoading: isLoadingProduct, error } = useQuery<Product>({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const res = await client.get(`/api/products/${params.id}`);
      return res.data;
    },
    enabled: !!params.id,
  });

  // Fetch all products for similar products
  const { data: allProducts, isLoading: isLoadingAllProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await client.get('/api/products');
      return res.data;
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await client.post('/api/cart', {
        productId,
        quantity: quantity.toString()
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate cart query to refresh cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Navigate to cart page
      router.push('/cart');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      // You can add toast notification here
    }
  });

  // Handle loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center justify-center h-64">
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

  // Pick up to 5 "similar" products in the same category
  const similarProducts = allProducts?.filter(
    (p) => p.category === product.category && p._id !== product._id
  ).slice(0, 5) || [];

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Handler for Add to Cart button
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCartMutation.mutateAsync({
        productId: product._id,
        quantity: quantity
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/market-place"
            className="text-sm text-gray-600 hover:underline"
          >
            &larr; Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Large Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
            <div className="relative w-full h-80 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-lg">No image available</div>
              )}
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
            {/* Rating - Commented out since rating is not available yet */}
            {/* <div className="flex items-center space-x-2">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500">
                ({product.reviews || 0} reviews)
              </span>
            </div> */}

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-orange-600">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {/* Brand */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Brand:
                </h3>
                <p className="text-gray-800">{product.brand}</p>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Category:
                </h3>
                <p className="text-gray-800">{product.category}</p>
              </div>

              {/* Stock */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Stock:
                </h3>
                <p className="text-gray-800">{product.stock} units available</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Description:
                </h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {product.description}
                </p>
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
    disabled={isAddingToCart || addToCartMutation.isPending}
    className="h-12 px-6 bg-[#fedc57] text-white rounded-lg font-medium hover:bg-yellow-500 transition flex items-center justify-center sm:flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <ShoppingCart className="h-5 w-5 mr-2" />
    {isAddingToCart || addToCartMutation.isPending ? "Adding..." : "Add to cart"}
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
              {product.description}
            </p>

            {/* Product Specifications */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Product Specifications
              </h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Brand: {product.brand}</li>
                <li>• Category: {product.category}</li>
                <li>• Stock Available: {product.stock} units</li>
                <li>• Price: ${product.price.toFixed(2)}</li>
              </ul>
            </div>

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
                  <strong>Vendor Name:</strong> {product.brand}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Product ID:</strong> {product._id}
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
                  key={p._id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition"
                >
                  <Link
                    href={`/product/${p._id}`}
                    className="block"
                  >
                    <div className="relative w-full h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-2">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs">No image</div>
                      )}
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