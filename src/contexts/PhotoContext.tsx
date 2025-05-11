
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sample placeholder photos
const placeholderPhotos = [
  {
    id: 1,
    title: "Mountain Landscape",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    size: "wide"
  },
  {
    id: 2,
    title: "Ocean Waves",
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    size: "regular"
  },
  {
    id: 3,
    title: "Urban Architecture",
    url: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    size: "tall"
  },
  {
    id: 4,
    title: "Colorful Flowers",
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    size: "regular"
  },
  {
    id: 5,
    title: "Night Sky",
    url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    size: "wide"
  },
  {
    id: 6,
    title: "Modern Building",
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    size: "tall"
  },
  {
    id: 7,
    title: "River Valley",
    url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    size: "regular"
  },
  {
    id: 8,
    title: "Wavy Building",
    url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
    size: "regular"
  },
  {
    id: 9,
    title: "Tabby Cat",
    url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    size: "wide"
  },
  {
    id: 10,
    title: "Cozy Living Room",
    url: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    size: "tall"
  }
];

export interface Photo {
  id: number;
  title: string;
  url: string;
  size?: 'regular' | 'wide' | 'tall';
  favorite?: boolean;
  description?: string;
}

interface PhotoContextType {
  photos: Photo[];
  favorites: Photo[];
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  toggleFavorite: (id: number) => void;
  deletePhoto: (id: number) => void;
  getPhotoById: (id: number) => Photo | undefined;
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

  // Initialize with placeholder photos
  useEffect(() => {
    const savedPhotos = localStorage.getItem('gallery_photos');
    const savedFavorites = localStorage.getItem('gallery_favorites');
    
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    } else {
      setPhotos(placeholderPhotos);
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save to local storage whenever photos or favorites change
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('gallery_photos', JSON.stringify(photos));
    }
    if (favorites.length > 0) {
      localStorage.setItem('gallery_favorites', JSON.stringify(favorites));
    }
  }, [photos, favorites]);

  const addPhoto = (photo: Omit<Photo, 'id'>) => {
    const newPhoto = {
      ...photo,
      id: Date.now(), // Simple way to generate unique IDs
      size: 'regular' as const,
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
  };

  const getPhotoById = (id: number) => {
    return photos.find(photo => photo.id === id);
  };

  return (
    <PhotoContext.Provider value={{ 
      photos, 
      favorites, 
      addPhoto, 
      toggleFavorite, 
      deletePhoto,
      getPhotoById
    }}>
      {children}
    </PhotoContext.Provider>
  );
};
