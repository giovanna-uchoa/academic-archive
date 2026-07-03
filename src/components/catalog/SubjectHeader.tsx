import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { renderSubjectIcon } from '../../utils/iconRenderer';
import type { Subject } from '../../utils/dataTypes';
import MarkdownContent from '../MarkdownContent';

interface SubjectHeaderProps {
  subject: Subject;
}

function SubjectHeader({ subject }: SubjectHeaderProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="overline" sx={{ letterSpacing: 2 }}>Subject</Typography>
      <Typography
        variant="h2"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          mb: 1,
        }}
      >
        {subject.icon?.trim() && (
          <Box sx={{ display: 'flex', color: theme.palette.secondary.main }}>
            {renderSubjectIcon(subject.icon, { size: 34, fallbackSize: '2.1rem' })}
          </Box>
        )}
        {subject.title}
      </Typography>

      {subject.description && (
        <Box sx={{ color: theme.palette.text.secondary }}>
          <MarkdownContent content={subject.description} />
        </Box>
      )}
    </Box>
  );
}

export default SubjectHeader;
