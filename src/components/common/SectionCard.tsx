import { type ReactNode } from 'react'
import { Card, CardContent, Typography, Box, Divider } from '@mui/material'

interface Props {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  action?: ReactNode
}

export default function SectionCard({ title, subtitle, icon, children, action }: Props) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>}
            <Box>
              <Typography variant="h6">{title}</Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {action}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  )
}
