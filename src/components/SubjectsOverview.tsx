import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { subjects } from '../data/subjects';
import { blogPosts } from '../data/blogPosts';
import { getCategoryIdFromName } from '../data/subjects';
import { SubjectCard } from './SubjectCard';

export function SubjectsOverview() {
  const theme = useTheme();

  const getPostCount = (subjectId: string) =>
    blogPosts.filter(
      post => getCategoryIdFromName(post.category) === subjectId
    ).length;

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
          Explore by Subject
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          Dive deep into specific topics and read about my experiments,
          findings, and best practices.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="stretch">
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