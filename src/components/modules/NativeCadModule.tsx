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
  Alert,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'
import { useTranslation } from 'react-i18next'
import type { NativeCadSpec, CadSystem, DrawingStandard, CadOutputFormat, Format2D } from '@/types'
import SectionCard from '@/components/common/SectionCard'

const CAD_OUTPUT_FORMATS: CadOutputFormat[] = [
  'CATIA_V5', 'CATIA_V6', 'SOLIDWORKS', 'NX', 'SOLIDEDGE', 'INVENTOR', 'CREO', 'STEP', 'IGES', 'PARASOLID',
]
const CAD_OUTPUT_LABELS: Record<CadOutputFormat, string> = {
  CATIA_V5: 'CATIA V5', CATIA_V6: 'CATIA V6', SOLIDWORKS: 'SolidWorks', NX: 'Siemens NX',
  SOLIDEDGE: 'Solid Edge', INVENTOR: 'Inventor', CREO: 'PTC Creo',
  STEP: 'STEP', IGES: 'IGES', PARASOLID: 'Parasolid',
}
const FORMATS_2D: Format2D[] = ['PDF_DRAWING', 'DXF', 'DWG', 'TIFF']
const FORMATS_2D_LABELS: Record<Format2D, string> = {
  PDF_DRAWING: 'PDF Drawing', DXF: 'DXF (CNC/Laser)', DWG: 'DWG (AutoCAD)', TIFF: 'TIFF (hi-res)',
}

function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

interface Props {
  value: NativeCadSpec
  onChange: (v: NativeCadSpec) => void
  cadFormats: CadOutputFormat[]
  formats2D: Format2D[]
  onCadFormatsChange: (v: CadOutputFormat[]) => void
  onFormats2DChange: (v: Format2D[]) => void
}

const CAD_SYSTEMS: CadSystem[] = ['NX', 'SOLIDWORKS', 'INVENTOR', 'CATIA_V5', 'CATIA_V6', 'CREO', 'SOLIDEDGE', 'FUSION360']
const DRAWING_STANDARDS: DrawingStandard[] = ['ISO', 'ANSI', 'DIN', 'custom']

export default function NativeCadModule({ value, onChange, cadFormats, formats2D, onCadFormatsChange, onFormats2DChange }: Props) {
  const { t } = useTranslation()

  const set = <K extends keyof NativeCadSpec>(key: K, val: NativeCadSpec[K]) =>
    onChange({ ...value, [key]: val })

  return (
    <SectionCard title={t('nativeCad.title')} icon={<CodeIcon />}>
      <Grid container spacing={3}>
        {/* Master switch */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={value.required}
                onChange={(e) => set('required', e.target.checked)}
                color="primary"
                size="medium"
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight={600}>
                {t('nativeCad.required')}
              </Typography>
            }
          />
        </Grid>

        {!value.required ? (
          <Grid item xs={12}>
            <Alert severity="info">
              {t('nativeCad.notRequired')}
            </Alert>
          </Grid>
        ) : (
          <>
            {/* CAD system */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('nativeCad.system')}</InputLabel>
                <Select
                  value={value.system ?? ''}
                  label={t('nativeCad.system')}
                  onChange={(e) => set('system', e.target.value ? e.target.value as CadSystem : null)}
                >
                  <MenuItem value="">
                    <em>—</em>
                  </MenuItem>
                  {CAD_SYSTEMS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {t(`nativeCad.systems.${s}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Version */}
            <Grid item xs={12} md={6}>
              <TextField
                label={t('nativeCad.version')}
                value={value.version}
                onChange={(e) => set('version', e.target.value)}
                fullWidth
                helperText={t('nativeCad.versionHint')}
              />
            </Grid>

            {/* Drawing standard */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('nativeCad.drawingStandard')}</InputLabel>
                <Select
                  value={value.drawingStandard}
                  label={t('nativeCad.drawingStandard')}
                  onChange={(e) => set('drawingStandard', e.target.value as DrawingStandard)}
                >
                  {DRAWING_STANDARDS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {t(`nativeCad.standards.${s}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {value.drawingStandard === 'custom' && (
              <Grid item xs={12} md={6}>
                <TextField
                  label={t('nativeCad.customDrawingStandard')}
                  value={value.customDrawingStandard}
                  onChange={(e) => set('customDrawingStandard', e.target.value)}
                  fullWidth
                />
              </Grid>
            )}

            {/* Feature switches */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                CAD Requirements
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={value.featureTreeRequired}
                      onChange={(e) => set('featureTreeRequired', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={t('nativeCad.featureTreeRequired')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={value.parametricRelations}
                      onChange={(e) => set('parametricRelations', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={t('nativeCad.parametricRelations')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={value.assemblyConstraints}
                      onChange={(e) => set('assemblyConstraints', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={t('nativeCad.assemblyConstraints')}
                />
              </Box>
            </Grid>

            {/* Sheet metal */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.sheetMetalRequired}
                    onChange={(e) => set('sheetMetalRequired', e.target.checked)}
                    color="warning"
                  />
                }
                label={t('nativeCad.sheetMetalRequired')}
              />
            </Grid>

            {value.sheetMetalRequired && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={t('nativeCad.sheetMetalKFactor')}
                  type="number"
                  inputProps={{ min: 0, max: 1, step: 0.01 }}
                  value={value.sheetMetalKFactor ?? ''}
                  onChange={(e) =>
                    set('sheetMetalKFactor', e.target.value === '' ? null : parseFloat(e.target.value))
                  }
                  fullWidth
                />
              </Grid>
            )}

            {/* Custom templates */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.useCustomTemplates}
                    onChange={(e) => set('useCustomTemplates', e.target.checked)}
                    color="primary"
                  />
                }
                label={t('nativeCad.useCustomTemplates')}
              />
            </Grid>

            {value.useCustomTemplates && (
              <Grid item xs={12}>
                <TextField
                  label={t('nativeCad.templateNotes')}
                  value={value.templateNotes}
                  onChange={(e) => set('templateNotes', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            )}

            {/* CAD output formats */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                {t('deliverables.cadFormats')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {CAD_OUTPUT_FORMATS.map((fmt) => (
                  <Chip
                    key={fmt}
                    label={CAD_OUTPUT_LABELS[fmt]}
                    onClick={() => onCadFormatsChange(toggleArr(cadFormats, fmt))}
                    color={cadFormats.includes(fmt) ? 'primary' : 'default'}
                    variant={cadFormats.includes(fmt) ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
              </Box>
            </Grid>

            {/* 2D Documentation */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                {t('deliverables.formats2D')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {FORMATS_2D.map((fmt) => (
                  <Chip
                    key={fmt}
                    label={FORMATS_2D_LABELS[fmt]}
                    onClick={() => onFormats2DChange(toggleArr(formats2D, fmt))}
                    color={formats2D.includes(fmt) ? 'primary' : 'default'}
                    variant={formats2D.includes(fmt) ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
              </Box>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 1, mt: 1 }} />
              <TextField
                label={t('nativeCad.notes')}
                value={value.notes}
                onChange={(e) => set('notes', e.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </SectionCard>
  )
}
