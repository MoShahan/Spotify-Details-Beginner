import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionGate } from './components/auth/SessionGate';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './contexts/auth';
import { ThemeProvider } from './contexts/theme';
import { ArtistDetailPage } from './pages/ArtistDetailPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
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
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/songs"
                element={
                  <ProtectedRoute>
                    <SongsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/songs/:id"
                element={
                  <ProtectedRoute>
                    <SongDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artists"
                element={
                  <ProtectedRoute>
                    <ArtistsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artists/:id"
                element={
                  <ProtectedRoute>
                    <ArtistDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster richColors position="top-center" closeButton />
        </SessionGate>
      </AuthProvider>
    </ThemeProvider>
  );
}
