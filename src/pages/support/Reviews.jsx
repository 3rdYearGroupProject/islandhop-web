import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
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
    priority: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseReview, setResponseReview] = useState(null);
  const [responseText, setResponseText] = useState("");

  // Mock data for fallback when API is not available
  const mockReviewsData = [
    {
      id: 1,
      reviewer: {
        name: "John Doe",
        email: "john.doe@email.com",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        userType: "traveler",
      },
      target: {
        type: "driver",
        name: "Kasun Fernando",
        id: "driver_123",
      },
      rating: 5,
      comment:
        "Excellent service! Kasun was very professional and knowledgeable about the local attractions. Highly recommended!",
      date: "2024-06-20",
      status: "approved",
      reported: false,
      reportDetails: null,
      tripId: "trip_456",
      priority: "low",
      supportResponse: null,
      needsSupport: false,
      supportTicketId: null,
    },
    {
      id: 2,
      reviewer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        userType: "traveler",
      },
      target: {
        type: "guide",
        name: "Priyantha Silva",
        id: "guide_789",
      },
      rating: 2,
      comment:
        "This guide was unprofessional and made inappropriate comments during the tour. Very disappointing experience. I would like a refund.",
      date: "2024-06-18",
      status: "reported",
      reported: true,
      reportDetails: {
        reportedBy: "customer",
        reportDate: "2024-06-19",
        reason: "Inappropriate behavior & refund request",
        description:
          "Customer reports unprofessional behavior and requests refund",
      },
      tripId: "trip_789",
      priority: "high",
      supportResponse: null,
      needsSupport: true,
      supportTicketId: "TICKET-001",
    },
    {
      id: 3,
      reviewer: {
        name: "Mike Wilson",
        email: "mike.w@email.com",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        userType: "traveler",
      },
      target: {
        type: "driver",
        name: "Tharaka Perera",
        id: "driver_101",
      },
      rating: 4,
      comment:
        "Good driver, safe journey. The vehicle was clean and comfortable. Would book again!",
      date: "2024-06-15",
      status: "approved",
      reported: false,
      reportDetails: null,
      tripId: "trip_101",
      priority: "low",
      supportResponse: null,
      needsSupport: false,
      supportTicketId: null,
    },
    {
      id: 4,
      reviewer: {
        name: "Emma Davis",
        email: "emma.d@email.com",
        avatar: "https://randomuser.me/api/portraits/women/35.jpg",
        userType: "traveler",
      },
      target: {
        type: "guide",
        name: "Chaminda Wickramasinghe",
        id: "guide_202",
      },
      rating: 1,
      comment:
        "Worst experience ever! The guide was late, didn't show proper locations, and was rude. I want compensation for this terrible service!",
      date: "2024-06-12",
      status: "under-review",
      reported: true,
      reportDetails: {
        reportedBy: "customer",
        reportDate: "2024-06-12",
        reason: "Poor service quality & compensation request",
        description:
          "Customer reports multiple service issues and requests compensation",
      },
      tripId: "trip_202",
      priority: "high",
      supportResponse: null,
      needsSupport: true,
      supportTicketId: "TICKET-002",
    },
    {
      id: 5,
      reviewer: {
        name: "David Brown",
        email: "david.b@email.com",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
        userType: "traveler",
      },
      target: {
        type: "driver",
        name: "Nimal Rajapakse",
        id: "driver_303",
      },
      rating: 5,
      comment:
        "Amazing experience! Nimal went above and beyond to make our trip memorable. His knowledge of the area was impressive.",
      date: "2024-06-10",
      status: "approved",
      reported: false,
      reportDetails: null,
      tripId: "trip_303",
      priority: "low",
      supportResponse: null,
      needsSupport: false,
      supportTicketId: null,
    },
    {
      id: 6,
      reviewer: {
        name: "Lisa Anderson",
        email: "lisa.a@email.com",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        userType: "traveler",
      },
      target: {
        type: "driver",
        name: "Sunil Perera",
        id: "driver_404",
      },
      rating: 3,
      comment:
        "Average service. The driver was okay but the vehicle had some issues with air conditioning. Could be improved.",
      date: "2024-06-08",
      status: "approved",
      reported: false,
      reportDetails: null,
      tripId: "trip_404",
      priority: "medium",
      supportResponse: {
        message:
          "Thank you for your feedback. We've noted the vehicle maintenance issue and will address it with our partner.",
        respondedBy: "Support Agent",
        respondedAt: "2024-06-09",
      },
      needsSupport: false,
      supportTicketId: null,
    },
  ];

  useEffect(() => {
    // Fetch reviews from API
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/pending-reviews"
        );
        setReviews(response.data);
        setFilteredReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Fallback to mock data if API fails
        setReviews(mockReviewsData);
        setFilteredReviews(mockReviewsData);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = reviews.filter((review) => {
      const matchesSearch =
        review.reviewer.name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        review.target.name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        review.comment.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || review.status === filters.status;
      const matchesUserType =
        filters.userType === "all" ||
        review.reviewer.userType === filters.userType;
      const matchesRating =
        filters.rating === "all" || review.rating.toString() === filters.rating;
      const matchesReportStatus =
        filters.reportStatus === "all" ||
        (filters.reportStatus === "reported" && review.reported) ||
        (filters.reportStatus === "not-reported" && !review.reported);
      const matchesPriority =
        filters.priority === "all" || review.priority === filters.priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUserType &&
        matchesRating &&
        matchesReportStatus &&
        matchesPriority
      );
    });

    setFilteredReviews(filtered);
  }, [reviews, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/pending-reviews/${reviewId}/status?status=APPROVED`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state on successful API call
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status: "approved",
                reported: false,
                reportDetails: null,
              }
            : review
        )
      );
    } catch (error) {
      console.error("Error approving review:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/pending-reviews/${reviewId}/status?status=REJECTED`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state on successful API call
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, status: "rejected" } : review
        )
      );
    } catch (error) {
      console.error("Error rejecting review:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = () => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewToDelete));
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleRespondToReview = (review) => {
    setResponseReview(review);
    setResponseText(review.supportResponse?.message || "");
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === responseReview.id
          ? {
              ...review,
              supportResponse: {
                message: responseText,
                respondedBy: "Support Agent",
                respondedAt: new Date().toISOString().split("T")[0],
              },
            }
          : review
      )
    );
    setShowResponseModal(false);
    setResponseReview(null);
    setResponseText("");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon
            key={i}
            className="h-4 w-4 text-gray-300 dark:text-gray-600"
          />
        )
      );
    }
    return stars;
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved:
        "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
      "under-review":
        "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      reported:
        "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
      rejected:
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300",
    };
    return badges[status] || badges.approved;
  };

  const getTargetTypeBadge = (type) => {
    const badges = {
      driver:
        "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300",
      guide: "bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300",
    };
    return badges[type] || badges.driver;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
      medium:
        "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
      high: "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300",
    };
    return badges[priority] || badges.low;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-secondary-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-secondary-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-secondary-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <HeartIcon className="h-8 w-8 text-primary-600" />
                Customer Reviews
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Support customers by monitoring reviews and providing assistance
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviews.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Reviews
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-danger-600">
                {reviews.filter((r) => r.needsSupport).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Need Support
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-danger-600">
                {reviews.filter((r) => r.priority === "high").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                High Priority
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-warning-600">
                {reviews.filter((r) => r.reported).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Reported
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-success-600">
                {reviews.filter((r) => r.supportResponse).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Responded
              </div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-primary-600">
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, r) => acc + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Rating
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="under-review">Under Review</option>
              <option value="reported">Reported</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
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
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.reportStatus}
              onChange={(e) =>
                handleFilterChange("reportStatus", e.target.value)
              }
            >
              <option value="all">All Reports</option>
              <option value="reported">Reported</option>
              <option value="not-reported">Not Reported</option>
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 transition-all hover:shadow-md ${
                  review.needsSupport
                    ? "border-l-4 border-l-danger-500 bg-danger-50/30 dark:bg-danger-900/10"
                    : review.reported
                    ? "border-l-4 border-l-warning-500"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={review.reviewer.avatar}
                      alt={review.reviewer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {review.reviewer.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.reviewer.email}
                        </span>
                        {review.needsSupport && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Needs Support
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTargetTypeBadge(
                            review.target.type
                          )}`}
                        >
                          {review.target.type}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          →
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.target.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                        review.priority
                      )}`}
                    >
                      {review.priority} priority
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        review.status
                      )}`}
                    >
                      {review.status.replace("-", " ")}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                {/* Support Ticket Information */}
                {review.supportTicketId && (
                  <div className="bg-info-50 dark:bg-info-900/10 border border-info-200 dark:border-info-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-info-800 dark:text-info-300">
                        Support Ticket: {review.supportTicketId}
                      </span>
                    </div>
                  </div>
                )}

                {/* Report Information */}
                {review.reported && review.reportDetails && (
                  <div className="bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300 mb-1">
                          Reported: {review.reportDetails.reason}
                        </h4>
                        <p className="text-sm text-warning-700 dark:text-warning-400 mb-2">
                          {review.reportDetails.description}
                        </p>
                        <p className="text-xs text-warning-600 dark:text-warning-500">
                          Reported by {review.reportDetails.reportedBy} on{" "}
                          {new Date(
                            review.reportDetails.reportDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Support Response */}
                {review.supportResponse && (
                  <div className="bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-success-600 dark:text-success-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-success-800 dark:text-success-300 mb-1">
                          Support Response
                        </h4>
                        <p className="text-sm text-success-700 dark:text-success-400 mb-2">
                          {review.supportResponse.message}
                        </p>
                        <p className="text-xs text-success-600 dark:text-success-500">
                          Responded by {review.supportResponse.respondedBy} on{" "}
                          {new Date(
                            review.supportResponse.respondedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors flex items-center space-x-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>View Trip</span>
                    </button>
                    {review.supportTicketId && (
                      <button className="text-sm text-info-600 hover:text-info-800 dark:text-info-400 dark:hover:text-info-300 transition-colors flex items-center space-x-1">
                        <span>View Ticket</span>
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="px-3 py-1 bg-success-600 text-white text-sm rounded hover:bg-success-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    )}

                    {review.status !== "rejected" && (
                      <button
                        onClick={() => handleRejectReview(review.id)}
                        className="px-3 py-1 bg-warning-600 text-white text-sm rounded hover:bg-warning-700 transition-colors flex items-center space-x-1"
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

        {/* Response Modal */}
        {showResponseModal && responseReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Respond to Review
              </h3>

              {/* Review Preview */}
              <div className="bg-gray-50 dark:bg-secondary-700 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {responseReview.reviewer.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    {renderStars(responseReview.rating)}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  "{responseReview.comment}"
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Support Response
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                  placeholder="Type your response to help the customer..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  disabled={!responseText.trim()}
                  className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Response
                </button>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default Reviews;
