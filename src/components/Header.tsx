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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    
    if (!isHome) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Subjects', id: 'subjects' },
  ];

  const socialLinks = [
    { href: 'https://github.com', icon: Github, label: 'GitHub' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:your@email.com', icon: Mail, label: 'Email' },
  ];

  return (
    <AppBar position="sticky" sx={{ 
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
      backdropFilter: 'blur(4px)',
    }}>
      <Toolbar sx={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Link
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: theme.palette.primary.main,
            flex: 1,
            opacity: 0.8,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 },
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Terminal size={20} />
          <Box sx={{ fontWeight: 600, color: theme.palette.primary.main }}>yourname.dev</Box>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Stack direction="row" spacing={3} sx={{ flex: 1, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  fontSize: '1rem',
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

        {/* Desktop Social Links */}
        {!isMobile && (
          <Stack direction="row" spacing={2}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: theme.palette.text.secondary }}
              >
                <social.icon size={20} />
              </IconButton>
            ))}
          </Stack>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ color: theme.palette.text.secondary }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      <Drawer
        anchor="top"
        open={mobileMenuOpen && isMobile}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '64px',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  fontSize: '1rem',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
            <Stack direction="row" spacing={2}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <social.icon size={20} />
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
