import { useState, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Logo from './ui/Logo';
import ThemeToggle from './ui/ThemeToggle';
import SocialLinks from './ui/SocialLinks';

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
        <Logo onClick={handleCloseMenu} />

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ flex: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
            {navItems.map(item => (
              <Button
                key={item.href}
                component={RouterLink}
                to={item.href}
                onClick={handleCloseMenu}
                sx={{
                  position: 'relative',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  color: isActiveRoute(item.href) ? theme.palette.primary.main : theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main, backgroundColor: 'transparent' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: 6,
                    height: '2px',
                    backgroundColor: theme.palette.secondary.main,
                    transform: isActiveRoute(item.href) ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'center',
                    transition: 'transform 0.25s ease',
                  },
                  '&:hover::after': { transform: 'scaleX(1)' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Desktop Social */}
        {!isMobile && (
          <Stack direction="row" spacing={1} alignItems="center">
            <SocialLinks />
            <ThemeToggle />
          </Stack>
        )}

        {/* Mobile: theme toggle + hamburger */}
        {isMobile && (
          <Stack direction="row" spacing={1} alignItems="center">
            <ThemeToggle />
            <IconButton
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              sx={{ color: theme.palette.text.secondary }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </IconButton>
          </Stack>
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

          <SocialLinks sx={{ mt: 3 }}/>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Header;