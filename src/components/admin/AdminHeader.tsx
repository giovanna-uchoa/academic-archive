import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

interface AdminHeaderProps {
  token: string;
  setToken: (token: string) => void;
  saveToken: () => void;
  status: string | null;
  statusType: 'success' | 'info' | 'warning' | 'error';
  error: string | null;
}

export function AdminHeader({ token, setToken, saveToken, status, statusType, error }: AdminHeaderProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Mini Admin Panel</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage subjects and posts from filesystem-backed CMS content.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Admin Token"
            value={token}
            onChange={event => setToken(event.target.value)}
            placeholder="Default: admin"
          />
          <Button variant="contained" onClick={saveToken}>
            Save Token
          </Button>
        </Stack>

        {status && <Alert severity={statusType}>{status}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Paper>
  )
}