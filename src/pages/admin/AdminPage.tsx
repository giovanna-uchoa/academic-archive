import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AdminHeader from '../../components/admin/AdminHeader'
import LoginDialog from '../../components/admin/LoginDialog'
import SubjectForm from '../../components/admin/SubjectForm'
import PostForm from '../../components/admin/PostForm'
import TagForm from '../../components/admin/TagForm'
import { useCmsContent } from '../../utils/useCmsContent'
import { getStoredToken, clearStoredToken, validateToken } from '../../utils/githubAuth'

function AdminPage() {
  const { subjects, posts, tags, loading, error, reload } = useCmsContent()

  const [userLabel, setUserLabel] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [statusType, setStatusType] =
    useState<'success' | 'error'>('success')
  const [activeSection, setActiveSection] =
    useState<'subjects' | 'posts' | 'tags'>('subjects')

  useEffect(() => {
    const token = getStoredToken()
    if (!token) return

    validateToken(token)
      .then((user) => setUserLabel(user.login))
      .catch(() => {
        clearStoredToken()
        setUserLabel(null)
      })
  }, [])

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts]
  )

  const handleLogout = () => {
    clearStoredToken()
    setUserLabel(null)
    setStatusType('success')
    setStatus('Logged out successfully.')
  }

  const isAuthenticated = Boolean(userLabel)

  return (
    <Box
      component="main"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          justifyContent: isAuthenticated ? 'flex-start' : 'center',
          transition: 'all 240ms ease'
        }}
      >
        <AdminHeader
          userLabel={userLabel}
          onLoginClick={() => setLoginOpen(true)}
          onLogout={handleLogout}
          status={status}
          statusType={statusType}
          error={error}
          mode={isAuthenticated ? 'default' : 'hero'}
        />

        <LoginDialog
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={(login) => {
            setUserLabel(login)
            setStatusType('success')
            setStatus('Logged in successfully.')
          }}
        />

        {isAuthenticated && (
          loading ? (
            <Stack alignItems="center" py={6}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <Tabs
                value={activeSection}
                onChange={(_event, value: 'subjects' | 'posts' | 'tags') =>
                  setActiveSection(value)
                }
                aria-label="Admin sections"
              >
                <Tab label="Subjects" value="subjects" />
                <Tab label="Posts" value="posts" />
                <Tab label="Tags" value="tags" />
              </Tabs>

              {activeSection === 'subjects' ? (
                <SubjectForm
                  subjects={subjects}
                  reload={reload}
                  setStatus={setStatus}
                  setStatusType={setStatusType}
                />
              ) : activeSection === 'posts' ? (
                <PostForm
                  posts={sortedPosts}
                  subjects={subjects}
                  tags={tags}
                  reload={reload}
                  setStatus={setStatus}
                  setStatusType={setStatusType}
                />
              ) : (
                <TagForm
                  tags={tags}
                  reload={reload}
                  setStatus={setStatus}
                  setStatusType={setStatusType}
                />
              )}
            </>
          )
        )}
      </Stack>
    </Box>
  )
}

export default AdminPage;