
import React, { useState } from 'react';
import { usePhotoContext, Photo } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Carousel = () => {
  const { photos } = usePhotoContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  return (
    <div className="carousel-container relative w-full overflow-hidden rounded-xl h-[500px] mb-12">
      <div className="relative h-full w-full">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "absolute top-0 left-0 h-full w-full transition-all duration-500 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <Link to={`/photo/${photo.id}`}>
              <img
                src={photo.url}
                alt={photo.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h2 className="text-2xl font-bold">{photo.title}</h2>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
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
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
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
        <span className="sr-only">Next slide</span>
      </Button>
    </div>
  );
};

export default Carousel;
