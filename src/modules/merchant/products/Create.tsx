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
  stock: string;
  price: string;
  category: string;
  brand: string;
  tags?: string[];
  costBeforeDiscount?: string;
  discount?: string;
  sku?: string;
  size?: string;
  memory?: string;
  firstProductImage?: File;
  secondProductImage?: File;
  thirdProductImage?: File;
  productImage?: File;
  maximumRepaymentTimeline?: string;
  repaymentPeriodInMonths?: string;
  mininumRepaymentAmount?: string;
  mininumDepositPercentage?: string;
  interestRatePercentage?: string;
  platformFee?: string;
  doorDeliveryTerms?: string;
  pickupTerms?: string;
  doorDeliveryTermsAndCondition?: string;
  pickupCentreTermsAndCondition?: string;
  storageOutdoor?: {
    height?: string;
    length?: string;
    breadth?: string;
  };
  storageRefrigerated?: {
    height?: string;
    length?: string;
    breadth?: string;
  };
  promo?: {
    code?: string;
    percentage?: string;
    status?: 'active' | 'inactive';
    startDate?: string;
    endDate?: string;
    minimumPurchase?: string;
    maxUsage?: string;
  };
};

interface FormErrors {
  general?: string;
}

// Utility function to sanitize form data before sending to backend
const sanitizeProductFormData = (data: ProductFormData) => {
  const sanitized: any = { ...data };

  // Convert empty string or 'null' to undefined for number fields
  const numberFields = [
    'discount',
    'size',
    'memory',
    'costBeforeDiscount',
    'price',
    'maximumRepaymentTimeline',
    'repaymentPeriodInMonths',
    'mininumRepaymentAmount',
    'mininumDepositPercentage',
    'interestRatePercentage',
    'platformFee',
    'promo.percentage',
    'promo.minimumPurchase',
    'promo.maxUsage',
    'stock',
  ];

  numberFields.forEach((field) => {
    // Handle nested promo fields
    if (field.startsWith('promo.')) {
      const promoField = field.split('.')[1];
      if (
        sanitized.promo &&
        (sanitized.promo[promoField] === '' || sanitized.promo[promoField] === 'null' || sanitized.promo[promoField] === undefined)
      ) {
        delete sanitized.promo[promoField];
      }
    } else {
      if (sanitized[field] === '' || sanitized[field] === 'null' || sanitized[field] === undefined) {
        delete sanitized[field];
      }
    }
  });

  // Remove promo if all fields are empty, '0', or 'inactive'
  if (sanitized.promo) {
    const promoFields = Object.entries(sanitized.promo).filter(
      ([key, v]) => {
        if (v === '' || v === undefined || v === 'null') return false;
        if (key === 'status' && v === 'inactive') return false;
        if ((key === 'percentage' || key === 'minimumPurchase' || key === 'maxUsage') && (v === '0' || v === 0)) return false;
        return true;
      }
    );
    if (promoFields.length === 0) {
      delete sanitized.promo;
    }
  }

  // Remove brand/category if not selected
  if (!sanitized.brand) delete sanitized.brand;
  if (!sanitized.category) delete sanitized.category;

  return sanitized;
};

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialFormData: ProductFormData = {
    name: '',
    description: '',
    stock: '',
    price: '',
    category: '',
    brand: '',
    tags: [],
  };
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [imagePreviews, setImagePreviews] = useState<(string | undefined)[]>([undefined, undefined, undefined]);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<FormErrors>({});
  const [platformChargeValue, setPlatformChargeValue] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [minimumDepositValue, setMinimumDepositValue] = useState('');

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
  
  const { data: brandsData, isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await client.get('/api/brands', { params: { t: Date.now() } });
      return res.data.data;
    },
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await client.get('/api/products-categories');
      return res.data.data;
    },
  });

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await client.get('/api/tags');
      return res.data.data;
    },
  });

  const { data: platformChargeData, isLoading: isLoadingPlatformCharge } = useQuery({
    queryKey: ['platform-charge'],
    queryFn: async () => {
      const res = await client.get('/api/platform-charge');
      return res.data;
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const sanitizedData = sanitizeProductFormData(data);
      const form = new FormData();
      form.append('name', sanitizedData.name);
      form.append('description', sanitizedData.description);
      form.append('price', sanitizedData.price || '');
      form.append('costBeforeDiscount', sanitizedData.costBeforeDiscount || '');
      form.append('discount', sanitizedData.discount || '');
      form.append('category', sanitizedData.category || '');
      form.append('brand', sanitizedData.brand || '');
      form.append('sku', sanitizedData.sku || '');
      form.append('size', sanitizedData.size || '');
      form.append('memory', sanitizedData.memory || '');
      form.append('stock', sanitizedData.stock);
     
      form.append('maximumRepaymentTimeline', sanitizedData.maximumRepaymentTimeline || '');
      form.append('repaymentPeriodInMonths', sanitizedData.repaymentPeriodInMonths || '');
      form.append('mininumRepaymentAmount', sanitizedData.mininumRepaymentAmount || '');
      form.append('mininumDepositPercentage', sanitizedData.mininumDepositPercentage || '');
      form.append('interestRatePercentage', sanitizedData.interestRatePercentage || '');
      form.append('platformFee', sanitizedData.platformFee || '');
      form.append('doorDeliveryTerms', sanitizedData.doorDeliveryTerms || '');
      form.append('pickupTerms', sanitizedData.pickupTerms || '');
      form.append('doorDeliveryTermsAndCondition', sanitizedData.doorDeliveryTermsAndCondition || '');
      form.append('pickupCentreTermsAndCondition', sanitizedData.pickupCentreTermsAndCondition || '');
      form.append('storageOutdoor', JSON.stringify(sanitizedData.storageOutdoor || {}));
      form.append('storageRefrigerated', JSON.stringify(sanitizedData.storageRefrigerated || {}));
      if (sanitizedData.promo) {
        form.append('promo', JSON.stringify(sanitizedData.promo));
      }
      if (sanitizedData.tags && sanitizedData.tags.length > 0) {
        form.append('tags', JSON.stringify(sanitizedData.tags));
      }
      if (sanitizedData.firstProductImage) form.append('firstProductImage', sanitizedData.firstProductImage);
      if (sanitizedData.secondProductImage) form.append('secondProductImage', sanitizedData.secondProductImage);
      if (sanitizedData.thirdProductImage) form.append('thirdProductImage', sanitizedData.thirdProductImage);
      return client.post('/api/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowCreateModal(false);
      setFormData(initialFormData);
      setImagePreviews([undefined, undefined, undefined]);
      setSuccessMessage('Product created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create product.';
      setErrors({ general: errorMessage });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: ProductFormData }) => {
      const sanitizedData = sanitizeProductFormData(data);
      const form = new FormData();
      form.append('name', sanitizedData.name);
      form.append('description', sanitizedData.description);
      form.append('price', sanitizedData.price || '');
      form.append('costBeforeDiscount', sanitizedData.costBeforeDiscount || '');
      form.append('discount', sanitizedData.discount || '');
      form.append('category', sanitizedData.category || '');
      form.append('brand', sanitizedData.brand || '');
      form.append('sku', sanitizedData.sku || '');
      form.append('size', sanitizedData.size || '');
      form.append('memory', sanitizedData.memory || '');
      form.append('stock', sanitizedData.stock);
      
      form.append('maximumRepaymentTimeline', sanitizedData.maximumRepaymentTimeline || '');
      form.append('repaymentPeriodInMonths', sanitizedData.repaymentPeriodInMonths || '');
      form.append('minimumRepaymentAmount', sanitizedData.mininumRepaymentAmount || '');
      form.append('mininumDepositPercentage', sanitizedData.mininumDepositPercentage|| '');
      form.append('interestRatePercentage', sanitizedData.interestRatePercentage || '');
      form.append('platformFee', sanitizedData.platformFee || '');
      form.append('doorDeliveryTerms', sanitizedData.doorDeliveryTerms || '');
      form.append('pickupTerms', sanitizedData.pickupTerms || '');
      form.append('doorDeliveryTermsAndCondition', sanitizedData.doorDeliveryTermsAndCondition || '');
      form.append('pickupCentreTermsAndCondition', sanitizedData.pickupCentreTermsAndCondition || '');
      form.append('storageOutdoor', JSON.stringify(sanitizedData.storageOutdoor || {}));
      form.append('storageRefrigerated', JSON.stringify(sanitizedData.storageRefrigerated || {}));
      if (sanitizedData.promo) {
        form.append('promo', JSON.stringify(sanitizedData.promo));
      }
      if (sanitizedData.tags && sanitizedData.tags.length > 0) {
        form.append('tags', JSON.stringify(sanitizedData.tags));
      }
      // For update, send all three images if present
      if (sanitizedData.firstProductImage) form.append('firstProductImage', sanitizedData.firstProductImage);
      if (sanitizedData.secondProductImage) form.append('secondProductImage', sanitizedData.secondProductImage);
      if (sanitizedData.thirdProductImage) form.append('thirdProductImage', sanitizedData.thirdProductImage);
      return client.put(`/api/products/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSuccessMessage('Product updated successfully!');
      setTimeout(() => {
        setShowViewEditModal(false);
        setSelectedProductId(null);
        setModalType(null);
        setSuccessMessage(null);
      }, 1000);
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
    if ((showCreateModal || showViewEditModal) && (name === 'firstProductImage' || name === 'secondProductImage' || name === 'thirdProductImage')) {
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
    if (name === 'costBeforeDiscount' || name === 'discount' || name === 'interestRatePercentage') {
      const newFormData = { ...formData, [name]: value };
      const cost = parseFloat(newFormData.costBeforeDiscount || '0');
      const disc = parseFloat(newFormData.discount || '0');
      const interest = parseFloat(newFormData.interestRatePercentage || '0');
      let price = '';
      if (!isNaN(cost) && !isNaN(disc)) {
        price = (cost - (cost * disc / 100)).toFixed(2);
      }
      setFormData((prev) => ({ ...prev, [name]: value, price }));
      const platformPercent = parseFloat(platformChargeData?.data?.percentage || '0');
      const discountedPrice = parseFloat(price || '0');
      const platformCharge = !isNaN(platformPercent) && !isNaN(discountedPrice) ? ((platformPercent / 100) * discountedPrice) : 0;
      const interestAmount = !isNaN(interest) && !isNaN(discountedPrice) ? ((interest / 100) * discountedPrice) : 0;
      setPlatformChargeValue(platformCharge.toFixed(2));
      setActualPrice((discountedPrice + platformCharge + interestAmount).toFixed(2));
      const minDepositPercent = parseFloat(formData.mininumDepositPercentage || '0');
      const minDepositValue = !isNaN(minDepositPercent) && !isNaN(discountedPrice)
        ? ((minDepositPercent / 100) * (discountedPrice + platformCharge + interestAmount))
        : 0;
      setMinimumDepositValue(minDepositValue.toFixed(2));
      return;
    }
    if (name === 'mininumDepositPercentage') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const minDepositPercent = parseFloat(value);
      const discountedPrice = parseFloat(formData.price || '0');
      const platformPercent = parseFloat(platformChargeData?.data?.percentage || '0');
      const interest = parseFloat(formData.interestRatePercentage || '0');
      const platformCharge = !isNaN(platformPercent) && !isNaN(discountedPrice) ? ((platformPercent / 100) * discountedPrice) : 0;
      const interestAmount = !isNaN(interest) && !isNaN(discountedPrice) ? ((interest / 100) * discountedPrice) : 0;
      const actual = discountedPrice + platformCharge + interestAmount;
      const minDepositValue = !isNaN(minDepositPercent) && !isNaN(actual) ? ((minDepositPercent / 100) * actual) : 0;
      setMinimumDepositValue(minDepositValue.toFixed(2));
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
    if (name.startsWith('storageOutdoor.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        storageOutdoor: { ...prev.storageOutdoor, [field]: value },
      }));
      return;
    }
    if (name.startsWith('storageRefrigerated.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        storageRefrigerated: { ...prev.storageRefrigerated, [field]: value },
      }));
      return;
    }
    if (name === 'tags') {
      // Handle multiple select for tags
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
      setFormData((prev) => ({ ...prev, tags: selectedOptions }));
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
    if (!formData.name || !formData.description || !formData.stock || !formData.price || !formData.category || !formData.brand) {
      setErrors({ general: 'Please fill all required fields (name, description, stock, price, category, and brand).' });
      return;
    }
    createProductMutation.mutate(formData);
  };

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!selectedProductId || !singleProduct) return;
    if (!formData.name || !formData.description || !formData.stock || !formData.price || !formData.category || !formData.brand) {
      setErrors({ general: 'Please fill all required fields (name, description, stock, price, category, and brand).' });
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
    'Repayment Period (Months)',
    'Interest Rate %',
    'Platform Fee',
    'Door Delivery Terms & Condition',
    'Pickup Centre Terms & Condition',
    'Image',
    'Promo Status',
    'Actions',
  ];

  // Helper to get brand name for search and display
  const getBrandName = (brand: any) => {
    if (!brand) return '';
    if (typeof brand === 'object' && brand !== null) {
      return brand.name || '';
    }
    // For display, try to find the name from brandsData if it's an id
    const found = brandsData?.find((b: any) => b._id === brand);
    return found?.name || brand;
  };

  const paginatedProducts = products ? products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getBrandName(product.brand).toLowerCase().includes(searchQuery.toLowerCase())
  ).slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage) : [];
  const totalPages = products ? Math.ceil(products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getBrandName(product.brand).toLowerCase().includes(searchQuery.toLowerCase())
  ).length / productsPerPage) : 1;

  const openProductModal = (id: string, type: 'view' | 'edit') => {
    setSelectedProductId(id);
    setModalType(type);
    setShowViewEditModal(true);
    if (type === 'edit' && products) {
      const productToEdit = products.find(p => p._id === id);
      if (productToEdit) {
        // Robustly find category ID
        let categoryId = '';
        const cats: any[] = categoriesData || [];
        if (typeof productToEdit.category === 'object' && productToEdit.category !== null) {
          categoryId = (productToEdit.category as any)._id || '';
        } else if (typeof productToEdit.category === 'string') {
          const foundCat = cats.find((cat) => cat._id === productToEdit.category || cat.name === productToEdit.category);
          categoryId = foundCat?._id || productToEdit.category;
        }

        // Robustly find brand ID
        let brandId = '';
        const brands: any[] = brandsData || [];
        if (typeof productToEdit.brand === 'object' && productToEdit.brand !== null) {
          brandId = (productToEdit.brand as any)._id || '';
        } else if (typeof productToEdit.brand === 'string') {
          const foundBrand = brands.find((brand) => brand._id === productToEdit.brand || brand.name === productToEdit.brand);
          brandId = foundBrand?._id || productToEdit.brand;
        }

        // Find tag IDs by names (assuming product has tags array)
        const tagIds = (productToEdit as any).tags ? 
          (productToEdit as any).tags.map((tagName: string) => {
            const tag = tagsData?.find((t: any) => t.name === tagName || t._id === tagName);
            return tag?._id || tagName;
          }) : [];

        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          price: String(productToEdit.price),
          costBeforeDiscount: String(productToEdit.costBeforeDiscount),
          discount: String(productToEdit.discount),
          category: categoryId,
          brand: brandId,
          sku: productToEdit.sku,
          size: String(productToEdit.size),
          memory: String(productToEdit.memory),
          firstProductImage: undefined,
          secondProductImage: undefined,
          thirdProductImage: undefined,
          productImage: undefined,
          stock: String(productToEdit.stock),
          maximumRepaymentTimeline: (productToEdit as any).maximumRepaymentTimeline?.toString() || '',
          repaymentPeriodInMonths: (productToEdit as any).repaymentPeriodInMonths?.toString() || '',
          mininumRepaymentAmount: (productToEdit as any).mininumRepaymentAmount?.toString() || '',
          mininumDepositPercentage: (productToEdit as any).mininumDepositPercentage?.toString() || '',
          interestRatePercentage: (productToEdit as any).interestRatePercentage?.toString() || '',
          platformFee: (productToEdit as any).platformFee?.toString() || '',
          doorDeliveryTerms: (productToEdit as any).doorDeliveryTerms || '',
          pickupTerms: (productToEdit as any).pickupTerms || '',
          doorDeliveryTermsAndCondition: (productToEdit as any).doorDeliveryTermsAndCondition || '',
          pickupCentreTermsAndCondition: (productToEdit as any).pickupCentreTermsAndCondition || '',
          storageOutdoor: (productToEdit as any).storageOutdoor || { height: '', length: '', breadth: '' },
          storageRefrigerated: (productToEdit as any).storageRefrigerated || { height: '', length: '', breadth: '' },
          promo: {
            code: productToEdit.promo?.code || '',
            percentage: productToEdit.promo?.percentage?.toString() || '',
            status: (productToEdit.promo?.status as 'active' | 'inactive') || 'active',
            startDate: productToEdit.promo?.startDate?.split('T')[0] || '',
            endDate: productToEdit.promo?.endDate?.split('T')[0] || '',
            minimumPurchase: productToEdit.promo?.minimumPurchase?.toString() || '0',
            maxUsage: productToEdit.promo?.maxUsage?.toString() || '0',
          },
          tags: tagIds,
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

  const getCategoryName = (category: any) => {
    if (!category) return 'N/A';
    if (typeof category === 'object' && category !== null) {
      return category.name || category._id || 'N/A';
    }
    const found = categoriesData?.find((cat: any) => cat._id === category);
    return found?.name || category;
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-2 md:px-6 md:py-8 lg:px-8">
        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 text-center">
            {successMessage}
          </div>
        )}
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
        {showCreateModal ? (
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
                <label className="block text-white">Discount (%) (optional)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Discounted Price (optional)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  disabled
                  className="w-full rounded border px-3 py-2 text-black bg-gray-200 cursor-not-allowed"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="platformFee" className="block text-sm font-medium text-white">Platform Charge %</label>
                <input
                  type="number"
                  id="platformFee"
                  name="platformFee"
                  value={platformChargeData?.data?.percentage || ''}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed sm:text-sm"
                />
                {isLoadingPlatformCharge && <span className="text-xs text-gray-400">Loading platform charge...</span>}
              </div>
              <div>
                <label className="block text-white">Platform charge value</label>
                <input
                  type="number"
                  name="platformChargeValue"
                  value={platformChargeValue}
                  disabled
                  className="w-full rounded border px-3 py-2 text-black bg-gray-200 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-white">Actual price</label>
                <input
                  type="number"
                  name="actualPrice"
                  value={actualPrice}
                  disabled
                  className="w-full rounded border px-3 py-2 text-black bg-gray-200 cursor-not-allowed"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="interestRatePercentage" className="block text-sm font-medium text-white">Interest rate (%) for little-by-little payment (optional)</label>
                <input
                  type="number"
                  id="interestRatePercentage"
                  name="interestRatePercentage"
                  value={formData.interestRatePercentage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
               <div className="mb-4">
                <label htmlFor="mininumDepositPercentage" className="block text-sm font-medium text-white">Minimum Deposit %</label>
                <input
                  type="number"
                  id="mininumDepositPercentage"
                  name="mininumDepositPercentage"
                  value={formData.mininumDepositPercentage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
               <div className="mb-4">
                <label htmlFor="minimumDepositValue" className="block text-sm font-medium text-white">Minimum Deposit Value</label>
                <input
                  type="number"
                  id="minimumDepositValue"
                  name="minimumDepositValue"
                  value={minimumDepositValue}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
               {/* <div className="mb-4">
                <label htmlFor="repaymentPeriodInMonths" className="block text-sm font-medium text-white">Repayment Period In Months (optional)</label>
                <input
                  type="number"
                  id="repaymentPeriodInMonths"
                  name="repaymentPeriodInMonths"
                  value={formData.repaymentPeriodInMonths}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div> */}
               {/* <div className="mb-4">
                <label htmlFor="minimumRepaymentAmount" className="block text-sm font-medium text-white">Minimum Repayment Amount (optional)</label>
                <input
                  type="number"
                  id="mininumRepaymentAmount"
                  name="mininumRepaymentAmount"
                  value={formData.mininumRepaymentAmount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              */}
             
              <div>
                <label className="block text-white">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesData?.map((category: any) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {isLoadingCategories && <span className="text-xs text-gray-400">Loading categories...</span>}
              </div>
              <div>
                <label className="block text-white">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                >
                  <option value="">Select a brand</option>
                  {brandsData?.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {isLoadingBrands && <span className="text-xs text-gray-400">Loading brands...</span>}
              </div>
              <div>
                <label className="block text-white">Stock</label>
                <input
                  type="text"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
             
              {/* <div>
                <label className="block text-white">SKU (optional)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div> */}
              
              <div>
                <label className="block text-white">Size (optional)</label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Memory (optional)</label>
                <input
                  type="number"
                  name="memory"
                  value={formData.memory}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
            
              
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx}>
                    <label className="block text-white">Product image {idx + 1} (optional)</label>
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
              <div>
                <label className="block text-white">Door Delivery Terms &amp; Condition (optional)</label>
                <textarea
                  name="doorDeliveryTermsAndCondition"
                  value={formData.doorDeliveryTermsAndCondition}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Pickup Centre Terms &amp; Condition (optional)</label>
                <textarea
                  name="pickupCentreTermsAndCondition"
                  value={formData.pickupCentreTermsAndCondition}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Storage Outdoor (Height, Length, Breadth) (optional)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="storageOutdoor.height"
                    placeholder="Height (optional)"
                    value={formData.storageOutdoor?.height}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageOutdoor.length"
                    placeholder="Length (optional)"
                    value={formData.storageOutdoor?.length}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageOutdoor.breadth"
                    placeholder="Breadth (optional)"
                    value={formData.storageOutdoor?.breadth}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white">Storage Refrigerated (Height, Length, Breadth) (optional)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="storageRefrigerated.height"
                    placeholder="Height (optional)"
                    value={formData.storageRefrigerated?.height}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageRefrigerated.length"
                    placeholder="Length (optional)"
                    value={formData.storageRefrigerated?.length}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageRefrigerated.breadth"
                    placeholder="Breadth (optional)"
                    value={formData.storageRefrigerated?.breadth}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-600 p-4 rounded-md">
                <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white">Promotion (optional)</h3>
                <div className="">
                  <label className="m-0 text-xs font-medium text-white">Promo code (or referral bonus code) (optional)</label>
                  <div className="relative w-full">
                    <input
                      name="promo.code"
                      type="text"
                      value={formData.promo?.code}
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
                  <label className="block text-white">Promo percentage (or referral bonus %) (optional)</label>
                  <input
                    type="number"
                    name="promo.percentage"
                    value={formData.promo?.percentage}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                 <div>
                  <label className="block text-white">Start date (optional)</label>
                  <input
                    type="date"
                    name="promo.startDate"
                    value={formData.promo?.startDate}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                 <div>
                  <label className="block text-white">End date (optional)</label>
                  <input
                    type="date"
                    name="promo.endDate"
                    value={formData.promo?.endDate}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                
                 <div>
                  <label className="block text-white">Status (optional)</label>
                  <select
                    name="promo.status"
                    value={formData.promo?.status}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-white">Minimum purchase (optional)</label>
                  <input
                    type="number"
                    name="promo.minimumPurchase"
                    value={formData.promo?.minimumPurchase}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
               
                <div>
                  <label className="block text-white">Max usage (optional)</label>
                  <input
                    type="number"
                    name="promo.maxUsage"
                    value={formData.promo?.maxUsage}
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
        ) : null}

        {/* View Product Modal */}
        {showViewEditModal && modalType === 'view' && singleProduct && (
          <Modal title="View Product" setModalState={setShowViewEditModal}>
            <div className="space-y-4 p-6 border border-gray-700 rounded-lg">
              <div>
                <label className="block text-white">Name</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">{singleProduct.name}</div>
              </div>
              <div>
                <label className="block text-white">Description</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">{singleProduct.description}</div>
              </div>
              <div>
                <label className="block text-white">Price</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">₦ {AmountFormatter(singleProduct.price)}</div>
              </div>
              <div>
                <label className="block text-white">Discount</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">{singleProduct.discount}%</div>
              </div>
              <div>
                <label className="block text-white">Cost Before Discount</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">₦ {AmountFormatter(singleProduct.costBeforeDiscount)}</div>
              </div>
              <div>
                <label className="block text-white">Platform Charge (%)</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">
                  {platformChargeData?.data?.percentage ? `${platformChargeData.data.percentage}%` : 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-white">Platform Charge Value</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">
                  {platformChargeData?.data?.percentage && singleProduct.price
                    ? `₦ ${AmountFormatter((singleProduct.price * platformChargeData.data.percentage) / 100)}`
                    : 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-white">Category</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">
                  {getCategoryName(singleProduct.category)}
                </div>
              </div>
              <div>
                <label className="block text-white">Brand</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">
                  {getBrandName(singleProduct.brand)}
                </div>
              </div>
              <div>
                <label className="block text-white">Stock</label>
                <div className="w-full rounded border px-3 py-2 text-black bg-gray-200">{singleProduct.stock}</div>
              </div>
              <div>
                <label className="block text-white">Image</label>
                {singleProduct.imageUrl && singleProduct.imageUrl.length > 0 ? (
                  <img src={singleProduct.imageUrl[0]} alt={singleProduct.name} className="w-32 h-32 object-cover rounded" />
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                )}
              </div>
              {/* Add more fields as needed */}
            </div>
          </Modal>
        )}

        {/* Edit Product Modal */}
        {showViewEditModal && modalType === 'edit' && singleProduct && (
          <Modal title="Edit Product" setModalState={setShowViewEditModal}>
            {updateProductMutation.isPending && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span className="text-white">Updating...</span>
                </div>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 text-center">
                {successMessage}
              </div>
            )}
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
                  name="costBeforeDiscount"
                  value={formData.costBeforeDiscount}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Discount (%) (optional)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Discounted Price (optional)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  disabled
                  className="w-full rounded border px-3 py-2 text-black bg-gray-200 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-white">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesData?.map((category: any) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {isLoadingCategories && <span className="text-xs text-gray-400">Loading categories...</span>}
              </div>
              <div>
                <label className="block text-white">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                >
                  <option value="">Select a brand</option>
                  {brandsData?.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {isLoadingBrands && <span className="text-xs text-gray-400">Loading brands...</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx}>
                    <label className="block text-white">Product image {idx + 1} (optional)</label>
                    {/* Show preview: if new image selected, show preview, else show existing image */}
                    {imagePreviews[idx] ? (
                      <div className="flex gap-2 mb-2">
                        <img src={imagePreviews[idx]} alt={`Product Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                      </div>
                    ) : singleProduct.imageUrl && singleProduct.imageUrl[idx] ? (
                      <div className="flex gap-2 mb-2">
                        <img src={singleProduct.imageUrl[idx]} alt={`Product Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                      </div>
                    ) : null}
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
              <div>
                <label className="block text-white">Door Delivery Terms &amp; Condition (optional)</label>
                <textarea
                  name="doorDeliveryTermsAndCondition"
                  value={formData.doorDeliveryTermsAndCondition}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Pickup Centre Terms &amp; Condition (optional)</label>
                <textarea
                  name="pickupCentreTermsAndCondition"
                  value={formData.pickupCentreTermsAndCondition}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2 text-black"
                />
              </div>
              <div>
                <label className="block text-white">Storage Outdoor (Height, Length, Breadth) (optional)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="storageOutdoor.height"
                    placeholder="Height (optional)"
                    value={formData.storageOutdoor?.height}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageOutdoor.length"
                    placeholder="Length (optional)"
                    value={formData.storageOutdoor?.length}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageOutdoor.breadth"
                    placeholder="Breadth (optional)"
                    value={formData.storageOutdoor?.breadth}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white">Storage Refrigerated (Height, Length, Breadth) (optional)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="storageRefrigerated.height"
                    placeholder="Height (optional)"
                    value={formData.storageRefrigerated?.height}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageRefrigerated.length"
                    placeholder="Length (optional)"
                    value={formData.storageRefrigerated?.length}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                  <input
                    type="number"
                    name="storageRefrigerated.breadth"
                    placeholder="Breadth (optional)"
                    value={formData.storageRefrigerated?.breadth}
                    onChange={handleInputChange}
                    className="w-1/3 rounded border px-3 py-2 text-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-600 p-4 rounded-md">
                <h3 className="col-span-1 md:col-span-2 text-lg font-semibold text-white">Promotion (optional)</h3>
                <div className="">
                  <label className="m-0 text-xs font-medium text-white">Promo code (or referral bonus code) (optional)</label>
                  <div className="relative w-full">
                    <input
                      name="promo.code"
                      type="text"
                      value={formData.promo?.code}
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
                  <label className="block text-white">Promo percentage (or referral bonus %) (optional)</label>
                  <input
                    type="number"
                    name="promo.percentage"
                    value={formData.promo?.percentage}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                 <div>
                  <label className="block text-white">Start date (optional)</label>
                  <input
                    type="date"
                    name="promo.startDate"
                    value={formData.promo?.startDate}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                 <div>
                  <label className="block text-white">End date (optional)</label>
                  <input
                    type="date"
                    name="promo.endDate"
                    value={formData.promo?.endDate}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
                
                 <div>
                  <label className="block text-white">Status (optional)</label>
                  <select
                    name="promo.status"
                    value={formData.promo?.status}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-white">Minimum purchase (optional)</label>
                  <input
                    type="number"
                    name="promo.minimumPurchase"
                    value={formData.promo?.minimumPurchase}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
               
                <div>
                  <label className="block text-white">Max usage (optional)</label>
                  <input
                    type="number"
                    name="promo.maxUsage"
                    value={formData.promo?.maxUsage}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2 text-black"
                  />
                </div>
              </div>
              {errors.general && <div className="text-red-500">{errors.general}</div>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
              </button>
            </form>
          </Modal>
        )}

        {/* Delete Product Modal */}
        {showViewEditModal && modalType === 'delete-confirm' && (
          <Modal title="Delete Product" setModalState={setShowViewEditModal}>
            <div className="p-6 border border-gray-700 rounded-lg">
              <p className="text-white mb-4">Are you sure you want to delete this product?</p>
              {errors.general && <div className="text-red-500 mb-2">{errors.general}</div>}
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={deleteProductMutation.isPending}
                >
                  {deleteProductMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowViewEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">{getCategoryName(product.category)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getBrandName(product.brand)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock} items left</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(product as any).repaymentPeriodInMonths || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(product as any).interestRatePercentage || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(product as any).platformFee || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(product as any).doorDeliveryTermsAndCondition || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(product as any).pickupCentreTermsAndCondition || '-'}</td>
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
      </div>
    </>
  );
};

export default Create;