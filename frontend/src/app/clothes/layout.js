'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/dashboard/Sidebar';
import { isAuthenticated } from '../../lib/cookieUtils';

export default function ClothesLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#e7ded0] flex" suppressHydrationWarning>
      <Sidebar />
      <div className="flex-1 md:ml-0">
        {children}
      </div>
    </div>
  );
}