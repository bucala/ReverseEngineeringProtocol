import { useMemo, useState } from 'react'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Box,
  Button,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import ScheduleIcon from '@mui/icons-material/Schedule'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useTranslation } from 'react-i18next'
import type { TimeEstimation, MeshAssessment, RECadPostprocessing, TimeEntry, ObjectSpec } from '@/types'
import SectionCard from '@/components/common/SectionCard'
import { useAppStore } from '@/store/appStore'

interface Props {
  value: TimeEstimation
  mesh: MeshAssessment
  recad: RECadPostprocessing
  objectSpecs?: ObjectSpec[]
  onChange: (v: TimeEstimation) => void
}

function computeAutoHours(mesh: MeshAssessment, recad: RECadPostprocessing) {
  const scanBase = mesh.estimatedScanningHours ?? 0
  const cadBase = recad.estimatedCadHours ?? 0

  const complexityMult: Record<string, number> = {
    simple: 0.8, moderate: 1.0, complex: 1.3, freeform: 1.6,
  }
  const mult = complexityMult[mesh.geometryComplexity] ?? 1

  return {
    preparation: parseFloat((scanBase * 0.2).toFixed(1)),
    scanning: scanBase,
    mesh: parseFloat((scanBase * 0.6 * mult).toFixed(1)),
    cad: cadBase || parseFloat((scanBase * 1.2 * mult).toFixed(1)),
    inspection: recad.drawingRequired ? 4 : 0,
    reporting: parseFloat((Math.max(2, (scanBase + cadBase) * 0.1)).toFixed(1)),
    management: parseFloat(((scanBase + cadBase) * 0.1).toFixed(1)),
    travel: 0,
  }
}

interface SmartEstimate {
  scanning: number
  mesh: number
  cad: number
  preparation: number
  reporting: number
  management: number
  travel: number
  inspection: number
}

function computeSmartEstimate(mesh: MeshAssessment, recad: RECadPostprocessing, objectSpecs: ObjectSpec[]): SmartEstimate {
  // Base scanning hours from method
  const scanBaseMap: Record<string, number> = {
    structured_light: 4,
    laser_line: 3,
    ct_scan: 8,
    photogrammetry: 6,
    cmm: 5,
    handheld: 2,
  }
  let scanBase = scanBaseMap[mesh.scanningMethod] ?? 4

  // Volume factor from bounding boxes
  const totalVolume = objectSpecs.reduce((sum, s) => {
    const x = s.boundingBox.x ?? 100
    const y = s.boundingBox.y ?? 100
    const z = s.boundingBox.z ?? 100
    return sum + x * y * z
  }, 0)
  if (totalVolume > 0) {
    const volFactor = Math.max(0.5, Math.min(3.0, totalVolume / 1000000))
    scanBase *= volFactor
  }

  // Complexity multiplier
  const complexityMult: Record<string, number> = { simple: 0.7, moderate: 1.0, complex: 1.5, freeform: 2.0 }
  const cMult = complexityMult[mesh.geometryComplexity] ?? 1.0
  scanBase *= cMult

  // Precision multiplier
  const precisionMult: Record<string, number> = { standard: 1.0, high_precision: 1.4, metrology: 2.0 }
  scanBase *= precisionMult[mesh.precisionLevel] ?? 1.0

  // Additions
  if (mesh.surfacePrepRequired) scanBase += 1
  if (mesh.requiresCtScan) scanBase += 3
  if (mesh.hasUndercutFeatures) scanBase += 1
  if (mesh.hasInternalFeatures) scanBase += 1.5
  if (mesh.hasDeepCavities) scanBase += 1

  // CAD hours from strategy
  let cadBase = scanBase * 1.2
  if (recad.strategy === 'design_intent') cadBase *= 1.4
  if (recad.featureBasedModeling) cadBase *= 1.2
  if (recad.drawingRequired) cadBase += 6

  const r = (n: number) => parseFloat(n.toFixed(1))

  return {
    scanning: r(scanBase),
    mesh: r(scanBase * 0.5),
    cad: r(cadBase),
    preparation: r(scanBase * 0.25),
    reporting: r(Math.max(2, (scanBase + cadBase) * 0.1)),
    management: r((scanBase + cadBase) * 0.1),
    inspection: recad.drawingRequired ? 4 : 0,
    travel: 0,
  }
}

async function fetchClaudeEstimate(
  apiKey: string,
  mesh: MeshAssessment,
  recad: RECadPostprocessing,
  objectSpecs: ObjectSpec[]
): Promise<SmartEstimate | null> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Estimate time in hours for a reverse engineering project. Object: ${objectSpecs.map((s) => s.name).join(', ') || 'unknown'}, complexity: ${mesh.geometryComplexity}, scanning: ${mesh.scanningMethod}, precision: ${mesh.precisionLevel}, CAD strategy: ${recad.strategy}. Reply with ONLY a JSON object: {"scanning": N, "mesh": N, "cad": N, "preparation": N, "reporting": N, "management": N, "travel": 0, "inspection": 0}`,
        }],
      }),
    })
    if (!response.ok) return null
    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''
    const match = text.match(/\{[^}]+\}/)
    if (!match) return null
    return JSON.parse(match[0]) as SmartEstimate
  } catch {
    return null
  }
}

export default function TimeEstimationModule({ value, mesh, recad, objectSpecs = [], onChange }: Props) {
  const { t } = useTranslation()
  const { anthropicApiKey } = useAppStore()
  const [estimating, setEstimating] = useState(false)

  const set = <K extends keyof TimeEstimation>(key: K, val: TimeEstimation[K]) =>
    onChange({ ...value, [key]: val })

  const setEntry = (key: keyof TimeEstimation, patch: Partial<TimeEntry>) =>
    set(key, { ...(value[key] as TimeEntry), ...patch })

  const autoHours = useMemo(() => computeAutoHours(mesh, recad), [mesh, recad])

  const handleAiEstimate = async () => {
    setEstimating(true)
    try {
      let estimate: SmartEstimate | null = null

      if (anthropicApiKey) {
        estimate = await fetchClaudeEstimate(anthropicApiKey, mesh, recad, objectSpecs)
      }

      if (!estimate) {
        estimate = computeSmartEstimate(mesh, recad, objectSpecs)
      }

      // Apply estimate to manual entries and switch to manual mode
      onChange({
        ...value,
        mode: 'manual',
        preparationEntry: { ...value.preparationEntry, hours: estimate.preparation },
        scanningEntry: { ...value.scanningEntry, hours: estimate.scanning },
        meshProcessingEntry: { ...value.meshProcessingEntry, hours: estimate.mesh },
        cadEntry: { ...value.cadEntry, hours: estimate.cad },
        inspectionEntry: { ...value.inspectionEntry, hours: estimate.inspection },
        reportingEntry: { ...value.reportingEntry, hours: estimate.reporting },
        managementEntry: { ...value.managementEntry, hours: estimate.management },
        travelEntry: { ...value.travelEntry, hours: estimate.travel },
      })
    } finally {
      setEstimating(false)
    }
  }

  const entries: Array<{
    key: keyof TimeEstimation
    labelKey: string
    autoHours: number
  }> = [
    { key: 'preparationEntry', labelKey: 'time.preparation', autoHours: autoHours.preparation },
    { key: 'scanningEntry', labelKey: 'time.scanning', autoHours: autoHours.scanning },
    { key: 'meshProcessingEntry', labelKey: 'time.meshProcessing', autoHours: autoHours.mesh },
    { key: 'cadEntry', labelKey: 'time.cad', autoHours: autoHours.cad },
    { key: 'inspectionEntry', labelKey: 'time.inspection', autoHours: autoHours.inspection },
    { key: 'reportingEntry', labelKey: 'time.reporting', autoHours: autoHours.reporting },
    { key: 'managementEntry', labelKey: 'time.management', autoHours: autoHours.management },
    { key: 'travelEntry', labelKey: 'time.travel', autoHours: autoHours.travel },
  ]

  const isAuto = value.mode === 'auto'

  const totals = entries.reduce(
    (acc, e) => {
      const entry = value[e.key] as TimeEntry
      const hours = isAuto ? e.autoHours : entry.hours
      return {
        hours: acc.hours + hours,
        cost: acc.cost + hours * entry.rate,
      }
    },
    { hours: 0, cost: 0 }
  )

  const subtotalCost = totals.cost
  const afterOverhead = subtotalCost * (1 + value.overhead / 100)
  const afterDiscount = afterOverhead * (1 - value.discount / 100)

  return (
    <SectionCard title={t('time.title')} icon={<ScheduleIcon />}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle2" gutterBottom>
            {t('time.mode')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={value.mode}
              exclusive
              onChange={(_, v) => v && set('mode', v)}
              size="small"
            >
              <ToggleButton value="auto">
                <AutoFixHighIcon sx={{ mr: 0.5 }} fontSize="small" />
                {t('time.modes.auto')}
              </ToggleButton>
              <ToggleButton value="manual">
                <EditNoteIcon sx={{ mr: 0.5 }} fontSize="small" />
                {t('time.modes.manual')}
              </ToggleButton>
            </ToggleButtonGroup>
            <Tooltip title={anthropicApiKey ? t('time.aiEstimate') : `${t('time.aiEstimate')} (${t('settings.title')} – API Key)`}>
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={estimating ? <CircularProgress size={14} /> : <AutoFixHighIcon />}
                  onClick={handleAiEstimate}
                  disabled={estimating}
                >
                  {estimating ? t('time.estimating') : t('time.aiEstimate')}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>{t('time.currency')}</InputLabel>
            <Select
              value={value.currency}
              label={t('time.currency')}
              onChange={(e) => set('currency', e.target.value as TimeEstimation['currency'])}
            >
              {(['EUR', 'USD', 'CZK'] as const).map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Time entries table */}
      <Paper variant="outlined" sx={{ mb: 2, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>{t('common.notes')}</TableCell>
              <TableCell align="right">{t('time.totalHours')}</TableCell>
              <TableCell align="right">{t('time.ratePerHour')}</TableCell>
              <TableCell align="right">{t('common.subtotal')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(({ key, labelKey, autoHours: ah }) => {
              const entry = value[key] as TimeEntry
              const hours = isAuto ? ah : entry.hours
              const lineCost = hours * entry.rate
              return (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 500 }}>{t(labelKey)}</TableCell>
                  <TableCell align="right">
                    {isAuto ? (
                      <Typography variant="body2">{ah} h</Typography>
                    ) : (
                      <TextField
                        type="number"
                        value={entry.hours}
                        onChange={(e) => setEntry(key, { hours: parseFloat(e.target.value) || 0 })}
                        inputProps={{ min: 0, step: 0.5, style: { textAlign: 'right' } }}
                        size="small"
                        sx={{ width: 80 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={entry.rate}
                      onChange={(e) => setEntry(key, { rate: parseFloat(e.target.value) || 0 })}
                      inputProps={{ min: 0, step: 1, style: { textAlign: 'right' } }}
                      size="small"
                      sx={{ width: 90 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={500}>
                      {lineCost.toFixed(2)} {value.currency}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Summary */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <TextField
            label={t('time.overhead')}
            type="number"
            value={value.overhead}
            onChange={(e) => set('overhead', parseFloat(e.target.value) || 0)}
            inputProps={{ min: 0, max: 100, step: 1 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            label={t('time.discount')}
            type="number"
            value={value.discount}
            onChange={(e) => set('discount', parseFloat(e.target.value) || 0)}
            inputProps={{ min: 0, max: 100, step: 1 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, pt: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                {t('time.totalHours')}
              </Typography>
              <Typography variant="h6">{totals.hours.toFixed(1)} h</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                {t('time.subtotal')}
              </Typography>
              <Typography variant="body2">{subtotalCost.toFixed(2)} {value.currency}</Typography>
              {value.overhead > 0 && (
                <Typography variant="body2" color="text.secondary">
                  + {value.overhead}% réžia → {afterOverhead.toFixed(2)}
                </Typography>
              )}
              {value.discount > 0 && (
                <Typography variant="body2" color="text.secondary">
                  - {value.discount}% zľava
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'right', bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 1, borderRadius: 2 }}>
              <Typography variant="caption">{t('time.totalCost')}</Typography>
              <Typography variant="h5" fontWeight={700}>
                {afterDiscount.toFixed(2)} {value.currency}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  )
}
