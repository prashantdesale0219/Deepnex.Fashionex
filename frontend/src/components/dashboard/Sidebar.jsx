'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  User, 
  Shirt, 
  Zap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    router.push('/');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard'
    },
    {
      name: 'Models',
      href: '/models',
      icon: User,
      current: pathname === '/models'
    },
    {
      name: 'Clothes',
      href: '/clothes',
      icon: Shirt,
      current: pathname === '/clothes'
    },
    {
      name: 'Try-On',
      href: '/tryon',
      icon: Zap,
      current: pathname === '/tryon'
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded-lg shadow-lg text-gray-600 hover:text-gray-900"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        w-64 md:w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#e7ded0]">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/assets/images/logo.png" 
                alt="FashionX" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-[#e7ded0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#e7ded0] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#26140c]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#26140c]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[#aa7156]">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                       href={item.href}
                       onClick={() => setIsOpen(false)}
                       className={`
                         flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                         ${
                           item.current
                             ? 'bg-[#e7ded0] text-[#26140c] border-r-2 border-[#aa7156]'
                             : 'text-[#aa7156] hover:bg-[#e7ded0] hover:text-[#26140c]'
                         }
                       `}
                     >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-[#e7ded0] space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#aa7156] hover:bg-[#e7ded0] hover:text-[#26140c] transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content spacer for desktop */}
      <div className="hidden md:block w-64 flex-shrink-0"></div>
    </>
  );
};

export default Sidebar;