import React, { useState, useRef } from 'react';
import Image from 'next/image';

const UploadImage = ({ onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Tops');
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const clothingTypes = ['Tops', 'Bottoms', 'Full Outfits', 'One-Pieces'];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    // Handle file upload logic here
    console.log('Files selected:', files);
  };

  // Add event listener for clicks outside dropdown
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative overflow-hidden">
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Virtual Try On image */}
        <div className="absolute top-8 right-8 z-10">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="text-center font-semibold mb-1">Virtual Try On</div>
            <div className="relative w-28 h-36 bg-yellow-100 rounded-lg overflow-hidden">
              <Image 
                src="/assets/images/avatar.webp" 
                alt="Virtual Try On" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0">
                {/* Decorative elements */}
                <div className="absolute top-1 left-1 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div className="absolute top-1 right-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
                <div className="absolute bottom-1 right-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-8">
          <h2 className="text-2xl font-bold mb-4">Upload clothing images</h2>
          
          {/* Clothing type dropdown */}
          <div className="mb-4 relative" ref={dropdownRef}>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-700 mr-4">Clothing Types</span>
              <div className="relative inline-block text-left">
                <button 
                  type="button" 
                  className="inline-flex justify-between items-center w-32 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  onClick={toggleDropdown}
                >
                  {selectedType}
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="origin-top-right absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      {clothingTypes.map((type) => (
                        <button
                          key={type}
                          className={`${selectedType === type ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-3">Drag images here or click to upload</p>
              <div className="flex space-x-3">
                <button
                  onClick={handleUploadClick}
                  className="flex items-center px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload
                </button>
                <button
                  className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                  </svg>
                  Batch upload
                  <span className="ml-1 text-xs bg-gray-700 text-white px-1 py-0.5 rounded">Pro</span>
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
              />
            </div>
          </div>

          {/* Sample images section */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-3">Try samples or pick from Projects</p>
            <div className="grid grid-cols-4 gap-3">
              {/* Sample images */}
              <div className="relative rounded-lg overflow-hidden shadow-sm group">
                <div className="aspect-square relative">
                  <Image src="/assets/images/ai1.webp" alt="Sample" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black bg-opacity-50 rounded">Sample</span>
                  </div>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-sm group">
                <div className="aspect-square relative">
                  <Image src="/assets/images/ai2.webp" alt="Sample" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black bg-opacity-50 rounded">Sample</span>
                  </div>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-sm group">
                <div className="aspect-square relative">
                  <Image src="/assets/images/ai3.webp" alt="Sample" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black bg-opacity-50 rounded">Sample</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button className="text-gray-500 hover:text-gray-700 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className="text-xs">View more</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;