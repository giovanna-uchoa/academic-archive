import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const ArchivesPage = lazy(() => import('./pages/ArchivesPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const TagsPage = lazy(() => import('./pages/TagsPage'));
const TagPage = lazy(() => import('./pages/TagPage'));
const PostPage = lazy(() => import('./pages/PostPage'));

export default function App() {
  const theme = useTheme();

  return (
    <HashRouter>
      <Box 
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          backgroundImage:
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 15% 5%, rgba(214, 186, 140, 0.25), transparent 45%)'
              : 'radial-gradient(circle at 15% 5%, rgba(214, 186, 140, 0.12), transparent 45%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Container sx={{ flex: 1, py: { xs: 3, md: 4 }, maxWidth: '100vw' }}>
          <Box
            component="main"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: { xs: 2, sm: 3, md: 4 },
              backgroundColor: theme.palette.background.paper,
              boxShadow:
                theme.palette.mode === 'light'
                  ? '0 16px 40px rgba(48, 29, 7, 0.08)'
                  : '0 16px 40px rgba(0, 0, 0, 0.22)',
            }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/archives" element={<ArchivesPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/tags" element={<TagsPage />} />
                <Route path="/tags/:tagSlug" element={<TagPage />} />
                <Route path="/subjects/:subjectId" element={<SubjectPage />} />
                <Route path="/subjects/:subjectId/post/:postId" element={<PostPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Suspense>
          </Box>
        </Container>
        <Footer />
      </Box>
    </HashRouter>
  );
}
