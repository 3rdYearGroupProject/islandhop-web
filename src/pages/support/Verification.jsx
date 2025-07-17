import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckBadgeIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ClockIcon,
  XMarkIcon,
  UserIcon,
  PencilIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { RefreshCw, AlertCircle } from "lucide-react";

import GuideVerificationForm from "../../components/GuideVerificationForm";

const Verification = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending, verified, rejected

  // Mock data for demonstration
  const mockGuides = [
    {
      id: 1,
      name: "Priya Perera",
      phone: "+94 77 123 4567",
      licenseNumber: "GD123456789",
      status: "pending",
      submittedAt: "2025-07-10T10:30:00Z",
      documents: {
        // license: "/documents/license_priya_perera.pdf",
        // identity: "/documents/id_priya_perera.pdf",
        certificate: "/documents/certificate_priya_perera.pdf",
      },
      specializations: [
        "Cultural Tours",
        "Historical Sites",
        "Adventure Tours",
      ],
      languages: ["English", "Sinhala", "Tamil"],
      experience: "5 years",
      qualifications: "Tourism & Hospitality Management Degree",
      type: "guide",
    },
    {
      id: 2,
      name: "Rohan Silva",
      phone: "+94 77 987 6543",
      licenseNumber: "GD987654321",
      status: "pending",
      submittedAt: "2025-07-12T14:15:00Z",
      documents: {
        // license: "/documents/license_rohan_silva.pdf",
        // identity: "/documents/id_rohan_silva.pdf",
        certificate: "/documents/certificate_rohan_silva.pdf",
      },
      specializations: ["Wildlife Tours", "Nature Walks", "Photography Tours"],
      languages: ["English", "Sinhala", "German"],
      experience: "3 years",
      qualifications: "Wildlife Conservation Certificate",
      type: "driver",
    },
    {
      id: 3,
      name: "Kamala Fernando",
      phone: "+94 77 555 0123",
      licenseNumber: "GD555000123",
      status: "verified",
      submittedAt: "2025-07-08T09:00:00Z",
      verifiedAt: "2025-07-09T16:30:00Z",
      documents: {
        // license: "/documents/license_kamala_fernando.pdf",
        // identity: "/documents/id_kamala_fernando.pdf",
        certificate: "/documents/certificate_kamala_fernando.pdf",
      },
      type: "guide",
    },
  ];

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await axios.get('http://localhost:8080/api/guides/pending-verification');
      // setGuides(response.data);

      // Using mock data for now
      setTimeout(() => {
        setGuides(mockGuides);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error fetching guides:", err);
      setError("Failed to load guides. Using sample data.");
      setGuides(mockGuides);
      setLoading(false);
    }
  };

  const handleDownloadDocument = (documentUrl, guideName, docType) => {
    // TODO: Implement actual document download
    console.log(
      `Downloading ${docType} document for ${guideName}: ${documentUrl}`
    );
    alert(`Downloading ${docType} document for ${guideName}`);
  };

  const handleVerifyCertificate = (certificateData) => {
    // TODO: Implement API call to verify certificate
    console.log("Verifying certificate:", certificateData);

    // Update local state
    setGuides(
      guides.map((guide) =>
        guide.id === certificateData.guideId
          ? {
              ...guide,
              status: "verified",
              verifiedAt: new Date().toISOString(),
              verification: {
                certificateIssuer: certificateData.certificateIssuer,
                issueDate: certificateData.issueDate,
                expiryDate: certificateData.expiryDate,
              },
            }
          : guide
      )
    );

    setShowVerificationForm(false);
    setSelectedGuide(null);
  };

  const handleRejectGuide = (guideId, reason) => {
    // TODO: Implement API call to reject guide
    console.log("Rejecting guide:", guideId, reason);

    // Update local state
    setGuides(
      guides.map((guide) =>
        guide.id === guideId
          ? {
              ...guide,
              status: "rejected",
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : guide
      )
    );
  };

  const filteredGuides = guides.filter((guide) => {
    if (filter === "all") return true;
    return guide.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "verified":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "rejected":
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (showVerificationForm && selectedGuide) {
    return (
      <GuideVerificationForm
        guide={selectedGuide}
        onVerify={handleVerifyGuide}
        onCancel={() => {
          setShowVerificationForm(false);
          setSelectedGuide(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verification Requests
            </h1>
            <p className="text-gray-600">
              Review and verify documents
            </p>
          </div>
          <button
            onClick={fetchGuides}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {guides.filter((g) => g.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {guides.filter((g) => g.status === "verified").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {guides.filter((g) => g.status === "rejected").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {guides.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "verified", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="text-gray-600">Loading requests...</span>
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

      {/* Requests List */}
      {!loading && (
        <div className="space-y-4">
          {filteredGuides.map((guide) => (
            Object.entries(guide.documents).map(([type, url]) => (
              <div
                key={`${guide.id}-${type}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {guide.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Request From: {guide.type === "driver" ? "Driver" : "Guide"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        guide.status
                      )}`}
                    >
                      {getStatusIcon(guide.status)}
                      <span className="ml-1">
                        {guide.status.charAt(0).toUpperCase() +
                          guide.status.slice(1)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Document View */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Document</h4>
                  <button
                    onClick={() => window.open(url, "_blank")}
                    className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    View {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                </div>

                {/* Verification Form */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Verification Form</h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleVerifyCertificate({
                        guideId: guide.id,
                        certificateIssuer: formData.get("issuer"),
                        issueDate: formData.get("issueDate"),
                        expiryDate: formData.get("expiryDate"),
                      });
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issuer
                      </label>
                      <input
                        type="text"
                        name="issuer"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        name="issueDate"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => handleRejectGuide(guide.id, "Rejected by admin")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Reject
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Accept
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ))
          ))}

          {/* Empty State */}
          {filteredGuides.length === 0 && !loading && (
            <div className="text-center py-12">
              <CheckBadgeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No requests found
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "No verification requests submitted yet."
                  : `No ${filter} requests found.`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verification;
