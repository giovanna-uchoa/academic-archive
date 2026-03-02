import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SubjectPage } from './pages/SubjectPage';

export default function App() {
  const theme = useTheme();

  return (
    <BrowserRouter>
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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}
