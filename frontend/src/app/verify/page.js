'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VerifyOTPModal from '@/components/auth/verify-otp';

function VerifyPageContent() {
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

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification...</p>
        </div>
      </main>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}