import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Chip,
  Stack,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '@/store/projectStore'
import type { ProjectStatus } from '@/types'

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

  const handleNewProject = () => {
    createProject()
    navigate('/projects/new')
  }

  const stats = {
    total: projects.length,
    draft: projects.filter((p) => p.status === 'draft').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('nav.dashboard')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('app.tagline')}
      </Typography>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: t('dashboard.stats.total'), value: stats.total, color: 'primary.main' },
          { label: t('dashboard.stats.draft'), value: stats.draft, color: 'warning.main' },
          { label: t('dashboard.stats.completed'), value: stats.completed, color: 'success.main' },
        ].map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick actions */}
      <Typography variant="h6" gutterBottom>
        {t('dashboard.quickActions')}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleNewProject}
        >
          {t('project.newProject')}
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<FileUploadIcon />}
          component="label"
        >
          {t('project.importProject')}
          <input type="file" accept=".reproj" hidden onChange={() => {/* handled in ImportDialog */}} />
        </Button>
      </Stack>

      {/* Recent projects */}
      <Typography variant="h6" gutterBottom>
        {t('dashboard.recentProjects')}
      </Typography>

      {projects.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <FolderOpenIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">{t('project.noProjects')}</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardActionArea
                  onClick={() => {
                    setActiveProject(project.id)
                    navigate(`/projects/${project.id}`)
                  }}
                  sx={{ p: 2 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" noWrap sx={{ maxWidth: '70%' }}>
                      {project.title || project.protocolNumber}
                    </Typography>
                    <Chip
                      label={t(`project.statuses.${project.status}`)}
                      color={STATUS_COLORS[project.status]}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {project.protocolNumber}
                  </Typography>
                  {project.ziadatel && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {project.ziadatel.name}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 1 }}>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
