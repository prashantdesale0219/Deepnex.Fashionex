'use client';
import React, { useEffect, useState } from 'react';
import LoginModal from '@/components/auth/login';
import { useRouter } from 'next/navigation';

export default function TryNow() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Open the modal automatically when the page loads
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    // Redirect to home page when modal is closed
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        initialMode="signup" // Start in signup mode by default
      />
    </div>
  );
}