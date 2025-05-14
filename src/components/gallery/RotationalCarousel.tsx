import React, { useState, useEffect, useCallback } from 'react';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const RotationalCarousel = () => {
  const { photos } = usePhotoContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  
  const displayPhotos = photos.slice(0, 5);
  
  const rotate = useCallback((direction: 'next' | 'prev') => {
    setIsRotating(true);
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayPhotos.length);
    } else {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? displayPhotos.length - 1 : prevIndex - 1
      );
    }
    
    setTimeout(() => {
      setIsRotating(false);
    }, 500); // Animation duration
  }, [displayPhotos.length]);

  // Autoplay effect
  useEffect(() => {
    if (displayPhotos.length > 1) { // Only autoplay if there's more than one photo
      const timer = setInterval(() => {
        rotate('next');
      }, 3000); // Rotate every 3 seconds
      return () => clearInterval(timer); // Cleanup interval on component unmount
    }
  }, [displayPhotos.length, rotate]);

  return (
    <div className="w-full px-4 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Featured Photos</h2>
      
      <div className="carousel-container relative mx-auto w-full max-w-3xl h-[400px]">
        <div className={cn(
          "rotational-carousel relative h-full w-full",
          isRotating ? "transition-transform duration-500" : ""
        )}>
          {displayPhotos.map((photo, index) => {
            const distance = ((index - currentIndex + displayPhotos.length) % displayPhotos.length);
            const isActive = distance === 0;
            
            let zIndex = displayPhotos.length - distance;
            let opacity = 1 - (distance * 0.2);
            let scale = 1 - (distance * 0.1);
            // Adjust rotation logic slightly for smoother visual transition with autoplay
            let rotateYDeg = 0;
            let translateZ = isActive ? '0px' : '-100px';

            if (distance === 1) { // Next item
              rotateYDeg = 45;
              translateZ = '-50px';
              scale = 0.9;
            } else if (distance === displayPhotos.length - 1) { // Previous item
              rotateYDeg = -45;
              translateZ = '-50px';
              scale = 0.9;
            } else if (distance > 1 && distance < displayPhotos.length - 1) { // Other items in the background
              opacity = 0; // Hide items further away
            }
            
            return (
              <div
                key={photo.id}
                className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out"
                style={{
                  zIndex,
                  opacity,
                  transform: `rotateY(${rotateYDeg}deg) translateZ(${translateZ}) scale(${scale})`,
                  transformOrigin: 'center center',
                }}
              >
                <Link to={`/photo/${photo.id}`} className={cn(
                  "block h-full w-full overflow-hidden rounded-2xl shadow-xl",
                  isActive ? "ring-4 ring-gallery-purple" : ""
                )}>
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <h3 className="text-xl font-bold text-white">{photo.title}</h3>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Navigation buttons are still useful for manual control, even with autoplay */}
        <div className="absolute bottom-[-60px] left-0 right-0 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => rotate('prev')}
            disabled={isRotating}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
            aria-label="Previous featured photo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => rotate('next')}
            disabled={isRotating}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
            aria-label="Next featured photo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RotationalCarousel;
