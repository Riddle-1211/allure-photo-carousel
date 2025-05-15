
import React, { useState, useEffect, useCallback } from 'react';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RotationalCarousel = () => {
  const { photos } = usePhotoContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  
  // Use a fixed number of photos for this specific carousel style, e.g., 5
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
    }, 700); 
  }, [carouselPhotos.length]);

  useEffect(() => {
    if (carouselPhotos.length > 1) {
      const timer = setInterval(() => {
        if (!document.hidden) { // Pause rotation when tab is not active
          rotate('next');
        }
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
    <div className="w-full px-4 py-16 bg-slate-900">
      <h2 className="text-2xl font-bold mb-12 text-center text-white">Featured Photos</h2>
      
      <div className="carousel-container relative mx-auto w-full max-w-3xl h-[300px] md:h-[350px]">
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

        <div className={cn(
          "rotational-carousel relative h-full w-full",
          isRotating ? "transition-transform duration-500" : ""
        )}>
          {carouselPhotos.map((photo, index) => {
            const distance = ((index - currentIndex + carouselPhotos.length) % carouselPhotos.length);
            const isActive = distance === 0;
            
            let zIndex, opacity, scale, rotateYDeg, translateX, translateZ, filterBlur;

            if (isActive) { // Center item (medium size)
              zIndex = carouselPhotos.length + 1;
              opacity = 1;
              scale = 0.8; // Reduced scale for medium size
              rotateYDeg = 0;
              translateX = '0%';
              translateZ = '10px'; // Reduced depth
              filterBlur = 'blur(0px)';
            } else if (distance === 1) { // Item to the immediate right
              zIndex = carouselPhotos.length - 1;
              opacity = 0.5;
              scale = 0.65; // Reduced scale
              rotateYDeg = -30; 
              translateX = '40%';
              translateZ = '-15px';
              filterBlur = 'blur(3px)'; // Increased blur
            } else if (distance === carouselPhotos.length - 1) { // Item to the immediate left
              zIndex = carouselPhotos.length - 1;
              opacity = 0.5;
              scale = 0.65; // Reduced scale
              rotateYDeg = 30;
              translateX = '-40%';
              translateZ = '-15px';
              filterBlur = 'blur(3px)'; // Increased blur
            } else if (distance === 2) { // Item to the far right
              zIndex = carouselPhotos.length - 2;
              opacity = 0.3;
              scale = 0.5; // Reduced scale
              rotateYDeg = -45;
              translateX = '70%';
              translateZ = '-80px';
              filterBlur = 'blur(5px)'; // Increased blur
            } else if (distance === carouselPhotos.length - 2) { // Item to the far left
              zIndex = carouselPhotos.length - 2;
              opacity = 0.3;
              scale = 0.5; // Reduced scale
              rotateYDeg = 45;
              translateX = '-70%';
              translateZ = '-80px';
              filterBlur = 'blur(5px)'; // Increased blur
            } else { // Items further out
              zIndex = 1;
              opacity = 0; 
              scale = 0.4;
              rotateYDeg = distance < carouselPhotos.length / 2 ? -60 : 60;
              translateX = distance < carouselPhotos.length / 2 ? '100%' : '-100%';
              translateZ = '-150px';
              filterBlur = 'blur(6px)';
            }
            
            return (
              <div
                key={photo.id + '-' + index}
                className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-out"
                style={{
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateYDeg}deg) scale(${scale})`,
                  filter: filterBlur,
                  transformOrigin: 'center center',
                }}
              >
                <Link to={`/photo/${photo.id}`} className={cn(
                  "block h-full w-full overflow-hidden rounded-lg shadow-xl",
                  isActive ? "ring-2 ring-gallery-purple/60" : "ring-1 ring-white/5"
                )}>
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-5">
                      <h3 className="text-md md:text-lg font-semibold text-white shadow-sm">{photo.title}</h3>
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
