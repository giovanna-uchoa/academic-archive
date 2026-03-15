import { CalendarDays } from 'lucide-react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ArchivePostItem from './ArchivePostItem';

interface ArchiveMonthGroupProps {
  group: any;
  subjectTitles: Map<string, string>;
}

function ArchiveMonthGroup({ group, subjectTitles }: ArchiveMonthGroupProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          left: { xs: -16, md: -22 },
          top: 8,
          width: 10,
          height: 10,
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          border: (theme) => `2px solid ${theme.palette.secondary.main}`,
          backgroundColor: 'background.paper',
        }}
      />

      <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
          <CalendarDays size={16} />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {group.label}
          </Typography>
        </Stack>

        <Stack divider={<Divider flexItem />}>
          {group.posts.map((post: any) => (
            <ArchivePostItem
              key={post.id}
              post={post}
              subjectTitle={subjectTitles.get(post.subjectId) ?? post.subjectId}
            />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

export default ArchiveMonthGroup;