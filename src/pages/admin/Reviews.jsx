import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    userType: "all",
    rating: "all",
    reportStatus: "all",
    reviewType: "drivers",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const endpoint =
          filters.reviewType === "drivers"
            ? "http://localhost:8082/api/v1/reviews/drivers/low-confidence"
            : "http://localhost:8082/api/v1/reviews/guides/low-confidence";
        const response = await fetch(endpoint);
        const data = await response.json();
        setReviews(data);
        setFilteredReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filters.reviewType]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        )
      );
    }
    return stars;
  };

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) {
      return "Unknown date";
    }
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3] || 0,
      dateArray[4] || 0,
      dateArray[5] || 0
    );
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Reviews Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and moderate user reviews and feedback
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'approved').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'under-review').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Under Review</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.reported).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reported</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900">
                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="under-review">Under Review</option>
              <option value="reported">Reported</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.reviewType}
              onChange={(e) => handleFilterChange("reviewType", e.target.value)}
            >
              <option value="drivers">Drivers</option>
              <option value="guides">Guides</option>
            </select>
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredReviews.length} of {reviews.length} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.reviewId}
                className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {`${review.reviewerFirstname || ""} ${
                            review.reviewerLastname || ""
                          }`.trim() || "Anonymous"}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.reviewerEmail || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {review.status === 'TO_SUPPORT_AGENTS' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        To Support Agents
                      </span>
                    )}
                    {review.status === 'REJECTED' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                        Rejected
                      </span>
                    )}
                    {review.status !== 'TO_SUPPORT_AGENTS' && review.status !== 'REJECTED' && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {review.status.replace("_", " ")}
                      </span>
                    )}
                    <div className="flex items-center space-x-1 mt-2">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{review.review || "No review content"}"
                  </p>
                </div>

                {/* AI Analysis */}
                {review.aiAnalysis && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                          AI Analysis
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                          {review.aiAnalysis}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-500">
                          Confidence Score: {((review.aiConfidenceScore || 0) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end">
                  <div className="flex space-x-2">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-success-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => handleRejectReview(review.id)}
                        className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-warning-700 transition-colors flex items-center space-x-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteReview}
                  className="px-4 py-2 bg-danger-600 text-white hover:bg-danger-700 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
