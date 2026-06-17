import { useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { useCompanyStore } from '@/store/companyStore'
import { importReproj } from '@/utils/fileFormat'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ImportDialog({ open, onClose }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { importProject } = useProjectStore()
  const { importProjectProfiles } = useCompanyStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setError(null)
    }
  }

  const handleImport = async () => {
    if (!file || !password) return
    setError(null)
    setLoading(true)
    try {
      const payload = await importReproj(file, password)
      importProject(payload.project)
      if (payload.companyProfiles?.length) {
        importProjectProfiles(payload.companyProfiles)
      }
      handleClose()
      navigate(`/projects/${payload.project.id}`)
    } catch {
      setError(t('security.incorrectPassword'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setFile(null)
    setPassword('')
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
        <LockOpenIcon color="primary" />
        {t('project.importProject')}
      </DialogTitle>

      <DialogContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".reproj"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: file ? 'success.main' : 'divider',
            borderRadius: 2,
            p: 3,
            mb: 2,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: file ? 'success.lighter' : 'background.default',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          {file ? (
            <>
              <InsertDriveFileIcon sx={{ fontSize: 36, color: 'success.main', mb: 0.5 }} />
              <Typography variant="body2" fontWeight={500}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            </>
          ) : (
            <>
              <FileUploadIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {t('project.importProject')} (.reproj)
              </Typography>
            </>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label={t('security.decryptPassword')}
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleImport()}
          fullWidth
          disabled={!file}
          InputProps={{ endAdornment: pwAdornment }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={loading || !file || !password}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {t('common.import')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
