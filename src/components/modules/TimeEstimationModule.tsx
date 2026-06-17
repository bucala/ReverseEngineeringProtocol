import { useMemo } from 'react'
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
} from '@mui/material'
import ScheduleIcon from '@mui/icons-material/Schedule'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useTranslation } from 'react-i18next'
import type { TimeEstimation, MeshAssessment, RECadPostprocessing, TimeEntry } from '@/types'
import SectionCard from '@/components/common/SectionCard'

interface Props {
  value: TimeEstimation
  mesh: MeshAssessment
  recad: RECadPostprocessing
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
    scanning: scanBase,
    mesh: parseFloat((scanBase * 0.6 * mult).toFixed(1)),
    cad: cadBase || parseFloat((scanBase * 1.2 * mult).toFixed(1)),
    inspection: recad.drawingRequired ? 4 : 0,
    management: parseFloat(((scanBase + cadBase) * 0.1).toFixed(1)),
    travel: 0,
  }
}

export default function TimeEstimationModule({ value, mesh, recad, onChange }: Props) {
  const { t } = useTranslation()
  const set = <K extends keyof TimeEstimation>(key: K, val: TimeEstimation[K]) =>
    onChange({ ...value, [key]: val })

  const setEntry = (key: keyof TimeEstimation, patch: Partial<TimeEntry>) =>
    set(key, { ...(value[key] as TimeEntry), ...patch })

  const autoHours = useMemo(() => computeAutoHours(mesh, recad), [mesh, recad])

  const entries: Array<{
    key: keyof TimeEstimation
    labelKey: string
    autoHours: number
  }> = [
    { key: 'scanningEntry', labelKey: 'time.scanning', autoHours: autoHours.scanning },
    { key: 'meshProcessingEntry', labelKey: 'time.meshProcessing', autoHours: autoHours.mesh },
    { key: 'cadEntry', labelKey: 'time.cad', autoHours: autoHours.cad },
    { key: 'inspectionEntry', labelKey: 'time.inspection', autoHours: autoHours.inspection },
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
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            {t('time.mode')}
          </Typography>
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
