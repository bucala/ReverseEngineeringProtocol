import { useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Grid,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import SignaturePad from 'signature_pad'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (realizatorSig: string | null, ziadatelSig: string | null, signedAt: string) => void
}

export default function SignatureDialog({ open, onClose, onSave }: Props) {
  const { t } = useTranslation()
  const realizatorCanvasRef = useRef<HTMLCanvasElement>(null)
  const ziadatelCanvasRef = useRef<HTMLCanvasElement>(null)
  const realizatorPadRef = useRef<SignaturePad | null>(null)
  const ziadatelPadRef = useRef<SignaturePad | null>(null)

  useEffect(() => {
    if (!open) return

    // Small delay to allow dialog to render
    const timeout = setTimeout(() => {
      if (realizatorCanvasRef.current) {
        realizatorPadRef.current = new SignaturePad(realizatorCanvasRef.current, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)',
        })
      }
      if (ziadatelCanvasRef.current) {
        ziadatelPadRef.current = new SignaturePad(ziadatelCanvasRef.current, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)',
        })
      }
    }, 100)

    return () => {
      clearTimeout(timeout)
      realizatorPadRef.current?.off()
      ziadatelPadRef.current?.off()
      realizatorPadRef.current = null
      ziadatelPadRef.current = null
    }
  }, [open])

  const clearRealizator = () => realizatorPadRef.current?.clear()
  const clearZiadatel = () => ziadatelPadRef.current?.clear()

  const handleSave = () => {
    const realizatorSig = realizatorPadRef.current?.isEmpty()
      ? null
      : (realizatorPadRef.current?.toDataURL('image/png') ?? null)
    const ziadatelSig = ziadatelPadRef.current?.isEmpty()
      ? null
      : (ziadatelPadRef.current?.toDataURL('image/png') ?? null)
    onSave(realizatorSig, ziadatelSig, new Date().toISOString())
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('signature.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('signature.realizator')}
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <canvas
                ref={realizatorCanvasRef}
                width={300}
                height={150}
                style={{ display: 'block', touchAction: 'none', width: '100%', height: '150px' }}
              />
            </Box>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 0.5 }}>
              <Button size="small" onClick={clearRealizator}>
                {t('signature.clear')}
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('signature.ziadatel')}
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
              <canvas
                ref={ziadatelCanvasRef}
                width={300}
                height={150}
                style={{ display: 'block', touchAction: 'none', width: '100%', height: '150px' }}
              />
            </Box>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 0.5 }}>
              <Button size="small" onClick={clearZiadatel}>
                {t('signature.clear')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={handleSave}>
          {t('signature.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
