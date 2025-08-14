'use client';
import { useEffect, useState, useRef } from 'react';
import { testimonialData } from '@/data/home';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

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
      className={`py-10 sm:py-12 md:py-16 lg:py-24 bg-vanilla/10 transition-opacity duration-1000 overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-2">
            Discover how FashionX has transformed the way our customers approach fashion design and production.
          </p>
        </div>

        <div className="relative mt-8 sm:mt-12 md:mt-16 pb-8 sm:pb-12 md:pb-16">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              el: '.swiper-pagination',
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 1.5,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
            }}
            className="testimonial-swiper"
          >
            {testimonialData.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="rounded-xl sm:rounded-2xl overflow-hidden mx-1 sm:mx-2 my-2 sm:my-4 max-w-5xl mx-auto h-[350px] sm:h-[450px] md:h-[550px]">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 relative overflow-hidden h-40 sm:h-52 md:h-full">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-center h-full">
                      <div>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium italic mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-relaxed line-clamp-4 sm:line-clamp-5 md:line-clamp-6">
                          {testimonial.testimonial}
                        </p>
                        <div className="flex items-center mt-2 sm:mt-3 md:mt-4">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 md:mr-4">
                                <img 
                                  src={testimonial.companyLogo} 
                                  alt={testimonial.company} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm sm:text-base md:text-lg">{testimonial.name}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{testimonial.position}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Responsive Navigation Buttons */}
          <div className="hidden sm:block absolute left-2 sm:left-4 md:left-10 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              ref={prevRef} 
              className="bg-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none hover:bg-gray-50 transition-all"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-coffee">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:block absolute right-2 sm:right-4 md:right-10 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              ref={nextRef} 
              className="bg-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none hover:bg-gray-50 transition-all"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-coffee">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation Buttons - Hidden */}
          <div className="hidden">
            <div className="swiper-pagination"></div>
            <div className="hidden">
              <button 
                ref={prevRef} 
                className="hidden"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-coffee">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                ref={nextRef} 
                className="hidden"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-coffee">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .testimonial-swiper .swiper-pagination {
          position: relative;
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .testimonial-swiper .swiper-pagination-bullet {
          background-color: var(--almond);
          opacity: 0.5;
          width: 8px;
          height: 8px;
          margin: 0 4px;
        }
        @media (min-width: 640px) {
          .testimonial-swiper .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            margin: 0 6px;
          }
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          background-color: var(--coffee);
          opacity: 1;
          width: 10px;
          height: 10px;
        }
        @media (min-width: 640px) {
          .testimonial-swiper .swiper-pagination-bullet-active {
            width: 12px;
            height: 12px;
          }
        }
        .testimonial-swiper {
          padding: 20px 0;
          overflow: visible;
        }
        @media (min-width: 640px) {
          .testimonial-swiper {
            padding: 30px 0;
          }
        }
        .testimonial-swiper .swiper-wrapper {
          align-items: center;
        }
        .testimonial-swiper .swiper-slide {
          opacity: 0.3;
          transform: scale(0.75);
          transition: all 0.4s ease;
          filter: blur(1px);
          height: auto;
        }
        .testimonial-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1.05);
          z-index: 2;
          filter: blur(0);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        @media (min-width: 768px) {
          .testimonial-swiper .swiper-slide-active {
            transform: scale(1.1);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          }
        }
        .testimonial-swiper .swiper-slide-prev,
        .testimonial-swiper .swiper-slide-next {
          opacity: 0.5;
          transform: scale(0.85);
          z-index: 1;
          filter: blur(0.5px);
        }
        @media (max-width: 639px) {
          .testimonial-swiper .swiper-slide {
            opacity: 0.4;
            transform: scale(0.8);
          }
          .testimonial-swiper .swiper-slide-active {
            opacity: 1;
            transform: scale(1.05);
          }
          .testimonial-swiper .swiper-pagination {
            margin-top: 0;
            flex: 1;
            justify-content: center;
          }
        }
        @media (min-width: 640px) and (max-width: 767px) {
          .testimonial-swiper .swiper-slide {
            opacity: 0.4;
            transform: scale(0.8);
          }
          .testimonial-swiper .swiper-slide-active {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        /* Add extra padding to the swiper container for better visibility of side cards */
        .testimonial-swiper {
          padding: 20px 3%;
          margin: 0 -3%;
          width: 106%;
        }
        @media (min-width: 640px) {
          .testimonial-swiper {
            padding: 30px 5%;
            margin: 0 -5%;
            width: 110%;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;