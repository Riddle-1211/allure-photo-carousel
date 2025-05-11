
import React, { useState, useEffect } from 'react';
import { usePhotoContext, Photo } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

type EffectType = 'fade' | 'cube' | 'cards' | 'parallax';
const EFFECTS: EffectType[] = ['fade', 'cube', 'cards', 'parallax'];

interface CarouselProps {
  autoRotateEffects?: boolean;
}

const Carousel = ({ autoRotateEffects = false }: CarouselProps) => {
  const { photos } = usePhotoContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [effect, setEffect] = useState<EffectType>('fade');
  const [effectIndex, setEffectIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [speed, setSpeed] = useState(2000); // milliseconds between transitions
  const [effectChangeInterval, setEffectChangeInterval] = useState(10000); // 10 seconds between effect changes

  // Effect for slide autoplay
  useEffect(() => {
    let interval: number | null = null;
    
    if (autoplay) {
      interval = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, speed);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, photos.length, speed]);

  // Effect for auto-rotating effects
  useEffect(() => {
    let interval: number | null = null;
    
    if (autoRotateEffects) {
      interval = window.setInterval(() => {
        setEffectIndex((prevIndex) => (prevIndex + 1) % EFFECTS.length);
        setEffect(EFFECTS[(effectIndex + 1) % EFFECTS.length]);
      }, effectChangeInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRotateEffects, effectIndex, effectChangeInterval]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  // Calculate visible slides
  const visiblePhotos = () => {
    const result = [];
    if (effect === 'cards' || effect === 'cube') {
      // For card and cube effects, only show 1 slide at a time
      result.push(photos[currentIndex]);
    } else {
      // For other effects, show multiple slides based on slidesPerView
      for (let i = 0; i < slidesPerView; i++) {
        const index = (currentIndex + i) % photos.length;
        result.push(photos[index]);
      }
    }
    return result;
  };

  return (
    <div className="space-y-6">
      {!autoRotateEffects && (
        <div className="flex justify-between items-center">
          <div className="flex gap-4 flex-wrap">
            {EFFECTS.map((effectType) => (
              <Button
                key={effectType}
                variant={effect === effectType ? "default" : "outline"}
                onClick={() => setEffect(effectType)}
                className="capitalize"
              >
                {effectType}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Autoplay</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={() => setAutoplay(!autoplay)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gallery-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gallery-purple"></div>
            </label>
          </div>
        </div>
      )}

      {autoRotateEffects && (
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            <span className="capitalize text-gallery-purple">{effect}</span> Effect
            <span className="text-sm ml-2 text-muted-foreground">
              Auto-changing every {effectChangeInterval/1000} seconds
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Autoplay Slides</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={() => setAutoplay(!autoplay)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gallery-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gallery-purple"></div>
            </label>
          </div>
        </div>
      )}

      {/* Settings Controls */}
      {(effect !== 'cards' && effect !== 'cube') && !autoRotateEffects && (
        <div className="flex items-center gap-4">
          <span className="text-sm">Slides:</span>
          <Slider
            defaultValue={[slidesPerView]}
            max={6}
            min={1}
            step={1}
            className="w-40"
            onValueChange={(value) => setSlidesPerView(value[0])}
          />
          <span className="text-sm font-medium">{slidesPerView}</span>
          
          <span className="ml-6 text-sm">Speed:</span>
          <Slider
            defaultValue={[speed]}
            max={5000}
            min={500}
            step={500}
            className="w-40"
            onValueChange={(value) => setSpeed(value[0])}
          />
          <span className="text-sm font-medium">{speed}ms</span>
        </div>
      )}

      {/* Auto-rotating effect speed control */}
      {autoRotateEffects && (
        <div className="flex items-center gap-4">
          <span className="text-sm">Effect Change Speed:</span>
          <Slider
            defaultValue={[effectChangeInterval]}
            max={20000}
            min={5000}
            step={1000}
            className="w-40"
            onValueChange={(value) => setEffectChangeInterval(value[0])}
          />
          <span className="text-sm font-medium">{effectChangeInterval/1000}s</span>
          
          {(effect !== 'cards' && effect !== 'cube') && (
            <>
              <span className="ml-6 text-sm">Slides:</span>
              <Slider
                value={[slidesPerView]}
                max={6}
                min={1}
                step={1}
                className="w-40"
                onValueChange={(value) => setSlidesPerView(value[0])}
              />
              <span className="text-sm font-medium">{slidesPerView}</span>
            </>
          )}
        </div>
      )}
      
      {/* Carousel Container */}
      <div 
        className={cn(
          "carousel-container relative w-full overflow-hidden rounded-xl h-[500px] mb-12",
          effect === 'cube' && "perspective-1000"
        )}
      >
        {/* Fade Effect */}
        {effect === 'fade' && (
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
        )}

        {/* Cube Effect */}
        {effect === 'cube' && (
          <div className="relative h-full w-full transform-style-3d">
            {photos.map((photo, index) => {
              // Calculate rotation and position for cube effect
              const rotation = (index - currentIndex) * 90;
              const isActive = index === currentIndex;
              const prevActive = index === (currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
              const nextActive = index === (currentIndex + 1) % photos.length;
              const zIndex = isActive ? 10 : 0;
              
              let transform = '';
              if (isActive) transform = 'translateZ(250px) rotateY(0deg)';
              else if (prevActive) transform = 'translateZ(0) rotateY(-90deg) translateX(-250px)';
              else if (nextActive) transform = 'translateZ(0) rotateY(90deg) translateX(250px)';
              else transform = 'translateZ(-250px) rotateY(180deg)';
              
              return (
                <div
                  key={photo.id}
                  className="absolute top-0 left-0 h-full w-full transition-transform duration-700 ease-in-out"
                  style={{ 
                    zIndex,
                    transform,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <Link to={`/photo/${photo.id}`} className="block h-full">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="h-full w-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h2 className="text-2xl font-bold">{photo.title}</h2>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Cards Effect */}
        {effect === 'cards' && (
          <div className="relative h-full w-full">
            {photos.map((photo, index) => {
              // Calculate position and scaling for cards effect
              const diff = (index - currentIndex + photos.length) % photos.length;
              const absIndex = diff <= photos.length / 2 ? diff : diff - photos.length;
              
              const scale = Math.max(0.8, 1 - Math.abs(absIndex) * 0.1);
              const translateX = absIndex * 50;
              const zIndex = photos.length - Math.abs(absIndex);
              const opacity = Math.max(0.5, 1 - Math.abs(absIndex) * 0.2);
              
              return (
                <div
                  key={photo.id}
                  className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out"
                  style={{ 
                    transform: `translateX(${translateX}%) scale(${scale})`, 
                    zIndex,
                    opacity
                  }}
                >
                  <Link to={`/photo/${photo.id}`} className="block h-full">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="h-full w-full object-cover rounded-xl"
                    />
                    {diff === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-xl">
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h2 className="text-2xl font-bold">{photo.title}</h2>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Parallax Effect */}
        {effect === 'parallax' && (
          <div className="relative h-full w-full">
            {visiblePhotos().map((photo, idx) => {
              const isCenter = idx === Math.floor(slidesPerView / 2);
              const offset = idx - Math.floor(slidesPerView / 2);
              
              return (
                <div
                  key={photo.id}
                  className="absolute top-0 h-full transition-all duration-500"
                  style={{ 
                    width: `${100 / slidesPerView}%`,
                    left: `${50 + (offset * (100 / slidesPerView)) - (100 / slidesPerView) / 2}%`,
                    transform: `translateX(-50%) scale(${isCenter ? 1 : 0.9})`,
                    zIndex: isCenter ? 10 : 5,
                    opacity: isCenter ? 1 : 0.7
                  }}
                >
                  <Link to={`/photo/${photo.id}`} className="block h-full">
                    <div className="parallax-container relative h-full overflow-hidden rounded-xl">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className={cn(
                          "h-full w-full object-cover transition-all duration-700",
                          isCenter ? "scale-110" : "scale-100"
                        )}
                        style={{
                          transform: isCenter ? `translateY(-5%)` : 'none'
                        }}
                      />
                      {isCenter && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                          <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h2 className="text-2xl font-bold">{photo.title}</h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-2">
        {photos.slice(0, Math.min(10, photos.length)).map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === currentIndex ? "bg-gallery-purple w-8" : "bg-gray-300"
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
        {photos.length > 10 && <span className="text-xs text-muted-foreground">+{photos.length - 10} more</span>}
      </div>
    </div>
  );
};

export default Carousel;
