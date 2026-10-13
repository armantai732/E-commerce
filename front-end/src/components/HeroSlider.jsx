import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react'; // Arrow icon is only for the button now
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "Style Meets Comfort",
    subtitle: "Premium fashion, modern lifestyle, just for you.",
    buttonText: "Shop Now",
    buttonLink: "#shop",
    // Unsplash se professional fashion image link
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Summer Collection '24",
    subtitle: "Discover breathable fabrics and vibrant prints.",
    buttonText: "Explore Now",
    buttonLink: "#collection",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Urban Essentials",
    subtitle: "Upgrade your daily wear with functional style.",
    buttonText: "View Products",
    buttonLink: "#essentials",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    // Changed: 'max-w-7xl', 'mx-auto', 'px-...' categories removed for full-width. 'py-0' used.
    <section className="relative w-full overflow-hidden bg-gray-950">

      {/* Main Container */}
      <div className="relative h-[65vh] sm:h-[75vh] md:h-[80vh] w-full">

        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Dark Overlay with subtle noise texture for realism */}
            <div className="absolute inset-0 bg-black/50 bg-[url('https://www.transparenttextures.com/patterns/dark-dotted-2.png')]"></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              {/* Added padding 'px-6', 'md:px-20' to match standard layouts */}
              <div className="max-w-3xl px-6 md:px-20 text-white space-y-5">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-gray-200 text-lg md:text-xl font-light max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Call to Action Button */}
                <div className="pt-4">
                  <Link
                    to={"/product"}
                    className="inline-flex items-center gap-2.5 bg-[#D4B483] hover:bg-[#C9A672] text-black font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {slide.buttonText}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* --- Side Arrows Section removed --- */}

        {/* Bottom Pagination Dots (Kept for manual navigation) */}
        // Positioned absolute bottom.
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${index === currentSlide
                ? 'w-10 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default HeroSlider;