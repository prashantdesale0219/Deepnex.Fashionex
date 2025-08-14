'use client';
import React from 'react';
import Link from 'next/link';

const BlogPagination = ({ currentPage = 1, totalPages = 15, onPageChange }) => {
  // Props with default values for easier testing
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Maximum number of page buttons to show
    
    // Logic to show limited page numbers with ellipsis
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(renderPageButton(i));
      }
    } else {
      // Always show first page
      pageNumbers.push(renderPageButton(1));
      
      // Calculate start and end of middle pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis-1" className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 mx-0.5 sm:mx-1 text-gray-500">
            ...
          </span>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(renderPageButton(i));
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis-2" className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 mx-0.5 sm:mx-1 text-gray-500">
            ...
          </span>
        );
      }
      
      // Always show last page
      pageNumbers.push(renderPageButton(totalPages));
    }
    
    return pageNumbers;
  };
  
  // Helper function to render a page button
  const renderPageButton = (pageNum) => {
    return (
      <Link 
        key={pageNum} 
        href={onPageChange ? '#' : `/blog?page=${pageNum}`}
        onClick={(e) => {
          if (onPageChange) {
            e.preventDefault();
            onPageChange(pageNum);
          }
        }}
        className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 mx-0.5 sm:mx-1 text-sm sm:text-base ${currentPage === pageNum 
          ? 'text-white bg-black font-medium' 
          : 'text-gray-700 hover:bg-coffee'} rounded-md transition-colors`}
      >
        {pageNum}
      </Link>
    );
  };
  
  return (
    <div className="flex justify-center items-center py-6 sm:py-8 md:py-10">
      <Link 
        href={onPageChange ? '#' : (currentPage > 1 ? `/blog?page=${currentPage - 1}` : '#')}
        className={`flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 mx-1 sm:mx-2 text-sm sm:text-base ${currentPage === 1 
          ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'} rounded-md transition-colors border border-gray-200`}
        aria-disabled={currentPage === 1}
        onClick={(e) => {
          if (currentPage === 1) {
            e.preventDefault();
            return;
          }
          if (onPageChange) {
            e.preventDefault();
            // Go to previous page when Previous button is clicked
            onPageChange(currentPage - 1);
            console.log(`Moving to page ${currentPage - 1}`);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </Link>
      
      <div className="flex items-center mx-2">
        {renderPageNumbers()}
      </div>
      
      <Link 
        href={onPageChange ? '#' : (currentPage < totalPages ? `/blog?page=${currentPage + 1}` : '#')}
        className={`flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 mx-1 sm:mx-2 text-sm sm:text-base ${currentPage === totalPages 
          ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'} rounded-md transition-colors border border-gray-200`}
        aria-disabled={currentPage === totalPages}
        onClick={(e) => {
          if (currentPage === totalPages) {
            e.preventDefault();
            return;
          }
          if (onPageChange) {
            e.preventDefault();
            // Go to next page (2, 3, etc.) when Next button is clicked
            onPageChange(currentPage + 1);
            console.log(`Moving to page ${currentPage + 1}`);
          }
        }}
      >
        <span className="hidden sm:inline">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default BlogPagination;