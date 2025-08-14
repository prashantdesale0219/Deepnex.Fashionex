"use client";
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard') || 
                     pathname?.includes('/models') || 
                     pathname?.includes('/clothes') || 
                     pathname?.includes('/tryon');
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');

  return (
    <>
      {!isDashboard && !isAuthPage && <Navbar />}
      {children}
      {!isDashboard && !isAuthPage && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}