import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  ChartBarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

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
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [reviewToApprove, setReviewToApprove] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewToReject, setReviewToReject] = useState(null);

  // Mock data for demonstration (fallback when API returns empty)
  const mockReviews = [
    {
      reviewId: 1,
      reviewerFirstname: "Sarah",
      reviewerLastname: "Johnson",
      reviewerEmail: "sarah.johnson@email.com",
      rating: 5,
      review:
        "Amazing experience! The driver was very professional and knowledgeable about the local area. The vehicle was clean and comfortable. Highly recommend this service to anyone visiting Sri Lanka.",
      createdAt: [2025, 7, 15, 10, 30, 0],
      status: "TO_SUPPORT_AGENTS",
      aiAnalysis:
        "Positive review highlighting professionalism, cleanliness, and local knowledge. No negative sentiment detected.",
      aiConfidenceScore: 0.92,
    },
    {
      reviewId: 2,
      reviewerFirstname: "Mike",
      reviewerLastname: "Chen",
      reviewerEmail: "mike.chen@email.com",
      rating: 4,
      review:
        "Great service overall. The guide was friendly and showed us beautiful locations. Only minor issue was we were running a bit late to some spots, but still had a wonderful time.",
      createdAt: [2025, 7, 14, 14, 45, 0],
      status: "APPROVED",
      aiAnalysis:
        "Mostly positive review with minor concern about timing. Overall satisfaction is high.",
      aiConfidenceScore: 0.85,
    },
    {
      reviewId: 3,
      reviewerFirstname: "Emily",
      reviewerLastname: "Rodriguez",
      reviewerEmail: "emily.rodriguez@email.com",
      rating: 2,
      review:
        "The driver was rude and unprofessional. The car smelled bad and was not clean. Very disappointed with this experience. Would not recommend.",
      createdAt: [2025, 7, 13, 16, 20, 0],
      status: "TO_SUPPORT_AGENTS",
      aiAnalysis:
        "Negative review citing unprofessional behavior and cleanliness issues. Requires immediate attention and investigation.",
      aiConfidenceScore: 0.78,
    },
    {
      reviewId: 4,
      reviewerFirstname: "David",
      reviewerLastname: "Thompson",
      reviewerEmail: "david.thompson@email.com",
      rating: 5,
      review:
        "Excellent service! Our guide was incredibly knowledgeable about Sri Lankan history and culture. The tour was well-organized and we saw amazing sights. Will definitely book again!",
      createdAt: [2025, 7, 12, 9, 15, 0],
      status: "APPROVED",
      aiAnalysis:
        "Highly positive review praising guide's knowledge and tour organization. Strong recommendation for service.",
      aiConfidenceScore: 0.95,
    },
    {
      reviewId: 5,
      reviewerFirstname: "Lisa",
      reviewerLastname: "Wang",
      reviewerEmail: "lisa.wang@email.com",
      rating: 3,
      review:
        "Average experience. The driver was okay but not very talkative. The route was good but we expected more interaction and local insights.",
      createdAt: [2025, 7, 11, 11, 0, 0],
      status: "TO_SUPPORT_AGENTS",
      aiAnalysis:
        "Neutral review with expectations not fully met regarding interaction and local insights. Room for improvement in service delivery.",
      aiConfidenceScore: 0.71,
    },
    {
      reviewId: 6,
      reviewerFirstname: "James",
      reviewerLastname: "Brown",
      reviewerEmail: "james.brown@email.com",
      rating: 1,
      review:
        "Terrible experience. The driver was 2 hours late and didn't even apologize. The car broke down halfway through the trip. Worst service ever!",
      createdAt: [2025, 7, 10, 8, 30, 0],
      status: "REJECTED",
      aiAnalysis:
        "Highly negative review citing punctuality issues and vehicle breakdown. Serious service failure requiring immediate attention.",
      aiConfidenceScore: 0.88,
    },
    {
      reviewId: 7,
      reviewerFirstname: "Maria",
      reviewerLastname: "Garcia",
      reviewerEmail: "maria.garcia@email.com",
      rating: 4,
      review:
        "Good experience with our guide. She was very friendly and took us to some hidden gems that weren't in the typical tourist spots. The only downside was the weather, but that's not their fault!",
      createdAt: [2025, 7, 9, 13, 45, 0],
      status: "APPROVED",
      aiAnalysis:
        "Positive review highlighting guide's friendliness and unique destinations. Weather mentioned as external factor.",
      aiConfidenceScore: 0.82,
    },
    {
      reviewId: 8,
      reviewerFirstname: "Robert",
      reviewerLastname: "Miller",
      reviewerEmail: "robert.miller@email.com",
      rating: 5,
      review:
        "Outstanding service from start to finish! The driver was punctual, professional, and went above and beyond to make our trip memorable. The vehicle was spotless and comfortable. 10/10 would recommend!",
      createdAt: [2025, 7, 8, 15, 20, 0],
      status: "APPROVED",
      aiAnalysis:
        "Exceptional positive review highlighting punctuality, professionalism, and extra effort. Strong recommendation with perfect satisfaction.",
      aiConfidenceScore: 0.97,
    },
  ];

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

        // Use API data if available, otherwise use mock data for demonstration
        const reviewsData = data && data.length > 0 ? data : mockReviews;
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Fallback to mock data on error
        setReviews(mockReviews);
        setFilteredReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filters.reviewType]);

  const renderStars = (rating, size = "h-4 w-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`${size} ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // Calculate review statistics
  const calculateReviewStats = () => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
      };
    }

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingCounts = [1, 2, 3, 4, 5].map(
      (star) => reviews.filter((review) => review.rating === star).length
    );

    const ratingDistribution = [5, 4, 3, 2, 1].map((star, index) => ({
      stars: star,
      count: ratingCounts[star - 1],
      percentage:
        totalReviews > 0 ? (ratingCounts[star - 1] / totalReviews) * 100 : 0,
    }));

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingDistribution,
    };
  };

  const reviewStats = calculateReviewStats();

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

    // Apply filters to the current reviews
    let filtered = reviews;

    if (value !== "all" && key === "status") {
      filtered = filtered.filter((review) => review.status === value);
    }

    if (value !== "all" && key === "rating") {
      filtered = filtered.filter((review) => review.rating === parseInt(value));
    }

    setFilteredReviews(filtered);
  };

  const handleApproveReview = async (reviewId) => {
    try {
      const endpoint =
        filters.reviewType === "drivers"
          ? `http://localhost:8082/api/v1/reviews/drivers/${reviewId}/status?status=1`
          : `http://localhost:8082/api/v1/reviews/guides/${reviewId}/status?status=1`;
      await fetch(endpoint, {
        method: "PUT",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error approving review:", error);
    } finally {
      setShowApproveModal(false);
      setReviewToApprove(null);
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      const endpoint =
        filters.reviewType === "drivers"
          ? `http://localhost:8082/api/v1/reviews/drivers/${reviewId}/status?status=2`
          : `http://localhost:8082/api/v1/reviews/guides/${reviewId}/status?status=2`;
      await fetch(endpoint, {
        method: "PUT",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting review:", error);
    } finally {
      setShowRejectModal(false);
      setReviewToReject(null);
    }
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      await fetch(`http://localhost:8082/api/v1/reviews/${reviewToDelete}`, {
        method: "DELETE",
      });
      setReviews((prev) =>
        prev.filter((review) => review.reviewId !== reviewToDelete)
      );
      setFilteredReviews((prev) =>
        prev.filter((review) => review.reviewId !== reviewToDelete)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reviews Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and moderate user reviews and feedback
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Reviews
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
            <div className="text-2xl font-bold text-success-600 dark:text-success-400">
              {reviews.filter((r) => r.status === "APPROVED").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Approved
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
              {reviews.filter((r) => r.status === "TO_SUPPORT_AGENTS").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pending
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
            <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
              {reviews.filter((r) => r.status === "REJECTED").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rejected
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.reviewType}
                onChange={(e) =>
                  handleFilterChange("reviewType", e.target.value)
                }
              >
                <option value="drivers">Drivers</option>
                <option value="guides">Guides</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="TO_SUPPORT_AGENTS">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredReviews.length} of {reviews.length} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {!loading && (
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {reviews.length === 0
                    ? "No reviews have been submitted yet."
                    : "No reviews match your current filter criteria."}
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {`${review.reviewerFirstname || ""} ${
                            review.reviewerLastname || ""
                          }`.trim() || "Anonymous"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {review.reviewerEmail || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      "{review.review || "No review content"}"
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    {review.status === "TO_SUPPORT_AGENTS" && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Pending Review
                      </span>
                    )}
                    {review.status === "REJECTED" && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300">
                        <XMarkIcon className="h-3 w-3 mr-1" />
                        Rejected
                      </span>
                    )}
                    {review.status === "APPROVED" && (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Approved
                      </span>
                    )}
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
                            Confidence Score:{" "}
                            {((review.aiConfidenceScore || 0) * 100).toFixed(0)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2">
                    {review.status !== "APPROVED" && (
                      <button
                        onClick={() => {
                          setShowApproveModal(true);
                          setReviewToApprove(review.reviewId);
                        }}
                        className="px-4 py-2 bg-success-600 text-white text-sm rounded-lg hover:bg-success-700 transition-colors flex items-center space-x-2"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    )}
                    {review.status !== "REJECTED" && (
                      <button
                        onClick={() => {
                          setShowRejectModal(true);
                          setReviewToReject(review.reviewId);
                        }}
                        className="px-4 py-2 bg-danger-600 text-white text-sm rounded-lg hover:bg-danger-700 transition-colors flex items-center space-x-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this review? This action cannot
                be undone.
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
        {/* Approval Modal */}
        {showApproveModal && reviewToApprove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Approval
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to approve this review?
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveReview}
                  className="px-4 py-2 bg-success-600 text-white hover:bg-success-700 rounded transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && reviewToReject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Rejection
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to reject this review? This action cannot
                be undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectReview}
                  className="px-4 py-2 bg-danger-600 text-white hover:bg-danger-700 rounded transition-colors"
                >
                  Reject
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
