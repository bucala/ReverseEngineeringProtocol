import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useTranslation } from 'react-i18next'
import type { Deliverables, MeshFormat, InspectionFormat } from '@/types'
import SectionCard from '@/components/common/SectionCard'

interface Props {
  value: Deliverables
  onChange: (v: Deliverables) => void
}

const MESH_FORMATS: MeshFormat[] = ['STL', 'OBJ', 'PLY', 'E57', 'FBX', '3MF']
const INSPECTION_FORMATS: InspectionFormat[] = [
  'COLOR_MAP', 'DIMENSION_REPORT_PDF', 'GD_T', 'FIRST_ARTICLE', 'NOMINAL_ACTUAL',
]
const INSPECTION_LABELS: Record<InspectionFormat, string> = {
  COLOR_MAP: 'Color Map Deviation',
  DIMENSION_REPORT_PDF: 'Dimension Report (PDF)',
  GD_T: 'GD&T Analysis',
  FIRST_ARTICLE: 'First Article Inspection',
  NOMINAL_ACTUAL: 'Nominal vs. Actual Report',
}

function ToggleChips<T extends string>({
  options,
  selected,
  labels,
  onToggle,
}: {
  options: T[]
  selected: T[]
  labels?: Record<T, string>
  onToggle: (v: T) => void
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt)
        return (
          <Chip
            key={opt}
            label={labels ? labels[opt] : opt}
            onClick={() => onToggle(opt)}
            color={isSelected ? 'primary' : 'default'}
            variant={isSelected ? 'filled' : 'outlined'}
            clickable
          />
        )
      })}
    </Box>
  )
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export default function DeliverablesModule({ value, onChange }: Props) {
  const { t } = useTranslation()
  const set = <K extends keyof Deliverables>(key: K, val: Deliverables[K]) =>
    onChange({ ...value, [key]: val })

  return (
    <SectionCard title={t('deliverables.title')} icon={<LocalShippingIcon />}>
      <Grid container spacing={3}>
        {/* Raw mesh */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {t('deliverables.rawMeshFormats')}
          </Typography>
          <ToggleChips
            options={MESH_FORMATS}
            selected={value.rawMeshFormats}
            onToggle={(v) => set('rawMeshFormats', toggle(value.rawMeshFormats, v))}
          />
        </Grid>

        {/* Optimized mesh */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {t('deliverables.optimizedMeshFormats')}
          </Typography>
          <ToggleChips
            options={MESH_FORMATS}
            selected={value.optimizedMeshFormats}
            onToggle={(v) => set('optimizedMeshFormats', toggle(value.optimizedMeshFormats, v))}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Inspection reports */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {t('deliverables.inspectionFormats')}
          </Typography>
          <ToggleChips
            options={INSPECTION_FORMATS}
            selected={value.inspectionFormats}
            labels={INSPECTION_LABELS}
            onToggle={(v) => set('inspectionFormats', toggle(value.inspectionFormats, v))}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Delivery options */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={value.cloudUpload}
                onChange={(e) => set('cloudUpload', e.target.checked)}
                color="primary"
              />
            }
            label={t('deliverables.cloudUpload')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={value.physicalMedia}
                onChange={(e) => set('physicalMedia', e.target.checked)}
                color="primary"
              />
            }
            label={t('deliverables.physicalMedia')}
          />
        </Grid>

        {/* Deadline – full date */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label={t('deliverables.deadline')}
            type="date"
            value={value.deadline ?? ''}
            onChange={(e) => set('deadline', e.target.value || null)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        {/* Delivery notes */}
        <Grid item xs={12}>
          <TextField
            label={t('deliverables.deliveryNotes')}
            value={value.deliveryNotes}
            onChange={(e) => set('deliveryNotes', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
