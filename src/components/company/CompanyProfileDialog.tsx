import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Avatar,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'
import type { CompanyProfile } from '@/types'
import { readFileAsDataURL } from '@/utils/fileFormat'

interface Props {
  open: boolean
  profile: CompanyProfile | null
  onClose: () => void
  onSave: (data: Omit<CompanyProfile, 'id'>) => void
}

const EMPTY: Omit<CompanyProfile, 'id'> = {
  name: '',
  address: '',
  city: '',
  zip: '',
  country: 'Slovensko',
  ico: '',
  dic: '',
  phone: '',
  email: '',
  website: '',
  contactPerson: '',
  logoBase64: null,
}

export default function CompanyProfileDialog({ open, profile, onClose, onSave }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState<Omit<CompanyProfile, 'id'>>(EMPTY)

  useEffect(() => {
    if (open) {
      setForm(profile ? { ...profile } : { ...EMPTY })
    }
  }, [open, profile])

  const set = (key: keyof typeof form, value: string | null) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readFileAsDataURL(file)
      set('logoBase64', dataUrl)
    } catch {
      /* ignore */
    }
    e.target.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {profile ? t('company.editProfile') : t('company.addProfile')}
        </DialogTitle>

        <DialogContent dividers>
          {/* Logo upload */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              src={form.logoBase64 ?? undefined}
              sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }}
            >
              {form.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('company.logo')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={t('company.uploadLogo')}>
                  <IconButton component="label" size="small">
                    <PhotoCameraIcon />
                    <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                  </IconButton>
                </Tooltip>
                {form.logoBase64 && (
                  <Tooltip title={t('company.removeLogo')}>
                    <IconButton size="small" onClick={() => set('logoBase64', null)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={t('company.name')}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('company.address')}
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('company.city')}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label={t('company.zip')}
                value={form.zip}
                onChange={(e) => set('zip', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label={t('company.country')}
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('company.ico')}
                value={form.ico}
                onChange={(e) => set('ico', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('company.dic')}
                value={form.dic}
                onChange={(e) => set('dic', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('company.contactPerson')}
                value={form.contactPerson}
                onChange={(e) => set('contactPerson', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('company.phone')}
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('company.email')}
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('company.website')}
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
