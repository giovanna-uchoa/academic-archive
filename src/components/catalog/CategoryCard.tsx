import { Link as RouterLink } from 'react-router-dom';
import { LibraryBig } from 'lucide-react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { renderSubjectIcon } from '../../utils/iconRenderer';
import { CategorySummary } from '../../utils/dataTypes';

interface CategoryCardProps {
  category: CategorySummary;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
      <Card
        variant="outlined"
        sx={{
          borderColor: 'divider',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
      >
        <CardActionArea
          component={RouterLink}
          to={`/subjects/${category.id}`}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack
              spacing={1.5}
              sx={{
                height: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {category.icon?.trim() && (
                    <Box sx={{ color: 'secondary.main' }}>
                      {renderSubjectIcon(category.icon, { size: 24 })}
                    </Box>
                  )}

                  <Typography variant="h6">
                    {category.title}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {category.description}
                </Typography>
              </Stack>

              <Chip
                icon={<LibraryBig size={14} />}
                label={`${category.totalPosts} posts`}
                size="small"
                sx={{ width: 'fit-content' }}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default CategoryCard;