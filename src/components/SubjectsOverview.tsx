import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { useCmsContent } from '../utils/useCmsContent';
import { SubjectCard } from './SubjectCard';

export function SubjectsOverview() {
  const theme = useTheme();
  const { subjects, posts, loading, error } = useCmsContent();

  const getPostCount = (subjectId: string) =>
    posts.filter(post => post.subjectId === subjectId).length;

  return (
    <Box
      component="section"
      id="subjects"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 8 },
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Explore por Disciplina
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          Abaixo estão organizadas algumas das disciplinas cursadas, reunindo registros
          das atividades desenvolvidas, projetos realizados, contribuições técnicas e
          reflexões acadêmicas produzidas ao longo de cada semestre.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="stretch">
        {loading && (
          <Grid item xs={12}>
            <Alert severity="info">
              Carregando disciplinas e conteúdos...
            </Alert>
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              Ocorreu um erro ao carregar as informações.
            </Alert>
          </Grid>
        )}

        {subjects.map(subject => (
          <Grid item key={subject.id} xs={12} sm={6} lg={4}>
            <SubjectCard
              id={subject.id}
              title={subject.title}
              description={subject.description}
              icon={subject.icon}
              postCount={getPostCount(subject.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}