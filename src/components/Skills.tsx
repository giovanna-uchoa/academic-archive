import { Server, Database, Cloud, Code, Terminal, Shield } from 'lucide-react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

const skills = [
  {
    icon: Server,
    name: 'Infrastructure',
    items: ['Linux', 'Docker', 'Kubernetes', 'Networking']
  },
  {
    icon: Database,
    name: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL']
  },
  {
    icon: Cloud,
    name: 'Cloud Platforms',
    items: ['AWS', 'Azure', 'GCP', 'Cloudflare']
  },
  {
    icon: Code,
    name: 'Development',
    items: ['Python', 'JavaScript', 'Bash', 'APIs']
  },
  {
    icon: Terminal,
    name: 'DevOps',
    items: ['CI/CD', 'Automation', 'Monitoring', 'IaC']
  },
  {
    icon: Shield,
    name: 'Security',
    items: ['SSL/TLS', 'Firewalls', 'Compliance', 'Backups']
  }
];

export function Skills() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="skills"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 8, md: 10 },
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Skills & Technologies
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Areas I work with and write about
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {skills.map((skill) => {
          const IconComponent = skill.icon;
          return (
            <Grid key={skill.name} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <IconComponent size={24} style={{ color: theme.palette.secondary.main }} />
                    <Typography variant="h6">{skill.name}</Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {skill.items.map((item) => (
                        <Chip
                          key={item}
                          label={item}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#3d2f26',
                            color: theme.palette.text.secondary,
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
