import Typography from '@mui/material/Typography';

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
      {children}
    </Typography>
  );
}

export default SectionLabel;
