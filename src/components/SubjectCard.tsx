import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  postCount: number;
}

export function SubjectCard({
  id,
  title,
  description,
  icon,
  postCount,
}: SubjectCardProps) {
  const theme = useTheme();

  return (
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
          to={`/subject/${id}`}
          underline="none"
          color="inherit"
          sx={{
            display: 'block',
            '&:hover .subject-title': {
              color: theme.palette.secondary.main,
            },
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Typography variant="h4">{icon}</Typography>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  className="subject-title"
                  sx={{
                    mb: 1,
                    transition: 'color 0.2s',
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {description}
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
              <Stack direction="row" spacing={0.5} alignItems="center">
                <BookOpen size={16} />
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {postCount} {postCount === 1 ? 'article' : 'articles'}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  color: theme.palette.secondary.main,
                  transition: 'gap 0.2s',
                  '&:hover': { gap: 1 },
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
  );
}