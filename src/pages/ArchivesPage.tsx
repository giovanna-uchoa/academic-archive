import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCmsContent } from '../utils/useCmsContent';
import { buildArchiveGroups } from '../utils/contentTaxonomy';
import AsyncBoundary from '../components/ui/state/AsyncBoundary';
import PageHeader from '../components/ui/PageHeader';
import ArchiveMonthGroup from '../components/archive/ArchiveMonthGroup';

export default function ArchivesPage() {
  const { posts, subjects, loading, error } = useCmsContent();

  const subjectTitles = new Map(subjects.map((subject) => [subject.id, subject.title]));
  const groups = buildArchiveGroups(posts);
  const groupedByYear = groups.reduce<Record<number, typeof groups>>((acc, group) => {
    if (!acc[group.year]) {
      acc[group.year] = [];
    }
    acc[group.year].push(group);
    return acc;
  }, {});

  return (
    <AsyncBoundary loading={loading} error={error}>
      <Stack spacing={4}>
        <PageHeader
          eyebrow="Archives"
          title="Timeline by Date"
          description="Browse content through a chronological timeline organized by month and year."
        />

        {Object.entries(groupedByYear)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .map(([year, yearGroups]) => (
            <Stack key={year} spacing={2}>
              <Typography variant="h5">{year}</Typography>

              <Box
                sx={{
                  position: 'relative',
                  pl: { xs: 3, md: 4 },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: { xs: 7, md: 9 },
                    top: 6,
                    bottom: 6,
                    width: '2px',
                    backgroundColor: 'divider',
                  },
                }}
              >
                <Stack spacing={2.5}>
                  {yearGroups.map((group) => (
                    <ArchiveMonthGroup
                      key={`${group.year}-${group.month}`}
                      group={group}
                      subjectTitles={subjectTitles}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          ))}
      </Stack>
    </AsyncBoundary>
  );
}
