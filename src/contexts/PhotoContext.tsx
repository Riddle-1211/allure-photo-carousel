
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sample placeholder photos
const placeholderPhotos: Photo[] = [
  {
    id: 1,
    title: "Mountain Landscape",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    size: "wide" as const,
    albumIds: []
  },
  {
    id: 2,
    title: "Ocean Waves",
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    size: "regular" as const,
    albumIds: []
  },
  {
    id: 3,
    title: "Urban Architecture",
    url: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    size: "tall" as const,
    albumIds: []
  },
  {
    id: 4,
    title: "Colorful Flowers",
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    size: "regular" as const,
    albumIds: []
  },
  {
    id: 5,
    title: "Night Sky",
    url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    size: "wide" as const,
    albumIds: []
  },
  {
    id: 6,
    title: "Modern Building",
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    size: "tall" as const,
    albumIds: []
  },
  {
    id: 7,
    title: "River Valley",
    url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    size: "regular" as const,
    albumIds: []
  },
  {
    id: 8,
    title: "Wavy Building",
    url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
    size: "regular" as const,
    albumIds: []
  },
  {
    id: 9,
    title: "Tabby Cat",
    url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    size: "wide" as const,
    albumIds: []
  },
  {
    id: 10,
    title: "Cozy Living Room",
    url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    size: "tall" as const,
    albumIds: []
  }
];

// Sample placeholder albums
const placeholderAlbums: Album[] = [
  {
    id: 1,
    name: "Nature",
    description: "Beautiful natural landscapes",
  },
  {
    id: 2,
    name: "Architecture",
    description: "Modern and classic buildings",
  }
];

export interface Photo {
  id: number;
  title: string;
  url: string;
  size?: 'regular' | 'wide' | 'tall';
  favorite?: boolean;
  description?: string;
  albumIds?: number[];
}

export interface Album {
  id: number;
  name: string;
  description?: string;
  coverPhotoId?: number;
}

interface PhotoContextType {
  photos: Photo[];
  favorites: Photo[];
  albums: Album[];
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  toggleFavorite: (id: number) => void;
  deletePhoto: (id: number) => void;
  getPhotoById: (id: number) => Photo | undefined;
  addAlbum: (album: Omit<Album, 'id'>) => void;
  updateAlbum: (album: Album) => void;
  deleteAlbum: (id: number) => void;
  getAlbumById: (id: number) => Album | undefined;
  addPhotoToAlbum: (photoId: number, albumId: number) => void;
  removePhotoFromAlbum: (photoId: number, albumId: number) => void;
  getPhotosByAlbumId: (albumId: number) => Photo[];
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhotoContext must be used within a PhotoProvider");
  }
  return context;
};

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [favorites, setFavorites] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  // Initialize with placeholder photos and albums
  useEffect(() => {
    const savedPhotos = localStorage.getItem('gallery_photos');
    const savedFavorites = localStorage.getItem('gallery_favorites');
    const savedAlbums = localStorage.getItem('gallery_albums');
    
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    } else {
      setPhotos(placeholderPhotos);
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
    } else {
      setAlbums(placeholderAlbums);
    }
  }, []);

  // Save to local storage whenever photos, favorites, or albums change
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('gallery_photos', JSON.stringify(photos));
    }
    if (favorites.length > 0) {
      localStorage.setItem('gallery_favorites', JSON.stringify(favorites));
    }
    if (albums.length > 0) {
      localStorage.setItem('gallery_albums', JSON.stringify(albums));
    }
  }, [photos, favorites, albums]);

  const addPhoto = (photo: Omit<Photo, 'id'>) => {
    const newPhoto = {
      ...photo,
      id: Date.now(), // Simple way to generate unique IDs
      size: 'regular' as const,
      albumIds: []
    };
    setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
  };

  const toggleFavorite = (id: number) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => 
        photo.id === id ? { ...photo, favorite: !photo.favorite } : photo
      )
    );

    const photo = photos.find(p => p.id === id);
    if (photo) {
      if (photo.favorite) {
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
      } else {
        setFavorites(prevFavorites => [...prevFavorites, { ...photo, favorite: true }]);
      }
    }
  };

  const deletePhoto = (id: number) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
    
    // Remove this photo from any albums that reference it
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.coverPhotoId === id ? { ...album, coverPhotoId: undefined } : album
      )
    );
  };

  const getPhotoById = (id: number) => {
    return photos.find(photo => photo.id === id);
  };

  // Album related functions
  const addAlbum = (album: Omit<Album, 'id'>) => {
    const newAlbum = {
      ...album,
      id: Date.now() // Simple way to generate unique IDs
    };
    setAlbums(prevAlbums => [...prevAlbums, newAlbum]);
  };

  const updateAlbum = (updatedAlbum: Album) => {
    setAlbums(prevAlbums => 
      prevAlbums.map(album => 
        album.id === updatedAlbum.id ? updatedAlbum : album
      )
    );
  };

  const deleteAlbum = (id: number) => {
    setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== id));
    
    // Remove this album from any photos that reference it
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => ({
        ...photo,
        albumIds: photo.albumIds?.filter(albumId => albumId !== id) || []
      }))
    );
  };

  const getAlbumById = (id: number) => {
    return albums.find(album => album.id === id);
  };

  const addPhotoToAlbum = (photoId: number, albumId: number) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => {
        if (photo.id === photoId) {
          const albumIds = photo.albumIds || [];
          if (!albumIds.includes(albumId)) {
            return { ...photo, albumIds: [...albumIds, albumId] };
          }
        }
        return photo;
      })
    );
  };

  const removePhotoFromAlbum = (photoId: number, albumId: number) => {
    setPhotos(prevPhotos => 
      prevPhotos.map(photo => {
        if (photo.id === photoId && photo.albumIds) {
          return { 
            ...photo, 
            albumIds: photo.albumIds.filter(id => id !== albumId) 
          };
        }
        return photo;
      })
    );
    
    // If this photo is the cover of the album, remove it as cover
    setAlbums(prevAlbums => 
      prevAlbums.map(album => {
        if (album.id === albumId && album.coverPhotoId === photoId) {
          return { ...album, coverPhotoId: undefined };
        }
        return album;
      })
    );
  };

  const getPhotosByAlbumId = (albumId: number) => {
    return photos.filter(photo => photo.albumIds?.includes(albumId));
  };

  return (
    <PhotoContext.Provider value={{ 
      photos, 
      favorites,
      albums,
      addPhoto, 
      toggleFavorite, 
      deletePhoto,
      getPhotoById,
      addAlbum,
      updateAlbum,
      deleteAlbum,
      getAlbumById,
      addPhotoToAlbum,
      removePhotoFromAlbum,
      getPhotosByAlbumId
    }}>
      {children}
    </PhotoContext.Provider>
  );
};
