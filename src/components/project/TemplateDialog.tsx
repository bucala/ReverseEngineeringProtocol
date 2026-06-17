import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'
import { useTemplateStore } from '@/store/templateStore'
import type { Project } from '@/types'

interface Props {
  open: boolean
  project: Project
  onClose: () => void
  onApply: (patch: Partial<Project>) => void
}

export default function TemplateDialog({ open, project, onClose, onApply }: Props) {
  const { t } = useTranslation()
  const { templates, saveTemplate, applyTemplate, deleteTemplate } = useTemplateStore()
  const [tab, setTab] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    saveTemplate(name.trim(), description.trim(), project)
    setName('')
    setDescription('')
    setSavedMsg(t('template.saved'))
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const handleApply = (id: string) => {
    if (!window.confirm(t('template.confirmApply'))) return
    const patch = applyTemplate(id)
    if (patch) {
      onApply(patch)
      onClose()
    }
  }

  const handleDelete = (id: string) => {
    deleteTemplate(id)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('template.manage')}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={t('template.saveAs')} />
          <Tab label={t('template.apply')} />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            <TextField
              label={t('template.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('template.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            {savedMsg && (
              <Typography color="success.main" variant="caption">{savedMsg}</Typography>
            )}
          </Stack>
        )}

        {tab === 1 && (
          <Box>
            {templates.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                {t('template.noTemplates')}
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {templates.map((tmpl) => (
                  <Card key={tmpl.id} variant="outlined">
                    <CardContent sx={{ pb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>{tmpl.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tmpl.createdAt).toLocaleDateString()}
                      </Typography>
                      {tmpl.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {tmpl.description}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                      <Button size="small" variant="outlined" onClick={() => handleApply(tmpl.id)}>
                        {t('template.applyBtn')}
                      </Button>
                      <IconButton size="small" color="error" onClick={() => handleDelete(tmpl.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {tab === 0 && (
          <Button onClick={handleSave} variant="contained" disabled={!name.trim()}>
            {t('template.save')}
          </Button>
        )}
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  )
}
