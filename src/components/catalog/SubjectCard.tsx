import { LibraryBig } from 'lucide-react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { renderSubjectIcon } from '../../utils/iconRenderer';
import { SubjectSummary } from '../../utils/dataTypes';
import TileCard from '../ui/TileCard';

interface SubjectCardProps {
  subject: SubjectSummary;
  featured?: boolean;
}

function SubjectCard({ subject, featured = false }: SubjectCardProps) {
  function formatText(text: string) {
    if (!text) return "";
    return text
      .replace(/\n+/g, "; ")
      .replace(/[*_]/g, "")
      .replace(/[#>`~-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return (
    <TileCard to={`/subjects/${subject.id}`} featured={featured}>
      <Stack
        spacing={1.5}
        sx={{
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={1.2}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
            {subject.id.toUpperCase()}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {subject.icon?.trim() && (
              <Box sx={{ color: 'secondary.main' }}>
                {renderSubjectIcon(subject.icon, { size: 24 })}
              </Box>
            )}

            <Typography variant={featured ? 'h5' : 'h6'}>
              {subject.title}
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
            {formatText(subject.description)}
          </Typography>
        </Stack>

        <Chip
          icon={<LibraryBig size={14} />}
          label={`${subject.totalPosts} posts`}
          size="small"
          sx={{ width: 'fit-content' }}
        />
      </Stack>
    </TileCard>
  );
}

export default SubjectCard;
