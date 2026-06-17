import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  FormGroup,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import MeshIcon from '@mui/icons-material/ViewInAr'
import { useTranslation } from 'react-i18next'
import type { RECadPostprocessing, REStrategy, SurfacingMethod, CadOutputFormat, MeshProcessingTasks } from '@/types'
import SectionCard from '@/components/common/SectionCard'

interface Props {
  value: RECadPostprocessing
  onChange: (v: RECadPostprocessing) => void
}

const STRATEGIES: REStrategy[] = ['as_built', 'design_intent']
const METHODS: SurfacingMethod[] = ['auto_surfacing', 'parametric_solid', 'hybrid']
const CAD_FORMATS: CadOutputFormat[] = [
  'CATIA_V5',
  'CATIA_V6',
  'SOLIDWORKS',
  'NX',
  'SOLIDEDGE',
  'INVENTOR',
  'CREO',
  'STEP',
  'IGES',
  'PARASOLID',
]

const CAD_LABELS: Record<CadOutputFormat, string> = {
  CATIA_V5: 'CATIA V5',
  CATIA_V6: 'CATIA V6',
  SOLIDWORKS: 'SolidWorks',
  NX: 'Siemens NX',
  SOLIDEDGE: 'Solid Edge',
  INVENTOR: 'Inventor',
  CREO: 'PTC Creo',
  STEP: 'STEP (.stp)',
  IGES: 'IGES (.igs)',
  PARASOLID: 'Parasolid (.x_t)',
}

const MESH_TASK_KEYS: (keyof MeshProcessingTasks)[] = [
  'errorCleaning',
  'smoothing',
  'coordinateAlignment',
  'dataOptimization',
  'watertight',
  'decimation',
]

export default function RECadModule({ value, onChange }: Props) {
  const { t } = useTranslation()
  const set = <K extends keyof RECadPostprocessing>(key: K, val: RECadPostprocessing[K]) =>
    onChange({ ...value, [key]: val })

  const toggleFormat = (fmt: CadOutputFormat) => {
    const current = value.selectedCadFormats
    const next = current.includes(fmt)
      ? current.filter((f) => f !== fmt)
      : [...current, fmt]
    set('selectedCadFormats', next)
  }

  const setMeshTask = (key: keyof MeshProcessingTasks, val: boolean) =>
    set('meshProcessingTasks', { ...value.meshProcessingTasks, [key]: val })

  return (
    <>
      <SectionCard title={t('recad.title')} icon={<ArchitectureIcon />}>
        <Grid container spacing={3}>
          {/* Strategy */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('recad.strategy')}</InputLabel>
              <Select
                value={value.strategy}
                label={t('recad.strategy')}
                onChange={(e) => set('strategy', e.target.value as REStrategy)}
              >
                {STRATEGIES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`recad.strategies.${s}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Surfacing method */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('recad.surfacingMethod')}</InputLabel>
              <Select
                value={value.surfacingMethod}
                label={t('recad.surfacingMethod')}
                onChange={(e) => set('surfacingMethod', e.target.value as SurfacingMethod)}
              >
                {METHODS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {t(`recad.methods.${m}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Switches row */}
          <Grid item xs={12}>
            <FormGroup row sx={{ gap: 2, flexWrap: 'wrap' }}>
              {[
                { key: 'featureBasedModeling', label: t('recad.featureBasedModeling') },
                { key: 'sketches2D', label: t('recad.sketches2D') },
                { key: 'drawingRequired', label: t('recad.drawingRequired') },
                { key: 'toleranceAnalysis', label: t('recad.toleranceAnalysis') },
              ].map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={value[key as keyof RECadPostprocessing] as boolean}
                      onChange={(e) =>
                        set(key as keyof RECadPostprocessing, e.target.checked as never)
                      }
                      color="primary"
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* CAD format checkboxes */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('recad.selectedCadFormats')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {CAD_FORMATS.map((fmt) => {
                const selected = value.selectedCadFormats.includes(fmt)
                return (
                  <Chip
                    key={fmt}
                    label={CAD_LABELS[fmt]}
                    onClick={() => toggleFormat(fmt)}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    clickable
                  />
                )
              })}
            </Box>
            {value.selectedCadFormats.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('common.total')}: {value.selectedCadFormats.length}
                </Typography>
              </Stack>
            )}
          </Grid>

          {/* Estimated CAD hours */}
          <Grid item xs={12} md={4}>
            <TextField
              label={t('recad.estimatedCadHours')}
              type="number"
              inputProps={{ min: 0, step: 0.5 }}
              value={value.estimatedCadHours ?? ''}
              onChange={(e) =>
                set('estimatedCadHours', e.target.value === '' ? null : parseFloat(e.target.value))
              }
              fullWidth
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label={t('recad.notes')}
              value={value.notes}
              onChange={(e) => set('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Mesh Processing Tasks */}
      <SectionCard title={t('meshProcessing.title')} icon={<MeshIcon />}>
        <Grid container spacing={2}>
          {MESH_TASK_KEYS.map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.meshProcessingTasks[key]}
                    onChange={(e) => setMeshTask(key, e.target.checked)}
                    color="primary"
                  />
                }
                label={t(`meshProcessing.${key}`)}
              />
            </Grid>
          ))}
        </Grid>
      </SectionCard>
    </>
  )
}
