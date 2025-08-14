import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      value: '10X',
      label: 'Faster Production',
      description: 'Create fashion content in minutes instead of days'
    },
    {
      id: 2,
      value: '80%',
      label: 'Cost Reduction',
      description: 'Save on photoshoot expenses and logistics'
    },
    {
      id: 3,
      value: '5M+',
      label: 'Images Generated',
      description: 'Trusted by fashion brands worldwide'
    },
    {
      id: 4,
      value: '24/7',
      label: 'Content Creation',
      description: 'Create fashion content anytime, anywhere'
    }
  ];

  return (
    <div className="bg-gray-50 rounded-xl shadow-inner p-6 my-8">
      <h2 className="text-xl font-semibold mb-6 text-center">FashionX Impact</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-sm p-4 text-center transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-900 mb-2">{stat.label}</div>
            <p className="text-xs text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;