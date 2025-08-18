'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';

const VerifyOTPContent = ({ isOpen, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });

  // Get email from URL params if available
  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [searchParams]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const requestOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseURL}/api/auth/resend-otp`, {
        email: formData.email
      });
      
      if (response.data.success) {
        toast.success('OTP sent to your email. Please check your inbox.');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.otp) {
      toast.error('Please enter both email and OTP');
      return;
    }
    
    setLoading(true);

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Verify email with OTP
      const response = await axios.post(`${baseURL}/api/auth/verify-email`, {
        email: formData.email,
        otp: formData.otp
      });
      
      if (response.data.success) {
        toast.success('Email verified successfully!');
        // Redirect to login page after successful verification
        setTimeout(() => {
          onClose();
          router.push('/?login=true');
        }, 1500);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-black/80 to-black/95 p-4">
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

        {/* Verification form section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-4xl font-bold text-gray-900">FX</div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Verify Your Email
            </h2>
            <p className="text-gray-800 font-medium">
              Enter the OTP sent to your email to verify your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-900 mb-1">
                  OTP
                </label>
                <button
                  type="button"
                  onClick={requestOTP}
                  disabled={loading || !formData.email}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {loading ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-full py-3 px-4 hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-900">
            <p>
              Back to{' '}
              <button 
                onClick={() => {
                  onClose();
                  router.push('/?login=true');
                }} 
                className="text-gray-900 font-bold underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyOTPModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verification...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyOTPContent isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
};

export default VerifyOTPModal;