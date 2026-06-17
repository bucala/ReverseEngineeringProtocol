import {
  Box,
  Grid,
  Typography,
  TextField,
} from '@mui/material'
import TimelineIcon from '@mui/icons-material/Timeline'
import { useTranslation } from 'react-i18next'
import type { Project } from '@/types'
import SectionCard from '@/components/common/SectionCard'

interface Props {
  project: Project
  onChange: (patch: Partial<Project>) => void
}

const PHASE_COLORS: Record<string, string> = {
  preparation: '#9e9e9e',
  scanning: '#1976d2',
  mesh: '#ed6c02',
  cad: '#2e7d32',
  inspection: '#7b1fa2',
  reporting: '#00838f',
  management: '#c62828',
  travel: '#78909c',
}

const PHASE_KEYS = [
  'preparation',
  'scanning',
  'mesh',
  'cad',
  'inspection',
  'reporting',
  'management',
  'travel',
] as const

function getEntryHours(project: Project, phase: string): number {
  const te = project.timeEstimation
  const isAuto = te.mode === 'auto'

  if (isAuto) {
    // Use auto calculation (same logic as existing computeAutoHours)
    const scanBase = project.meshAssessment.estimatedScanningHours ?? 0
    const cadBase = project.reCadPostprocessing.estimatedCadHours ?? 0
    const complexityMult: Record<string, number> = { simple: 0.8, moderate: 1.0, complex: 1.3, freeform: 1.6 }
    const mult = complexityMult[project.meshAssessment.geometryComplexity] ?? 1
    const autoMap: Record<string, number> = {
      preparation: parseFloat((scanBase * 0.2).toFixed(1)),
      scanning: scanBase,
      mesh: parseFloat((scanBase * 0.6 * mult).toFixed(1)),
      cad: cadBase || parseFloat((scanBase * 1.2 * mult).toFixed(1)),
      inspection: project.reCadPostprocessing.drawingRequired ? 4 : 0,
      reporting: parseFloat(Math.max(2, (scanBase + cadBase) * 0.1).toFixed(1)),
      management: parseFloat(((scanBase + cadBase) * 0.1).toFixed(1)),
      travel: 0,
    }
    return autoMap[phase] ?? 0
  }

  const entryMap: Record<string, number> = {
    preparation: te.preparationEntry.hours,
    scanning: te.scanningEntry.hours,
    mesh: te.meshProcessingEntry.hours,
    cad: te.cadEntry.hours,
    inspection: te.inspectionEntry.hours,
    reporting: te.reportingEntry.hours,
    management: te.managementEntry.hours,
    travel: te.travelEntry.hours,
  }
  return entryMap[phase] ?? 0
}

export default function GanttModule({ project, onChange }: Props) {
  const { t } = useTranslation()

  const phases = PHASE_KEYS.map((key) => ({
    key,
    hours: getEntryHours(project, key),
    days: Math.max(0.5, getEntryHours(project, key) / 8),
  })).filter((p) => p.hours > 0)

  const totalDays = phases.reduce((sum, p) => sum + p.days, 0)
  const maxDays = Math.max(totalDays, 1)

  const startDate = project.startDate ? new Date(project.startDate) : null

  const getPhaseStart = (index: number) => {
    let days = 0
    for (let i = 0; i < index; i++) days += phases[i].days
    return days
  }

  const formatDateOffset = (days: number) => {
    if (!startDate) return ''
    const d = new Date(startDate)
    d.setDate(d.getDate() + Math.round(days))
    return d.toLocaleDateString('sk-SK')
  }

  return (
    <SectionCard title={t('gantt.title')} icon={<TimelineIcon />}>
      {/* Start Date picker */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label={t('gantt.startDate')}
          type="date"
          value={project.startDate ?? ''}
          onChange={(e) => onChange({ startDate: e.target.value || null })}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 220 }}
        />
      </Box>

      {!project.startDate && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('gantt.startDateRequired')}
        </Typography>
      )}

      {phases.length === 0 && (
        <Typography color="text.secondary">
          {t('time.totalHours')}: 0 h
        </Typography>
      )}

      {phases.length > 0 && (
        <Box>
          {/* Column headers */}
          <Grid container sx={{ mb: 1 }}>
            <Grid item sx={{ width: '25%' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('gantt.phase')}
              </Typography>
            </Grid>
            <Grid item sx={{ width: '75%', pl: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {t('gantt.duration')}
              </Typography>
            </Grid>
          </Grid>

          {/* Gantt bars */}
          {phases.map((phase, idx) => {
            const phaseStart = getPhaseStart(idx)
            const widthPct = (phase.days / maxDays) * 100
            const leftPct = (phaseStart / maxDays) * 100
            return (
              <Grid container key={phase.key} alignItems="center" sx={{ mb: 1.5 }}>
                <Grid item sx={{ width: '25%' }}>
                  <Typography variant="body2" fontWeight={500}>
                    {t(`time.${phase.key === 'mesh' ? 'meshProcessing' : phase.key}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {phase.hours}h / {phase.days.toFixed(1)}d
                  </Typography>
                </Grid>
                <Grid item sx={{ width: '75%', pl: 1, position: 'relative' }}>
                  <Box sx={{ height: 28, bgcolor: 'action.hover', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        height: '100%',
                        bgcolor: PHASE_COLORS[phase.key] ?? '#1976d2',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        px: 0.5,
                        minWidth: 4,
                      }}
                    >
                      {widthPct > 10 && startDate && (
                        <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                          {formatDateOffset(phaseStart)} – {formatDateOffset(phaseStart + phase.days)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )
          })}

          {/* Total duration */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2">
              {t('gantt.totalDuration')}: {totalDays.toFixed(1)} {t('gantt.duration').toLowerCase()}
              {startDate && ` (${formatDateOffset(0)} – ${formatDateOffset(totalDays)})`}
            </Typography>
          </Box>
        </Box>
      )}
    </SectionCard>
  )
}
