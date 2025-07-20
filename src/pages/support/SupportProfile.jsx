import React, { useState, useEffect } from "react";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import api from "../../api/axios";
import dp from "../../assets/dp.png";

const SupportProfile = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState({
    firstName: "Alex",
    lastName: "Support",
    email: "alex.support@islandhop.com",
    phoneNumber: "+94 77 234 5678",
    address: "Kandy, Sri Lanka",
    role: "Support Agent",
    profilePicturefixed: dp, // Use default avatar
    joinedDate: "Loading...",
    lastActive: "Loading...",
    ticketsResolved: 0,
    avgResponseTime: "5 min",
    satisfactionRating: 4.8,
    status: "Available",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Function to format the last active time
  const formatLastActive = (timestamp) => {
    if (!timestamp) return "Never";
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diff = now - lastActive;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  // Function to format the joined date
  const formatJoinedDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const joinedDate = new Date(timestamp);
    return joinedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get user's profile data from Firebase Auth and backend
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const lastSignInTime = currentUser.metadata.lastSignInTime;
          const creationTime = currentUser.metadata.creationTime;
          const formattedLastActive = formatLastActive(lastSignInTime);
          const formattedJoinedDate = formatJoinedDate(creationTime);

          try {
            const response = await api.get(
              `/support/profile?email=${currentUser.email}`
            );
            if (response.status === 200 && response.data) {
              const profileData = response.data;
              const profilePicture = profileData.profilePictureBase64
                ? `data:image/jpeg;base64,${profileData.profilePictureBase64}`
                : profileData.profilePicture || dp; // Fallback to default avatar

              setUser((prevUser) => ({
                ...prevUser,
                firstName: profileData.firstName || prevUser.firstName,
                lastName: profileData.lastName || prevUser.lastName,
                email: profileData.email || currentUser.email,
                phoneNumber: profileData.contactNo || prevUser.phoneNumber,
                address: profileData.address || prevUser.address,
                role: profileData.role || prevUser.role,
                profilePicture: profilePicture,
                joinedDate: formattedJoinedDate,
                lastActive: formattedLastActive,
              }));
            } else {
              setUser((prevUser) => ({
                ...prevUser,
                email: currentUser.email,
                joinedDate: formattedJoinedDate,
                lastActive: formattedLastActive,
              }));
            }
          } catch (error) {
            console.warn("Failed to fetch profile from backend:", error);
            setUser((prevUser) => ({
              ...prevUser,
              email: currentUser.email,
              joinedDate: formattedJoinedDate,
              lastActive: formattedLastActive,
            }));
          }
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    fetchProfileData();
  }, []);

  const notify = (msg, type = "success") => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePasswordReset = async () => {
    try {
      // Call backend API to reset password
      const response = await api.post("/support/reset-password", {
        email: user.email,
      });

      if (response.status === 200) {
        notify("Password reset email sent successfully!");
      } else {
        notify("Failed to send password reset email. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      notify("Failed to send password reset email. Please try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.profilePicturefixed}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-secondary-700"
          />
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </p>
            <p className="text-neutral-900 dark:text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Phone Number
            </p>
            <p className="text-neutral-900 dark:text-white">{user.phoneNumber}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Address
            </p>
            <p className="text-neutral-900 dark:text-white">{user.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Joined Date
            </p>
            <p className="text-neutral-900 dark:text-white">{user.joinedDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Last Active
            </p>
            <p className="text-neutral-900 dark:text-white">{user.lastActive}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePasswordReset}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            Reset Password
          </button>
        </div>

        {showToast && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400 text-sm">
              {toastMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportProfile;
