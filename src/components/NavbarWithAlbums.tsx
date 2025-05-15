
import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Folder } from 'lucide-react';

const NavbarWithAlbums = () => {
  // This component provides a wrapper to add the Albums link since we can't modify Navbar directly
  return (
    <div className="relative">
      <Navbar />
      <div className="absolute right-[180px] top-1/2 -translate-y-1/2">
        <Button variant="ghost" asChild className="text-sm font-medium">
          <Link to="/albums">
            <Folder className="mr-2 h-4 w-4" />
            Albums
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NavbarWithAlbums;
