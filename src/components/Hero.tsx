import { Code2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export function Hero() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const email = import.meta.env.VITE_USER_EMAIL;
  const isHome = location.pathname === '/';

  const handleScrollToSubjects = () => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      component="section"
      id="about"
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Typography
          component="h1"
          variant="h1"
          sx={{
            fontSize: { xs: '1.875rem', sm: '2.25rem', md: '3rem' },
          }}
        >
          <Box component="span" sx={{ color: theme.palette.secondary.main }}>
            Repositório Acadêmico
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ maxWidth: '42rem', lineHeight: 1.7 }}>
          Esta plataforma funciona como um repositório estruturado das minhas
          atividades acadêmicas, estudos técnicos e projetos desenvolvidos no
          contexto do Bacharelado em Ciência da Computação.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: '42rem',
            lineHeight: 1.7,
            color: theme.palette.text.secondary,
          }}
        >
          O objetivo é manter um acompanhamento público e organizado do
          desenvolvimento dos projetos, documentando metodologias adotadas,
          decisões técnicas e reflexões sobre o processo de aprendizagem.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ pt: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleScrollToSubjects}
            startIcon={<Code2 size={18} />}
            sx={{ px: 3, py: 1.5 }}
          >
            Explorar
          </Button>

          <Button
            variant="outlined"
            component="a"
            href={email ? `mailto:${email}` : undefined}
            sx={{ px: 3, py: 1.5 }}
          >
            Contato Acadêmico
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}