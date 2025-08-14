import React from 'react';

const FAQSidebar = ({ activeSection, onSectionClick }) => {
  const sections = [
    { id: 'general', label: 'General FAQs' },
    { id: 'product', label: 'Product FAQs' },
    { id: 'pricing', label: 'Pricing & Billing' },
  ];
  
  return (
    <nav className="w-full md:w-64 bg-white rounded-md border border-gray-200 shadow-sm">
      {sections.map((section, index) => (
        <div 
          key={section.id}
          className={`py-3 px-4 cursor-pointer transition-all duration-300 text-base ${
            activeSection === section.id 
              ? 'bg-gray-50 border-l-4 border-l-coffee text-gray-900 font-medium' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={() => onSectionClick(section.id)}
        >
          {section.label}
        </div>
      ))}
    </nav>
  );
};


export default FAQSidebar;