import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

interface AdminHeaderProps {
  userEmail: string | null
  onLoginClick: () => void
  onLogout: () => void
  status: string | null
  statusType: 'success' | 'info' | 'warning' | 'error'
  error: string | null
  mode?: 'default' | 'hero'
}

export function AdminHeader({
  userEmail,
  onLoginClick,
  onLogout,
  status,
  statusType,
  error,
  mode = 'default'
}: AdminHeaderProps) {
  const isHero = mode === 'hero'

  return (
    <Paper
      sx={{
        p: isHero ? { xs: 4, md: 6 } : 3,
        width: '100%',
        maxWidth: isHero ? '80vw' : 'none',
        mx: 'auto',
        transition: 'all 240ms ease'
      }}
    >
      <Stack spacing={2} alignItems={isHero ? 'center' : 'stretch'}>
        <Typography variant={isHero ? 'h3' : 'h4'}>Mini Admin Panel</Typography>
        <Typography variant={isHero ? 'body1' : 'body2'} color="text.secondary">
          Manage subjects and posts stored in Supabase.
        </Typography>

        {userEmail ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">
              Logged as: <strong>{userEmail}</strong>
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={onLogout}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button variant="contained" onClick={onLoginClick}>
            Login as Admin
          </Button>
        )}

        {status && <Alert severity={statusType}>{status}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Paper>
  )
}