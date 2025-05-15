
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Folder, Image, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const AlbumDetailsPage = () => {
  const { id } = useParams();
  const albumId = parseInt(id || "0");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    albums, 
    photos, 
    getAlbumById, 
    getPhotosByAlbumId, 
    updateAlbum, 
    deleteAlbum,
    addPhotoToAlbum,
    removePhotoFromAlbum
  } = usePhotoContext();
  
  const album = getAlbumById(albumId);
  const albumPhotos = getPhotosByAlbumId(albumId);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addPhotosDialogOpen, setAddPhotosDialogOpen] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<number>>(new Set());
  
  // Initialize form state when album data is loaded
  useEffect(() => {
    if (album) {
      setAlbumName(album.name);
      setAlbumDescription(album.description || '');
    }
  }, [album]);
  
  if (!album) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
          <p className="mb-6">The album you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/albums">Back to Albums</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleUpdateAlbum = () => {
    if (!albumName.trim()) {
      toast({
        title: "Album name required",
        description: "Please enter a name for your album",
        variant: "destructive",
      });
      return;
    }
    
    updateAlbum({
      ...album,
      name: albumName,
      description: albumDescription || undefined,
    });
    
    toast({
      title: "Album updated",
      description: "Your album has been updated successfully",
    });
    
    setEditDialogOpen(false);
  };
  
  const handleDeleteAlbum = () => {
    deleteAlbum(albumId);
    toast({
      title: "Album deleted",
      description: `"${album.name}" has been deleted`,
    });
    navigate('/albums');
  };

  const handleAddPhotosToAlbum = () => {
    selectedPhotoIds.forEach(photoId => {
      addPhotoToAlbum(photoId, albumId);
    });
    
    toast({
      title: "Photos added",
      description: `${selectedPhotoIds.size} photo(s) added to "${album.name}"`,
    });
    
    setAddPhotosDialogOpen(false);
    setSelectedPhotoIds(new Set());
  };
  
  const handleRemoveFromAlbum = (photoId: number) => {
    removePhotoFromAlbum(photoId, albumId);
    
    toast({
      title: "Photo removed",
      description: "Photo has been removed from the album",
    });
  };
  
  const handlePhotoSelection = (photoId: number, isChecked: boolean) => {
    const newSelectedPhotoIds = new Set(selectedPhotoIds);
    if (isChecked) {
      newSelectedPhotoIds.add(photoId);
    } else {
      newSelectedPhotoIds.delete(photoId);
    }
    setSelectedPhotoIds(newSelectedPhotoIds);
  };
  
  // Get photos that are not in this album
  const availablePhotos = photos.filter(
    photo => !albumPhotos.some(albumPhoto => albumPhoto.id === photo.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="mb-6">
          <Link to="/albums" className="text-muted-foreground hover:text-foreground flex items-center mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Albums
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{album.name}</h1>
              {album.description && (
                <p className="text-muted-foreground mt-1">{album.description}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Album</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Album</DialogTitle>
                    <DialogDescription>
                      Make changes to your album details here.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="album-name-edit">Album Name</Label>
                      <Input 
                        id="album-name-edit" 
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="album-description-edit">Description (Optional)</Label>
                      <Textarea 
                        id="album-description-edit"
                        value={albumDescription}
                        onChange={(e) => setAlbumDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateAlbum}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Album</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Album</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this album? This action cannot be undone.
                      Photos in this album won't be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive" onClick={handleDeleteAlbum}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Photos ({albumPhotos.length})</h2>
          
          <Dialog open={addPhotosDialogOpen} onOpenChange={setAddPhotosDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={availablePhotos.length === 0}>
                <Plus className="mr-2 h-5 w-5" />
                Add Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Photos to Album</DialogTitle>
                <DialogDescription>
                  Select photos to add to "{album.name}"
                </DialogDescription>
              </DialogHeader>
              
              {availablePhotos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-2">All photos are already in this album.</p>
                  <Button asChild>
                    <Link to="/upload">Upload new photos</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
                  {availablePhotos.map(photo => (
                    <div key={photo.id} className="relative">
                      <div className={`
                        aspect-square rounded-md overflow-hidden border-2
                        ${selectedPhotoIds.has(photo.id) ? 'border-primary' : 'border-transparent'}
                      `}>
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Checkbox
                          checked={selectedPhotoIds.has(photo.id)}
                          onCheckedChange={(checked) => 
                            handlePhotoSelection(photo.id, checked === true)
                          }
                          className="h-5 w-5 bg-white/70"
                        />
                      </div>
                      <p className="text-sm truncate mt-1">{photo.title}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAddPhotosDialogOpen(false);
                    setSelectedPhotoIds(new Set());
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddPhotosToAlbum}
                  disabled={selectedPhotoIds.size === 0}
                >
                  Add Selected Photos
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {albumPhotos.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-lg">
            <Image className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Photos in this Album</h3>
            <p className="text-muted-foreground mb-6">
              Add photos to this album to start organizing your collection.
            </p>
            <Button onClick={() => setAddPhotosDialogOpen(true)} disabled={availablePhotos.length === 0}>
              <Plus className="mr-2 h-5 w-5" />
              Add Photos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumPhotos.map(photo => (
              <div key={photo.id} className="group relative">
                <Link to={`/photo/${photo.id}`} className="block aspect-square">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover rounded-md transition-transform group-hover:scale-[1.02]"
                  />
                </Link>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-sm font-medium truncate mr-2">{photo.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFromAlbum(photo.id)}
                      className="text-white hover:text-red-300 hover:bg-transparent"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumDetailsPage;
