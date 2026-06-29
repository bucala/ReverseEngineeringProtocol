import { Suspense, lazy, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material'
import { lightTheme, darkTheme } from '@/theme'
import { useAppStore } from '@/store/appStore'
import AppShell from '@/components/layout/AppShell'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ProjectEditor = lazy(() => import('@/pages/ProjectEditor'))
const CompanyProfiles = lazy(() => import('@/pages/CompanyProfiles'))
const Settings = lazy(() => import('@/pages/Settings'))

function RouteFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  )
}

export default function App() {
  const themeMode = useAppStore((s) => s.themeMode)
  const theme = useMemo(
    () => (themeMode === 'dark' ? darkTheme : lightTheme),
    [themeMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/new" element={<ProjectEditor />} />
              <Route path="/projects/:id" element={<ProjectEditor />} />
              <Route path="/companies" element={<CompanyProfiles />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  )
}
