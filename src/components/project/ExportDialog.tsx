import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useTranslation } from 'react-i18next'
import type { Project } from '@/types'
import { useCompanyStore } from '@/store/companyStore'
import { exportReproj, downloadBlob, sanitizeFilename } from '@/utils/fileFormat'

interface Props {
  open: boolean
  project: Project
  onClose: () => void
}

export default function ExportDialog({ open, project, onClose }: Props) {
  const { t } = useTranslation()
  const { profiles } = useCompanyStore()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setError(null)
    if (password.length < 8) {
      setError(t('security.passwordTooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('security.passwordMismatch'))
      return
    }
    setLoading(true)
    try {
      const blob = await exportReproj(project, profiles, password)
      const filename = `${sanitizeFilename(project.protocolNumber || project.id)}.reproj`
      downloadBlob(blob, filename)
      onClose()
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setPassword('')
    setConfirmPassword('')
    setError(null)
    onClose()
  }

  const pwAdornment = (
    <InputAdornment position="end">
      <IconButton size="small" onClick={() => setShowPw((v) => !v)} edge="end">
        {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockIcon color="primary" />
        {t('security.title')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('security.encryptionInfo')}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label={t('security.password')}
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          autoFocus
          sx={{ mb: 2 }}
          InputProps={{ endAdornment: pwAdornment }}
        />
        <TextField
          label={t('security.confirmPassword')}
          type={showPw ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          InputProps={{ endAdornment: pwAdornment }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={loading || !password || !confirmPassword}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {t('common.export')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
