import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PrintIcon from '@mui/icons-material/Print'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '@/store/projectStore'
import { useCompanyStore } from '@/store/companyStore'
import { useAppStore } from '@/store/appStore'
import ProjectHeader from '@/components/project/ProjectHeader'
import ObjectSpecModule from '@/components/modules/ObjectSpecModule'
import MeshAssessmentModule from '@/components/modules/MeshAssessmentModule'
import RECadModule from '@/components/modules/RECadModule'
import TimeEstimationModule from '@/components/modules/TimeEstimationModule'
import DeliverablesModule from '@/components/modules/DeliverablesModule'
import NativeCadModule from '@/components/modules/NativeCadModule'
import ExportDialog from '@/components/project/ExportDialog'
import { printProtocol } from '@/components/project/ProtocolPrint'
import type { Project } from '@/types'

const STEPS = ['project', 'object', 'mesh', 'recad', 'time', 'deliverables', 'nativecad'] as const
type StepId = (typeof STEPS)[number]

const STEP_LABELS: Record<StepId, string> = {
  project: 'nav.projects',
  object: 'object.title',
  mesh: 'mesh.title',
  recad: 'recad.title',
  time: 'time.title',
  deliverables: 'deliverables.title',
  nativecad: 'nativeCad.title',
}

export default function ProjectEditor() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    projects,
    activeProjectId,
    createProject,
    updateProject,
    setActiveProject,
    getActiveProject,
  } = useProjectStore()
  const { profiles } = useCompanyStore()
  const { language } = useAppStore()

  const [activeStep, setActiveStep] = useState(0)
  const [exportOpen, setExportOpen] = useState(false)
  const [saveIndicator, setSaveIndicator] = useState(false)

  // Resolve which project to edit
  useEffect(() => {
    if (id && id !== 'new') {
      const found = projects.find((p) => p.id === id)
      if (found) {
        setActiveProject(found.id)
        return
      }
      navigate('/dashboard')
      return
    }
    // "new" path — project was already created by Dashboard button
    if (!activeProjectId) {
      const proj = createProject()
      navigate(`/projects/${proj.id}`, { replace: true })
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const project = getActiveProject()

  const handleUpdate = (patch: Partial<Project>) => {
    if (!project) return
    updateProject(project.id, patch)
    setSaveIndicator(true)
    setTimeout(() => setSaveIndicator(false), 1500)
  }

  if (!project) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  const stepContent = [
    <ProjectHeader key="header" project={project} profiles={profiles} onChange={handleUpdate} />,
    <ObjectSpecModule key="object" value={project.objectSpec} onChange={(v) => handleUpdate({ objectSpec: v })} />,
    <MeshAssessmentModule key="mesh" value={project.meshAssessment} onChange={(v) => handleUpdate({ meshAssessment: v })} />,
    <RECadModule key="recad" value={project.reCadPostprocessing} onChange={(v) => handleUpdate({ reCadPostprocessing: v })} />,
    <TimeEstimationModule key="time" value={project.timeEstimation} mesh={project.meshAssessment} recad={project.reCadPostprocessing} onChange={(v) => handleUpdate({ timeEstimation: v })} />,
    <DeliverablesModule key="deliverables" value={project.deliverables} onChange={(v) => handleUpdate({ deliverables: v })} />,
    <NativeCadModule key="nativecad" value={project.nativeCadSpec} onChange={(v) => handleUpdate({ nativeCadSpec: v })} />,
  ]

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">
            {project.title || project.protocolNumber}
          </Typography>
          {saveIndicator && (
            <Typography variant="caption" color="success.main">
              ✓ {t('common.save')}d
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => printProtocol(project, language)}
          >
            {t('protocol.generate')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => setExportOpen(true)}
          >
            {t('project.exportProject')}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => handleUpdate({ updatedAt: new Date().toISOString() })}
          >
            {t('project.saveProject')}
          </Button>
        </Stack>
      </Stack>

      {/* Stepper navigation */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((step, idx) => (
          <Step key={step} completed={activeStep > idx}>
            <StepLabel
              sx={{ cursor: 'pointer' }}
              onClick={() => setActiveStep(idx)}
            >
              {t(STEP_LABELS[step])}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step content */}
      <Box sx={{ mb: 4 }}>
        {stepContent[activeStep]}
      </Box>

      {/* Navigation buttons */}
      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => s - 1)}
        >
          {t('common.back')}
        </Button>
        <Button
          variant="contained"
          disabled={activeStep === STEPS.length - 1}
          onClick={() => setActiveStep((s) => s + 1)}
        >
          {activeStep === STEPS.length - 1 ? t('common.finish') : t('common.next')}
        </Button>
      </Stack>

      <ExportDialog
        open={exportOpen}
        project={project}
        onClose={() => setExportOpen(false)}
      />
    </Box>
  )
}
