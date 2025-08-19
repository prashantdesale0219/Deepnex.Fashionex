'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import { Eye, EyeOff } from 'lucide-react';
import { setAuthToken, setUserData } from '../../lib/cookieUtils';

const LoginModalContent = ({ isOpen, onClose, initialMode = 'login' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  // Check if we should show login modal with login tab active
  useEffect(() => {
    const loginParam = searchParams.get('login');
    if (loginParam === 'true') {
      setIsLoginMode(true);
      setShowEmailForm(true);
    }
  }, [searchParams]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        // Login without OTP
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.success) {
          setAuthToken(response.data.data.token);
          setUserData(response.data.data.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
          // Dispatch custom event for navbar to detect login status change
          window.dispatchEvent(new Event('loginStatusChanged'));
          toast.success('Login successful!');
          onClose();
          router.push('/dashboard');
        }
      } else {
        // Register
        const response = await axios.post('/api/auth/signup', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.success) {
          toast.success('Registration successful! Please verify your email to activate your account.');
          // Redirect to verification page with email
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    toast.info('Google authentication coming soon!');
  };

  const handleAppleAuth = () => {
    // TODO: Implement Apple OAuth
    toast.info('Apple authentication coming soon!');
  };
  
  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setShowEmailForm(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-black/80 to-black/95  p-4">x

      <div className="relative bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-4xl flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <IoMdClose size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Image section */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="h-full min-h-[400px]">
            <Image
              src="/assets/images/login-image.jpg"
              alt="Fashion model"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>

        {/* Login form section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-4xl font-bold text-gray-900">FX</div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              {isLoginMode ? 'Sign in to FashionX' : 'Create your FashionX account'}
            </h2>
            <p className="text-gray-800 font-medium">
              {isLoginMode 
                ? 'Continue with your account to access exclusive features' 
                : 'Join FashionX to transform your fashion experience'}
            </p>
            {verificationMessage && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg">
                {verificationMessage}
              </div>
            )}
          </div>

          {!showEmailForm ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 px-4 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>
              
              <button
                onClick={handleAppleAuth}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 px-4 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
              >
                <FaApple size={20} />
                <span>Continue with Apple</span>
              </button>
              
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 px-4 hover:bg-gray-50 transition-colors text-gray-900 font-medium"
              >
                <MdEmail size={20} />
                <span>Continue with Email</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              {isLoginMode && (
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/verify?email=${encodeURIComponent(formData.email)}`)}
                    disabled={!formData.email}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Need to verify your email?
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white rounded-full py-3 px-4 hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLoginMode ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-900">
            <p>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={toggleAuthMode} 
                className="text-gray-900 font-bold underline"
              >
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-gray-900">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-gray-900 font-bold underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-gray-900 font-bold underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  if (!isOpen) return null;

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginModalContent isOpen={isOpen} onClose={onClose} initialMode={initialMode} />
    </Suspense>
  );
};

export default LoginModal;