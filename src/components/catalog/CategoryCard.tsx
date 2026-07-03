import { Link as RouterLink } from 'react-router-dom';
import { LibraryBig, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { renderSubjectIcon } from '../../utils/iconRenderer';
import { CategorySummary } from '../../utils/dataTypes';
import { getContentPalette } from '../../theme/muiTheme';

interface CategoryCardProps {
  category: CategorySummary;
  featured?: boolean;
}

function CategoryCard({ category, featured = false }: CategoryCardProps) {
  const theme = useTheme();
  const affordanceSize = featured ? 40 : 32;

  function formatText(text: string) {
    if (!text) return "";
    return text
      .replace(/\n+/g, "; ")
      .replace(/[*_]/g, "")
      .replace(/[#>`~\-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        borderColor: 'divider',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: getContentPalette(theme.palette.mode).elevatedShadow,
        },
        '&:hover .card-open-affordance': {
          opacity: 1,
          transform: 'scale(1)',
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
            p: featured ? { xs: 2.5, sm: 3.5 } : { xs: 2, sm: 2.5 },
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
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                {category.id.toUpperCase()}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                {category.icon?.trim() && (
                  <Box sx={{ color: 'secondary.main' }}>
                    {renderSubjectIcon(category.icon, { size: 24 })}
                  </Box>
                )}

                <Typography variant={featured ? 'h5' : 'h6'}>
                  {category.title}
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: featured ? 4 : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {formatText(category.description)}
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

      <Box
        className="card-open-affordance"
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: affordanceSize,
          height: affordanceSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <ArrowUpRight size={featured ? 18 : 16} />
      </Box>
    </Card>
  );
}

export default CategoryCard;