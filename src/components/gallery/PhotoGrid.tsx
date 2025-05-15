
import React from 'react';
import { usePhotoContext, Photo } from '@/contexts/PhotoContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

const PhotoGrid = () => {
  const { photos } = usePhotoContext();

  return (
    <div>
      <div className="masonry-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
};

const PhotoCard = ({ photo }: { photo: Photo }) => {
  return (
    <Link to={`/photo/${photo.id}`}>
      <Card 
        className="photo-card overflow-hidden relative rounded-xl hover-scale w-full"
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
            />
            <div className="photo-overlay absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 opacity-0 transition-opacity duration-300 flex flex-col justify-end">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white drop-shadow-md">{photo.title}</h3>
                {photo.description && (
                  <p className="text-sm text-white/90 mt-1 line-clamp-2">{photo.description}</p>
                )}
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PhotoGrid;
