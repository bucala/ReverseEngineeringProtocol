import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  ButtonBase,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '@/store/projectStore'
import type { ProjectStatus } from '@/types'
import ImportDialog from '@/components/project/ImportDialog'

const STATUS_COLORS: Record<ProjectStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  draft: 'default',
  in_review: 'warning',
  approved: 'info',
  completed: 'success',
  archived: 'error',
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { projects, setActiveProject, createProject } = useProjectStore()
  const [importOpen, setImportOpen] = useState(false)

  const handleNewProject = () => {
    createProject()
    navigate('/projects/new')
  }

  const total = projects.length
  const draft = projects.filter((p) => p.status === 'draft' || p.status === 'in_review').length
  const completed = projects.filter((p) => p.status === 'completed').length

  return (
    <Box>
      {/* Compact action row + inline stats */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleNewProject}>
          {t('project.newProject')}
        </Button>
        <Button variant="outlined" size="small" startIcon={<FileUploadIcon />} onClick={() => setImportOpen(true)}>
          {t('common.import')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={0.5}>
          <Chip size="small" label={`${total} projektov`} />
          {draft > 0 && <Chip size="small" label={`${draft} aktívne`} color="warning" variant="outlined" />}
          {completed > 0 && <Chip size="small" label={`${completed} hotovo`} color="success" variant="outlined" />}
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      {/* Project list */}
      {projects.length === 0 ? (
        <Stack alignItems="center" sx={{ py: 6, color: 'text.disabled' }}>
          <FolderOpenIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2">{t('project.noProjects')}</Typography>
        </Stack>
      ) : (
        <Box>
          {projects.map((project, idx) => (
            <Box key={project.id}>
              <ButtonBase
                sx={{ width: '100%', textAlign: 'left', display: 'block', px: 0.5, py: 1, borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => { setActiveProject(project.id); navigate(`/projects/${project.id}`) }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {project.title || project.protocolNumber}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {project.protocolNumber} · {new Date(project.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={t(`project.statuses.${project.status}`)}
                    color={STATUS_COLORS[project.status]}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Stack>
              </ButtonBase>
              {idx < projects.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      )}

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </Box>
  )
}
