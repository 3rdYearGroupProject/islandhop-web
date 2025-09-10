import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getAuth } from "firebase/auth";
import userServicesApi from "../../api/axios";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    userType: "tourist", // Default to tourist instead of "all"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    contact_no: "",
    permission: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Fetch users from backend with Firebase token based on user type
  async function getUsersByType(userType) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      
      // Map userType to appropriate endpoint
      const endpoint = `http://localhost:4011/users/${userType}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log(`Fetched ${userType} users:`, response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`${userType} users data:`, data);
      
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error(`Error fetching ${userType} users:`, error);
      throw error;
    }
  }

  useEffect(() => {
    setLoading(true);
    getUsersByType(filters.userType)
      .then((users) => {
        // Map API response to local format for table
        const mapped = users.map((u, idx) => ({
          id: idx + 1,
          name: `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.trim(),
          email: u.email,
          phone: u.phone || u.contact_no || "",
          userType: filters.userType, // Use the filter type since we're fetching by type
          status: u.status ? u.status.toLowerCase() : "",
          location: u.location || u.address || "",
          joinDate: u.joinDate || u.createdAt || "",
          lastActive: u.lastActive || "",
          profileCompletion: u.profileCompletion || 100,
          avatar: u.profilePicUrl || u.avatar || null,
        }));
        setAccounts(mapped);
        setFilteredAccounts(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
        setAccounts([]);
        setFilteredAccounts([]);
        setLoading(false);
      });
  }, [filters.userType]); // Changed dependency to filters.userType

  useEffect(() => {
    // Filter accounts based on search and status only (userType filtering is now done at API level)
    let filtered = accounts.filter((account) => {
      const matchesSearch =
        (account.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
         account.email?.toLowerCase().includes(filters.search.toLowerCase())) ?? false;

      let matchesStatus = false;
      if (filters.status === "all") {
        matchesStatus = true;
      } else {
        matchesStatus = account.status?.toLowerCase() === filters.status.toLowerCase();
      }

      return matchesSearch && matchesStatus;
    });

    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [accounts, filters.search, filters.status]); // Removed filters.userType from dependencies

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

  // Function to get last sign-in from Firebase
  const getLastSignIn = async (email) => {
    try {
      // TODO: Implement Firebase Admin SDK or backend API call to get user last sign-in
      // For now, return placeholder data
      return new Date().toISOString();
    } catch (error) {
      console.error("Error getting last sign-in:", error);
      return null;
    }
  };

  // Handle action confirmation
  const handleAction = (account, action) => {
    setSelectedAccount(account);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  // Confirm and execute action
  const confirmActionExecute = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      // Backend expects PUT /users/status with { email, status }
      const newStatus = confirmAction === "activate" ? "ACTIVE" : "DEACTIVATED";
      const payload = {
        email: selectedAccount.email,
        status: newStatus,
      };
      const response = await userServicesApi.put("/users/status", payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200 && response.data.status === "success") {
        // Refresh the accounts list
        getUsersByType(filters.userType)
          .then((users) => {
            const mapped = users.map((u, idx) => ({
              id: idx + 1,
              name: `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.trim(),
              email: u.email,
              phone: u.phone || u.contact_no || "",
              userType: filters.userType,
              status: u.status ? u.status.toLowerCase() : "",
              location: u.location || u.address || "",
              joinDate: u.joinDate || u.createdAt || "",
              lastActive: u.lastActive || "",
              profileCompletion: u.profileCompletion || 100,
              avatar: u.profilePicUrl || u.avatar || null,
            }));
            setAccounts(mapped);
            setFilteredAccounts(mapped);
            setLoading(false);
          })
          .catch(() => {
            setAccounts([]);
            setFilteredAccounts([]);
            setLoading(false);
          });
        setShowConfirmModal(false);
        setSelectedAccount(null);
        setConfirmAction(null);
      } else {
        alert("Failed to update user status. Please try again.");
        setShowConfirmModal(false);
        setSelectedAccount(null);
        setConfirmAction(null);
      }
    } catch (error) {
      console.error(`Error ${confirmAction} user:`, error);
      alert("Failed to update user status. Please try again.");
      setShowConfirmModal(false);
      setSelectedAccount(null);
      setConfirmAction(null);
    }
  };

  const sendEmailToGroup = async (email) => {
    try {
      const auth = getAuth(); // Initialize Firebase auth
      const authToken = await auth.currentUser.getIdToken();
      const requesterId = auth.currentUser.uid;

      const response = await fetch('http://localhost:8093/api/v1/firebase/user/email-to-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email,
          groupId: '6872785e3372e21e0948ecc8',
          requesterId
        })
      });

      if (response.ok) {
        console.log(`Email successfully sent to group for ${email}`);
      } else {
        console.error(`Failed to send email to group for ${email}:`, response.status);
      }
    } catch (error) {
      console.error(`Error sending email to group for ${email}:`, error);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // First name validation
    if (!formData.first_name) {
      errors.first_name = "First name is required";
    } else if (formData.first_name.length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }
    
    // Last name validation
    if (!formData.last_name) {
      errors.last_name = "Last name is required";
    } else if (formData.last_name.length < 2) {
      errors.last_name = "Last name must be at least 2 characters";
    }
    
    // Address validation
    if (!formData.address) {
      errors.address = "Address is required";
    } else if (formData.address.length < 10) {
      errors.address = "Please enter a complete address (minimum 10 characters)";
    }
    
    // Contact number validation
    if (!formData.contact_no) {
      errors.contact_no = "Contact number is required";
    } else if (!/^\+94[0-9]{9}$/.test(formData.contact_no)) {
      errors.contact_no = "Please enter a valid Sri Lankan phone number (+94xxxxxxxxx)";
    }
    
    // Permission validation
    if (!formData.permission) {
      errors.permission = "Permission level is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      address: "",
      contact_no: "",
      permission: ""
    });
    setFormErrors({});
    setAddError("");
    setAddSuccess("");
  };

  // Update the account creation logic
  const handleCreateSupportAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      const token = await user.getIdToken();
      
      // Make API call to backend with all form data
      const response = await fetch('http://localhost:8061/register-support-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          address: formData.address,
          contact_no: formData.contact_no,
          permission: parseInt(formData.permission)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAddSuccess("Support agent account created successfully! Credentials have been sent via email.");
        
        // Send email to group
        await sendEmailToGroup(formData.email);
        
        // Reset form and refresh accounts list
        setTimeout(() => {
          setShowAddModal(false);
          resetForm();
          // Refresh accounts list
          getUsersByType(filters.userType)
            .then((users) => {
              setAccounts(users || []);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        }, 2000);
        
      } else {
        setAddError(data.message || "Failed to create support agent account");
      }
    } catch (err) {
      console.error("Error creating support account:", err);
      setAddError("Network error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 ">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              User Accounts
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              User accounts and access permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Support Account
          </button>
        </div>

        {/* Add Support Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Create Support Agent Account</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.email ? 'border-red-500' : 'border-neutral-300 dark:border-secondary-600'
                    }`}
                    placeholder="Enter email address"
                    disabled={addLoading}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={e => handleFormChange('first_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.first_name ? 'border-red-500' : 'border-neutral-300 dark:border-secondary-600'
                    }`}
                    placeholder="Enter first name"
                    disabled={addLoading}
                  />
                  {formErrors.first_name && <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={e => handleFormChange('last_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.last_name ? 'border-red-500' : 'border-neutral-300 dark:border-secondary-600'
                    }`}
                    placeholder="Enter last name"
                    disabled={addLoading}
                  />
                  {formErrors.last_name && <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_no}
                    onChange={e => handleFormChange('contact_no', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.contact_no ? 'border-red-500' : 'border-neutral-300 dark:border-secondary-600'
                    }`}
                    placeholder="+94771234567"
                    disabled={addLoading}
                  />
                  {formErrors.contact_no && <p className="text-red-500 text-sm mt-1">{formErrors.contact_no}</p>}
                </div>

                {/* Permission Level */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Permission Level *
                  </label>
                  <select
                    value={formData.permission}
                    onChange={e => handleFormChange('permission', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.permission ? 'border-red-500' : 'border-neutral-300 dark:border-secondary-600'
                    }`}
                    disabled={addLoading}
                  >
                    <option value="">Select permission level</option>
                    <option value="1">Verification</option>
                    <option value="2">Reviews</option>
                    <option value="3">Complaints</option>
                    <option value="4">All</option>
                  </select>
                  {formErrors.permission && <p className="text-red-500 text-sm mt-1">{formErrors.permission}</p>}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={e => handleFormChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                      formErrors.address ? 'border-red-500' : 'border-neutral-300 dark:border-secondary-600'
                    }`}
                    placeholder="Enter complete address"
                    disabled={addLoading}
                  />
                  {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                </div>
              </div>

              {/* Error and Success Messages */}
              {addError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{addError}</p>
                </div>
              )}
              {addSuccess && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 text-sm">{addSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-neutral-200 dark:border-secondary-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-secondary-700 hover:bg-neutral-200 dark:hover:bg-secondary-600 rounded-lg transition-colors"
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSupportAccount}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  Inactive Accounts
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {accounts.filter((a) => a.status === "inactive" || a.status === "deactivated").length}
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
              <option value="inactive">Inactive/Deactivated</option>
            </select>
            <select
              value={filters.userType}
              onChange={(e) => handleFilterChange("userType", e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="tourist">Tourist</option>
              <option value="guide">Guide</option>
              <option value="driver">Driver</option>
              <option value="support">Support</option>
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
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-secondary-700">
                {currentAccounts.map((account) => {
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white">
                          {account.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(
                            account.userType
                          )}`}
                        >
                          {account.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        {account.status === "active" ? (
                          <button 
                            onClick={() => handleAction(account, "deactivate")}
                            className="block mb-2 text-warning-600 hover:text-warning-700 dark:text-warning-400 dark:hover:text-warning-300"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction(account, "activate")}
                            className="block mb-2 text-success-600 hover:text-success-700 dark:text-success-400 dark:hover:text-success-300"
                          >
                            Activate
                          </button>
                        )}
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

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-warning-600" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Confirm Action
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Are you sure you want to {confirmAction} the account for{" "}
                <span className="font-medium">{selectedAccount?.name}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-secondary-700 hover:bg-neutral-200 dark:hover:bg-secondary-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmActionExecute}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    confirmAction === "activate"
                      ? "bg-success-600 hover:bg-success-700"
                      : "bg-warning-600 hover:bg-warning-700"
                  }`}
                >
                  {confirmAction === "activate" ? "Activate" : "Deactivate"}
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
