
import React from 'react';
import { usePhotoContext, Photo } from '@/contexts/PhotoContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

const PhotoGrid = () => {
  const { photos } = usePhotoContext();

  return (
    <div className="image-grid py-8">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

const PhotoCard = ({ photo }: { photo: Photo }) => {
  return (
    <Link to={`/photo/${photo.id}`}>
      <Card 
        className={cn(
          "photo-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl", 
          photo.size
        )}
      >
        <CardContent className="p-0 h-full w-full">
          <div className="relative h-full w-full">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="h-full w-full object-cover"
            />
            <div className="photo-overlay absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-medium text-white">{photo.title}</h3>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PhotoGrid;
