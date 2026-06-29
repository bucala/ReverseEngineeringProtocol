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
    warnings.push('Difficult optical surface')
    recommendations.push('Plan matting spray or CT/CMM fallback')
  }
  if (mesh.geometryComplexity === 'complex' || mesh.geometryComplexity === 'freeform') {
    score += 20
    warnings.push('Complex/freeform geometry')
    recommendations.push('Increase mesh cleanup and CAD reconstruction buffer')
  }
  if (mesh.hasDeepCavities || mesh.hasInternalFeatures) {
    score += 20
    warnings.push('Hidden/internal geometry')
    recommendations.push('Evaluate CT scan or destructive method')
  }
  if (mesh.hasThinWalls) {
    score += 10
    warnings.push('Thin walls')
    recommendations.push('Add handling/deformation risk note')
  }
  if ((mesh.toleranceMm ?? 1) <= 0.05) {
    score += 15
    warnings.push('Tight tolerance')
    recommendations.push('Use metrology workflow and reference targets')
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
    <SectionCard title="Advanced roadmap features" subtitle="Workflow, quotes, risk scoring, delivery, integrations, AI and compliance" icon={<AutoAwesomeIcon />}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>1. Lifecycle & approvals</Typography>
              <TextField
                select
                label="Workflow stage"
                value={features.workflowStage}
                onChange={(e) => patch({ workflowStage: e.target.value as AdvancedProjectFeatures['workflowStage'] })}
                fullWidth
                sx={{ mt: 2 }}
              >
                {WORKFLOW_STAGES.map((stage) => <MenuItem key={stage} value={stage}>{stage}</MenuItem>)}
              </TextField>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Approval records: {features.approvals.length}; checklist completion: {features.checklist.filter((i) => i.completed).length}/{features.checklist.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>2. Quotes & rate cards</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                {features.quoteVariants.map((variant) => (
                  <Chip key={variant.id} label={`${variant.name}: ${variant.totalPrice} ${variant.currency}`} />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Rate card entries: {features.rateCard.length}; estimated hours: {hours.toFixed(1)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>3. Scan risk & method recommendation</Typography>
                <Chip color={calculatedRisk.level === 'critical' ? 'error' : calculatedRisk.level === 'high' ? 'warning' : 'default'} label={`${calculatedRisk.score}/100 ${calculatedRisk.level}`} />
              </Stack>
              <Alert severity="info" sx={{ mt: 2 }}>
                Recommended method: {calculatedRisk.recommendedMethod}
              </Alert>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {calculatedRisk.warnings.map((warning) => <Chip key={warning} size="small" label={warning} />)}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>4. CAD, RE software & delivery manifest</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                RE software selected: {project.reCadPostprocessing.reverseEngineeringSoftware.length || 0}; manifest items: {features.deliveryManifest.length}; CAD compatibility notes: {features.cadCompatibility.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports Geomagic Design X, QUICKSURFACE, PolyWorks, Rhino and Rhino + Meshsurface in the RE/CAD step.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>5. Capacity, KPI & reporting</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Resources: {features.capacityResources.length}; revenue: {features.kpiSnapshot.estimatedRevenue}; margin: {features.kpiSnapshot.marginPercent}%
              </Typography>
              <TextField
                select
                label="Overdue risk"
                value={features.kpiSnapshot.overdueRisk}
                onChange={(e) => patch({ kpiSnapshot: { ...features.kpiSnapshot, overdueRisk: e.target.value as AdvancedProjectFeatures['kpiSnapshot']['overdueRisk'] } })}
                fullWidth
                sx={{ mt: 2 }}
              >
                {['low', 'medium', 'high'].map((risk) => <MenuItem key={risk} value={risk}>{risk}</MenuItem>)}
              </TextField>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>6. Cloud, CRM/accounting & CAD/PDM integrations</Typography>
              <TextField label="Cloud target path" value={features.cloudDelivery.targetPath} onChange={(e) => updateCloud({ targetPath: e.target.value })} fullWidth sx={{ mt: 2 }} />
              <Grid container spacing={1} sx={{ mt: 0 }}>
                <Grid item xs={6}><TextField label="CRM" value={features.businessIntegrations.crmSystem} onChange={(e) => updateIntegrations({ crmSystem: e.target.value })} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="Accounting" value={features.businessIntegrations.accountingSystem} onChange={(e) => updateIntegrations({ accountingSystem: e.target.value })} fullWidth /></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>7. AI assisted protocol work</Typography>
              <Stack>
                <FormControlLabel control={<Switch checked={features.aiAssistance.generateTechnicalSummary} onChange={(e) => updateAi({ generateTechnicalSummary: e.target.checked })} />} label="Generate technical summary" />
                <FormControlLabel control={<Switch checked={features.aiAssistance.checkConsistency} onChange={(e) => updateAi({ checkConsistency: e.target.checked })} />} label="Check project consistency" />
                <FormControlLabel control={<Switch checked={features.aiAssistance.translateNotes} onChange={(e) => updateAi({ translateNotes: e.target.checked })} />} label="Translate notes" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>8. Security, compliance, mobile & desktop</Typography>
              <TextField
                select
                label="Confidentiality"
                value={features.compliance.confidentiality}
                onChange={(e) => updateCompliance({ confidentiality: e.target.value as AdvancedProjectFeatures['compliance']['confidentiality'] })}
                fullWidth
                sx={{ mt: 2 }}
              >
                {['public', 'internal', 'confidential', 'nda'].map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
              </TextField>
              <Divider sx={{ my: 1.5 }} />
              <Stack>
                <FormControlLabel control={<Switch checked={features.compliance.lockAfterSignature} onChange={(e) => updateCompliance({ lockAfterSignature: e.target.checked })} />} label="Lock after signature" />
                <FormControlLabel control={<Switch checked={features.platformWorkflow.mobilePhotoMode} onChange={(e) => updatePlatform({ mobilePhotoMode: e.target.checked })} />} label="Mobile photo mode" />
                <FormControlLabel control={<Switch checked={features.platformWorkflow.desktopSecureStorage} onChange={(e) => updatePlatform({ desktopSecureStorage: e.target.checked })} />} label="Desktop secure storage" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="success">
            This module centralizes all 12 proposed roadmap areas as structured project data: lifecycle, quotes, scan intelligence, CAD/delivery, media, planning, reporting, integrations, AI, compliance, revisions and mobile/desktop workflows.
          </Alert>
        </Grid>
      </Grid>
    </SectionCard>
  )
}
