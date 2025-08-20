'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navbar } from '../data/navbar';
import { FiMenu, FiX, FiChevronDown, FiHelpCircle, FiFileText, FiBookOpen } from 'react-icons/fi';
import LoginButton from '../components/auth/LoginButton';
import { getAuthToken, clearAuthCookies } from '../lib/cookieUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // Effect for handling scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/' || pathname.includes('/faq')) {
        // Only change background on scroll for home and FAQ pages
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);
  
  // Effect for setting initial navbar state based on current path
  useEffect(() => {
    if (pathname === '/' || pathname.includes('/faq')) {
      // For home and FAQ pages, start with transparent background
      // and let scroll determine the state
      setIsScrolled(window.scrollY > 50);
    } else {
      // For all other pages, always show white background
      setIsScrolled(true);
    }
  }, [pathname]);
  
  // Effect for checking login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = getAuthToken();
      setIsLoggedIn(!!token);
    };
    
    // Check on initial load
    checkLoginStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Custom event for login status changes within the app
    window.addEventListener('loginStatusChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    clearAuthCookies();
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12 lg:px-16 ${isScrolled ? 'bg-white shadow-sm border-b border-gray-200' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className={`text-2xl font-bold ${isScrolled ? 'text-coffee' : 'text-white'}`}>
            <Image 
              src={isScrolled ? "/assets/images/logo.png" : "/assets/images/white-logo.png"} 
              alt="FashionX" 
              width={160} 
              height={40} 
              className='w-auto h-10'
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8">
          {navbar.map((item) => (
            item.hasDropdown ? (
              <div key={item.id} className="relative group">
                <button 
                  className={`flex items-center hover:text-coffee transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  {item.title}
                  <FiChevronDown className="ml-1" />
                </button>
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border border-gray-100 transition-all duration-300 transform origin-top-right opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                  <div className="py-2 w-full rounded-lg overflow-hidden">
                    {item.title === "Resources" && (
                      <div className="text-sm font-bold text-gray-700 px-4 py-2 border-b border-gray-100 ">
                        {item.title}
                      </div>
                    )}
                    <div className="flex flex-col w-full">
                      {item.dropdownItems && item.dropdownItems.map((dropItem, index) => {
                        let IconComponent;
                        switch(dropItem.icon) {
                          case 'HelpCircle':
                            IconComponent = FiHelpCircle;
                            break;
                          case 'FileText':
                            IconComponent = FiFileText;
                            break;
                          case 'BookOpen':
                            IconComponent = FiBookOpen;
                            break;
                          default:
                            IconComponent = FiHelpCircle;
                        }
                        
                        return (
                          <div key={dropItem.id} className="w-full">
                            <Link 
                              href={dropItem.link} 
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-coffee transition-colors duration-200 w-full"
                            >
                              <IconComponent className="text-coffee" size={18} />
                              <span>{dropItem.title}</span>
                            </Link>
                            {index !== item.dropdownItems.length - 1 && (
                              <div className="border-b border-gray-100"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.link}
                className={`hover:text-coffee transition-colors duration-300 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                {item.title}
              </Link>
            )
          ))}
        </div>

        {/* Login/Try Now Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <div>
            <LoginButton />
          </div>
          {!isLoggedIn && (
            <Link 
              href="/try-now" 
              className={`${isScrolled ? 'bg-coffee text-white' : 'bg-white text-coffee'}  px-4 py-2 rounded-md hover:bg-almond transition-colors duration-300`}
            >
              Try Now
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className={`hover:text-coffee focus:outline-none ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-full w-full bg-black/60 bg-opacity-50 z-50">
          <div className="h-full w-[60%] ml-auto bg-white py-4 px-4 border-l border-gray-200 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-coffee focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
            {navbar.map((item) => (
              item.hasDropdown ? (
                <div key={item.id}>
                  <button 
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                    className="flex items-center justify-between text-gray-700 hover:text-coffee transition-colors duration-300 w-full text-left py-2 px-1 rounded-md hover:bg-gray-50"
                  >
                    <span className="font-medium">{item.title}</span>
                    <FiChevronDown className={`ml-1 transition-transform duration-300 ${resourcesOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  <div className={`mt-2 bg-white rounded-lg border border-gray-100 w-full overflow-hidden transition-all duration-300 ${resourcesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'}`}>
                    {item.title === "Resources" && (
                      <div className="text-sm font-bold text-gray-700 px-4 py-2 bg-gray-50 border-b border-gray-100">
                        {item.title}
                      </div>
                    )}
                    <div className="flex flex-col w-full">
                      {item.dropdownItems && item.dropdownItems.map((dropItem, index) => {
                        let IconComponent;
                        switch(dropItem.icon) {
                          case 'HelpCircle':
                            IconComponent = FiHelpCircle;
                            break;
                          case 'FileText':
                            IconComponent = FiFileText;
                            break;
                          case 'BookOpen':
                            IconComponent = FiBookOpen;
                            break;
                          default:
                            IconComponent = FiHelpCircle;
                        }
                        
                        return (
                          <div key={dropItem.id} className="w-full">
                            <Link 
                              href={dropItem.link} 
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-coffee transition-colors duration-200 w-full"
                              onClick={() => {
                                setResourcesOpen(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              <IconComponent className="text-coffee" size={18} />
                              <span>{dropItem.title}</span>
                            </Link>
                            {index !== item.dropdownItems.length - 1 && (
                              <div className="border-b border-gray-100"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.link}
                  className="text-gray-700 hover:text-[--color-coffee] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              )
            ))}
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-4">
              {!isLoggedIn ? (
                <>
                  <div className="text-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <LoginButton />
                  </div>
                  <Link 
                    href="/try-now" 
                    className="bg-coffee text-white px-4 py-2 rounded-md hover:bg-almond transition-colors duration-300 inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Try Now
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-coffee transition-colors duration-300 px-4 py-2 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-300 px-4 py-2 rounded-md hover:bg-red-50 w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;