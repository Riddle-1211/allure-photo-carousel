
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PhotoProvider } from "./contexts/PhotoContext";

import Index from "./pages/Index";
import GalleryPage from "./pages/GalleryPage";
import UploadPage from "./pages/UploadPage";
import FavoritesPage from "./pages/FavoritesPage";
import PhotoDetailsPage from "./pages/PhotoDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PhotoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/photo/:id" element={<PhotoDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PhotoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
