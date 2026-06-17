import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '@/store/projectStore'

const NAV_ITEMS = [
  { key: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { key: 'newProject', path: '/projects/new', icon: <AddCircleOutlineIcon /> },
  { key: 'companies', path: '/companies', icon: <BusinessIcon /> },
  { key: 'settings', path: '/settings', icon: <SettingsIcon /> },
]

export default function SideNav() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const projects = useProjectStore((s) => s.projects)
  const setActive = useProjectStore((s) => s.setActiveProject)

  return (
    <Box sx={{ overflow: 'auto', py: 1 }}>
      <List dense>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.key}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={t(`nav.${item.key === 'companies' ? 'companyProfiles' : item.key}`)} />
          </ListItemButton>
        ))}
      </List>

      {projects.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
            {t('nav.projects')}
          </Typography>
          <List dense>
            {projects.slice(0, 8).map((p) => (
              <ListItemButton
                key={p.id}
                selected={location.pathname === `/projects/${p.id}`}
                onClick={() => {
                  setActive(p.id)
                  navigate(`/projects/${p.id}`)
                }}
                sx={{ borderRadius: 1, mx: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FolderOpenIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={p.title || p.protocolNumber}
                  primaryTypographyProps={{ noWrap: true, fontSize: 13 }}
                />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  )
}
