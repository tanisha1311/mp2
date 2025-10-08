// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import { ResultsProvider } from "./store/ResultsContext";

export default function App() {
  return (
    <ResultsProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/pokemon/:id" element={<DetailView />} />
        {/* fallback to avoid white screens on bad URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ResultsProvider>
  );
}
