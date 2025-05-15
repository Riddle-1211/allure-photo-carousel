// This component is no longer needed since albums link is now in the main Navbar
// Keeping this file as a redirect to the main Navbar component
import React from 'react';
import Navbar from './Navbar';

const NavbarWithAlbums = () => {
  // This component now just returns the main Navbar since Albums is integrated
  return <Navbar />;
};

export default NavbarWithAlbums;
