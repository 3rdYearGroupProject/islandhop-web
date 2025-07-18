import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StarIcon,
  ChartBarIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../firebase";

const DriverReviews = () => {
  const { user } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the logged-in user's email instead of hardcoded value
  const driverEmail = auth.currentUser?.email;

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8082/api/v1/reviews/drivers/driver/${driverEmail}`
        );
        setReviews(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [driverEmail]);

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

  // Helper function to format date from API response
  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  // Helper function to get rating from AI confidence score
  const getRatingFromConfidence = (confidenceScore) => {
    return Math.round(confidenceScore * 5);
  };

  const filterOptions = [
    { value: "all", label: "All Reviews" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  const timeFilters = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "Last 3 Months" },
  ];

  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter === "all") return true;
    return review.rating.toString() === selectedFilter;
  });

  const renderStars = (rating, size = "h-5 w-5") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reviews & Ratings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See what passengers are saying about your service
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Content - only show when not loading */}
      {!loading && !error && (
        <>
          {/* Rating Overview */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                  {reviewStats.averageRating || "N/A"}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(
                    Math.round(reviewStats.averageRating),
                    "h-8 w-8"
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on {reviewStats.totalReviews} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {reviewStats.ratingDistribution.map((item) => (
                  <div
                    key={item.stars}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.stars}
                      </span>
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Rating
                </label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                >
                  {timeFilters.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {reviews.length === 0
                  ? "You haven't received any reviews yet."
                  : "No reviews match your current filter criteria."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {review.reviewerFirstname} {review.reviewerLastname}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {renderStars(review.rating, "h-4 w-4")}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.review}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DriverReviews;
