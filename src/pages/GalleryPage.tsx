
import React from 'react';
import NavbarWithAlbums from '@/components/NavbarWithAlbums';
import PhotoGrid from '@/components/gallery/PhotoGrid';

const GalleryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWithAlbums />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Your Gallery</h1>
        <p className="text-muted-foreground mb-6">
          Browse your collection of beautiful memories and moments.
        </p>
        
        <div className="mt-6">
          <PhotoGrid />
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 GalleryVista. Your Beautiful Photo Gallery.</p>
        </div>
      </footer>
    </div>
  );
};

export default GalleryPage;
