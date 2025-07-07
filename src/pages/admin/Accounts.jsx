import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    userType: "all",
    verificationStatus: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for accounts
  const mockAccounts = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      userType: "tourist",
      status: "active",
      verificationStatus: "verified",
      location: "New York, USA",
      joinDate: "2024-01-15",
      lastActive: "2024-06-25",
      profileCompletion: 95,
      avatar: null,
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1-555-0124",
      userType: "guide",
      status: "active",
      verificationStatus: "pending",
      location: "San Francisco, USA",
      joinDate: "2024-02-10",
      lastActive: "2024-06-24",
      profileCompletion: 78,
      avatar: null,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1-555-0125",
      userType: "driver",
      status: "inactive",
      verificationStatus: "verified",
      location: "Los Angeles, USA",
      joinDate: "2024-03-05",
      lastActive: "2024-06-20",
      profileCompletion: 85,
      avatar: null,
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@example.com",
      phone: "+1-555-0126",
      userType: "tourist",
      status: "active",
      verificationStatus: "verified",
      location: "Seattle, USA",
      joinDate: "2024-04-12",
      lastActive: "2024-06-25",
      profileCompletion: 90,
      avatar: null,
    },
    {
      id: 5,
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      phone: "+1-555-0127",
      userType: "guide",
      status: "restricted",
      verificationStatus: "rejected",
      location: "Miami, USA",
      joinDate: "2024-05-08",
      lastActive: "2024-06-22",
      profileCompletion: 65,
      avatar: null,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts(mockAccounts);
      setFilteredAccounts(mockAccounts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter accounts based on search and filters
    let filtered = accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" || account.status === filters.status;
      const matchesUserType =
        filters.userType === "all" || account.userType === filters.userType;
      const matchesVerification =
        filters.verificationStatus === "all" ||
        account.verificationStatus === filters.verificationStatus;

      return (
        matchesSearch && matchesStatus && matchesUserType && matchesVerification
      );
    });

    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [accounts, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-success-700 bg-success-100";
      case "inactive":
        return "text-neutral-700 bg-neutral-100";
      case "restricted":
        return "text-danger-700 bg-danger-100";
      default:
        return "text-neutral-700 bg-neutral-100";
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case "verified":
        return "text-success-700 bg-success-100";
      case "pending":
        return "text-warning-700 bg-warning-100";
      case "rejected":
        return "text-danger-700 bg-danger-100";
      default:
        return "text-neutral-700 bg-neutral-100";
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case "verified":
        return CheckCircleIcon;
      case "pending":
        return ExclamationTriangleIcon;
      case "rejected":
        return XCircleIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case "tourist":
        return "text-primary-700 bg-primary-100";
      case "guide":
        return "text-info-700 bg-info-100";
      case "driver":
        return "text-warning-700 bg-warning-100";
      default:
        return "text-neutral-700 bg-neutral-100";
    }
  };

  // Pagination
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl ">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Account Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage user accounts, profiles, and access permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Account
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Total Accounts
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {accounts.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-success-900/20 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-primary-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Active Accounts
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {accounts.filter((a) => a.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-warning-900/20 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-primary-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Pending Verification
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {
                  accounts.filter((a) => a.verificationStatus === "pending")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-danger-900/20 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-primary-600 dark:text-danger-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Restricted
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {accounts.filter((a) => a.status === "restricted").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-secondary-700 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="restricted">Restricted</option>
          </select>
          <select
            value={filters.userType}
            onChange={(e) => handleFilterChange("userType", e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="tourist">Tourist</option>
            <option value="guide">Guide</option>
            <option value="driver">Driver</option>
          </select>
          <select
            value={filters.verificationStatus}
            onChange={(e) =>
              handleFilterChange("verificationStatus", e.target.value)
            }
            className="px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-neutral-200 dark:border-secondary-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-secondary-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-secondary-700">
              {currentAccounts.map((account) => {
                const VerificationIcon = getVerificationIcon(
                  account.verificationStatus
                );
                return (
                  <tr
                    key={account.id}
                    className="hover:bg-neutral-50 dark:hover:bg-secondary-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          {account.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={account.avatar}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-secondary-700 flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {account.name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            ID: {account.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-1 mb-1">
                          <EnvelopeIcon className="h-3 w-3 text-neutral-400" />
                          {account.email}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <PhoneIcon className="h-3 w-3 text-neutral-400" />
                          {account.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3 text-neutral-400" />
                          {account.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(
                            account.userType
                          )}`}
                        >
                          {account.userType}
                        </span>
                        <br />
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(
                          account.verificationStatus
                        )}`}
                      >
                        <VerificationIcon className="h-3 w-3" />
                        {account.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <CalendarIcon className="h-3 w-3" />
                          Joined:{" "}
                          {new Date(account.joinDate).toLocaleDateString()}
                        </div>
                        <div>
                          Last active:{" "}
                          {new Date(account.lastActive).toLocaleDateString()}
                        </div>
                        <div className="mt-1">
                          <div className="text-xs">
                            Profile: {account.profileCompletion}%
                          </div>
                          <div className="w-16 bg-neutral-200 dark:bg-secondary-700 rounded-full h-1 mt-1">
                            <div
                              className="bg-primary-600 h-1 rounded-full"
                              style={{ width: `${account.profileCompletion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button className="block mb-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-center">
                        Edit
                      </button>
                      <button className="block  mb-2 text-warning-600 hover:text-warning-700 dark:text-warning-400 dark:hover:text-warning-300 ">
                        Suspend
                      </button>
                      <button className="block text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 text-center">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-secondary-800 px-4 py-3 border-t border-neutral-200 dark:border-secondary-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstAccount + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastAccount, filteredAccounts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredAccounts.length}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-neutral-300 dark:border-secondary-600 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-secondary-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-neutral-300 dark:border-secondary-600 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
