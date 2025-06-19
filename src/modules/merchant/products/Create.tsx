"use client"

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { apiUrl, useAuth } from '@/api/hooks/useAuth';
import TransactionsTable from '@/components/Tables';
import Modal from '@/components/Modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusIndicator } from '@/components/StatusIndicator';
import Image from 'next/image';
import AmountFormatter from '@/utils/AmountFormatter';

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
}

interface ProductFormData {
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
  images: File[];
  stock: string;
}

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

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    costBeforeDiscount: '',
    discount: '',
    category: '',
    brand: '',
    sku: '',
    size: '',
    memory: '',
    images: [],
    stock: '',
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
      if (data.images && data.images.length > 0) {
        const imageFields = ['firstProductImage', 'secondProductImage', 'thirdProductImage'];
        data.images.slice(0, 3).forEach((img, index) => {
          form.append(imageFields[index], img);
        });
      }
      return client.post('/api/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowCreateModal(false);
      setFormData({
        name: '', description: '', price: '', costBeforeDiscount: '', discount: '', category: '', brand: '', sku: '', size: '', memory: '', images: [], stock: ''
      });
      setImagePreviews([]);
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
      if (data.images && data.images.length > 0) {
        const imageFields = ['firstProductImage', 'secondProductImage', 'thirdProductImage'];
        data.images.slice(0, 3).forEach((img, index) => {
          form.append(imageFields[index], img);
        });
      }
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'images' && files && files.length > 0) {
      const fileArr = Array.from(files);
      if (fileArr.length > 3) {
        setErrors({ general: 'Maximum 3 images allowed.' });
        return;
      }
      setFormData((prev) => ({ ...prev, images: fileArr }));
      setImagePreviews(fileArr.map(file => URL.createObjectURL(file)));
      setErrors({}); // Clear any previous errors
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

 
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    'Category',
    'Brand',
    'Stock',
    'Image',
    'Actions',
  ];

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
          images: [],
          stock: String(productToEdit.stock),
        });
        setImagePreviews(productToEdit.imageUrl ? productToEdit.imageUrl : []);
      }
    }
  };

  const openDeleteConfirmModal = (id: string) => {
    setSelectedProductId(id);
    setModalType('delete-confirm');
    setShowViewEditModal(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-2 md:px-6 md:py-8 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-ajo_offWhite">Products</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setShowCreateModal(true);
            setFormData({
              name: '', description: '', price: '', costBeforeDiscount: '', discount: '', category: '', brand: '', sku: '', size: '', memory: '', images: [], stock: ''
            });
            setImagePreviews([]);
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
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2 text-black"
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
              <label className="block text-white">Product Images (Max 3 images)</label>
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Product Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              )}
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2 text-black"
              />
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
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
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
                <label className="block text-white">Product Images (Max 3 images)</label>
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {imagePreviews.map((src, idx) => (
                      <img key={idx} src={src} alt={`Product Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
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
            ) : products && products.length > 0 ? (
              products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((product: Product, idx: number) => (
                <tr key={product._id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-lg">₦ {AmountFormatter(product.price)}</span>
                    {product.discount > 0 && (
                      <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">-{product.discount}%</span>
                    )}
                    {product.costBeforeDiscount > product.price && (
                      <span className="block text-xs text-gray-400 line-through">₦ {AmountFormatter(product.costBeforeDiscount)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock} items left</td>
                   <td className="px-6 py-4">
    {product.imageUrl && product.imageUrl.length > 0 ? (
      <div className="flex gap-2">
        {product.imageUrl.map((src, idx) => (
          <Image key={idx} src={src} alt={product.name + '-' + idx} width={50} height={50} className="object-cover rounded" />
        ))}
      </div>
    ) : (
      <div className="flex justify-center">
        <span className="text-xs text-gray-400">No Image</span>
      </div>
    )}
  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <StatusIndicator
                      label="Actions"
                      dropdownEnabled
                      clickHandler={() => toggleDropdown(idx + 1)}
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      currentIndex={idx + 1}
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
  );
};

export default Create;