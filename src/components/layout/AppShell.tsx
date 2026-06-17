import { type ReactNode } from 'react'
import { Box, Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import TopBar from './TopBar'
import SideNav from './SideNav'
import { useAppStore } from '@/store/appStore'

const DRAWER_WIDTH = 240

interface Props {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar drawerWidth={DRAWER_WIDTH} />

      {/* Permanent drawer on desktop, temporary on mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? sidebarOpen : sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: (t) => `1px solid ${t.palette.divider}`,
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Toolbar /> {/* spacer below TopBar */}
        <SideNav />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: {
            md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* spacer below TopBar */}
        {children}
      </Box>
    </Box>
  )
}
