import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Input, { PasswordInput } from '../components/Input';
import { Select } from '../components/Input';
import Card, { CardBody } from '../components/Card';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'tourist';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'tourist', label: 'Tourist' },
    { value: 'driver', label: 'Driver' },
    { value: 'guide', label: 'Guide' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      await signup(formData.email, formData.password, displayName, formData.role);
      toast.success('Account created successfully!');
      // Navigation will be handled by App.jsx based on user role
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-primary-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              IslandHop
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join thousands exploring Sri Lanka
          </p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-xl">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>

              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <Select
                label="I am a"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                required
              />

              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                helpText="Must be at least 6 characters"
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Privacy Policy
                    </Link>
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                size="lg"
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-secondary-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-secondary-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Sign in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
