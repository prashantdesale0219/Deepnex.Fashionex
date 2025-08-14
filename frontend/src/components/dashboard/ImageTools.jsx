import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UploadImage from './UploadImage';

const ImageTools = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const imageTools = [
    {
      id: 1,
      title: 'AI Template',
      image: '/assets/images/ai-template.jpg',
      link: '/tool/ai-template',
      bgColor: 'bg-gray-50'
    },
    {
      id: 2,
      title: 'AI Background',
      image: '/assets/images/ai-background.jpg',
      link: '/tool/ai-background',
      bgColor: 'bg-gray-50'
    },
    {
      id: 3,
      title: 'AI Shadow',
      image: '/assets/images/ai-shadow.jpg',
      link: '/tool/ai-shadow',
      bgColor: 'bg-gray-50'
    },
    {
      id: 4,
      title: 'Style Clone',
      image: '/assets/images/style-clone.jpg',
      link: '/tool/style-clone',
      bgColor: 'bg-gray-50'
    },
    {
      id: 5,
      title: 'White Background',
      image: '/assets/images/white-background.jpg',
      link: '/tool/white-background',
      bgColor: 'bg-gray-50'
    },
    {
      id: 6,
      title: 'Image Translator',
      image: '/assets/images/image-translator.jpg',
      link: '/tool/image-translator',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Image Tool</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-xs sm:text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Images
          </button>
          <Link 
            href="/all-tools" 
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {imageTools.map((tool) => (
          <Link key={tool.id} href={tool.link} className="block group">
            <div className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${tool.bgColor}`}>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3 text-center">
                <h3 className="font-medium text-xs sm:text-sm text-gray-900">{tool.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
       {showUploadModal && <UploadImage onClose={() => setShowUploadModal(false)} />}
    </div>
     
    
  );
};

export default ImageTools;