import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';

const GuideReviews = () => {
  const [filter, setFilter] = useState('all'); // all, 5star, 4star, 3star, 2star, 1star
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, helpful

  const [reviews, setReviews] = useState([
    {
      id: 'rev001',
      tourist: {
        name: 'Emily Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d9e3?w=150&h=150&fit=crop&crop=face',
        location: 'New York, USA',
        totalReviews: 24
      },
      tour: 'Kandy Cultural Heritage Tour',
      rating: 5,
      date: '2024-12-15',
      title: 'Absolutely Incredible Experience!',
      content: 'Priya was an amazing guide! Her knowledge of Kandy\'s history and culture was exceptional. The Temple of the Tooth visit was spiritual and enlightening. The traditional lunch was delicious and the cultural show was spectacular. Highly recommend!',
      images: [
        'https://images.unsplash.com/photo-1566754827201-e6d9e4a0fc23?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop'
      ],
      helpful: 12,
      isHelpful: false,
      replied: true,
      replyDate: '2024-12-15',
      reply: 'Thank you so much Emily! It was a pleasure showing you around Kandy. I\'m thrilled you enjoyed the cultural aspects of the tour. Hope to see you again soon!'
    },
    {
      id: 'rev002',
      tourist: {
        name: 'Marco Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        location: 'Madrid, Spain',
        totalReviews: 18
      },
      tour: 'Ella Adventure Trek',
      rating: 5,
      date: '2024-12-12',
      title: 'Best Adventure Guide Ever!',
      content: 'What an adventure! The hike to Ella Rock was challenging but so rewarding. Priya kept us motivated and safe throughout. The views from the top were breathtaking. The Nine Arch Bridge visit was the perfect ending. Professional, knowledgeable, and fun!',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
      ],
      helpful: 8,
      isHelpful: true,
      replied: true,
      replyDate: '2024-12-12',
      reply: 'Muchas gracias Marco! Your enthusiasm made the trek even more enjoyable. Those views from Ella Rock never get old! Safe travels!'
    },
    {
      id: 'rev003',
      tourist: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        location: 'Singapore',
        totalReviews: 31
      },
      tour: 'Colombo Food Discovery',
      rating: 4,
      date: '2024-12-10',
      title: 'Great Food Tour with Minor Issues',
      content: 'The food tour was fantastic! Priya introduced us to amazing local dishes and hidden gems. The street food was delicious and authentic. Only minor issue was the timing - we felt a bit rushed at some stops. Overall, highly recommended for food lovers!',
      images: [],
      helpful: 6,
      isHelpful: false,
      replied: true,
      replyDate: '2024-12-10',
      reply: 'Thank you Sarah! I really appreciate your feedback about the timing. I\'ll make sure to allow more time at each stop in future tours. So glad you enjoyed the local cuisine!'
    },
    {
      id: 'rev004',
      tourist: {
        name: 'James Wilson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: 'London, UK',
        totalReviews: 42
      },
      tour: 'Sigiriya Historical Tour',
      rating: 5,
      date: '2024-12-08',
      title: 'Historical Masterpiece!',
      content: 'Priya\'s passion for Sri Lankan history shines through every story she tells. The climb up Sigiriya was well-paced and her historical insights made it truly memorable. The ancient frescoes and gardens were explained beautifully. A must-do tour!',
      images: [
        'https://images.unsplash.com/photo-1566754827201-e6d9e4a0fc23?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop'
      ],
      helpful: 15,
      isHelpful: false,
      replied: true,
      replyDate: '2024-12-08',
      reply: 'Thank you James! History comes alive when shared with enthusiastic guests like you. Sigiriya truly is a wonder of ancient engineering!'
    },
    {
      id: 'rev005',
      tourist: {
        name: 'Lisa Anderson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        location: 'Sydney, Australia',
        totalReviews: 19
      },
      tour: 'Kandy Cultural Heritage Tour',
      rating: 3,
      date: '2024-12-05',
      title: 'Good Tour but Room for Improvement',
      content: 'The tour was informative and Priya was knowledgeable. However, the group was quite large which made it difficult to hear at times. The temple visit was beautiful but felt rushed. The lunch was good. With some adjustments, this could be a 5-star experience.',
      images: [],
      helpful: 4,
      isHelpful: false,
      replied: true,
      replyDate: '2024-12-05',
      reply: 'Thank you for the honest feedback Lisa. You\'re absolutely right about the group size. I\'m now limiting groups to 8 people maximum for a more intimate experience.'
    },
    {
      id: 'rev006',
      tourist: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        location: 'Seoul, South Korea',
        totalReviews: 27
      },
      tour: 'Ella Adventure Trek',
      rating: 5,
      date: '2024-12-03',
      title: 'Perfect Adventure Day!',
      content: 'Outstanding guide and perfect day! Priya was professional, safety-conscious, and incredibly knowledgeable about the local flora and fauna. The trek was challenging but manageable. Photos don\'t do justice to the actual views. Thank you for an unforgettable experience!',
      images: [
        'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=300&fit=crop'
      ],
      helpful: 9,
      isHelpful: true,
      replied: false
    }
  ]);

  const reviewStats = {
    totalReviews: reviews.length,
    averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    ratingDistribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    },
    replyRate: (reviews.filter(r => r.replied).length / reviews.length) * 100,
    totalHelpful: reviews.reduce((sum, review) => sum + review.helpful, 0)
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || review.rating === parseInt(filter.replace('star', ''));
    const matchesSearch = review.tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const toggleHelpful = (reviewId) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1,
          isHelpful: !review.isHelpful
        };
      }
      return review;
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
            <p className="text-gray-600">Monitor and respond to tourist feedback</p>
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
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
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
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center">
                  <p className={`text-2xl font-bold ${getRatingColor(reviewStats.averageRating)}`}>
                    {reviewStats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(reviewStats.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
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
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviewStats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Reply className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reply Rate</p>
                <p className="text-2xl font-bold text-gray-900">{reviewStats.replyRate.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Helpful Votes</p>
                <p className="text-2xl font-bold text-gray-900">{reviewStats.totalHelpful}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviewStats.ratingDistribution[rating];
              const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="flex items-center w-20">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 ml-1" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                  <span className="text-sm text-gray-500 w-12">{percentage.toFixed(0)}%</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
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

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={review.tourist.avatar}
                  alt={review.tourist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{review.tourist.name}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{review.tourist.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{review.tourist.totalReviews} reviews</span>
                    <span>•</span>
                    <span>{review.tour}</span>
                    <span>•</span>
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-900">{review.rating}.0</span>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>

            {/* Review Images */}
            {review.images.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleHelpful(review.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                    review.isHelpful ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${review.isHelpful ? 'fill-current' : ''}`} />
                  <span>Helpful ({review.helpful})</span>
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
                {review.replied && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Replied
                  </span>
                )}
                {!review.replied && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                    Reply
                  </button>
                )}
              </div>
            </div>

            {/* Guide Reply */}
            {review.replied && review.reply && (
              <div className="mt-4 pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="ml-2 font-semibold text-gray-900">Priya Perera (Guide)</span>
                  <span className="ml-2 text-sm text-gray-500">• {formatDate(review.replyDate)}</span>
                </div>
                <p className="text-gray-700">{review.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'No reviews match your search criteria.' : 'You haven\'t received any reviews yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuideReviews;