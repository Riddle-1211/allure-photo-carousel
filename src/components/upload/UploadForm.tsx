
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UploadIcon } from '@/components/icons/UploadIcon';
import { GalleryIcon } from '@/components/icons/GalleryIcon';

const UploadForm = () => {
  const { addPhoto } = usePhotoContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error("Please provide a title for your photo");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real application, you would upload the file to a server
      // Here we're just simulating by using the preview URL
      setTimeout(() => {
        addPhoto({
          title: formData.title,
          description: formData.description,
          url: previewUrl as string,
        });
        
        toast.success("Photo uploaded successfully!");
        navigate('/gallery');
      }, 1000);
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12">
      <Card className="glass-card overflow-hidden border-0 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gallery-purple/30 to-gallery-darkPurple/20 blur-2xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gallery-purple/30 to-gallery-darkPurple/20 blur-2xl rounded-full -ml-16 -mb-16" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-gradient-to-br from-gallery-purple to-gallery-darkPurple rounded-full">
              <UploadIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center gradient-text">Upload New Photo</CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter photo title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="bg-white/50 backdrop-blur-sm border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter photo description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-white/50 backdrop-blur-sm border-white/20 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium">Select Photo</Label>
                <div className="flex items-center justify-center w-full">
                  <label 
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 hover:bg-white/40 backdrop-blur-sm border-gallery-purple/30 transition-all duration-300"
                  >
                    {previewUrl ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                              setPreviewUrl(null);
                            }}
                            className="rounded-full"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        <div className="p-4 rounded-full bg-gallery-purple/10 mb-4">
                          <UploadIcon className="w-8 h-8 text-gallery-purple" />
                        </div>
                        <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 text-center">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                      </div>
                    )}
                    <input 
                      id="file"
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/gallery')}
                className="border-gallery-purple/30 text-gallery-darkPurple"
              >
                <GalleryIcon className="h-4 w-4 mr-2" />
                Back to Gallery
              </Button>
              
              <Button 
                type="submit"
                className="bg-gradient-to-r from-gallery-purple to-gallery-darkPurple hover:opacity-90 text-white transition-all duration-300"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadForm;
