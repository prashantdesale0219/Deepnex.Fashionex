import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const VideoTool = () => {
  const videoTools = [
    {
      id: 1,
      title: 'AI Dubbing',
      image: '/src/components/dashboard/ai-dubbing.jpg',
      link: '/tool/ai-dubbing',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Video Tool</h2>
          <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold text-white bg-red-500 rounded-full">NEW</span>
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {videoTools.map((tool) => (
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
    </div>
  );
};

export default VideoTool;