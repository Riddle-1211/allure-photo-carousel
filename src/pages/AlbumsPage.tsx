
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { usePhotoContext } from '@/contexts/PhotoContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, FolderPlus, Image, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AlbumsPage = () => {
  const { albums, addAlbum, deleteAlbum, getPhotosByAlbumId } = usePhotoContext();
  const { toast } = useToast();

  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) {
      toast({
        title: "Album name required",
        description: "Please enter a name for your album",
        variant: "destructive",
      });
      return;
    }

    addAlbum({
      name: newAlbumName,
      description: newAlbumDescription
    });

    toast({
      title: "Album created",
      description: `"${newAlbumName}" has been created successfully`,
    });

    setNewAlbumName('');
    setNewAlbumDescription('');
    setDialogOpen(false);
  };

  const handleDeleteAlbum = (id: number, name: string) => {
    deleteAlbum(id);
    toast({
      title: "Album deleted",
      description: `"${name}" has been deleted`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Albums</h1>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gallery-purple hover:bg-gallery-darkPurple">
                <FolderPlus className="mr-2 h-5 w-5" />
                Create Album
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
                <DialogDescription>
                  Create a new album to organize your photos.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="album-name">Album Name</Label>
                  <Input 
                    id="album-name" 
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Family Vacation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="album-description">Description (Optional)</Label>
                  <Textarea 
                    id="album-description"
                    value={newAlbumDescription}
                    onChange={(e) => setNewAlbumDescription(e.target.value)}
                    placeholder="Summer vacation photos from 2024"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button className="bg-gallery-purple hover:bg-gallery-darkPurple" onClick={handleCreateAlbum}>
                  Create Album
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {albums.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Albums Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first album to organize your photos
            </p>
            <Button className="bg-gallery-purple hover:bg-gallery-darkPurple" onClick={() => setDialogOpen(true)}>
              <FolderPlus className="mr-2 h-5 w-5" />
              Create Your First Album
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map((album) => {
              const albumPhotos = getPhotosByAlbumId(album.id);
              const coverPhoto = albumPhotos.length > 0 ? albumPhotos[0] : null;
              
              return (
                <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/album/${album.id}`}>
                    <div className="h-48 bg-gray-200 relative">
                      {coverPhoto ? (
                        <img 
                          src={coverPhoto.url} 
                          alt={album.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                          <Image className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm py-1 px-2 rounded-md">
                        {albumPhotos.length} {albumPhotos.length === 1 ? 'photo' : 'photos'}
                      </div>
                    </div>
                  </Link>
                  
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <Link to={`/album/${album.id}`} className="hover:text-gallery-purple transition-colors">
                        {album.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  {album.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                    </CardContent>
                  )}
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link to={`/album/${album.id}`}>View Album</Link>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Album</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{album.name}"? This action cannot be undone.
                            Photos in this album won't be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDeleteAlbum(album.id, album.name)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlbumsPage;
