import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  IconButton,
  type SelectChangeEvent,
} from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'
import type { AppLanguage, AppThemeMode } from '@/types'

export default function Settings() {
  const { t } = useTranslation()
  const { language, setLanguage, themeMode, setThemeMode, anthropicApiKey, setAnthropicApiKey } = useAppStore()
  const [showApiKey, setShowApiKey] = useState(false)

  const handleLanguage = (e: SelectChangeEvent) => setLanguage(e.target.value as AppLanguage)
  const handleTheme = (_: unknown, val: AppThemeMode | null) => {
    if (val) setThemeMode(val)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      <Card sx={{ maxWidth: 480, mt: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>{t('settings.language')}</InputLabel>
            <Select value={language} label={t('settings.language')} onChange={handleLanguage}>
              <MenuItem value="sk">🇸🇰 Slovenčina</MenuItem>
              <MenuItem value="en">🇬🇧 English</MenuItem>
              <MenuItem value="de">🇩🇪 Deutsch</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('settings.theme')}
            </Typography>
            <ToggleButtonGroup
              value={themeMode}
              exclusive
              onChange={handleTheme}
              aria-label="theme mode"
            >
              <ToggleButton value="light" aria-label="light mode">
                <LightModeIcon sx={{ mr: 1 }} />
                {t('settings.themes.light')}
              </ToggleButton>
              <ToggleButton value="dark" aria-label="dark mode">
                <DarkModeIcon sx={{ mr: 1 }} />
                {t('settings.themes.dark')}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TextField
            label={t('settings.anthropicApiKey')}
            type={showApiKey ? 'text' : 'password'}
            value={anthropicApiKey}
            onChange={(e) => setAnthropicApiKey(e.target.value)}
            fullWidth
            helperText={t('settings.anthropicApiKeyHint')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowApiKey((v) => !v)} edge="end">
                    {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
