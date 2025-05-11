
import React from 'react';
import Navbar from '@/components/Navbar';
import UploadForm from '@/components/upload/UploadForm';

const UploadPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4">
        <UploadForm />
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 GalleryVista. Your Beautiful Photo Gallery.</p>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
