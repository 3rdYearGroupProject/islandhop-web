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
    userType: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Fetch users from backend with Firebase token
  async function getAllUsers() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const response = await userServicesApi.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("Fetched users:", response.data);
      if (response.status === 200 && response.data.status === "success") {
        return response.data.users;
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((users) => {
        // Map API response to local format for table
        const mapped = users.map((u, idx) => ({
          id: idx + 1,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          phone: u.phone || "",
          userType: u.accountType ? u.accountType.toLowerCase() : "",
          status: u.status ? u.status.toLowerCase() : "",
          location: u.location || "",
          joinDate: u.joinDate || "",
          lastActive: u.lastActive || "",
          profileCompletion: u.profileCompletion || 100,
          avatar: u.profilePicUrl || null,
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
  }, []);

  useEffect(() => {
    // Filter accounts based on search and filters
    let filtered = accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.email.toLowerCase().includes(filters.search.toLowerCase());
      let matchesStatus = false;
      if (filters.status === "all") {
        matchesStatus = true;
      } else if (filters.status === "active") {
        matchesStatus = account.status === "active";
      } else if (filters.status === "inactive") {
        matchesStatus = account.status === "inactive" || account.status === "deactivated";
      }
      const matchesUserType =
        filters.userType === "all" || account.userType === filters.userType;

      return matchesSearch && matchesStatus && matchesUserType;
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
        getAllUsers()
          .then((users) => {
            const mapped = users.map((u, idx) => ({
              id: idx + 1,
              name: `${u.firstName} ${u.lastName}`,
              email: u.email,
              phone: u.phone || "",
              userType: u.accountType ? u.accountType.toLowerCase() : "",
              status: u.status ? u.status.toLowerCase() : "",
              location: u.location || "",
              joinDate: u.joinDate || "",
              lastActive: u.lastActive || "",
              profileCompletion: u.profileCompletion || 100,
              avatar: u.profilePicUrl || null,
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

  // Update the account creation logic
  const handleCreateSupportAccount = async () => {
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    if (!addEmail) {
      setAddError("Email is required");
      setAddLoading(false);
      return;
    }
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();
      const response = await userServicesApi.post("/admin/create/support", { email: addEmail }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.status === 200 && response.data.message) {
        setAddSuccess(response.data.message);
        setAddEmail("");
        // Send email to group
        await sendEmailToGroup(addEmail);
      } else if (response.status === 409) {
        setAddError("Account already exists");
      } else {
        setAddError(response.data.message || "Failed to create account");
      }
    } catch (err) {
      setAddError(err?.response?.data?.message || err.message || "Error creating account");
    }
    setAddLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Create Support Agent Account</h3>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Support Agent Email</label>
              <input
                type="email"
                value={addEmail}
                onChange={e => setAddEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-900 text-neutral-900 dark:text-white mb-4"
                placeholder="Enter email address"
                disabled={addLoading}
              />
              {addError && <div className="text-danger-600 mb-2 text-sm">{addError}</div>}
              {addSuccess && <div className="text-success-600 mb-2 text-sm">{addSuccess}</div>}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddEmail("");
                    setAddError("");
                    setAddSuccess("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-secondary-700 hover:bg-neutral-200 dark:hover:bg-secondary-600 rounded-lg transition-colors"
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSupportAccount}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  disabled={addLoading}
                >
                  {addLoading ? "Creating..." : "Create"}
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
              <option value="all">All Types</option>
              <option value="tourist">Tourist</option>
              <option value="guide">Guide</option>
              <option value="driver">Driver</option>
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
