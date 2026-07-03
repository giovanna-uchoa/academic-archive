import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack
} from '@mui/material'
import { setStoredToken, validateToken } from '../../utils/githubAuth'
import type { GitHubUser } from '../../utils/githubAuth'
import { getErrorMessage } from '../../utils/errors'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (user: GitHubUser) => void
}

function LoginDialog({ open, onClose, onSuccess }: Props) {
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const user = await validateToken(token.trim())
      setStoredToken(token.trim())
      setToken('')
      onSuccess(user)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Admin Login</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="GitHub Personal Access Token"
            type="password"
            fullWidth
            value={token}
            onChange={e => setToken(e.target.value)}
            helperText="Use a fine-grained PAT scoped to only this repo, with Contents read/write permission and an expiry set. Stored in this tab's session only."
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={loading || !token.trim()}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginDialog;
