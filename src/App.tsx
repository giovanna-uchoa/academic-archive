import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SubjectPage = lazy(() => import('@/pages/SubjectPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));

export default function App() {
  const theme = useTheme();

  return (
    <HashRouter>
      <Box 
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Box component="main" sx={{ flex: 1 }}>
          <Suspense fallback={<div>Carregando...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/subject/:subjectId" element={<SubjectPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </HashRouter>
  );
}
