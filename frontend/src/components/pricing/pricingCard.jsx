import React from 'react';
import { FaCheck } from 'react-icons/fa';

const PricingCard = ({ plan, billingType }) => {
  const { name, icon, description, price, credits, features, popular } = plan;

  return (
    <div className={`flex flex-col ${popular ? 'p-5 sm:p-8 border-2 border-[var(--almond)] bg-[#f9f7f5] scale-105 md:scale-110 md:h-[105%] shadow-lg hover:shadow-xl' : 'p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md'} rounded-lg relative h-full transition-all duration-300`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--coffee)] text-white text-xs font-semibold px-3 py-1 rounded-full">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[var(--almond)] rounded-full"></span>
            Most Popular
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2 flex-wrap sm:flex-nowrap">
        <span className="text-xl">{icon}</span>
        <h3 className="text-xl font-semibold">{name}</h3>
        <span className="ml-auto text-sm bg-[var(--vanilla)] text-[var(--coffee)] px-2 py-0.5 rounded whitespace-nowrap">
          {credits} Credits
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div className="mb-6">
        <div className="flex items-end flex-wrap sm:flex-nowrap">
          <span className="text-3xl font-bold transition-all duration-300">₹{Math.round(price * 83)}</span>
          <div className="text-xs sm:text-sm text-gray-500 ml-1 mb-1">
            <div>INR/month</div>
            <div className="text-xs">Billed {billingType}, Unlimited credit rollover</div>
          </div>
        </div>
      </div>
      
      <button className="w-full py-2 px-4 bg-[var(--coffee)] text-white rounded hover:bg-[#3a1e12] transition-colors mb-6 font-medium">
        Get Started
      </button>
      
      <div className="space-y-3 mt-auto">
        {features.map((feature, index) => (
          <div key={index}>
            {feature.header ? (
              <p className="text-sm font-medium">{feature.text}</p>
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-[var(--almond)] mt-1">
                  <FaCheck size={12} />
                </span>
                <span className="text-sm">{feature.text}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;