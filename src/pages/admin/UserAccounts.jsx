import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const UserAccounts = ({
  onPageChange = null,
  setSelectedUserId = null,
  users: propUsers = null,
  setUsers: propSetUsers = null,
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    userType: "all",
    joinedDate: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [showAddSupportModal, setShowAddSupportModal] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [addSupportLoading, setAddSupportLoading] = useState(false);
  const [addSupportMessage, setAddSupportMessage] = useState("");

  // Mock data - In a real app, this would come from your backend/Firebase
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      userType: "traveler",
      status: "active",
      joinedDate: "2024-01-15",
      lastActive: "2024-06-20",
      profileComplete: true,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      totalBookings: 5,
      verificationStatus: "verified"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      userType: "guide",
      status: "active",
      joinedDate: "2024-02-10",
      lastActive: "2024-06-25",
      profileComplete: true,
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      totalBookings: 12,
      verificationStatus: "verified"
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.w@email.com",
      userType: "driver",
      status: "inactive",
      joinedDate: "2024-03-05",
      lastActive: "2024-05-15",
      profileComplete: false,
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      totalBookings: 0,
      verificationStatus: "pending"
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.d@email.com",
      userType: "traveler",
      status: "restricted",
      joinedDate: "2024-04-12",
      lastActive: "2024-06-18",
      profileComplete: true,
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
      totalBookings: 3,
      verificationStatus: "verified"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.b@email.com",
      userType: "guide",
      status: "active",
      joinedDate: "2024-05-20",
      lastActive: "2024-06-24",
      profileComplete: true,
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      totalBookings: 8,
      verificationStatus: "verified"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === "all" || user.status === filters.status;
      const matchesUserType = filters.userType === "all" || user.userType === filters.userType;
      
      return matchesSearch && matchesStatus && matchesUserType;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, filters, sortConfig]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleUpdateUser = (userId) => {
    if (setSelectedUserId && onPageChange) {
      setSelectedUserId(userId);
      onPageChange('UpdateUserProfile');
    }
  };

  const handleRestrictUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'restricted' ? 'active' : 'restricted' }
        : user
    ));
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
      inactive: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
      restricted: 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-300'
    };
    return badges[status] || badges.inactive;
  };

  const getUserTypeBadge = (userType) => {
    const badges = {
      traveler: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
      driver: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
      guide: 'bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-300'
    };
    return badges[userType] || badges.traveler;
  };

  const getVerificationIcon = (status) => {
    if (status === 'verified') {
      return <CheckCircleIcon className="h-4 w-4 text-success-600" />;
    } else if (status === 'pending') {
      return <XCircleIcon className="h-4 w-4 text-warning-600" />;
    }
    return <XCircleIcon className="h-4 w-4 text-danger-600" />;
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
                <div key={i} className="h-16 bg-gray-200 dark:bg-secondary-700 rounded"></div>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                User Accounts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage user accounts, profiles, and access permissions
              </p>
            </div>
            <button
              onClick={() => setShowAddSupportModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>Add Support User</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-success-600">{users.filter(u => u.status === 'active').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-warning-600">{users.filter(u => u.verificationStatus === 'pending').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Verification</div>
            </div>
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-gray-200 dark:border-secondary-700">
              <div className="text-2xl font-bold text-danger-600">{users.filter(u => u.status === 'restricted').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Restricted</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="restricted">Restricted</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
              value={filters.userType}
              onChange={(e) => handleFilterChange('userType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="traveler">Traveler</option>
              <option value="driver">Driver</option>
              <option value="guide">Guide</option>
            </select>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-gray-200 dark:border-secondary-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-secondary-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-secondary-600"
                    onClick={() => handleSort('name')}
                  >
                    User
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-secondary-600"
                    onClick={() => handleSort('joinedDate')}
                  >
                    Joined
                    {sortConfig.key === 'joinedDate' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-800 divide-y divide-gray-200 dark:divide-secondary-700">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {user.name}
                            {!user.profileComplete && (
                              <span className="ml-2 text-xs text-warning-600">Incomplete</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeBadge(user.userType)}`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getVerificationIcon(user.verificationStatus)}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {user.verificationStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateUser(user.id)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                          title="Edit User"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRestrictUser(user.id)}
                          className={`transition-colors ${
                            user.status === 'restricted'
                              ? 'text-success-600 hover:text-success-900 dark:text-success-400'
                              : 'text-danger-600 hover:text-danger-900 dark:text-danger-400'
                          }`}
                          title={user.status === 'restricted' ? 'Unrestrict User' : 'Restrict User'}
                        >
                          <ShieldExclamationIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white dark:bg-secondary-800 px-4 py-3 border-t border-gray-200 dark:border-secondary-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-secondary-700 border border-gray-300 dark:border-secondary-600 hover:bg-gray-50 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-secondary-700 border border-gray-300 dark:border-secondary-600 hover:bg-gray-50 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'bg-white dark:bg-secondary-700 border-gray-300 dark:border-secondary-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-secondary-600'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-secondary-600 bg-white dark:bg-secondary-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccounts;
