import { useState, useMemo } from 'react';
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

// ENV CONFIG
const appName = import.meta.env.VITE_APP_NAME ?? 'App';
const githubUrl = import.meta.env.VITE_GITHUB_URL;
const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL;
const email = import.meta.env.VITE_USER_EMAIL;

function Header() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // NAV ITEMS
  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Archives', href: '/archives' },
      { label: 'Catalog', href: '/catalog' },
      { label: 'Tags', href: '/tags' },
    ],
    []
  );

  // SOCIAL LINKS
  const socialLinks = useMemo(
    () =>
      [
        { href: githubUrl, icon: Github, label: 'GitHub' },
        { href: linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
        { href: email ? `mailto:${email}` : undefined, icon: Mail, label: 'Email' },
      ].filter(link => link.href),
    [githubUrl, linkedinUrl, email]
  );

  const handleCloseMenu = () => setMobileMenuOpen(false);

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Logo */}
        <Link
          component={RouterLink}
          to="/"
          underline="none"
          onClick={handleCloseMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: 1,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: theme.palette.primary.main,
            opacity: 0.9,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            '&:hover': { opacity: 1, transform: 'translateY(-1px)' },
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
                key={item.href}
                component={RouterLink}
                to={item.href}
                onClick={handleCloseMenu}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  px: 1.25,
                  color: isActiveRoute(item.href) ? theme.palette.primary.main : theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main, backgroundColor: 'transparent' },
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
                  '&:hover': { color: theme.palette.primary.main },
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
            aria-label="Toggle menu"
            sx={{ color: theme.palette.text.secondary }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={mobileMenuOpen && isMobile}
        onClose={handleCloseMenu}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            {navItems.map(item => (
              <Button
                key={item.href}
                component={RouterLink}
                to={item.href}
                onClick={handleCloseMenu}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: isActiveRoute(item.href) ? theme.palette.primary.main : theme.palette.text.secondary,
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

export default Header;