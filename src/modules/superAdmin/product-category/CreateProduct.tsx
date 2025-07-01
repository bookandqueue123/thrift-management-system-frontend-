"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import TransactionsTable from '@/components/Tables';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import ViewProductCategory from './ViewProductCategory';

const CreateProduct = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [viewCategoryId, setViewCategoryId] = useState<string | null>(null);

  // Fetch all product categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await client.get('/api/products-categories');
      return res.data;
    },
  });

  // Create product category
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return client.post('/api/products-categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setShowModal(false);
      setForm({ name: '', description: '' });
    },
  });

  // Update product category
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description: string } }) => {
      return client.put(`/api/products-categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setShowModal(false);
      setEditId(null);
      setForm({ name: '', description: '' });
    },
  });

  // Delete product category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/api/products-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['product-categories'] });
    },
  });

  // Edit handler
  const handleEdit = (cat: any) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description });
    setShowModal(true);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  // View handler
  const handleView = (id: string) => {
    setViewCategoryId(id);
    setViewModal(true);
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateMutation.mutate({ id: editId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  // Filtered categories
  const filtered = categoriesData?.data?.filter((cat: any) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-ajo_offWhite mb-4">Product Categories</h2>
      <div className="flex gap-4 mb-4">
        <select
          className="rounded px-3 py-2 bg-[#2d2545] text-white border border-[#3b2f73] w-32"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">Filter</option>
          {/* Add filter options if needed */}
        </select>
        <div className="flex items-center justify-between rounded-lg bg-[rgba(255,255,255,0.1)] p-3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-ajo_offWhite caret-ajo_offWhite outline-none focus:outline-none"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
        </div>
        <button
          className="ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', description: '' }); }}
        >
          Create a Category
        </button>
      </div>
      <div className="mt-6">
        <TransactionsTable
          key={filtered.map((cat: { _id: any; }) => cat._id).join(',')}
          headers={["S/N", "Category Name", "Description", "Action"]}
          content={isLoading ? (
            <tr><td colSpan={4} className="text-center text-white">Loading...</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td colSpan={4} className="text-center text-white">No categories found.</td></tr>
          ) : (
            filtered.map((cat: any, idx: number) => (
              <tr key={cat._id}>
                <td className="text-left px-6">{idx + 1}</td>
                <td className="text-left px-6">{cat.name}</td>
                <td className="text-left px-6">{cat.description}</td>
                <td className="flex gap-2 items-center">
                  <button onClick={() => handleView(cat._id)} className="p-1 hover:text-blue-400"><FiEye /></button>
                  <button onClick={() => handleEdit(cat)} className="p-1 hover:text-yellow-400"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(cat._id)} className="p-1 hover:text-red-500" disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? "Deleting..." : <FiTrash2 />}
                  </button>
                </td>
              </tr>
            ))
          )}
        />
      </div>
      {/* Modal for create/edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[#221c3e] p-8 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white">{editId ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-1">Category Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full rounded border px-3 py-2 text-black"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-500 text-white" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editId ? (updateMutation.isPending ? 'Updating...' : 'Update') : (createMutation.isPending ? 'Creating...' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal for view category */}
      {viewModal && viewCategoryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[#221c3e] p-8 rounded-lg w-full max-w-md min-w-[300px]">
            <h3 className="text-xl font-bold mb-4 text-white">Category Details</h3>
            <ViewProductCategory categoryId={viewCategoryId} />
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="px-4 py-2 rounded bg-gray-500 text-white" onClick={() => setViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;