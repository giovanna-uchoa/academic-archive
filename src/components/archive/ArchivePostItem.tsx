import { Link as RouterLink } from 'react-router-dom';
import { FolderTree } from 'lucide-react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getPostPath } from '../../utils/contentTaxonomy';
import type { Post } from '../../utils/dataTypes';

interface ArchivePostItemProps {
  post: Post;
  subjectTitle: string;
}

function ArchivePostItem({ post, subjectTitle }: ArchivePostItemProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.25}
      sx={{
        py: 1.25,
        justifyContent: 'space-between',
        alignItems: { md: 'center' },
      }}
    >
      <Box>
        <Link
          component={RouterLink}
          to={getPostPath(post)}
          underline="hover"
          color="inherit"
          variant="subtitle1"
        >
          {post.title}
        </Link>

        <Typography variant="body2" color="text.secondary">
          {post.excerpt}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip
          icon={<FolderTree size={14} />}
          label={subjectTitle}
          component={RouterLink}
          to={`/subjects/${post.subjectId}`}
          clickable
          size="small"
        />
      </Stack>
    </Stack>
  );
}

export default ArchivePostItem;