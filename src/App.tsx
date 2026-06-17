import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from '@/theme'
import { useAppStore } from '@/store/appStore'
import AppShell from '@/components/layout/AppShell'
import Dashboard from '@/pages/Dashboard'
import ProjectEditor from '@/pages/ProjectEditor'
import CompanyProfiles from '@/pages/CompanyProfiles'
import Settings from '@/pages/Settings'

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
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/new" element={<ProjectEditor />} />
            <Route path="/projects/:id" element={<ProjectEditor />} />
            <Route path="/companies" element={<CompanyProfiles />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  )
}
