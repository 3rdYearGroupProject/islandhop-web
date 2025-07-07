import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Filter,
  Search,
  TrendingUp,
  Award,
  Users,
  Calendar,
  ChevronDown,
  Eye,
  Reply,
  Heart,
  Flag,
  Share2,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

const GuideReviews = () => {
  const [filter, setFilter] = useState("all"); // all, 5star, 4star, 3star, 2star, 1star
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // recent, rating, helpful
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data as fallback

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use default guide email for now - in a real app, this would come from auth context
        const guideEmail = "guide003@gmail.com";
        const response = await axios.get(
          `http://localhost:8082/api/v1/reviews/guides/guide/${guideEmail}`
        );

        if (response.data && response.data.length > 0) {
          setReviews(response.data);
        } else {
          // Use mock data as fallback
          setReviews(mockReviewsData);
        }
      } catch (err) {
        console.error("Error fetching guide reviews:", err);
        setError("Failed to load reviews. Using sample data.");
        // Use mock data as fallback
        setReviews(mockReviewsData);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Calculate stats from current reviews data
  const reviewStats = {
    totalReviews: reviews.length,
    averageRating:
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        : 0,
    ratingDistribution: {
      5: reviews.filter((r) => (r.rating || 0) === 5).length,
      4: reviews.filter((r) => (r.rating || 0) === 4).length,
      3: reviews.filter((r) => (r.rating || 0) === 3).length,
      2: reviews.filter((r) => (r.rating || 0) === 2).length,
      1: reviews.filter((r) => (r.rating || 0) === 1).length,
    },
    replyRate: 0, // Backend doesn't seem to have reply functionality yet
    totalHelpful: 0, // Backend doesn't seem to have helpful votes yet
  };

  const filteredReviews = reviews.filter((review) => {
    const rating = review.rating || 0;
    const matchesFilter =
      filter === "all" || rating === parseInt(filter.replace("star", ""));

    const reviewerName = `${review.reviewerFirstname || ""} ${
      review.reviewerLastname || ""
    }`.trim();
    const reviewContent = review.review || "";

    const matchesSearch =
      reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.reviewerEmail || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        // Convert array format [2025, 7, 7, 20, 27, 49, 256857000] to Date
        const dateA = a.createdAt
          ? new Date(
              a.createdAt[0],
              a.createdAt[1] - 1,
              a.createdAt[2],
              a.createdAt[3] || 0,
              a.createdAt[4] || 0,
              a.createdAt[5] || 0
            )
          : new Date(0);
        const dateB = b.createdAt
          ? new Date(
              b.createdAt[0],
              b.createdAt[1] - 1,
              b.createdAt[2],
              b.createdAt[3] || 0,
              b.createdAt[4] || 0,
              b.createdAt[5] || 0
            )
          : new Date(0);
        return dateB - dateA;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "helpful":
        return 0; // No helpful votes in backend yet
      default:
        return 0;
    }
  });

  const toggleHelpful = (reviewId) => {
    // Helpful votes not implemented in backend yet
    console.log("Helpful vote for review:", reviewId);
  };

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) {
      return "Unknown date";
    }
    // Convert [2025, 7, 7, 20, 27, 49, 256857000] to readable date
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1, // Month is 0-indexed in JS
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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reviews & Ratings
            </h1>
            <p className="text-gray-600">
              Monitor and respond to tourist feedback
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <div className="flex items-center">
                  <p
                    className={`text-2xl font-bold ${getRatingColor(
                      reviewStats.averageRating
                    )}`}
                  >
                    {reviewStats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(reviewStats.averageRating)
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviewStats.totalReviews}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Reply className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Approved Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter((r) => r.status === "APPROVED").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg AI Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0
                    ? (
                        (reviews.reduce(
                          (sum, r) => sum + (r.aiConfidenceScore || 0),
                          0
                        ) /
                          reviews.length) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingDistribution[rating];
              const percentage =
                reviewStats.totalReviews > 0
                  ? (count / reviewStats.totalReviews) * 100
                  : 0;

              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="flex items-center w-20">
                    <span className="text-sm font-medium text-gray-700">
                      {rating}
                    </span>
                    <Star className="h-4 w-4 text-yellow-500 ml-1" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                  <span className="text-sm text-gray-500 w-12">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Rating
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="5star">5 Stars</option>
                  <option value="4star">4 Stars</option>
                  <option value="3star">3 Stars</option>
                  <option value="2star">2 Stars</option>
                  <option value="1star">1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="text-gray-600">Loading reviews...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt={
                      `${review.reviewerFirstname || ""} ${
                        review.reviewerLastname || ""
                      }`.trim() || "Reviewer"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {`${review.reviewerFirstname || ""} ${
                          review.reviewerLastname || ""
                        }`.trim() || "Anonymous"}
                      </h3>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {review.reviewerEmail || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : review.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {review.status}
                      </span>
                      <span>•</span>
                      <span>
                        AI Score:{" "}
                        {((review.aiConfidenceScore || 0) * 100).toFixed(0)}%
                      </span>
                      <span>•</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {review.rating ? (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold text-gray-900">
                        {review.rating.toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No rating</span>
                  )}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.review || "No review content"}
                </p>
              </div>

              {/* AI Analysis */}
              {review.aiAnalysis && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-blue-800">
                      AI Analysis
                    </span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      Confidence:{" "}
                      {((review.aiConfidenceScore || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">{review.aiAnalysis}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleHelpful(review.reviewId)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful</span>
                  </button>

                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>

                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200">
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {sortedReviews.length === 0 && !loading && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "No reviews match your search criteria."
                  : "You haven't received any reviews yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideReviews;
