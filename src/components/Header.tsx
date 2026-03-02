import { useState } from 'react';
import { Terminal, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ENV CONFIG
  const appName = import.meta.env.VITE_APP_NAME;
  const githubUrl = import.meta.env.VITE_GITHUB_URL;
  const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL;
  const email = import.meta.env.VITE_USER_EMAIL;

  const socialLinks = [
    { href: githubUrl, icon: Github, label: 'GitHub' },
    { href: linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    { href: `mailto:${email}`, icon: Mail, label: 'Email' },
  ].filter(link => link.href);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);

    if (!isHome) {
      window.location.assign(`/#${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Sobre', id: 'about' },
    { label: 'Disciplinas', id: 'subjects' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ maxWidth: '1200px', mx: 'auto', width: '100%' }}>

        {/* Logo */}
        <Link
          component={RouterLink}
          to="/"
          underline="none"
          onClick={() => setMobileMenuOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: theme.palette.primary.main,
            fontWeight: 600,
            letterSpacing: 0.5,
            flex: 1,
            opacity: 0.85,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 },
          }}
        >
          <Terminal size={20} />
          {appName}
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Stack direction="row" spacing={3} sx={{ flex: 1, justifyContent: 'center' }}>
            {navItems.map(item => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}

        {/* Desktop Social */}
        {!isMobile && (
          <Stack direction="row" spacing={1}>
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer external"
                aria-label={label}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: 'color 0.2s',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Icon size={18} />
              </IconButton>
            ))}
          </Stack>
        )}

        {/* Mobile Toggle */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileMenuOpen(prev => !prev)}
            sx={{ color: theme.palette.text.secondary }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileMenuOpen && isMobile}
        onClose={() => setMobileMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            mt: '64px',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            {navItems.map(item => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: theme.palette.text.secondary,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer external"
                aria-label={label}
              >
                <Icon size={18} />
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}