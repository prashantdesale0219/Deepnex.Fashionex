'use client';
import { useEffect, useState, useRef } from 'react';
import { aiSolutionsData } from '@/data/home';

const AISolutions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`py-10 sm:py-12 md:py-16 lg:py-24 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 tracking-tight">
            AI solutions to <span className="italic">boost</span> <br className="hidden sm:block" />
            your fashion brand
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {aiSolutionsData.map((item) => (
            <div 
              key={item.id} 
              className={`rounded-lg overflow-hidden transition-all duration-500 transform ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}
              style={{ transitionDelay: `${item.id * 100}ms` }}
            >
              <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-5 md:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <button className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default AISolutions;