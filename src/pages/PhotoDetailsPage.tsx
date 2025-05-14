import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePhotoContext } from '@/contexts/PhotoContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PhotoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPhotoById, toggleFavorite, deletePhoto } = usePhotoContext();
  const navigate = useNavigate();
  
  const photo = getPhotoById(Number(id));
  
  if (!photo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Photo not found</h1>
            <Link 
              to="/gallery" 
              className="text-gallery-purple hover:text-gallery-darkPurple underline"
            >
              Return to gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    toggleFavorite(photo.id);
    toast.success(photo.favorite ? "Removed from favorites" : "Added to favorites");
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deletePhoto(photo.id);
      toast.success("Photo deleted successfully");
      navigate('/gallery');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link to="/gallery" className="text-gallery-purple hover:text-gallery-darkPurple mb-6 inline-block">
          &larr; Back to gallery
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="rounded-lg overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center h-[calc(80vh-120px)] max-h-[650px]">
              <img 
                src={photo.url} 
                alt={photo.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{photo.title}</h1>
            
            {photo.description && (
              <p className="text-gray-600 mb-6">{photo.description}</p>
            )}
            
            <div className="flex flex-wrap gap-3 mb-8">
              <Button 
                variant={photo.favorite ? "default" : "outline"}
                onClick={handleFavoriteToggle}
                className={photo.favorite ? "bg-gallery-purple hover:bg-gallery-darkPurple" : ""}
              >
                {photo.favorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              
              <Button 
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Photo
              </Button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Photo Details</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">ID:</span> {photo.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Size:</span> {photo.size || "Regular"}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 GalleryVista. Your Beautiful Photo Gallery.</p>
        </div>
      </footer>
    </div>
  );
};

export default PhotoDetailsPage;
