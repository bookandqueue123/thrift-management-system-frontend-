"use client"

import React, { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Star, Send, ThumbsUp, MessageCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@/api/hooks/useAuth'

interface RatingsReviewProps {
  productId: string
}

const RatingsReview: React.FC<RatingsReviewProps> = ({ productId }) => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  // Fetch all ratings for this product
  const { data: ratings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ['product-ratings', productId],
    queryFn: async () => {
      const res = await client.get(`/api/product-ratings/product/${productId}`);
      return res.data;
    },
  });

  // Delete rating mutation
  const deleteRatingMutation = useMutation({
    mutationFn: async (ratingId: string) => {
      await client.delete(`/api/product-ratings/${ratingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-ratings', productId] });
    },
  });

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const res = await client.post('/api/product-ratings', { productId, rating, comment });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-ratings', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    submitRatingMutation.mutate({ rating, comment: comment.trim() });
  };

  const resetForm = () => {
    setRating(0);
    setComment('');
    submitRatingMutation.reset();
  };

  if (submitRatingMutation.isSuccess) {
    return (
      <div className="flex items-center justify-center p-2">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md w-full text-center">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-green-900 mb-2">Thank You!</h2>
          <p className="text-green-800 mb-4 text-sm">Your review has been submitted successfully.</p>
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Customer Feedback</h1>
          <p className="text-gray-500 text-sm">Your feedback helps us improve our service</p>
        </div>
        {/* Rating Card */}
        <div className="rounded-xl p-4 mb-4 bg-white">
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="text-center mb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-2">How would you rate us?</h2>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {rating === 0 && 'Please select a rating'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </div>
            </div>
            {/* Review Text */}
            <div className="mb-3">
              <label className="block text-gray-900 font-medium mb-1 text-sm">
                <MessageCircle className="inline w-4 h-4 mr-1" />
                Tell us more about your experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts... (optional)"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm"
                rows={3}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {comment.length}/500
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || submitRatingMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {submitRatingMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>
            {/* Error Message */}
            {submitRatingMutation.isError && (
              <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-600 text-xs">
                  {submitRatingMutation.error instanceof Error
                    ? submitRatingMutation.error.message
                    : 'Failed to submit rating. Please try again.'}
                </p>
              </div>
            )}
          </form>
        </div>
        {/* Ratings Table */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">All Ratings</h2>
          {isLoadingRatings ? (
            <div className="text-gray-500 text-sm">Loading ratings...</div>
          ) : ratings && ratings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Rating</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Comment</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r: any) => (
                    <tr key={r._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 max-w-xs truncate" title={r.comment}>{r.comment || <span className="italic text-gray-400">No comment</span>}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => deleteRatingMutation.mutate(r._id)}
                          disabled={deleteRatingMutation.isPending}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete rating"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No ratings yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RatingsReview