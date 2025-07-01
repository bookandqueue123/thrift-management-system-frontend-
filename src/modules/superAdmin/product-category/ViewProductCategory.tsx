import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';

interface ViewProductCategoryProps {
  categoryId: string;
}

const ViewProductCategory: React.FC<ViewProductCategoryProps> = ({ categoryId }) => {
  const { client } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product-category', categoryId],
    queryFn: async () => {
      const res = await client.get(`/api/products-categories/${categoryId}`);
      return res.data;
    },
    enabled: !!categoryId,
  });

  if (isLoading) return <div className="text-white">Loading category...</div>;
  if (isError) return <div className="text-red-500">Error: {(error as any)?.message || 'Failed to load category.'}</div>;
  if (!data?.data) return <div className="text-white">Category not found.</div>;

  const { name, description } = data.data;

  return (
    <div className="bg-[#221c3e] p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-2">Category Details</h2>
      <div className="mb-2">
        <span className="font-semibold text-white">Name:</span> <span className="text-gray-300">{name}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-white">Description:</span> <span className="text-gray-300">{description}</span>
      </div>
    </div>
  );
};

export default ViewProductCategory; 