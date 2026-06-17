import { useCallback } from 'react'
import {
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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import type { ObjectSpec, ObjectImage } from '@/types'
import SectionCard from '@/components/common/SectionCard'
import CategoryIcon from '@mui/icons-material/Category'
import { readFileAsDataURL } from '@/utils/fileFormat'

interface Props {
  value: ObjectSpec
  onChange: (v: ObjectSpec) => void
}

const UNITS = ['mm', 'cm', 'm', 'inch'] as const

export default function ObjectSpecModule({ value, onChange }: Props) {
  const { t } = useTranslation()

  const set = <K extends keyof ObjectSpec>(key: K, val: ObjectSpec[K]) =>
    onChange({ ...value, [key]: val })

  const setBBox = (axis: 'x' | 'y' | 'z', num: string) =>
    onChange({
      ...value,
      boundingBox: { ...value.boundingBox, [axis]: num === '' ? null : parseFloat(num) },
    })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newImages: ObjectImage[] = []
      for (const file of acceptedFiles) {
        try {
          const dataBase64 = await readFileAsDataURL(file)
          newImages.push({
            id: uuidv4(),
            dataBase64,
            mimeType: file.type,
            description: file.name,
            takenAt: null,
          })
        } catch {
          /* skip unreadable files */
        }
      }
      set('images', [...value.images, ...newImages])
    },
    [value.images] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const updateImageDescription = (id: string, description: string) =>
    set(
      'images',
      value.images.map((img) => (img.id === id ? { ...img, description } : img))
    )

  const removeImage = (id: string) =>
    set('images', value.images.filter((img) => img.id !== id))

  return (
    <>
      <SectionCard title={t('object.title')} icon={<CategoryIcon />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('object.name')}
              value={value.name}
              onChange={(e) => set('name', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label={t('object.partNumber')}
              value={value.partNumber}
              onChange={(e) => set('partNumber', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label={t('object.material')}
              value={value.material}
              onChange={(e) => set('material', e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Bounding Box */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('object.boundingBox')}
            </Typography>
          </Grid>
          {(['x', 'y', 'z'] as const).map((axis) => (
            <Grid item xs={6} sm={3} key={axis}>
              <TextField
                label={t(`object.dimension${axis.toUpperCase()}`)}
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                value={value.boundingBox[axis] ?? ''}
                onChange={(e) => setBBox(axis, e.target.value)}
                fullWidth
              />
            </Grid>
          ))}
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>{t('object.unit')}</InputLabel>
              <Select
                value={value.boundingBox.unit}
                label={t('object.unit')}
                onChange={(e) =>
                  onChange({
                    ...value,
                    boundingBox: {
                      ...value.boundingBox,
                      unit: e.target.value as typeof value.boundingBox.unit,
                    },
                  })
                }
              >
                {UNITS.map((u) => (
                  <MenuItem key={u} value={u}>
                    {t(`common.${u}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('object.notes')}
              value={value.notes}
              onChange={(e) => set('notes', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Image upload */}
      <SectionCard title={t('object.images')} icon={<AddPhotoAlternateIcon />}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.default',
            mb: 2,
            transition: 'all 0.2s',
          }}
        >
          <input {...getInputProps()} />
          <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">
            {isDragActive ? t('object.uploadImages') : `${t('object.uploadImages')} (drag & drop)`}
          </Typography>
        </Box>

        {value.images.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {value.images.map((img) => (
              <Paper
                key={img.id}
                variant="outlined"
                sx={{ width: 160, p: 1, position: 'relative' }}
              >
                <Box
                  component="img"
                  src={img.dataBase64}
                  alt={img.description}
                  sx={{
                    width: '100%',
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    display: 'block',
                    mb: 1,
                  }}
                />
                <TextField
                  value={img.description}
                  onChange={(e) => updateImageDescription(img.id, e.target.value)}
                  placeholder={t('object.imageDescription')}
                  size="small"
                  fullWidth
                />
                <Tooltip title={t('object.removeImage')}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeImage(img.id)}
                    sx={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Paper>
            ))}
          </Stack>
        )}
      </SectionCard>
    </>
  )
}
