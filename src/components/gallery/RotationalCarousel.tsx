
import React, { useState, useEffect, useCallback } from 'react';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Using lucide icons already available

const RotationalCarousel = () => {
  const { photos } = usePhotoContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  
  // Use a fixed number of photos for this specific carousel style, e.g., 5
  // Ensure we have enough photos, or repeat if necessary for the effect
  const carouselPhotos = photos.length >= 5 ? photos.slice(0, 5) : 
    photos.length > 0 ? [...photos, ...photos, ...photos, ...photos, ...photos].slice(0,5) : [];

  const rotate = useCallback((direction: 'next' | 'prev') => {
    if (carouselPhotos.length === 0) return;
    setIsRotating(true);
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
    } else {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? carouselPhotos.length - 1 : prevIndex - 1
      );
    }
    
    setTimeout(() => {
      setIsRotating(false);
    }, 600); // Animation duration, slightly increased for smoother feel
  }, [carouselPhotos.length]);

  useEffect(() => {
    if (carouselPhotos.length > 1) {
      const timer = setInterval(() => {
        rotate('next');
      }, 3000); 
      return () => clearInterval(timer);
    }
  }, [carouselPhotos.length, rotate]);

  if (carouselPhotos.length === 0) {
    return (
      <div className="w-full px-4 py-12 bg-slate-900 text-center text-slate-400">
        <h2 className="text-2xl font-bold mb-8">Featured Photos</h2>
        <p>Not enough photos to display the carousel.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-16 bg-slate-900"> {/* Dark background */}
      <h2 className="text-2xl font-bold mb-12 text-center text-white">Featured Photos</h2>
      
      {/* Carousel Container with Perspective */}
      <div className="carousel-container relative mx-auto w-full max-w-4xl h-[450px] md:h-[500px]">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          onClick={() => rotate('prev')}
          disabled={isRotating}
          className="absolute left-0 sm:left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 z-20 rounded-full w-10 h-10 p-0 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white border-white/30"
          aria-label="Previous featured photo"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => rotate('next')}
          disabled={isRotating}
          className="absolute right-0 sm:right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 z-20 rounded-full w-10 h-10 p-0 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white border-white/30"
          aria-label="Next featured photo"
        >
          <ArrowRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>

        {/* Rotational Carousel Items Area */}
        <div className={cn(
          "rotational-carousel relative h-full w-full",
          isRotating ? "transition-transform duration-500" : ""
        )}>
          {carouselPhotos.map((photo, index) => {
            const distance = ((index - currentIndex + carouselPhotos.length) % carouselPhotos.length);
            const isActive = distance === 0;
            
            let zIndex, opacity, scale, rotateYDeg, translateX, translateZ;

            if (isActive) { // Center item
              zIndex = carouselPhotos.length + 1;
              opacity = 1;
              scale = 1.15; // Slightly larger and more prominent
              rotateYDeg = 0;
              translateX = '0%';
              translateZ = '60px'; // Bring slightly forward
            } else if (distance === 1) { // Item to the immediate right
              zIndex = carouselPhotos.length - 1;
              opacity = 0.7;
              scale = 0.9;
              rotateYDeg = -35;
              translateX = '45%'; 
              translateZ = '-30px';
            } else if (distance === carouselPhotos.length - 1) { // Item to the immediate left
              zIndex = carouselPhotos.length - 1;
              opacity = 0.7;
              scale = 0.9;
              rotateYDeg = 35;
              translateX = '-45%';
              translateZ = '-30px';
            } else if (distance === 2) { // Item to the far right
              zIndex = carouselPhotos.length - 2;
              opacity = 0.4;
              scale = 0.75;
              rotateYDeg = -55;
              translateX = '85%';
              translateZ = '-120px';
            } else if (distance === carouselPhotos.length - 2) { // Item to the far left
              zIndex = carouselPhotos.length - 2;
              opacity = 0.4;
              scale = 0.75;
              rotateYDeg = 55;
              translateX = '-85%';
              translateZ = '-120px';
            } else { // Items further out (should not happen with 5 items, but as a fallback)
              zIndex = 1;
              opacity = 0;
              scale = 0.5;
              rotateYDeg = distance < carouselPhotos.length / 2 ? -70 : 70;
              translateX = distance < carouselPhotos.length / 2 ? '120%' : '-120%';
              translateZ = '-200px';
            }
            
            return (
              <div
                key={photo.id + '-' + index} // Ensure key is unique if photos are repeated
                className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-out" // Slower transition for smoother effect
                style={{
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateYDeg}deg) scale(${scale})`,
                  transformOrigin: 'center center', // Crucial for correct rotation and scaling
                }}
              >
                <Link to={`/photo/${photo.id}`} className={cn(
                  "block h-full w-full overflow-hidden rounded-xl shadow-2xl", // Slightly smaller rounding, stronger shadow
                  isActive ? "ring-4 ring-gallery-purple/70" : "ring-1 ring-white/10"
                )}>
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-white">{photo.title}</h3>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RotationalCarousel;
