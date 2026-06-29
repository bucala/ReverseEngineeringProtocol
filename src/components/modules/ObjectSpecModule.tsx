import { lazy, Suspense, useCallback, useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  Chip,
  Button,
  Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import CategoryIcon from '@mui/icons-material/Category'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import type { ObjectSpec, ObjectImage, REPurpose } from '@/types'
import SectionCard from '@/components/common/SectionCard'

import { readFileAsDataURL } from '@/utils/fileFormat'

const UNITS = ['mm', 'cm', 'm', 'inch'] as const
const RE_PURPOSES: REPurpose[] = ['spare_part', 'design_innovation', 'archiving', 'documentation', 'inspection', 'other']

const ModelViewer3D = lazy(() => import('@/components/common/ModelViewer3D'))

const MAX_IMAGE_SIZE = 8 * 1024 * 1024 // 8 MB
const MAX_IMAGES_PER_OBJECT = 12
const MAX_MODEL_SIZE = 15 * 1024 * 1024 // 15 MB

const emptySpec = (): ObjectSpec => ({
  name: '',
  partNumber: '',
  serialNumber: '',
  material: '',
  images: [],
  boundingBox: { x: null, y: null, z: null, unit: 'mm' },
  notes: '',
  rePurpose: [],
  rePurposeNotes: '',
  model3D: null,
})

// ─── Image dropzone (per-object) ─────────────────────────────────────────────

function ImageDropzone({ spec, onChange }: { spec: ObjectSpec; onChange: (v: ObjectSpec) => void }) {
  const { t } = useTranslation()
  const [imageError, setImageError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setImageError(null)
      const remainingSlots = MAX_IMAGES_PER_OBJECT - spec.images.length
      if (remainingSlots <= 0) {
        setImageError(t('object.imageLimitReached'))
        return
      }
      const newImages: ObjectImage[] = []
      for (const file of acceptedFiles.slice(0, remainingSlots)) {
        if (file.size > MAX_IMAGE_SIZE) {
          setImageError(t('object.imageTooBig'))
          continue
        }
        try {
          const dataBase64 = await readFileAsDataURL(file)
          newImages.push({ id: uuidv4(), dataBase64, mimeType: file.type, description: file.name, takenAt: null })
        } catch { /* skip */ }
      }
      onChange({ ...spec, images: [...spec.images, ...newImages] })
    },
    [spec, onChange, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: true,
  })

  const updateDesc = (id: string, description: string) =>
    onChange({ ...spec, images: spec.images.map((img) => img.id === id ? { ...img, description } : img) })

  const removeImg = (id: string) =>
    onChange({ ...spec, images: spec.images.filter((img) => img.id !== id) })

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.default',
          transition: 'all 0.2s',
        }}
      >
        <input {...getInputProps()} />
        <AddPhotoAlternateIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 0.5 }} />
        <Typography variant="caption" display="block" color="text.secondary">
          {t('object.uploadImages')}
        </Typography>
      </Box>
      {imageError && <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>{imageError}</Typography>}
      {spec.images.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 1.5 }}>
          {spec.images.map((img) => (
            <Paper key={img.id} variant="outlined" sx={{ width: 130, p: 0.75, position: 'relative' }}>
              <Box component="img" src={img.dataBase64} alt={img.description}
                sx={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 1, display: 'block', mb: 0.75 }} />
              <TextField value={img.description} onChange={(e) => updateDesc(img.id, e.target.value)}
                placeholder={t('object.imageDescription')} size="small" fullWidth />
              <Tooltip title={t('object.removeImage')}>
                <IconButton size="small" color="error" onClick={() => removeImg(img.id)}
                  sx={{ position: 'absolute', top: 2, right: 2 }}>
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

// ─── 3D Model dropzone ────────────────────────────────────────────────────────

function Model3DDropzone({ spec, onChange }: { spec: ObjectSpec; onChange: (v: ObjectSpec) => void }) {
  const { t } = useTranslation()
  const [modelError, setModelError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      if (file.size > MAX_MODEL_SIZE) {
        setModelError(t('object.modelTooBig'))
        return
      }
      setModelError(null)
      const ext = file.name.split('.').pop()?.toLowerCase()
      const format = ext === 'stl' ? 'stl' : 'obj'
      try {
        const arrayBuffer = await file.arrayBuffer()
        const uint8 = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i])
        const dataBase64 = btoa(binary)
        onChange({ ...spec, model3D: { dataBase64, format, filename: file.name, filesize: file.size } })
      } catch {
        setModelError(t('common.error'))
      }
    },
    [spec, onChange, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'model/stl': ['.stl'], 'application/octet-stream': ['.stl', '.obj'], 'text/plain': ['.obj'] },
    multiple: false,
  })

  const remove3D = () => onChange({ ...spec, model3D: null })

  return (
    <Box>
      {!spec.model3D ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.default',
            transition: 'all 0.2s',
          }}
        >
          <input {...getInputProps()} />
          <ViewInArIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 0.5 }} />
          <Typography variant="caption" display="block" color="text.secondary">
            {t('object.uploadModel')}
          </Typography>
          {modelError && (
            <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
              {modelError}
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Box sx={{ height: 280, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
            <Suspense fallback={<Typography variant="caption">{t('common.loading')}</Typography>}><ModelViewer3D dataBase64={spec.model3D.dataBase64} format={spec.model3D.format} /></Suspense>
          </Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {spec.model3D.filename} ({(spec.model3D.filesize / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={remove3D}>
              {t('object.removeModel')}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

// ─── Single object form ───────────────────────────────────────────────────────

function ObjectForm({
  spec, index, total, onChange, onRemove,
}: {
  spec: ObjectSpec
  index: number
  total: number
  onChange: (v: ObjectSpec) => void
  onRemove: () => void
}) {
  const { t } = useTranslation()
  const set = <K extends keyof ObjectSpec>(key: K, val: ObjectSpec[K]) => onChange({ ...spec, [key]: val })

  const togglePurpose = (p: REPurpose) => {
    const current = spec.rePurpose ?? []
    set('rePurpose', current.includes(p) ? current.filter((v) => v !== p) : [...current, p])
  }

  const rePurpose = spec.rePurpose ?? []
  const label = spec.name || t('object.objectIndex', { n: index + 1 })

  return (
    <Accordion defaultExpanded={index === 0} disableGutters elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 44, py: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" pr={1}>
          <Typography variant="subtitle2" fontWeight={600}>{label}</Typography>
          {total > 1 && (
            <IconButton size="small" color="error"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              sx={{ ml: 1 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label={t('object.name')} value={spec.name}
              onChange={(e) => set('name', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label={t('object.partNumber')} value={spec.partNumber}
              onChange={(e) => set('partNumber', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label={t('object.serialNumber')} value={spec.serialNumber ?? ''}
              onChange={(e) => set('serialNumber', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label={t('object.material')} value={spec.material}
              onChange={(e) => set('material', e.target.value)} fullWidth />
          </Grid>

          {/* RE Purpose */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {t('rePurpose.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {RE_PURPOSES.map((p) => {
                const selected = rePurpose.includes(p)
                return (
                  <Chip key={p} label={t(`rePurpose.${p}`)} size="small"
                    onClick={() => togglePurpose(p)}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'} clickable />
                )
              })}
            </Box>
          </Grid>

          {rePurpose.length > 0 && (
            <Grid item xs={12}>
              <TextField label={t('rePurpose.notes')} value={spec.rePurposeNotes ?? ''}
                onChange={(e) => set('rePurposeNotes', e.target.value)} multiline rows={1} fullWidth />
            </Grid>
          )}

          {/* Bounding Box */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">{t('object.boundingBox')}</Typography>
          </Grid>
          {(['x', 'y', 'z'] as const).map((axis) => (
            <Grid item xs={4} sm={3} key={axis}>
              <TextField label={`${axis.toUpperCase()} (${spec.boundingBox.unit})`} type="number"
                inputProps={{ min: 0, step: 0.1 }}
                value={spec.boundingBox[axis] ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  set('boundingBox', { ...spec.boundingBox, [axis]: v === '' ? null : parseFloat(v) })
                }} fullWidth />
            </Grid>
          ))}
          <Grid item xs={4} sm={3}>
            <FormControl fullWidth>
              <InputLabel>{t('object.unit')}</InputLabel>
              <Select value={spec.boundingBox.unit} label={t('object.unit')}
                onChange={(e) => set('boundingBox', { ...spec.boundingBox, unit: e.target.value as typeof spec.boundingBox.unit })}>
                {UNITS.map((u) => <MenuItem key={u} value={u}>{t(`common.${u}`)}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField label={t('object.notes')} value={spec.notes}
              onChange={(e) => set('notes', e.target.value)} multiline rows={2} fullWidth />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {t('object.images')}
            </Typography>
            <ImageDropzone spec={spec} onChange={onChange} />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {t('object.model3D')}
            </Typography>
            <Model3DDropzone spec={spec} onChange={onChange} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

// ─── Main module ──────────────────────────────────────────────────────────────

interface Props {
  value: ObjectSpec[]
  onChange: (v: ObjectSpec[]) => void
}

export default function ObjectSpecModule({ value, onChange }: Props) {
  const { t } = useTranslation()
  const safeValue = value?.length ? value : [emptySpec()]

  const update = (index: number, spec: ObjectSpec) => {
    const next = [...safeValue]
    next[index] = spec
    onChange(next)
  }

  return (
    <SectionCard title={t('object.title')} icon={<CategoryIcon />}>
      {safeValue.map((spec, i) => (
        <ObjectForm
          key={i}
          spec={spec}
          index={i}
          total={safeValue.length}
          onChange={(v) => update(i, v)}
          onRemove={() => onChange(safeValue.filter((_, idx) => idx !== i))}
        />
      ))}
      <Button startIcon={<AddIcon />} onClick={() => onChange([...safeValue, emptySpec()])}
        variant="outlined" size="small" sx={{ mt: 1 }}>
        {t('object.addObject')}
      </Button>
    </SectionCard>
  )
}
