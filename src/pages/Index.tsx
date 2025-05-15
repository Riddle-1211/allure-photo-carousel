
import React from 'react';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/gallery/Carousel';
import RotationalCarousel from '@/components/gallery/RotationalCarousel';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import { GalleryIcon } from '@/components/icons/GalleryIcon';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Folder } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative py-8 md:py-12 bg-gradient-to-b from-background to-secondary/30">
          <div className="container mx-auto">
            <Carousel autoRotateEffects={true} />
          </div>
        </div>
        
        {/* Featured Section */}
        <section className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mt-12 mb-2">Your Photo Gallery</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A beautiful space to showcase your favorite moments, memories, and artistic photography.
          </p>
          
          <RotationalCarousel />
        </section>
        
        {/* Recent Photos Grid */}
        <section className="container mx-auto py-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Photos</h2>
            <Button asChild variant="outline">
              <Link to="/gallery">
                <GalleryIcon className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </div>
          
          <PhotoGrid />
        </section>
        
        {/* Albums CTA */}
        <section className="bg-gradient-to-r from-gallery-purple/20 to-gallery-darkPurple/20 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Organize Your Photos</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Create albums to organize your photos into collections by theme, event, or any way you prefer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gallery-purple hover:bg-gallery-darkPurple">
                <Link to="/albums">
                  <Folder className="mr-2 h-5 w-5" />
                  Browse Albums
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/upload">
                  Upload New Photos
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Upload CTA */}
        <section className="bg-gradient-to-r from-gallery-purple/20 to-gallery-darkPurple/20 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Add Your Own Photos</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Upload your favorite images to your personal gallery and organize them beautifully.
            </p>
            <Button asChild size="lg" className="bg-gallery-purple hover:bg-gallery-darkPurple">
              <Link to="/upload">
                Upload New Photos
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 GalleryVista. Your Beautiful Photo Gallery.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
