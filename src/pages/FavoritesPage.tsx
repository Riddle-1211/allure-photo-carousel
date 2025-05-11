
import React from 'react';
import Navbar from '@/components/Navbar';
import { usePhotoContext, Photo } from '@/contexts/PhotoContext';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites } = usePhotoContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted-foreground mb-6">
          A collection of your most treasured photographs.
        </p>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Add photos to your favorites to see them here.
            </p>
            <Link 
              to="/gallery" 
              className="text-gallery-purple hover:text-gallery-darkPurple underline"
            >
              Browse your gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((photo) => (
              <Link to={`/photo/${photo.id}`} key={photo.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3]">
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                        <h3 className="text-white font-medium p-4">{photo.title}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 GalleryVista. Your Beautiful Photo Gallery.</p>
        </div>
      </footer>
    </div>
  );
};

export default FavoritesPage;
