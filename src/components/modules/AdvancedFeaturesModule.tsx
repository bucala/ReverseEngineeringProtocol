import { useMemo } from 'react'
import {
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useTranslation } from 'react-i18next'
import type { AdvancedProjectFeatures, Project, ScanRiskAssessment, ScanningMethod } from '@/types'
import SectionCard from '@/components/common/SectionCard'

interface Props {
  project: Project
  onChange: (features: AdvancedProjectFeatures) => void
}

const WORKFLOW_STAGES: AdvancedProjectFeatures['workflowStage'][] = [
  'draft',
  'ready_for_review',
  'internal_review',
  'client_approval',
  'approved',
  'in_production',
  'delivered',
  'closed',
]

function calculateRisk(project: Project): ScanRiskAssessment {
  const mesh = project.meshAssessment
  let score = 10
  const warnings: string[] = []
  const recommendations: string[] = []

  if (mesh.surfaceFinish === 'reflective' || mesh.surfaceFinish === 'transparent') {
    score += 25
    warnings.push('difficultSurface')
    recommendations.push('surfacePrep')
  }
  if (mesh.geometryComplexity === 'complex' || mesh.geometryComplexity === 'freeform') {
    score += 20
    warnings.push('complexGeometry')
    recommendations.push('increaseBuffer')
  }
  if (mesh.hasDeepCavities || mesh.hasInternalFeatures) {
    score += 20
    warnings.push('hiddenGeometry')
    recommendations.push('ctOrDestructive')
  }
  if (mesh.hasThinWalls) {
    score += 10
    warnings.push('thinWalls')
    recommendations.push('deformationRisk')
  }
  if ((mesh.toleranceMm ?? 1) <= 0.05) {
    score += 15
    warnings.push('tightTolerance')
    recommendations.push('metrologyWorkflow')
  }

  const clamped = Math.min(100, score)
  const level = clamped >= 75 ? 'critical' : clamped >= 55 ? 'high' : clamped >= 30 ? 'medium' : 'low'
  const recommendedMethod: ScanningMethod = mesh.hasInternalFeatures || mesh.requiresCtScan
    ? 'ct_scan'
    : mesh.precisionLevel === 'metrology'
      ? 'cmm'
      : mesh.geometryComplexity === 'freeform'
        ? 'structured_light'
        : mesh.scanningMethod

  return { score: clamped, level, warnings, recommendations, recommendedMethod }
}

function totalHours(project: Project): number {
  const te = project.timeEstimation
  return [
    te.preparationEntry,
    te.scanningEntry,
    te.meshProcessingEntry,
    te.cadEntry,
    te.inspectionEntry,
    te.reportingEntry,
    te.managementEntry,
    te.travelEntry,
  ].reduce((sum, entry) => sum + entry.hours, 0)
}

export default function AdvancedFeaturesModule({ project, onChange }: Props) {
  const { t } = useTranslation()
  const features = project.advancedFeatures
  const calculatedRisk = useMemo(() => calculateRisk(project), [project])
  const hours = totalHours(project)

  const patch = (patchValue: Partial<AdvancedProjectFeatures>) => {
    onChange({ ...features, ...patchValue })
  }

  const updateCompliance = (patchValue: Partial<AdvancedProjectFeatures['compliance']>) =>
    patch({ compliance: { ...features.compliance, ...patchValue } })

  const updateAi = (patchValue: Partial<AdvancedProjectFeatures['aiAssistance']>) =>
    patch({ aiAssistance: { ...features.aiAssistance, ...patchValue } })

  const updateCloud = (patchValue: Partial<AdvancedProjectFeatures['cloudDelivery']>) =>
    patch({ cloudDelivery: { ...features.cloudDelivery, ...patchValue } })

  const updateIntegrations = (patchValue: Partial<AdvancedProjectFeatures['businessIntegrations']>) =>
    patch({ businessIntegrations: { ...features.businessIntegrations, ...patchValue } })

  const updatePlatform = (patchValue: Partial<AdvancedProjectFeatures['platformWorkflow']>) =>
    patch({ platformWorkflow: { ...features.platformWorkflow, ...patchValue } })

  return (
    <SectionCard title={t('advanced.roadmapTitle')} subtitle={t('advanced.roadmapSubtitle')} icon={<AutoAwesomeIcon />}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.lifecycleApprovals')}</Typography>
              <TextField
                select
                label={t('advanced.workflowStage')}
                value={features.workflowStage}
                onChange={(e) => patch({ workflowStage: e.target.value as AdvancedProjectFeatures['workflowStage'] })}
                fullWidth
                sx={{ mt: 2 }}
              >
                {WORKFLOW_STAGES.map((stage) => <MenuItem key={stage} value={stage}>{t(`advanced.workflowStages.${stage}`)}</MenuItem>)}
              </TextField>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('advanced.approvalRecords')}: {features.approvals.length}; {t('advanced.checklistCompletion')}: {features.checklist.filter((i) => i.completed).length}/{features.checklist.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.quotesRateCards')}</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                {features.quoteVariants.map((variant) => (
                  <Chip key={variant.id} label={`${variant.name}: ${variant.totalPrice} ${variant.currency}`} />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('advanced.rateCardEntries')}: {features.rateCard.length}; {t('advanced.estimatedHours')}: {hours.toFixed(1)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>{t('advanced.scanRiskRecommendation')}</Typography>
                <Chip color={calculatedRisk.level === 'critical' ? 'error' : calculatedRisk.level === 'high' ? 'warning' : 'default'} label={`${calculatedRisk.score}/100 ${t(`advanced.riskLevels.${calculatedRisk.level}`)}`} />
              </Stack>
              <Alert severity="info" sx={{ mt: 2 }}>
                {t('advanced.recommendedMethod')}: {t(`mesh.methods.${calculatedRisk.recommendedMethod}`, { defaultValue: calculatedRisk.recommendedMethod })}
              </Alert>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {calculatedRisk.warnings.map((warning) => <Chip key={warning} size="small" label={t(`advanced.riskWarnings.${warning}`)} />)}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.cadReDelivery')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('advanced.reSoftwareSelected')}: {project.reCadPostprocessing.reverseEngineeringSoftware.length || 0}; {t('advanced.manifestItems')}: {features.deliveryManifest.length}; {t('advanced.cadCompatibilityNotes')}: {features.cadCompatibility.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('advanced.reSoftwareSupport')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.capacityKpiReporting')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('advanced.resources')}: {features.capacityResources.length}; {t('advanced.revenue')}: {features.kpiSnapshot.estimatedRevenue}; {t('advanced.margin')}: {features.kpiSnapshot.marginPercent}%
              </Typography>
              <TextField
                select
                label={t('advanced.overdueRisk')}
                value={features.kpiSnapshot.overdueRisk}
                onChange={(e) => patch({ kpiSnapshot: { ...features.kpiSnapshot, overdueRisk: e.target.value as AdvancedProjectFeatures['kpiSnapshot']['overdueRisk'] } })}
                fullWidth
                sx={{ mt: 2 }}
              >
                {['low', 'medium', 'high'].map((risk) => <MenuItem key={risk} value={risk}>{t(`advanced.riskLevels.${risk}`)}</MenuItem>)}
              </TextField>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.cloudIntegrations')}</Typography>
              <TextField label={t('advanced.cloudTargetPath')} value={features.cloudDelivery.targetPath} onChange={(e) => updateCloud({ targetPath: e.target.value })} fullWidth sx={{ mt: 2 }} />
              <Grid container spacing={1} sx={{ mt: 0 }}>
                <Grid item xs={6}><TextField label="CRM" value={features.businessIntegrations.crmSystem} onChange={(e) => updateIntegrations({ crmSystem: e.target.value })} fullWidth /></Grid>
                <Grid item xs={6}><TextField label={t('advanced.accounting')} value={features.businessIntegrations.accountingSystem} onChange={(e) => updateIntegrations({ accountingSystem: e.target.value })} fullWidth /></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.aiAssistedWork')}</Typography>
              <Stack>
                <FormControlLabel control={<Switch checked={features.aiAssistance.generateTechnicalSummary} onChange={(e) => updateAi({ generateTechnicalSummary: e.target.checked })} />} label={t('advanced.generateTechnicalSummary')} />
                <FormControlLabel control={<Switch checked={features.aiAssistance.checkConsistency} onChange={(e) => updateAi({ checkConsistency: e.target.checked })} />} label={t('advanced.checkProjectConsistency')} />
                <FormControlLabel control={<Switch checked={features.aiAssistance.translateNotes} onChange={(e) => updateAi({ translateNotes: e.target.checked })} />} label={t('advanced.translateNotes')} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{t('advanced.securityCompliance')}</Typography>
              <TextField
                select
                label={t('advanced.confidentiality')}
                value={features.compliance.confidentiality}
                onChange={(e) => updateCompliance({ confidentiality: e.target.value as AdvancedProjectFeatures['compliance']['confidentiality'] })}
                fullWidth
                sx={{ mt: 2 }}
              >
                {['public', 'internal', 'confidential', 'nda'].map((level) => <MenuItem key={level} value={level}>{t(`advanced.confidentialityLevels.${level}`)}</MenuItem>)}
              </TextField>
              <Divider sx={{ my: 1.5 }} />
              <Stack>
                <FormControlLabel control={<Switch checked={features.compliance.lockAfterSignature} onChange={(e) => updateCompliance({ lockAfterSignature: e.target.checked })} />} label={t('advanced.lockAfterSignature')} />
                <FormControlLabel control={<Switch checked={features.platformWorkflow.mobilePhotoMode} onChange={(e) => updatePlatform({ mobilePhotoMode: e.target.checked })} />} label={t('advanced.mobilePhotoMode')} />
                <FormControlLabel control={<Switch checked={features.platformWorkflow.desktopSecureStorage} onChange={(e) => updatePlatform({ desktopSecureStorage: e.target.checked })} />} label={t('advanced.desktopSecureStorage')} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="success">
            {t('advanced.centralizedSummary')}
          </Alert>
        </Grid>
      </Grid>
    </SectionCard>
  )
}
