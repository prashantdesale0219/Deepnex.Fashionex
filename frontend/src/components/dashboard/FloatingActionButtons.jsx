'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiHelpCircle, FiUpload, FiX } from 'react-icons/fi';

const FloatingActionButtons = () => {
  const [showModal, setShowModal] = useState(false);
  
  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 z-40">
        
        {/* Create New Button (Yellow) */}
        <button 
          onClick={openModal}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-almond text-white flex items-center justify-center shadow-lg  transition-colors duration-300"
        >
          <FiPlus size={20} className="sm:hidden" />
          <FiPlus size={24} className="hidden sm:block" />
        </button>
      </div>
      
      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input 
                    type="text" 
                    id="project-name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Assets</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Drag or Upload File<span className="text-yellow-500 font-medium">Browse Files</span></p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF  10MB</p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
               Cancel
              </button>
              <button 
                className="px-4 py-2 bg-yellow-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButtons;