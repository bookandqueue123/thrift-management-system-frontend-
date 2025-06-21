"use client"

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { apiUrl, useAuth } from '@/api/hooks/useAuth';
import TransactionsTable from '@/components/Tables';
import Modal from '@/components/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusIndicator } from '@/components/StatusIndicator';
import Image from 'next/image';
import AmountFormatter from '@/utils/AmountFormatter';

interface Promo {
  code?: string;
  percentage?: number;
  status: string;
  startDate?: string;
  endDate?: string;
  minimumPurchase: number;
  maxUsage?: number;
  currentUsage?: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  costBeforeDiscount: number;
  discount: number;
  category: string;
  brand: string;
  sku: string;
  size: number;
  memory: number;
  imageUrl?: string[];
  stock: number;
  promo?: Promo;
}

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  costBeforeDiscount: string;
  discount: string;
  category: string;
  brand: string;
  sku: string;
  size: string;
  memory: string;
  firstProductImage?: File;
  secondProductImage?: File;
  thirdProductImage?: File;
  productImage?: File;
  stock: string;
  promo: {
    code: string;
    percentage: string;
    status: 'active' | 'inactive';
    startDate: string;
    endDate: string;
    minimumPurchase: string;
    maxUsage: string;
  };
};

interface FormErrors {
  general?: string;
}

const Create = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewEditModal, setShowViewEditModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete-confirm' | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const initialFormData: ProductFormData = {
    name: '',
    description: '',
    price: '',
    costBeforeDiscount: '',
    discount: '0',
    category: '',
    brand: '',
    sku: '',
    size: '',
    memory: '',
    firstProductImage: undefined,
    secondProductImage: undefined,
    thirdProductImage: undefined,
    productImage: undefined,
    stock: '',
    promo: {
      code: '',
      percentage: '',
      status: 'active',
      startDate: '',
      endDate: '',
      minimumPurchase: '',
      maxUsage: '',
    },
  };
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [imagePreviews, setImagePreviews] = useState<(string | undefined)[]>([undefined, undefined, undefined]);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<FormErrors>({});


  const { data: products, isLoading, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await client.get('/api/products');
      return res.data;
    },
  });


  const { data: singleProduct, isLoading: isLoadingSingleProduct } = useQuery<Product>({
    queryKey: ['product', selectedProductId],
    queryFn: async () => {
      if (!selectedProductId) return null;
      const res = await client.get(`/api/products/${selectedProductId}`);
      return res.data;
    },
    enabled: !!selectedProductId && (modalType === 'view' || modalType === 'edit'),
  });


  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const form = new FormData();
      form.append('name', data.name);
      form.append('description', data.description);
      form.append('price', data.price);
      form.append('costBeforeDiscount', data.costBeforeDiscount);
      form.append('discount', data.discount);
      form.append('category', data.category);
      form.append('brand', data.brand);
      form.append('sku', data.sku);
      form.append('size', data.size);
      form.append('memory', data.memory);
      form.append('stock', data.stock);
      form.append('promo', JSON.stringify(data.promo));
      if (data.firstProductImage) form.append('firstProductImage', data.firstProductImage);
      if (data.secondProductImage) form.append('secondProductImage', data.secondProductImage);
      if (data.thirdProductImage) form.append('thirdProductImage', data.thirdProductImage);
      return client.post('/api/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowCreateModal(false);
      setFormData(initialFormData);
      setImagePreviews([undefined, undefined, undefined]);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create product.';
      setErrors({ general: errorMessage });
    },
  });

 
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: ProductFormData }) => {
      const form = new FormData();
      form.append('name', data.name);
      form.append('description', data.description);
      form.append('price', data.price);
      form.append('costBeforeDiscount', data.costBeforeDiscount);
      form.append('discount', data.discount);
      form.append('category', data.category);
      form.append('brand', data.brand);
      form.append('sku', data.sku);
      form.append('size', data.size);
      form.append('memory', data.memory);
      form.append('stock', data.stock);
      form.append('promo', JSON.stringify(data.promo));
      if (data.productImage) form.append('productImage', data.productImage);
      return client.put(`/api/products/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowViewEditModal(false);
      setSelectedProductId(null);
      setModalType(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update product.';
      setErrors({ general: errorMessage });
    },
  });

 
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowViewEditModal(false);
      setSelectedProductId(null);
      setModalType(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete product.';
      setErrors({ general: errorMessage });
    },
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (showCreateModal && (name === 'firstProductImage' || name === 'secondProductImage' || name === 'thirdProductImage')) {
      if (files && files.length > 0) {
        const file = files[0];
        setFormData((prev) => ({ ...prev, [name]: file }));
        setImagePreviews((prev) => {
          const idx = name === 'firstProductImage' ? 0 : name === 'secondProductImage' ? 1 : 2;
          const newPreviews = [...prev];
          newPreviews[idx] = URL.createObjectURL(file);
          return newPreviews;
        });
      } else {
        setFormData((prev) => ({ ...prev, [name]: undefined }));
        setImagePreviews((prev) => {
          const idx = name === 'firstProductImage' ? 0 : name === 'secondProductImage' ? 1 : 2;
          const newPreviews = [...prev];
          newPreviews[idx] = undefined;
          return newPreviews;
        });
      }
      return;
    }
    if (showViewEditModal && name === 'productImage') {
      if (files && files.length > 0) {
        const file = files[0];
        setFormData((prev) => ({ ...prev, productImage: file }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setFormData((prev) => ({ ...prev, productImage: undefined }));
        setImagePreview(undefined);
      }
      return;
    }
    if (name === 'costBeforeDiscount' || name === 'discount') {
      const newFormData = { ...formData, [name]: value };
      const cost = parseFloat(name === 'costBeforeDiscount' ? value : newFormData.costBeforeDiscount || '0');
      const disc = parseFloat(name === 'discount' ? value : newFormData.discount || '0');
      let price = '';
      if (!isNaN(cost) && !isNaN(disc)) {
        price = (cost - (cost * disc / 100)).toFixed(2);
      }
      setFormData((prev) => ({ ...prev, [name]: value, price }));
      return;
    }

    if (name.startsWith('promo.')) {
      const promoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        promo: {
          ...prev.promo,
          [promoField]: value,
        },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePromoCodeGeneration = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setFormData((prev) => ({ ...prev, promo: { ...prev.promo, code } }));
  };

 
  const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!formData.name || !formData.description || !formData.price || !formData.costBeforeDiscount || 
        !formData.discount || !formData.category || !formData.brand || !formData.sku || 
        !formData.size || !formData.memory || !formData.stock) {
      setErrors({ general: 'Please fill all required fields.' });
      return;
    }
    createProductMutation.mutate(formData);
  };


  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!selectedProductId || !singleProduct) return;

    if (!formData.name || !formData.description || !formData.price || !formData.costBeforeDiscount || 
        !formData.discount || !formData.category || !formData.brand || !formData.sku || 
        !formData.size || !formData.memory || !formData.stock) {
      setErrors({ general: 'Please fill all required fields.' });
      return;
    }
    updateProductMutation.mutate({ id: selectedProductId, data: formData });
  };

  
  const handleDeleteConfirm = () => {
    if (selectedProductId) {
      deleteProductMutation.mutate(selectedProductId);
    }
  };

  
  const toggleDropdown = (val: number) => {
    if (openDropdown === val) {
      setOpenDropdown(0);
    } else {
      setOpenDropdown(val);
    }
  };


  const headers = [
    'S/N',
    'Name',
    'Description',
    'Price',
    'Discount',
    'Cost Before Discount',
    'SKU',
    'Size',
    'Memory',
    'Category',
    'Brand',
    'Stock',
    'Image',
    'Promo Status',
    'Actions',
  ];

  const paginatedProducts = products ? products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage) : [];
  const totalPages = products ? Math.ceil(products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  ).length / productsPerPage) : 1;

  const openProductModal = (id: string, type: 'view' | 'edit') => {
    setSelectedProductId(id);
    setModalType(type);
    setShowViewEditModal(true);
    if (type === 'edit' && products) {
      const productToEdit = products.find(p => p._id === id);
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          price: String(productToEdit.price),
          costBeforeDiscount: String(productToEdit.costBeforeDiscount),
          discount: String(productToEdit.discount),
          category: productToEdit.category,
          brand: productToEdit.brand,
          sku: productToEdit.sku,
          size: String(productToEdit.size),
          memory: String(productToEdit.memory),
          firstProductImage: undefined,
          secondProductImage: undefined,
          thirdProductImage: undefined,
          productImage: undefined,
          stock: String(productToEdit.stock),
          promo: {
            code: productToEdit.promo?.code || '',
            percentage: productToEdit.promo?.percentage?.toString() || '',
            status: (productToEdit.promo?.status as 'active' | 'inactive') || 'active',
            startDate: productToEdit.promo?.startDate?.split('T')[0] || '',
            endDate: productToEdit.promo?.endDate?.split('T')[0] || '',
            minimumPurchase: productToEdit.promo?.minimumPurchase?.toString() || '0',
            maxUsage: productToEdit.promo?.maxUsage?.toString() || '0',
          },
        });
        setImagePreview(productToEdit.imageUrl && productToEdit.imageUrl[0] ? productToEdit.imageUrl[0] : undefined);
        setImagePreviews([undefined, undefined, undefined]);
      }
    }
  };

  const openDeleteConfirmModal = (id: string) => {
    setSelectedProductId(id);
    setModalType('delete-confirm');
    setShowViewEditModal(true);
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-2 md:px-6 md:py-8 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-ajo_offWhite">Products</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setShowCreateModal(true);
              setFormData(initialFormData);
              setImagePreviews([undefined, undefined, undefined]);
              setErrors({});
            }}
          >
            Create Product
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[27%] rounded-2xl border px-3 py-2 text-black"
          />
        </div>
        {showCreateModal && (
          <Modal title="Create Product" setModalState={setShowCreateModal}>
            <form onSubmit={handleCreateSubmit} className="space-y-4 p-6 border border-gray-700 rounded-lg">
              <div>
                <label className="block text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Price</label>
                <input
                  type="number"
                  name="costBeforeDiscount"
                  value={formData.costBeforeDiscount}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
               <div>
                <label className="block text-white">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Discounted Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  disabled
                  className="w-full rounded border px-3 py-2 text-black bg-gray-200 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Platform Charge %</label>
                <input
                  type="number"
                  name=""
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                 
                />
              </div>
              <div>
                <label className="block text-white">Actaul Price</label>
                <input
                  type="number"
                  name=""
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                 
                />
              </div>
              <div>
                <label className="block text-white">Minimum Deposit Amount</label>
                <input
                  type="number"
                  name=""
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                 
                />
              </div>
              <div>
                <label className="block text-white">Maximum Repayment Timeline</label>
                <input
                  type="number"
                  name=""
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                 
                />
              </div>
              <div>
                <label className="block text-white">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white">Size</label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Memory</label>
                <input
                  type="number"
                  name="memory"
                  value={formData.memory}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx}>
                    <label className="block text-white">Product Image {idx + 1} (optional)</label>
                    {imagePreviews[idx] && (
                      <div className="flex gap-2 mb-2">
                        <img src={imagePreviews[idx]} alt={`Product Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    <input
                      type="file"
                      name={idx === 0 ? 'firstProductImage' : idx === 1 ? 'secondProductImage' : 'thirdProductImage'}
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-600 p-4 rounded-md">
                <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white">Promotion</h3>
                <div className="">
                  <label className="m-0 text-xs font-medium text-white">Promo Code</label>
                  <div className="relative w-full">
                    <input
                      name="promo.code"
                      type="text"
                      value={formData.promo.code}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-500 px-4 py-1 text-sm text-white"
                      onClick={handlePromoCodeGeneration}
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white">Promo Percentage</label>
                  <input
                    type="number"
                    name="promo.percentage"
                    value={formData.promo.percentage}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                 <div>
                  <label className="block text-white">Start Date</label>
                  <input
                    type="date"
                    name="promo.startDate"
                    value={formData.promo.startDate}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                 <div>
                  <label className="block text-white">End Date</label>
                  <input
                    type="date"
                    name="promo.endDate"
                    value={formData.promo.endDate}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                
                 <div>
                  <label className="block text-white">Status</label>
                  <select
                    name="promo.status"
                    value={formData.promo.status}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-white">Minimum Purchase</label>
                  <input
                    type="number"
                    name="promo.minimumPurchase"
                    value={formData.promo.minimumPurchase}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
               
                <div>
                  <label className="block text-white">Max Usage</label>
                  <input
                    type="number"
                    name="promo.maxUsage"
                    value={formData.promo.maxUsage}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                <div>
                <label className="block text-white">Referral Bonus %</label>
                <input
                  type="number"
                  name=""
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                 
                />
              </div>
              </div>
              {errors.general && <div className="text-red-500">{errors.general}</div>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </Modal>
        )}

        {showViewEditModal && (
          <Modal
            title={
              modalType === 'view' ? 'Product Details' :
              modalType === 'edit' ? 'Edit Product' :
              'Confirm Deletion'
            }
            setModalState={setShowViewEditModal}
          >
            {modalType === 'view' && singleProduct && (
              isLoadingSingleProduct ? (
                <div className="text-white p-6">Loading product details...</div>
              ) : (
                <div className="text-white p-6 space-y-4 border border-gray-700 rounded-lg">
                  <h3 className="text-2xl font-bold text-ajo_offWhite mb-4">{singleProduct.name}</h3>
                  {singleProduct.imageUrl && singleProduct.imageUrl.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {singleProduct.imageUrl.map((src, idx) => (
                        <Image key={idx} src={src} alt={singleProduct.name + '-' + idx} width={100} height={100} className="object-cover rounded" />
                      ))}
                    </div>
                  )}
                  <div className="space-y-4">
                    <p className="flex items-start">
                      <span className="w-32 font-semibold text-ajo_offWhite">Description:</span>
                      <span className="flex-1">{singleProduct.description}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">SKU:</span>
                      <span className="flex-1">{singleProduct.sku}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">Price:</span>
                      <span className="flex-1 font-bold text-lg">₦ {AmountFormatter(singleProduct.price)}</span>
                      {singleProduct.discount > 0 && (
                        <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">-{singleProduct.discount}%</span>
                      )}
                      {singleProduct.costBeforeDiscount > singleProduct.price && (
                        <span className="ml-2 text-xs text-gray-400 line-through">₦ {AmountFormatter(singleProduct.costBeforeDiscount)}</span>
                      )}
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">Category:</span>
                      <span className="flex-1">{singleProduct.category}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">Brand:</span>
                      <span className="flex-1">{singleProduct.brand}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">Stock:</span>
                      <span className="flex-1">{singleProduct.stock} items left</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">Size:</span>
                      <span className="flex-1">{singleProduct.size}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 font-semibold text-ajo_offWhite">Memory:</span>
                      <span className="flex-1">{singleProduct.memory}</span>
                    </p>
                    {singleProduct.promo && (
                      <div className="border-t border-gray-600 pt-4 mt-4">
                        <h4 className="text-lg font-semibold text-ajo_offWhite mb-3">Promotion Details</h4>
                        <p className="flex items-center">
                          <span className="w-32 font-semibold text-ajo_offWhite">Status:</span>
                          <span className="flex-1">
                            <span className={singleProduct.promo.status === 'active' 
                              ? 'px-2 py-1 rounded text-xs bg-green-100 text-green-600' 
                              : 'px-2 py-1 rounded text-xs bg-red-100 text-red-600'}>
                              {singleProduct.promo.status}
                            </span>
                          </span>
                        </p>
                        {singleProduct.promo.code && (
                          <p className="flex items-center">
                            <span className="w-32 font-semibold text-ajo_offWhite">Promo Code:</span>
                            <span className="flex-1 font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">{singleProduct.promo.code}</span>
                          </p>
                        )}
                        {singleProduct.promo.percentage && (
                          <p className="flex items-center">
                            <span className="w-32 font-semibold text-ajo_offWhite">Discount:</span>
                            <span className="flex-1">{singleProduct.promo.percentage}%</span>
                          </p>
                        )}
                        {singleProduct.promo.startDate && (
                          <p className="flex items-center">
                            <span className="w-32 font-semibold text-ajo_offWhite">Start Date:</span>
                            <span className="flex-1">{new Date(singleProduct.promo.startDate).toLocaleDateString()}</span>
                          </p>
                        )}
                        {singleProduct.promo.endDate && (
                          <p className="flex items-center">
                            <span className="w-32 font-semibold text-ajo_offWhite">End Date:</span>
                            <span className="flex-1">{new Date(singleProduct.promo.endDate).toLocaleDateString()}</span>
                          </p>
                        )}
                        <p className="flex items-center">
                          <span className="w-32 font-semibold text-ajo_offWhite">Min Purchase:</span>
                          <span className="flex-1">₦ {AmountFormatter(singleProduct.promo.minimumPurchase)}</span>
                        </p>
                        {singleProduct.promo.maxUsage && (
                          <p className="flex items-center">
                            <span className="w-32 font-semibold text-ajo_offWhite">Max Usage:</span>
                            <span className="flex-1">{singleProduct.promo.maxUsage}</span>
                          </p>
                        )}
                        {singleProduct.promo.currentUsage !== undefined && (
                          <p className="flex items-center">
                            <span className="w-32 font-semibold text-ajo_offWhite">Current Usage:</span>
                            <span className="flex-1">{singleProduct.promo.currentUsage}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            {modalType === 'edit' && singleProduct && (
              isLoadingSingleProduct ? (
                <div className="text-white p-6">Loading product for edit...</div>
              ) : (
                <form onSubmit={handleEditSubmit} className="space-y-4 p-6 border border-gray-700 rounded-lg">
                  <div>
                    <label className="block text-white">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      disabled
                      className="w-full rounded border px-3 py-2 text-black bg-gray-200 cursor-not-allowed"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Cost Before Discount</label>
                    <input
                      type="number"
                      name="costBeforeDiscount"
                      value={formData.costBeforeDiscount}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Size</label>
                    <input
                      type="number"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Memory</label>
                    <input
                      type="number"
                      name="memory"
                      value={formData.memory}
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white">Product Image</label>
                    {imagePreview && (
                      <div className="flex gap-2 mb-2">
                        <img src={imagePreview} alt="Product Preview" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    <input
                      type="file"
                      name="productImage"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full rounded border px-3 py-2 text-black"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-600 p-4 rounded-md">
                    <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white">Promotion</h3>
                    <div className="">
                      <label className="m-0 text-xs font-medium text-white">Promo Code</label>
                      <div className="relative w-full">
                        <input
                          name="promo.code"
                          type="text"
                          value={formData.promo.code}
                          onChange={handleInputChange}
                          className="w-full rounded border px-3 py-2 text-black"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-500 px-4 py-1 text-sm text-white"
                          onClick={handlePromoCodeGeneration}
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white">Promo Percentage</label>
                      <input
                        type="number"
                        name="promo.percentage"
                        value={formData.promo.percentage}
                        onChange={handleInputChange}
                        className="w-full rounded border px-3 py-2 text-black"
                      />
                    </div>
                     <div>
                      <label className="block text-white">Status</label>
                      <select
                        name="promo.status"
                        value={formData.promo.status}
                        onChange={handleInputChange}
                        className="w-full rounded border px-3 py-2 text-black"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-white">Start Date</label>
                      <input
                        type="date"
                        name="promo.startDate"
                        value={formData.promo.startDate}
                        onChange={handleInputChange}
                        className="w-full rounded border px-3 py-2 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-white">End Date</label>
                      <input
                        type="date"
                        name="promo.endDate"
                        value={formData.promo.endDate}
                        onChange={handleInputChange}
                        className="w-full rounded border px-3 py-2 text-black"
                      />
                    </div>
                     <div>
                      <label className="block text-white">Minimum Purchase</label>
                      <input
                        type="number"
                        name="promo.minimumPurchase"
                        value={formData.promo.minimumPurchase}
                        onChange={handleInputChange}
                        className="w-full rounded border px-3 py-2 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-white">Max Usage</label>
                      <input
                        type="number"
                        name="promo.maxUsage"
                        value={formData.promo.maxUsage}
                        onChange={handleInputChange}
                        className="w-full rounded border px-3 py-2 text-black"
                      />
                    </div>
                  </div>
                  {errors.general && <div className="text-red-500">{errors.general}</div>}
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                    disabled={updateProductMutation.isPending}
                  >
                    {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
                  </button>
                </form>
              )
            )}
            {modalType === 'delete-confirm' && (
              <div className="text-white p-6 border border-gray-700 rounded-lg">
                <p className="mb-4">Are you sure you want to delete this product?</p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => setShowViewEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleDeleteConfirm}
                    disabled={deleteProductMutation.isPending}
                  >
                    {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </Modal>
        )}
        <div className="mt-8">
          <TransactionsTable
            headers={headers}
            content={
              isLoading ? (
                <tr><td colSpan={headers.length} className="text-center text-white">Loading products...</td></tr>
              ) : paginatedProducts && paginatedProducts.length > 0 ? (
                paginatedProducts.map((product: Product, idx: number) => (
                  <tr key={product._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * productsPerPage + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-lg">₦ {AmountFormatter(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.discount}%</td>
                    <td className="px-6 py-4 whitespace-nowrap line-through text-gray-400">₦ {AmountFormatter(product.costBeforeDiscount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.memory}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock} items left</td>
                    <td className="px-6 py-4">
                      {product.imageUrl && product.imageUrl.length > 0 ? (
                        <Image src={product.imageUrl[0]} alt={product.name + '-0'} width={50} height={50} className="object-cover rounded" />
                      ) : (
                        <div className="flex justify-center">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.promo ? (
                        <span className={product.promo.status === 'active' 
                          ? 'px-2 py-1 rounded text-xs bg-green-100 text-green-600' 
                          : 'px-2 py-1 rounded text-xs bg-red-100 text-red-600'}>
                          {product.promo.status}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No Promo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <StatusIndicator
                        label="Actions"
                        dropdownEnabled
                        clickHandler={() => toggleDropdown((currentPage - 1) * productsPerPage + idx + 1)}
                        openDropdown={openDropdown}
                        toggleDropdown={toggleDropdown}
                        currentIndex={(currentPage - 1) * productsPerPage + idx + 1}
                        dropdownContents={{
                          labels: ['View Product', 'Edit Product', 'Delete Product'],
                          actions: [
                            () => openProductModal(product._id, 'view'),
                            () => openProductModal(product._id, 'edit'),
                            () => openDeleteConfirmModal(product._id),
                          ],
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={headers.length} className="text-center text-white">No products found.</td></tr>
              )
            }
          />
        </div>
      </div>
      {/* Pagination below the container */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Create;