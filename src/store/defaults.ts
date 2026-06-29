import type {
  MeshAssessment,
  RECadPostprocessing,
  TimeEstimation,
  Deliverables,
  ObjectSpec,
  Project,
  NativeCadSpec,
  AdvancedProjectFeatures,
} from '@/types'
import { v4 as uuidv4 } from 'uuid'

export const defaultMeshAssessment = (): MeshAssessment => ({
  scanningMethod: 'structured_light',
  precisionLevel: 'standard',
  toleranceMm: null,
  requiresCtScan: false,
  requiresDestructive: false,
  referenceTargets: 'none',
  hasDeepCavities: false,
  hasThinWalls: false,
  scanningDifficulty: 'medium',
  surfaceFinish: 'matte',
  surfacePrepRequired: false,
  surfacePrepMethod: '',
  geometryComplexity: 'moderate',
  hasUndercutFeatures: false,
  hasInternalFeatures: false,
  estimatedScanningHours: null,
  notes: '',
})

export const defaultRECad = (): RECadPostprocessing => ({
  strategy: 'as_built',
  surfacingMethod: 'auto_surfacing',
  featureBasedModeling: false,
  sketches2D: false,
  drawingRequired: false,
  toleranceAnalysis: false,
  selectedCadFormats: [],
  meshProcessingTasks: {
    errorCleaning: true,
    smoothing: false,
    coordinateAlignment: true,
    dataOptimization: false,
    watertight: false,
    decimation: false,
  },
  reverseEngineeringSoftware: [],
  reverseEngineeringSoftwareOther: '',
  scanToCadPreparationNotes: '',
  estimatedCadHours: null,
  notes: '',
})

export const defaultTimeEstimation = (): TimeEstimation => ({
  mode: 'auto',
  currency: 'EUR',
  preparationEntry: { label: 'Preparation', hours: 0, rate: 50 },
  scanningEntry: { label: 'Scanning', hours: 0, rate: 65 },
  meshProcessingEntry: { label: 'Mesh Processing', hours: 0, rate: 55 },
  cadEntry: { label: 'CAD Processing', hours: 0, rate: 60 },
  inspectionEntry: { label: 'Inspection', hours: 0, rate: 55 },
  reportingEntry: { label: 'Reporting', hours: 0, rate: 55 },
  managementEntry: { label: 'Project Management', hours: 0, rate: 50 },
  travelEntry: { label: 'Travel', hours: 0, rate: 45 },
  overhead: 10,
  discount: 0,
})

export const defaultDeliverables = (): Deliverables => ({
  rawMeshFormats: [],
  optimizedMeshFormats: [],
  cadFormats: [],
  inspectionFormats: [],
  formats2D: [],
  cloudUpload: false,
  physicalMedia: false,
  deliveryNotes: '',
  deadline: null,
})

export const defaultObjectSpec = (): ObjectSpec => ({
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

export const defaultNativeCadSpec = (): NativeCadSpec => ({
  required: false,
  system: null,
  version: '',
  useCustomTemplates: false,
  templateNotes: '',
  drawingStandard: 'ISO',
  customDrawingStandard: '',
  sheetMetalRequired: false,
  sheetMetalKFactor: null,
  featureTreeRequired: true,
  parametricRelations: true,
  assemblyConstraints: false,
  notes: '',
})


export const defaultAdvancedFeatures = (): AdvancedProjectFeatures => ({
  workflowStage: 'draft',
  approvals: [],
  checklist: [
    { id: 'project-basic', area: 'project', label: 'Project header completed', completed: false, required: true },
    { id: 'object-basic', area: 'object', label: 'Object and dimensions documented', completed: false, required: true },
    { id: 'mesh-risk', area: 'mesh', label: 'Scan risks reviewed', completed: false, required: true },
    { id: 'recad-output', area: 'recad', label: 'RE software and CAD outputs selected', completed: false, required: true },
    { id: 'deliverables-deadline', area: 'deliverables', label: 'Deliverables and deadline confirmed', completed: false, required: true },
  ],
  quoteVariants: [
    { id: 'basic', name: 'basic', description: 'Raw/optimized mesh and basic cleanup', includedDeliverables: ['Raw mesh', 'Optimized mesh'], totalPrice: 0, currency: 'EUR' },
    { id: 'standard', name: 'standard', description: 'Mesh cleanup plus neutral CAD output', includedDeliverables: ['Optimized mesh', 'STEP/IGES'], totalPrice: 0, currency: 'EUR' },
    { id: 'premium', name: 'premium', description: 'Parametric CAD, drawings and inspection support', includedDeliverables: ['Parametric CAD', '2D drawing', 'Inspection report'], totalPrice: 0, currency: 'EUR' },
  ],
  rateCard: [
    { id: 'scanning', label: 'Scanning', hourlyRate: 65, currency: 'EUR' },
    { id: 'mesh', label: 'Mesh processing', hourlyRate: 55, currency: 'EUR' },
    { id: 'cad', label: 'CAD reconstruction', hourlyRate: 60, currency: 'EUR' },
  ],
  scanRisk: { score: 0, level: 'low', warnings: [], recommendations: [], recommendedMethod: 'structured_light' },
  materialKnowledge: [],
  deliveryManifest: [],
  cadCompatibility: [],
  capacityResources: [],
  kpiSnapshot: { estimatedRevenue: 0, estimatedHours: 0, marginPercent: 0, overdueRisk: 'low' },
  cloudDelivery: { provider: 'other', targetPath: '', shareUrl: '', expiresAt: null },
  businessIntegrations: { crmSystem: '', accountingSystem: '', exportFormat: 'csv' },
  aiAssistance: { generateTechnicalSummary: true, checkConsistency: true, translateNotes: false, lastSummary: '' },
  compliance: { confidentiality: 'internal', watermark: '', lockAfterSignature: true, invalidateSignaturesOnChange: true },
  platformWorkflow: { mobilePhotoMode: true, desktopSecureStorage: true, autoBackupPath: '' },
})

export const createDefaultProject = (protocolNumber?: string): Project => {
  const now = new Date().toISOString()
  const year = new Date().getFullYear()
  return {
    id: uuidv4(),
    protocolNumber: protocolNumber ?? `RE-${year}-0001`,
    title: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    realizator: null,
    ziadatel: null,
    objectSpecs: [defaultObjectSpec()],
    meshAssessment: defaultMeshAssessment(),
    reCadPostprocessing: defaultRECad(),
    timeEstimation: defaultTimeEstimation(),
    deliverables: defaultDeliverables(),
    nativeCadSpec: defaultNativeCadSpec(),
    internalNotes: '',
    realizatorSignature: null,
    ziadatelSignature: null,
    signedAt: null,
    startDate: null,
    version: 1,
    auditLog: [{ id: uuidv4(), at: now, action: 'created', details: 'Project created' }],
    revisions: [{ version: 1, savedAt: now, summary: 'Initial version' }],
    advancedFeatures: defaultAdvancedFeatures(),
  }
}
