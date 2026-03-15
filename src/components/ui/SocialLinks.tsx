import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';
import { getSocialLinks } from '../../utils/socials';

type SocialLinksProps = {
  sx?: SxProps<Theme>;
};

function SocialLinks({ sx }: SocialLinksProps) {
  const links = useMemo(() => getSocialLinks(), []);

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={sx}>
      {links.map(({ href, icon: Icon, label }) => (
        <IconButton
          key={label}
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer external"
          aria-label={label}
          size="small"
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            transition: 'color 0.2s ease, transform 0.15s ease',

            '&:hover': {
              color: theme.palette.primary.main,
              transform: 'translateY(-1px)',
            },
          })}
        >
          <Icon size={18} />
        </IconButton>
      ))}
    </Stack>
  );
}

export default SocialLinks;