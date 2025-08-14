'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import VerifyOTPModal from '@/components/auth/verify-otp';

export default function VerifyPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const searchParams = useSearchParams();
  
  // Auto-open the verification modal when the page loads
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <VerifyOTPModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}