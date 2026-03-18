import { BookOpen } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BlogCard from './BlogCard';
import type { Subject, Post } from '../../utils/dataTypes';

interface BlogSectionProps {
  subject: Subject;
  subjectPosts: Post[];
}

const DEFAULT_BLOG_SECTION_TITLE = 'Articles & Experiments';

function BlogSection({ subject, subjectPosts }: BlogSectionProps) {
    const theme = useTheme();

    return (
        <Box>
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: { xs: 2, sm: 3 },
            color: theme.palette.primary.main,
          }}
        >
          <BookOpen size={24} />
          {subject.blogSectionTitle || DEFAULT_BLOG_SECTION_TITLE}
        </Typography>

        {subjectPosts.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              textAlign: 'center',
              py: 6,
            }}
          >
            No entries yet. Check back soon.
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column-reverse', gap: { xs: 2, sm: 3 } }}>
            {subjectPosts.map((post) => (
              <BlogCard key={post.id} post={post} onSelectRedirectTo={`/subjects/${subject.id}/post/${post.id}`} />
            ))}
          </Box>
        )}
      </Box>
    )
}

export default BlogSection;