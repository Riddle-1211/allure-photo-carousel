
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { UploadIcon } from './icons/UploadIcon';
import { GalleryIcon } from './icons/GalleryIcon';
import { cn } from '@/lib/utils';
import { ZoomInIcon, ImagesIcon } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-gallery-purple to-gallery-darkPurple p-1.5 rounded-lg">
              <GalleryIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">GalleryVista</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center">
          <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-full p-1 px-1">
            <div className="flex space-x-1">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium px-4 py-1.5 rounded-full transition-colors",
                  isActive('/') 
                    ? "bg-gallery-purple text-white shadow-sm" 
                    : "hover:bg-white/50 text-gray-700"
                )}
              >
                Home
              </Link>
              <Link 
                to="/gallery" 
                className={cn(
                  "text-sm font-medium px-4 py-1.5 rounded-full transition-colors",
                  isActive('/gallery') 
                    ? "bg-gallery-purple text-white shadow-sm" 
                    : "hover:bg-white/50 text-gray-700"
                )}
              >
                Gallery
              </Link>
              <Link 
                to="/favorites" 
                className={cn(
                  "text-sm font-medium px-4 py-1.5 rounded-full transition-colors",
                  isActive('/favorites') 
                    ? "bg-gallery-purple text-white shadow-sm" 
                    : "hover:bg-white/50 text-gray-700"
                )}
              >
                Favorites
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            asChild 
            variant="ghost" 
            size="icon" 
            className={cn(
              "mr-2 rounded-full",
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-gray-700 hover:bg-white/50"
            )}
          >
            <Link to="/gallery" title="Browse Gallery">
              <ImagesIcon className="h-5 w-5" />
              <span className="sr-only">Gallery</span>
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="ghost" 
            size="icon" 
            className={cn(
              "mr-2 rounded-full",
              scrolled ? "text-gray-700 hover:bg-gray-100" : "text-gray-700 hover:bg-white/50"
            )}
          >
            <Link to="/photo/1" title="Photo Detail View">
              <ZoomInIcon className="h-5 w-5" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          
          <Button 
            asChild
            className="bg-gradient-to-r from-gallery-purple to-gallery-darkPurple text-white shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-90"
          >
            <Link to="/upload" className="flex items-center">
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload Photo
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
