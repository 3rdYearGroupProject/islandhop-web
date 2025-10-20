import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";
import { useToast } from "../components/ToastProvider";
import sriLankaVideo from "../assets/sri-lanka-video.mp4";
import islandhopFooterLogo from "../assets/islandhop footer 1.png";
import api from "../api/axios";
import { encryptUserData } from "../utils/userStorage";

// Add GoogleAuthProvider instance
const provider = new GoogleAuthProvider();

const ProfessionalSignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Function to securely store user data
  const storeUserData = (firebaseUser, role) => {
    console.log("🔐 Storing user data securely...");

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      role: role,
      loginTimestamp: Date.now(),
      tokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      lastLoginMethod: firebaseUser.providerData?.[0]?.providerId || "password",
    };

    console.log("📝 User data to store:", {
      uid: userData.uid,
      email: userData.email,
      role: userData.role,
      loginMethod: userData.lastLoginMethod,
    });

    // Store encrypted user data
    encryptUserData(userData);
    console.log("✅ User data stored securely");
  };

  // Helper to get endpoint based on role
  const getEndpoint = () => {
    switch (formData.role) {
      case "driver":
        return "/driver/session-register";
      case "guide":
        return "/guide/session-register";
      default:
        return "/tourist/session-register";
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.role) {
      setError("Please select your professional role");
      toast.error("Please select your professional role");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    let userCredential = null;
    try {
      console.log("handleEmailSignup called 1");

      // Create user in Firebase
      userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();
      console.log("Professional user created:", userCredential.user);

      // Send ID token and role to backend
      const endpoint = getEndpoint();
      const res = await api.post(endpoint, {
        idToken,
        role: formData.role,
      });

      console.log("Backend response (professional signup):", res);

      if (res.status === 200) {
        toast.success(
          "Professional account created successfully! Please sign in to continue.",
          {
            duration: 3000,
          }
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        // If backend fails, delete Firebase user
        await deleteUser(userCredential.user);
        toast.error("Registration failed on server. Please try again.");
        setError("Registration failed on server");
      }
    } catch (err) {
      // If Firebase user was created but any error occurs, delete user
      if (userCredential && userCredential.user) {
        try {
          await deleteUser(userCredential.user);
        } catch (e) {
          /* ignore */
        }
      }

      toast.error(err.message || "Registration failed. Please try again.");
      setError(err.message || "Registration error");
      console.log("Error during professional signup:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!formData.role) {
      setError("Please select your professional role first");
      toast.error("Please select your professional role first");
      return;
    }

    setLoading(true);
    setError("");

    let result = null;
    try {
      result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      console.log("🔑 Got Firebase token, sending to backend...");
      // Send ID token to backend for session registration with role
      const endpoint = getEndpoint();
      const res = await api.post(endpoint, {
        idToken,
        role: formData.role,
      });
      console.log("📨 Google professional signup response:", res);

      if (res.status === 200 && res.data && res.data.role) {
        // Store user data
        storeUserData(result.user, res.data.role);

        toast.success("Professional account created successfully!", {
          duration: 2000,
        });

        // Navigate based on role immediately for Google signup
        const userRole = res.data.role;
        setTimeout(() => {
          switch (userRole) {
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "support":
              navigate("/support/dashboard");
              break;
            case "guide":
              navigate("/guide/dashboard");
              break;
            case "driver":
              navigate("/driver/dashboard");
              break;
            case "tourist":
            default:
              navigate("/tourist/dashboard");
              break;
          }
        }, 1000);
      } else {
        // If backend fails, delete Firebase user
        await deleteUser(result.user);
        toast.error("Registration failed on server. Please try again.");
        setError("Registration failed on server");
      }
    } catch (err) {
      // If Firebase user was created but any error occurs, delete user
      if (result && result.user) {
        try {
          await deleteUser(result.user);
        } catch (e) {
          /* ignore */
        }
      }

      toast.error(err.message || "Google signup failed. Please try again.");
      setError(err.message || "Google signup error");
      console.error("❌ Error during Google professional signup:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Top left logo */}
      <div
        className="absolute top-2 left-2 md:top-4 md:left-4 lg:top-6 lg:left-6 z-20 flex items-center cursor-pointer p-2 md:p-3 lg:p-4"
        onClick={handleLogoClick}
      >
        <img
          src={islandhopFooterLogo}
          alt="IslandHop"
          className="h-7 md:h-8 lg:h-9 xl:h-10"
        />
      </div>

      {/* Left side - Video section */}
      <div className="hidden md:flex md:w-1/2 relative p-4">
        <div className="w-full h-full relative overflow-hidden rounded-2xl">
          <video
            className="w-full h-full object-cover rounded-2xl"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={sriLankaVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-end justify-end pb-8 pr-8">
            <div className="text-right text-white">
              <h3 className="text-5xl font-normal mb-4">
                Join Our Professional Network
              </h3>
              <p className="text-xl opacity-90">
                Become a part of Sri Lanka's premier travel service community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Professional Account
            </h2>
            <p className="text-gray-600">
              Join as a driver or guide and start earning with IslandHop
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Your Role
            </h3>
            <div className="space-y-3">
              <label
                className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                  formData.role === "driver"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={formData.role === "driver"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Driver</h4>
                    <p className="text-sm text-gray-600">
                      Provide transportation services to travelers
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                  formData.role === "guide"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="guide"
                  checked={formData.role === "guide"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tour Guide</h4>
                    <p className="text-sm text-gray-600">
                      Share your local knowledge and expertise
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.5 7.5m2.378 2.378a3 3 0 004.243-4.243M12 7.5c2.478 0 4.743.943 6.457 2.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.5 7.5m2.378 2.378a3 3 0 004.243-4.243M12 7.5c2.478 0 4.743.943 6.457 2.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-black hover:text-gray-700"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Professional Account"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-black focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-3">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-black hover:text-gray-700"
              >
                Login
              </Link>
            </p>

            <div className="text-gray-600">
              Looking for regular account?{" "}
              <Link
                to="/signup"
                className="font-medium text-black hover:text-gray-700"
              >
                Sign up as Traveler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSignupPage;
