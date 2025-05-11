
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { UploadIcon } from './icons/UploadIcon';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-gallery-purple">
            GalleryVista
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/gallery" className="text-sm font-medium transition-colors hover:text-primary">
            Gallery
          </Link>
          <Link to="/favorites" className="text-sm font-medium transition-colors hover:text-primary">
            Favorites
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link to="/upload">
              <UploadIcon className="h-5 w-5" />
              <span className="sr-only">Upload</span>
            </Link>
          </Button>
          <Button asChild>
            <Link to="/upload">
              Upload Photo
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
