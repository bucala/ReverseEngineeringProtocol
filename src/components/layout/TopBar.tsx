import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '@/types'

interface Props {
  drawerWidth: number
}

const LANGUAGES: { code: AppLanguage; label: string; flag: string }[] = [
  { code: 'sk', label: 'SK', flag: '🇸🇰' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
]

export default function TopBar({ drawerWidth: _drawerWidth }: Props) {
  const { t } = useTranslation()
  const { toggleSidebar, themeMode, toggleTheme, language, setLanguage } = useAppStore()

  const handleLanguageChange = (e: SelectChangeEvent) => {
    setLanguage(e.target.value as AppLanguage)
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'primary.main',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleSidebar}
          aria-label="toggle sidebar"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
          {t('app.title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language selector */}
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            variant="outlined"
            sx={{
              color: 'inherit',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.7)' },
              '.MuiSvgIcon-root': { color: 'inherit' },
              minWidth: 80,
            }}
          >
            {LANGUAGES.map((l) => (
              <MenuItem key={l.code} value={l.code}>
                {l.flag} {l.label}
              </MenuItem>
            ))}
          </Select>

          {/* Theme toggle */}
          <Tooltip title={themeMode === 'light' ? t('settings.themes.dark') : t('settings.themes.light')}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
