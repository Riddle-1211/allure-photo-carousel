
import React, { useState } from 'react';
import { usePhotoContext, Photo } from '@/contexts/PhotoContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { ImageIcon, Maximize } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PhotoGrid = () => {
  const { photos } = usePhotoContext();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
};

const PhotoCard = ({ photo }: { photo: Photo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Card 
        className="photo-card overflow-hidden relative rounded-xl hover-scale w-full aspect-square"
      >
        <CardContent className="p-0 h-full w-full">
          <div className="relative h-full w-full shimmer">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
              onClick={() => setIsExpanded(true)}
            />
            <div className="photo-overlay absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 opacity-0 transition-opacity duration-300 flex flex-col justify-end">
              <div className="p-4 flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium text-white drop-shadow-md">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-sm text-white/90 mt-1 line-clamp-2">{photo.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                    className="bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm"
                    aria-label="Expand image"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <Link 
              to={`/photo/${photo.id}`}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
            >
              <ImageIcon className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-5xl w-full p-1 bg-black/90 border-neutral-800">
          <div className="relative aspect-auto max-h-[85vh] flex items-center justify-center">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="p-4 bg-black/60 absolute bottom-0 left-0 right-0">
            <h2 className="text-white font-medium">{photo.title}</h2>
            {photo.description && (
              <p className="text-white/80 text-sm">{photo.description}</p>
            )}
            <Link 
              to={`/photo/${photo.id}`}
              className="text-blue-400 hover:text-blue-300 text-sm mt-1 block"
              onClick={() => setIsExpanded(false)}
            >
              View details
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGrid;
