import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  Avatar,
  Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Project, CompanyProfile, ProjectStatus } from '@/types'
import SectionCard from '@/components/common/SectionCard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BusinessIcon from '@mui/icons-material/Business'

const STATUSES: ProjectStatus[] = ['draft', 'in_review', 'approved', 'completed', 'archived']

interface Props {
  project: Project
  profiles: CompanyProfile[]
  onChange: (patch: Partial<Project>) => void
}

function CompanyOption({ profile }: { profile: CompanyProfile }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar src={profile.logoBase64 ?? undefined} sx={{ width: 28, height: 28, fontSize: 13 }}>
        {profile.name.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="body2">{profile.name}</Typography>
        <Typography variant="caption" color="text.secondary">{profile.city}</Typography>
      </Box>
    </Box>
  )
}

export default function ProjectHeader({ project, profiles, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <>
      <SectionCard title={t('nav.projects')} icon={<AssignmentIcon />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('project.title')}
              value={project.title}
              onChange={(e) => onChange({ title: e.target.value })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label={t('project.protocolNumber')}
              value={project.protocolNumber}
              onChange={(e) => onChange({ protocolNumber: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t('project.status')}</InputLabel>
              <Select
                value={project.status}
                label={t('project.status')}
                onChange={(e) => onChange({ status: e.target.value as ProjectStatus })}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`project.statuses.${s}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t('project.internalNotes')}
              value={project.internalNotes}
              onChange={(e) => onChange({ internalNotes: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title={`${t('company.realizator')} & ${t('company.ziadatel')}`} icon={<BusinessIcon />}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={profiles}
              getOptionLabel={(p) => p.name}
              value={project.realizator}
              onChange={(_, val) => onChange({ realizator: val })}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <CompanyOption profile={option} />
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label={t('company.realizator')} fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={profiles}
              getOptionLabel={(p) => p.name}
              value={project.ziadatel}
              onChange={(_, val) => onChange({ ziadatel: val })}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <CompanyOption profile={option} />
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label={t('company.ziadatel')} fullWidth />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>
    </>
  )
}
