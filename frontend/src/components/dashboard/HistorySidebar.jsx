'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HistorySidebar = () => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);

  return (
    <div className="w-64 h-screen bg-white border-r border-[#EFDECD] fixed left-0 top-0 z-10">
      <div className="p-4 border-b border-[#EFDECD]">
        <div className="flex items-center">
          <div className="font-bold text-xl">PIC COPILOT</div>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/templates" className="flex items-center px-4 py-3 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span>Template</span>
            </Link>
          </li>
          <li>
            <Link href="/help" className="flex items-center px-4 py-3 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help Center</span>
            </Link>
          </li>
          <li className="relative group">
            <Link href="/dashboard/project" className="flex items-center px-4 py-3 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <div className="flex flex-col">
              <Link href="/dashboard/history" className="flex items-center px-4 py-3 text-[#6F4E37] bg-[#EFDECD] rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History</span>
              </Link>
              
              {/* History Submenu */}
              <div className="ml-8 mt-2 space-y-1">
                <div className="text-gray-400 text-xs uppercase font-medium mb-1 ml-2">Fashion AI</div>
                <Link href="/dashboard/history?type=fashion-reels" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>Fashion Reels</span>
                </Link>
                <Link href="/dashboard/history?type=product-anyshoot" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>Product AnyShoot</span>
                </Link>
                <Link href="/dashboard/history?type=virtual-try-on" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>Virtual Try On</span>
                </Link>
                <Link href="/dashboard/history?type=virtual-try-on-shoes" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>Virtual Try On Shoes</span>
                </Link>
                <Link href="/dashboard/history?type=ai-background" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>AI Background for M...</span>
                </Link>
                <Link href="/dashboard/history?type=ai-model-swap" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>AI Model Swap</span>
                </Link>
                
                <div className="text-gray-400 text-xs uppercase font-medium mb-1 mt-3 ml-2">Image Tool</div>
                <Link href="/dashboard/history?type=ai-templates" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>AI Templates</span>
                </Link>
                <Link href="/dashboard/history?type=ai-backgrounds" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>AI Backgrounds</span>
                </Link>
                <Link href="/dashboard/history?type=ai-shadows" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>AI Shadows</span>
                </Link>
                <Link href="/dashboard/history?type=style-clone" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>Style Clone</span>
                </Link>
                <Link href="/dashboard/history?type=white-background" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>White Background</span>
                </Link>
                <Link href="/dashboard/history?type=image-translator" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>Image Translator</span>
                </Link>
                
                <div className="text-gray-400 text-xs uppercase font-medium mb-1 mt-3 ml-2">Advanced AI Tools</div>
                <Link href="/dashboard/history?type=hd-enhancement" className="flex items-center px-4 py-2 text-[#6F4E37] hover:bg-[#EFDECD] rounded-lg text-sm">
                  <span>HD Enhancement</span>
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-[#EFDECD]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;