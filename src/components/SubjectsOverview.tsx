import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { subjects } from '../data/subjects';
import { blogPosts } from '../data/blogPosts';
import { getCategoryIdFromName } from '../data/subjects';

export function SubjectsOverview() {
  const theme = useTheme();

  const getPostCount = (subjectId: string) => {
    return blogPosts.filter(
      post => getCategoryIdFromName(post.category) === subjectId
    ).length;
  };

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
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Dive deep into specific topics and read about my experiments, findings, and best practices.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {subjects.map((subject) => {
          const postCount = getPostCount(subject.id);

          return (
            <Grid key={subject.id} size={{ xs: 12, md: 6 }}>
              <Card
                component={CardActionArea}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Link
                    component={RouterLink}
                    to={`/subject/${subject.id}`}
                    sx={{
                      textDecoration: 'none',
                      display: 'block',
                      '&:hover .subject-title': {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Typography variant="h4">{subject.icon}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            className="subject-title"
                            sx={{
                              mb: 1,
                              transition: 'color 0.2s',
                            }}
                          >
                            {subject.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {subject.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 1,
                          borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          <BookOpen size={16} />
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {postCount} {postCount === 1 ? 'article' : 'articles'}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            alignItems: 'center',
                            color: theme.palette.secondary.main,
                            transition: 'gap 0.2s',
                            '&:hover': {
                              gap: 1,
                            },
                          }}
                        >
                          <Typography variant="caption">Explore</Typography>
                          <ArrowRight size={16} />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
