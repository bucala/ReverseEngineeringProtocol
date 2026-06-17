import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Slider,
  Box,
  Chip,
} from '@mui/material'
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot'
import { useTranslation } from 'react-i18next'
import type {
  MeshAssessment,
  ScanningDifficulty,
  SurfaceFinish,
  GeometryComplexity,
  ScanningMethod,
  PrecisionLevel,
  ReferenceTargets,
} from '@/types'
import SectionCard from '@/components/common/SectionCard'

interface Props {
  value: MeshAssessment
  onChange: (v: MeshAssessment) => void
}

const DIFFICULTIES: ScanningDifficulty[] = ['easy', 'medium', 'hard', 'extreme']
const SURFACES: SurfaceFinish[] = ['matte', 'glossy', 'reflective', 'transparent', 'mixed']
const COMPLEXITIES: GeometryComplexity[] = ['simple', 'moderate', 'complex', 'freeform']
const SCANNING_METHODS: ScanningMethod[] = ['structured_light', 'laser_line', 'ct_scan', 'photogrammetry', 'cmm', 'handheld']
const PRECISION_LEVELS: PrecisionLevel[] = ['standard', 'high_precision', 'metrology']
const REFERENCE_TARGETS: ReferenceTargets[] = ['none', 'coded', 'uncoded', 'both']

const DIFFICULTY_COLOR: Record<ScanningDifficulty, 'success' | 'warning' | 'error'> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
  extreme: 'error',
}

export default function MeshAssessmentModule({ value, onChange }: Props) {
  const { t } = useTranslation()
  const set = <K extends keyof MeshAssessment>(key: K, val: MeshAssessment[K]) =>
    onChange({ ...value, [key]: val })

  const showTolerance = value.precisionLevel === 'high_precision' || value.precisionLevel === 'metrology'

  return (
    <SectionCard title={t('mesh.title')} icon={<ScatterPlotIcon />}>
      <Grid container spacing={3}>
        {/* Scanning method */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('mesh.scanningMethod')}</InputLabel>
            <Select
              value={value.scanningMethod}
              label={t('mesh.scanningMethod')}
              onChange={(e) => set('scanningMethod', e.target.value as ScanningMethod)}
            >
              {SCANNING_METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {t(`mesh.methods.${m}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Precision level */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('mesh.precisionLevel')}</InputLabel>
            <Select
              value={value.precisionLevel}
              label={t('mesh.precisionLevel')}
              onChange={(e) => set('precisionLevel', e.target.value as PrecisionLevel)}
            >
              {PRECISION_LEVELS.map((p) => (
                <MenuItem key={p} value={p}>
                  {t(`mesh.precisionLevels.${p}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tolerance (conditional) */}
        {showTolerance && (
          <Grid item xs={12} md={4}>
            <TextField
              label={t('mesh.toleranceMm')}
              type="number"
              inputProps={{ min: 0, step: 0.001 }}
              value={value.toleranceMm ?? ''}
              onChange={(e) =>
                set('toleranceMm', e.target.value === '' ? null : parseFloat(e.target.value))
              }
              fullWidth
            />
          </Grid>
        )}

        {/* Reference targets */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('mesh.referenceTargets')}</InputLabel>
            <Select
              value={value.referenceTargets}
              label={t('mesh.referenceTargets')}
              onChange={(e) => set('referenceTargets', e.target.value as ReferenceTargets)}
            >
              {REFERENCE_TARGETS.map((r) => (
                <MenuItem key={r} value={r}>
                  {t(`mesh.targets.${r}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Scanning difficulty */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('mesh.scanningDifficulty')}</InputLabel>
            <Select
              value={value.scanningDifficulty}
              label={t('mesh.scanningDifficulty')}
              onChange={(e) => set('scanningDifficulty', e.target.value as ScanningDifficulty)}
              renderValue={(v) => (
                <Chip
                  label={t(`mesh.difficulties.${v}`)}
                  color={DIFFICULTY_COLOR[v as ScanningDifficulty]}
                  size="small"
                />
              )}
            >
              {DIFFICULTIES.map((d) => (
                <MenuItem key={d} value={d}>
                  <Chip
                    label={t(`mesh.difficulties.${d}`)}
                    color={DIFFICULTY_COLOR[d]}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Surface finish */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('mesh.surfaceFinish')}</InputLabel>
            <Select
              value={value.surfaceFinish}
              label={t('mesh.surfaceFinish')}
              onChange={(e) => set('surfaceFinish', e.target.value as SurfaceFinish)}
            >
              {SURFACES.map((s) => (
                <MenuItem key={s} value={s}>
                  {t(`mesh.surfaces.${s}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Geometry complexity */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('mesh.geometryComplexity')}</InputLabel>
            <Select
              value={value.geometryComplexity}
              label={t('mesh.geometryComplexity')}
              onChange={(e) => set('geometryComplexity', e.target.value as GeometryComplexity)}
            >
              {COMPLEXITIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {t(`mesh.complexities.${c}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Switches */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.surfacePrepRequired}
                onChange={(e) => set('surfacePrepRequired', e.target.checked)}
                color="warning"
              />
            }
            label={t('mesh.surfacePrepRequired')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.hasUndercutFeatures}
                onChange={(e) => set('hasUndercutFeatures', e.target.checked)}
                color="warning"
              />
            }
            label={t('mesh.hasUndercutFeatures')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.hasInternalFeatures}
                onChange={(e) => set('hasInternalFeatures', e.target.checked)}
                color="warning"
              />
            }
            label={t('mesh.hasInternalFeatures')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.requiresCtScan}
                onChange={(e) => set('requiresCtScan', e.target.checked)}
                color="warning"
              />
            }
            label={t('mesh.requiresCtScan')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.requiresDestructive}
                onChange={(e) => set('requiresDestructive', e.target.checked)}
                color="error"
              />
            }
            label={t('mesh.requiresDestructive')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.hasDeepCavities}
                onChange={(e) => set('hasDeepCavities', e.target.checked)}
                color="warning"
              />
            }
            label={t('mesh.hasDeepCavities')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={value.hasThinWalls}
                onChange={(e) => set('hasThinWalls', e.target.checked)}
                color="warning"
              />
            }
            label={t('mesh.hasThinWalls')}
          />
        </Grid>

        {/* Surface prep method (conditional) */}
        {value.surfacePrepRequired && (
          <Grid item xs={12} md={6}>
            <TextField
              label={t('mesh.surfacePrepMethod')}
              value={value.surfacePrepMethod}
              onChange={(e) => set('surfacePrepMethod', e.target.value)}
              fullWidth
              placeholder="e.g. Anti-reflex spray, powder coating…"
            />
          </Grid>
        )}

        {/* Estimated scanning hours */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" gutterBottom>
            {t('mesh.estimatedScanningHours')}: <strong>{value.estimatedScanningHours ?? 0} h</strong>
          </Typography>
          <Box sx={{ px: 1, pt: 3 }}>
            <Slider
              value={value.estimatedScanningHours ?? 0}
              min={0}
              max={80}
              step={0.5}
              marks={[
                { value: 0, label: '0h' },
                { value: 20, label: '20h' },
                { value: 40, label: '40h' },
                { value: 60, label: '60h' },
                { value: 80, label: '80h' },
              ]}
              valueLabelDisplay="on"
              onChange={(_, v) => set('estimatedScanningHours', v as number)}
            />
          </Box>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            label={t('mesh.notes')}
            value={value.notes}
            onChange={(e) => set('notes', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
