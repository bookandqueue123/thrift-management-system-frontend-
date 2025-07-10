

"use client"

import React, { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Star, Send, ThumbsUp, MessageCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@/api/hooks/useAuth'
import TransactionsTable from '@/components/Tables';

interface RatingsReviewProps {
  productId: string
}

const GetAllRatingsReview: React.FC<RatingsReviewProps> = ({ productId }) => {
  const { client } = useAuth()
  const queryClient = useQueryClient()

  // Fetch all ratings for this product
  const { data: ratingsData, isLoading: isLoadingRatings } = useQuery({
    queryKey: ['product-ratings', productId],
    queryFn: async () => {
      const res = await client.get(`/api/product-ratings/product/${productId}`);
      return res.data;
    },
  });

  // Extract ratings from the response structure
  const ratings = ratingsData?.ratings || [];

  // Delete rating mutation
  const deleteRatingMutation = useMutation({
    mutationFn: async (ratingId: string) => {
      await client.delete(`/api/product-ratings/${ratingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-ratings', productId] });
    },
  });

  return (
    <div className=" p-4 rounded-xl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Customer Feedback</h1>
          <p className="text-gray-500 text-sm">All ratings for this product</p>
        </div>
        {/* Ratings Table */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">All Ratings</h2>
          <TransactionsTable
            headers={["S/N", "Rating", "Comment", "Product ID", "Email", "Date", "Action"]}
            content={
              isLoadingRatings ? (
                <tr><td colSpan={7} className="text-center text-white">Loading ratings...</td></tr>
              ) : ratings && ratings.length > 0 ? (
                ratings.map((r: any, idx: number) => (
                  <tr key={r._id}>
                    <td className="text-left px-6">{idx + 1}</td>
                    <td className="text-left px-6">
                      <div className="flex items-center gap-1">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </td>
                    <td className="text-left px-6 max-w-xs truncate" title={r.comment}>{r.comment || <span className="italic text-gray-400">No comment</span>}</td>
                    <td className="text-left px-6 text-xs text-gray-500">{r.productId}</td>
                    <td className="text-left px-6 text-xs text-gray-500">{r.userId?.email || 'N/A'}</td>
                    <td className="text-left px-6 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                    <td className="flex gap-2 items-center px-6">
                      <button
                        onClick={() => deleteRatingMutation.mutate(r._id)}
                        disabled={deleteRatingMutation.isPending}
                        className="p-1 hover:text-red-500"
                        title="Delete rating"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="text-center text-white">No ratings found.</td></tr>
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export default GetAllRatingsReview