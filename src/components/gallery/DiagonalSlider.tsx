
import React, { useState } from 'react';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DiagonalSlider = () => {
  const { photos } = usePhotoContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use a subset of photos for the diagonal slider
  const sliderPhotos = photos.slice(0, 4);
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderPhotos.length);
  };

  return (
    <div className="w-full my-16 relative h-[500px] overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-gallery-darkPurple/80 to-transparent diagonal-slider"></div>
      
      {sliderPhotos.map((photo, index) => (
        <div
          key={photo.id}
          className={cn(
            "absolute inset-0 transition-all duration-700",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img 
            src={photo.url} 
            alt={photo.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      <div className="absolute bottom-0 left-0 z-20 p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-white mb-4">
          {sliderPhotos[currentIndex]?.title}
        </h2>
        <p className="text-white/80 mb-6">
          Discover the beauty and stories behind each photograph in your personal collection.
        </p>
        
        <div className="flex items-center gap-4">
          <Link 
            to={`/photo/${sliderPhotos[currentIndex]?.id}`}
            className="px-6 py-3 bg-white text-gallery-darkPurple rounded-md font-medium hover:bg-white/90 transition"
          >
            View Details
          </Link>
          
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition"
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
          </button>
        </div>
        
        <div className="flex mt-6 gap-2">
          {sliderPhotos.map((_, idx) => (
            <button 
              key={idx}
              className={cn(
                "w-12 h-1 rounded-full transition-all", 
                idx === currentIndex ? "bg-white" : "bg-white/30"
              )}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagonalSlider;
