'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.post(`${baseURL}/api/auth/verify-email`, { token });
        
        if (response.data.success) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified! You can now login.');
          
          // Start countdown for redirect
          // Use redirectUrl from backend if available
          const redirectUrl = response.data.data?.redirectUrl || '/?login=true';
          startCountdown(redirectUrl);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed. The link may be expired or invalid.');
      }
    };

    verifyEmail();
  }, [token, startCountdown]);

  const startCountdown = (redirectUrl = '/?login=true') => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to login page
          router.push(redirectUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLoginClick = () => {
    router.push('/?login=true');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          {verificationStatus === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader className="h-16 w-16 text-blue-600 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Verifying Your Email</h2>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-4 text-sm text-gray-500">
                Redirecting to login in {countdown} seconds...
              </p>
              <button
                onClick={handleLoginClick}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login Now
              </button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <button
                onClick={handleLoginClick}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;