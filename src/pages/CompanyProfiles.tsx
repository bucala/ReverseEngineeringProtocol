import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import BusinessIcon from '@mui/icons-material/Business'
import { useTranslation } from 'react-i18next'
import { useCompanyStore } from '@/store/companyStore'
import CompanyProfileDialog from '@/components/company/CompanyProfileDialog'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import type { CompanyProfile } from '@/types'
import {
  exportCompanyProfiles,
  importCompanyProfiles,
  downloadBlob,
  readFileAsText,
} from '@/utils/fileFormat'

export default function CompanyProfiles() {
  const { t } = useTranslation()
  const {
    profiles,
    defaultRealizatorId,
    addProfile,
    updateProfile,
    deleteProfile,
    setDefaultRealizator,
    importProfiles,
  } = useCompanyStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CompanyProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null)

  const handleAdd = () => {
    setEditTarget(null)
    setDialogOpen(true)
  }

  const handleEdit = (profile: CompanyProfile) => {
    setEditTarget(profile)
    setDialogOpen(true)
  }

  const handleSave = (data: Omit<CompanyProfile, 'id'>) => {
    if (editTarget) {
      updateProfile(editTarget.id, data)
    } else {
      addProfile(data)
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deleteTarget) deleteProfile(deleteTarget.id)
    setDeleteTarget(null)
  }

  const handleExport = () => {
    const blob = exportCompanyProfiles(profiles)
    downloadBlob(blob, 'company-profiles.json')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const json = await readFileAsText(file)
      const imported = importCompanyProfiles(json)
      importProfiles(imported, true)
    } catch {
      alert(t('common.error') + ': invalid file')
    }
    e.target.value = ''
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">{t('nav.companyProfiles')}</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={profiles.length === 0}
          >
            {t('company.exportProfiles')}
          </Button>
          <Button variant="outlined" startIcon={<FileUploadIcon />} component="label">
            {t('company.importProfiles')}
            <input type="file" accept=".json" hidden onChange={handleImport} />
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            {t('company.addProfile')}
          </Button>
        </Stack>
      </Stack>

      {profiles.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">{t('company.noProfiles')}</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={profile.logoBase64 ?? undefined}
                      sx={{ width: 52, height: 52, bgcolor: 'primary.main' }}
                    >
                      {profile.name.charAt(0).toUpperCase() || <BusinessIcon />}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" noWrap fontWeight={600}>
                          {profile.name || '–'}
                        </Typography>
                        {defaultRealizatorId === profile.id && (
                          <Chip label={t('company.realizator')} size="small" color="primary" />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {profile.contactPerson}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" noWrap>
                        {profile.city}, {profile.country}
                      </Typography>
                    </Box>
                  </Stack>

                  {profile.email && (
                    <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                      {profile.email}
                    </Typography>
                  )}
                  {profile.ico && (
                    <Typography variant="caption" color="text.secondary">
                      IČO: {profile.ico}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                  <Tooltip title={t('company.setAsDefault')}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setDefaultRealizator(
                          defaultRealizatorId === profile.id ? null : profile.id
                        )
                      }
                      color={defaultRealizatorId === profile.id ? 'warning' : 'default'}
                    >
                      {defaultRealizatorId === profile.id ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('company.editProfile')}>
                    <IconButton size="small" onClick={() => handleEdit(profile)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('company.deleteProfile')}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(profile)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CompanyProfileDialog
        open={dialogOpen}
        profile={editTarget}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('company.deleteProfile')}
        message={`${t('project.deleteConfirm')}`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
