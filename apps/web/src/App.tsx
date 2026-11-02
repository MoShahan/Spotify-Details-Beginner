import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionGate } from './components/auth/SessionGate';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './contexts/auth';
import { ThemeProvider } from './contexts/theme';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

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
