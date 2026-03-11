import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SubjectSection } from '@/components/admin/SubjectSection'
import { PostSection } from '@/components/admin/PostSection'
import { useCmsContent } from '@/utils/useCmsContent'
import { LoginDialog } from '@/components/admin/LoginDialog'
import { supabase } from '@/utils/supabaseClient'

function AdminPage() {
  const { subjects, posts, loading, error, reload } = useCmsContent()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [statusType, setStatusType] =
    useState<'success' | 'error'>('success')
  const [activeSection, setActiveSection] =
    useState<'subjects' | 'posts'>('subjects')

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts]
  )

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setStatusType('error')
      setStatus(error.message)
      return
    }

    setStatusType('success')
    setStatus('Logged out successfully.')
  }

  const isAuthenticated = Boolean(userEmail)

  return (
    <Box
      component="main"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: 2,
        py: 4,
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
          userEmail={userEmail}
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
          onSuccess={() => {
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
                onChange={(_event, value: 'subjects' | 'posts') =>
                  setActiveSection(value)
                }
                aria-label="Admin sections"
              >
                <Tab label="Subjects" value="subjects" />
                <Tab label="Posts" value="posts" />
              </Tabs>

              {activeSection === 'subjects' ? (
                <SubjectSection
                  subjects={subjects}
                  reload={reload}
                  setStatus={setStatus}
                  setStatusType={setStatusType}
                />
              ) : (
                <PostSection
                  posts={sortedPosts}
                  subjects={subjects}
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