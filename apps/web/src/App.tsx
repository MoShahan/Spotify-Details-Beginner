import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionGate } from './components/auth/SessionGate';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './contexts/auth';
import { ThemeProvider } from './contexts/theme';
import { AboutPage } from './pages/AboutPage';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NewArtistPage } from './pages/NewArtistPage';
import { NewSongPage } from './pages/NewSongPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { RegisterPage } from './pages/RegisterPage';
import { SongDetailPage } from './pages/SongDetailPage';
import { SongsPage } from './pages/SongsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionGate>
          <Routes>
            <Route element={<AppShell />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/songs" element={<SongsPage />} />
                <Route path="/songs/new" element={<NewSongPage />} />
                <Route path="/songs/:id" element={<SongDetailPage />} />
                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/artists/new" element={<NewArtistPage />} />
                <Route path="/artists/:id" element={<ArtistDetailPage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
              </Route>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster position="top-center" closeButton />
        </SessionGate>
      </AuthProvider>
    </ThemeProvider>
  );
}
