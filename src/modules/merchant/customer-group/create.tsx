"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import TransactionsTable from '@/components/Tables';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const CustomerGroup = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', members: [] as string[] });
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [viewGroup, setViewGroup] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all groups
  const { data: groupsData, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await client.get('/api/groups');
      return res.data;
    },
  });

  // Create group
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; members: string[] }) => {
      return client.post('/api/groups', data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['groups'] }); // force refresh
      setShowModal(false);
      setForm({ name: '', description: '', members: [] as string[] });
      setSuccessMessage('Customer group created successfully!');
    },
  });

  // Update group
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description: string; members: string[] } }) => {
      return client.put(`/api/groups/${id}`, data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['groups'] }); // force refresh
      setShowModal(false);
      setEditId(null);
      setForm({ name: '', description: '', members: [] as string[] });
      setSuccessMessage('Customer group updated successfully!');
    },
  });

  // Delete group
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/api/groups/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['groups'] });
      setSuccessMessage('Customer group deleted successfully!');
    },
  });

  // Edit handler
  const handleEdit = (group: any) => {
    setEditId(group._id);
    setForm({ 
      name: group.name, 
      description: group.description, 
      members: group.members || [] 
    });
    setShowModal(true);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    setDeleteId(id);
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

  // View handler (open modal and fetch group details)
  const handleView = async (id: string) => {
    setViewLoading(true);
    setViewModal(true);
    try {
      const res = await client.get(`/api/groups/${id}`);
      setViewGroup(res.data?.data);
    } catch (err) {
      setViewGroup(null);
    } finally {
      setViewLoading(false);
    }
  };

  // Filtered groups
  const filtered = groupsData?.data?.filter((group: any) =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    group.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-ajo_offWhite mb-4">Customer Groups</h2>
      <div className="flex gap-4 mb-4">
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
          onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', description: '', members: [] as string[] }); }}
        >
          Create a Group
        </button>
      </div>
      <div className="mt-6">
        <TransactionsTable
          key={filtered.map((group: { _id: any; }) => group._id).join(',')}
          headers={["S/N", "Group Name", "Description", "Members Count", "Action"]}
          content={isLoading ? (
            <tr><td colSpan={5} className="text-center text-white">Loading...</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td colSpan={5} className="text-center text-white">No groups found.</td></tr>
          ) : (
            filtered.map((group: any, idx: number) => (
              <tr key={group._id}>
                <td className="text-left px-6">{idx + 1}</td>
                <td className="text-left px-6">{group.name}</td>
                <td className="text-left px-6">{group.description}</td>
                <td className="text-left px-6">{group.members?.length || 0}</td>
                <td className="flex gap-2 items-center">
                  <button onClick={() => handleView(group._id)} className="p-1 hover:text-blue-400"><FiEye /></button>
                  <button onClick={() => handleEdit(group)} className="p-1 hover:text-yellow-400"><FiEdit2 /></button>
                  <button
                    onClick={() => handleDelete(group._id)}
                    className="p-1 hover:text-red-500"
                    disabled={deleteMutation.isPending && deleteId === group._id}
                  >
                    {deleteMutation.isPending && deleteId === group._id ? "Deleting..." : <FiTrash2 />}
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
            <h3 className="text-xl font-bold mb-4 text-white">{editId ? 'Edit Group' : 'Create Group'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-1">Group Name</label>
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
              <div>
                <label className="block text-white mb-1">Members (comma-separated IDs)</label>
                <input
                  type="text"
                  value={form.members.join(', ')}
                  onChange={e => setForm(f => ({ 
                    ...f, 
                    members: e.target.value.split(',').map(id => id.trim()).filter(id => id) 
                  }))}
                  className="w-full rounded border px-3 py-2 text-black"
                  placeholder="e.g., 6790ddaab9dda06a8c9359cc, 6790ddaab9dda06a8c9359cd"
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
      {/* Modal for view group */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[#221c3e] p-8 rounded-lg w-full max-w-md min-w-[300px]">
            <h3 className="text-xl font-bold mb-4 text-white">Group Details</h3>
            {viewLoading ? (
              <div className="text-white">Loading...</div>
            ) : viewGroup ? (
              <div className="space-y-2">
                <p className="text-white"><strong>Name:</strong> {viewGroup.name}</p>
                <p className="text-white"><strong>Description:</strong> {viewGroup.description}</p>
                <p className="text-white"><strong>Members Count:</strong> {viewGroup.members?.length || 0}</p>
                {viewGroup.members && viewGroup.members.length > 0 && (
                  <div>
                    <p className="text-white"><strong>Members:</strong></p>
                    <ul className="text-white text-sm ml-4">
                      {viewGroup.members.map((member: any, index: number) => (
                        <li key={index}>{member.email} ({member._id})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-white">Failed to load group details.</div>
            )}
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 rounded bg-gray-500 text-white" onClick={() => setViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Success Message Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[#221c3e] p-8 rounded-lg w-full max-w-md">
            <div className="text-white text-lg mb-4 font-bold">Success</div>
            <div className="text-white mb-4">{successMessage}</div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-500 text-white"
                onClick={() => setSuccessMessage('')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[#221c3e] p-8 rounded-lg w-full max-w-md">
            <div className="text-white text-lg mb-4">Are you sure you want to delete this group?</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-500 text-white"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                onClick={() => {
                  deleteMutation.mutate(deleteId!);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerGroup;