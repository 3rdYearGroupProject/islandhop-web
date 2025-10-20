import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  BanknotesIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';

const Payments = () => {
  const { success, error: showError } = useToast();
  
  const [driverPayments, setDriverPayments] = useState([]);
  const [guidePayments, setGuidePayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, completed, all
  const [activeTab, setActiveTab] = useState('drivers'); // drivers, guides, history
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Payment history
  const [paymentHistory, setPaymentHistory] = useState({ drivers: [], guides: [] });
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPaymentHistory();
    }
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const [driverRes, guideRes] = await Promise.all([
        fetch('http://localhost:4013/driver'),
        fetch('http://localhost:4013/guide')
      ]);

      if (!driverRes.ok || !guideRes.ok) {
        throw new Error('Failed to fetch payment data');
      }

      const driverData = await driverRes.json();
      const guideData = await guideRes.json();

      setDriverPayments(driverData.success ? driverData.data : []);
      setGuidePayments(guideData.success ? guideData.data : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setHistoryLoading(true);

      const [driverHistoryRes, guideHistoryRes] = await Promise.all([
        fetch('http://localhost:4021/payment/drivers'),
        fetch('http://localhost:4021/payment/guides')
      ]);

      if (driverHistoryRes.ok && guideHistoryRes.ok) {
        const driverHistory = await driverHistoryRes.json();
        const guideHistory = await guideHistoryRes.json();

        setPaymentHistory({
          drivers: driverHistory.success ? driverHistory.data : [],
          guides: guideHistory.success ? guideHistory.data : []
        });
        console.log('Payment history fetched successfully');
        console.log('Driver History:', driverHistory);
        console.log('Guide History:', guideHistory);
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchBankDetails = async (email) => {
    try {
      setBankLoading(true);
      setBankDetails(null);

      const response = await fetch(`http://localhost:4021/bank/${email}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBankDetails(data.data);
        } else {
          setBankDetails({ error: 'Bank details not found' });
        }
      } else {
        setBankDetails({ error: 'Bank details not available' });
      }
    } catch (err) {
      console.error('Error fetching bank details:', err);
      setBankDetails({ error: 'Failed to load bank details' });
    } finally {
      setBankLoading(false);
    }
  };

  const handleViewBankDetails = async (email) => {
    setShowBankDetails(true);
    await fetchBankDetails(email);
  };

  const handleMarkAsPaid = (payment, type) => {
    setSelectedPayment({ ...payment, type });
    setShowPaymentModal(true);
    setEvidenceFile(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size should be less than 5MB');
        return;
      }
      setEvidenceFile(file);
    }
  };

  const submitPayment = async () => {
    if (!selectedPayment || !evidenceFile) {
      showError('Please upload evidence before submitting');
      return;
    }

    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append('evidence', evidenceFile);

      const endpoint = selectedPayment.type === 'driver' 
        ? `http://localhost:4021/payment/update/drivers/${selectedPayment.tripId}`
        : `http://localhost:4021/payment/update/guides/${selectedPayment.tripId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        success('Payment marked as paid successfully!');
        setShowPaymentModal(false);
        setSelectedPayment(null);
        setEvidenceFile(null);
        // Refresh payment data
        await fetchPayments();
      } else {
        throw new Error('Failed to update payment');
      }
    } catch (err) {
      console.error('Error submitting payment:', err);
      showError('Failed to update payment. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const filterPayments = (payments) => {
    let filtered = payments;

    // Filter by payment status
    if (filter === 'pending') {
      filtered = filtered.filter(payment => payment.paid === 0);
    } else if (filter === 'completed') {
      filtered = filtered.filter(payment => payment.paid === 1);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        getPaymentIdentifier(payment, 'driver').toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPaymentIdentifier(payment, 'guide').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.driverEmail && payment.driverEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.guideEmail && payment.guideEmail.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate a more readable payment identifier
  const getPaymentIdentifier = (payment, type) => {
    const date = new Date(payment.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit' 
    });
    const serviceType = type === 'driver' ? 'Driver Service' : 'Guide Service';
    const email = type === 'driver' ? payment.driverEmail : payment.guideEmail;
    const userName = email ? email.split('@')[0] : 'Unknown';
    
    return `${serviceType} - ${userName} (${formattedDate})`;
  };

  // Generate payment identifier for table display (shorter version)
  const getTablePaymentIdentifier = (payment, type) => {
    const date = new Date(payment.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit' 
    });
    const serviceType = type === 'driver' ? 'Driver' : 'Guide';
    const email = type === 'driver' ? payment.driverEmail : payment.guideEmail;
    const userName = email ? email.split('@')[0] : 'Unknown';
    
    return `${serviceType} - ${userName} (${formattedDate})`;
  };

  const PaymentCard = ({ payment, type }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${payment.paid === 0 ? 'bg-yellow-100' : 'bg-green-100'}`}>
            {payment.paid === 0 ? (
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            ) : (
              <CheckCircleIconSolid className="h-5 w-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{getPaymentIdentifier(payment, type)}</h3>
            <p className="text-sm text-gray-500">
              {type === 'driver' ? payment.driverEmail : payment.guideEmail}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          payment.paid === 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {payment.paid === 0 ? 'Pending' : 'Paid'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Amount</p>
          <p className="font-semibold text-lg text-gray-900">{formatCurrency(payment.cost)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created</p>
          <p className="text-sm text-gray-900">{formatDate(payment.createdAt)}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleViewBankDetails(type === 'driver' ? payment.driverEmail : payment.guideEmail)}
          className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <BanknotesIcon className="h-4 w-4 mr-2" />
          View Bank Details
        </button>
        
        {payment.paid === 0 && (
          <button
            onClick={() => handleMarkAsPaid(payment, type)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Manage driver and guide payments</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={fetchPayments}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'drivers', label: 'Driver Payments', icon: UserIcon },
              { key: 'guides', label: 'Guide Payments', icon: UserIcon },
              { key: 'history', label: 'Payment History', icon: CalendarIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      {activeTab !== 'history' && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'pending', label: 'Pending' },
                { key: 'completed', label: 'Completed' },
                { key: 'all', label: 'All' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === option.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Service or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'drivers' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Driver Payments</h2>
            <span className="text-sm text-gray-500">
              {filterPayments(driverPayments).length} payment{filterPayments(driverPayments).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterPayments(driverPayments).map((payment) => (
              <PaymentCard key={payment._id} payment={payment} type="driver" />
            ))}
          </div>
          {filterPayments(driverPayments).length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500">No driver payments match your current filters.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'guides' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Guide Payments</h2>
            <span className="text-sm text-gray-500">
              {filterPayments(guidePayments).length} payment{filterPayments(guidePayments).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterPayments(guidePayments).map((payment) => (
              <PaymentCard key={payment._id} payment={payment} type="guide" />
            ))}
          </div>
          {filterPayments(guidePayments).length === 0 && (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500">No guide payments match your current filters.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment History</h2>
          {historyLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Payment History</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.drivers.map((payment) => (
                        <tr key={payment._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getTablePaymentIdentifier(payment, 'driver')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.driverEmail}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payment.cost)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.paid === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.paid === 1 ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Guide Payment History</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.guides.map((payment) => (
                        <tr key={payment._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getTablePaymentIdentifier(payment, 'guide')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.guideEmail}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payment.cost)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.paid === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.paid === 1 ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bank Details Modal */}
      {showBankDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
              <button
                onClick={() => setShowBankDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {bankLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : bankDetails?.error ? (
              <div className="text-center py-8">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{bankDetails.error}</p>
              </div>
            ) : bankDetails ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                  <p className="mt-1 text-sm text-gray-900">{bankDetails.accountHolderName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <p className="mt-1 text-sm text-gray-900">{bankDetails.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <p className="mt-1 text-sm text-gray-900">****{bankDetails.accountNumber.slice(-4)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch Code</label>
                  <p className="mt-1 text-sm text-gray-900">{bankDetails.branchCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                  <p className="mt-1 text-sm text-gray-900">{bankDetails.branchName}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mark Payment as Paid</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-semibold">{getPaymentIdentifier(selectedPayment, selectedPayment.type)}</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">Amount</p>
                <p className="font-semibold">{formatCurrency(selectedPayment.cost)}</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">
                  {selectedPayment.type === 'driver' ? 'Driver' : 'Guide'}
                </p>
                <p className="font-semibold">
                  {selectedPayment.type === 'driver' ? selectedPayment.driverEmail : selectedPayment.guideEmail}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Evidence *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="evidence-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input
                        id="evidence-upload"
                        name="evidence-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              {evidenceFile && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {evidenceFile.name} selected
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                disabled={!evidenceFile || uploadLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadLoading ? 'Processing...' : 'Mark as Paid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
