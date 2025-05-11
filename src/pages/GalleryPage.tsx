
import React from 'react';
import Navbar from '@/components/Navbar';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import Carousel from '@/components/gallery/Carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GalleryPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Your Gallery</h1>
        <p className="text-muted-foreground mb-6">
          Browse your collection of beautiful memories and moments.
        </p>
        
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="carousel">Effects Gallery</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-6">
            <PhotoGrid />
          </TabsContent>
          
          <TabsContent value="carousel">
            <Carousel />
          </TabsContent>
        </Tabs>
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
