// ─── Company / Profile ────────────────────────────────────────────────────────

export interface CompanyProfile {
  id: string
  name: string
  address: string
  city: string
  zip: string
  country: string
  ico: string        // Business ID (IČO)
  dic: string        // Tax ID (DIČ)
  phone: string
  email: string
  website: string
  contactPerson: string
  logoBase64: string | null
}

export type CompanyRole = 'realizator' | 'ziadatel'

// ─── Object / Media ────────────────────────────────────────────────────────────

export interface ObjectImage {
  id: string
  dataBase64: string
  mimeType: string
  description: string
  takenAt: string | null  // ISO date string
}

export interface BoundingBox {
  x: number | null
  y: number | null
  z: number | null
  unit: 'mm' | 'cm' | 'm' | 'inch'
}

export type REPurpose = 'spare_part' | 'design_innovation' | 'archiving' | 'documentation' | 'inspection' | 'other'

export interface Model3D {
  dataBase64: string
  format: 'stl' | 'obj'
  filename: string
  filesize: number
}

export interface ObjectSpec {
  name: string
  partNumber: string
  serialNumber: string
  material: string
  images: ObjectImage[]
  boundingBox: BoundingBox
  notes: string
  rePurpose: REPurpose[]
  rePurposeNotes: string
  model3D: Model3D | null
}

// ─── Mesh Assessment Module ────────────────────────────────────────────────────

export type ScanningDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type SurfaceFinish = 'matte' | 'glossy' | 'reflective' | 'transparent' | 'mixed'
export type GeometryComplexity = 'simple' | 'moderate' | 'complex' | 'freeform'
export type ScanningMethod = 'structured_light' | 'laser_line' | 'ct_scan' | 'photogrammetry' | 'cmm' | 'handheld'
export type PrecisionLevel = 'standard' | 'high_precision' | 'metrology'
export type ReferenceTargets = 'none' | 'coded' | 'uncoded' | 'both'

export interface MeshAssessment {
  scanningMethod: ScanningMethod
  precisionLevel: PrecisionLevel
  toleranceMm: number | null
  requiresCtScan: boolean
  requiresDestructive: boolean
  referenceTargets: ReferenceTargets
  hasDeepCavities: boolean
  hasThinWalls: boolean
  scanningDifficulty: ScanningDifficulty
  surfaceFinish: SurfaceFinish
  surfacePrepRequired: boolean
  surfacePrepMethod: string
  geometryComplexity: GeometryComplexity
  hasUndercutFeatures: boolean
  hasInternalFeatures: boolean
  estimatedScanningHours: number | null
  notes: string
}

// ─── RE & CAD Postprocessing Module ───────────────────────────────────────────

export type REStrategy = 'as_built' | 'design_intent'
export type SurfacingMethod = 'auto_surfacing' | 'parametric_solid' | 'hybrid'
export type CadOutputFormat =
  | 'CATIA_V5'
  | 'CATIA_V6'
  | 'SOLIDWORKS'
  | 'NX'
  | 'SOLIDEDGE'
  | 'INVENTOR'
  | 'CREO'
  | 'STEP'
  | 'IGES'
  | 'PARASOLID'

export type ReverseEngineeringSoftware = 'GEOMAGIC_DESIGN_X' | 'QUICKSURFACE' | 'POLYWORKS' | 'RHINO' | 'RHINO_MESHSURFACE' | 'OTHER'

export interface MeshProcessingTasks {
  errorCleaning: boolean
  smoothing: boolean
  coordinateAlignment: boolean
  dataOptimization: boolean
  watertight: boolean
  decimation: boolean
}

export interface RECadPostprocessing {
  strategy: REStrategy
  surfacingMethod: SurfacingMethod
  featureBasedModeling: boolean
  sketches2D: boolean
  drawingRequired: boolean
  toleranceAnalysis: boolean
  selectedCadFormats: CadOutputFormat[]
  meshProcessingTasks: MeshProcessingTasks
  reverseEngineeringSoftware: ReverseEngineeringSoftware[]
  reverseEngineeringSoftwareOther: string
  scanToCadPreparationNotes: string
  estimatedCadHours: number | null
  notes: string
}

// ─── Time Estimation Module ───────────────────────────────────────────────────

export type EstimationMode = 'auto' | 'manual'

export interface TimeEntry {
  label: string
  hours: number
  rate: number       // EUR / hour
}

export interface TimeEstimation {
  mode: EstimationMode
  currency: 'EUR' | 'USD' | 'CZK'
  preparationEntry: TimeEntry
  scanningEntry: TimeEntry
  meshProcessingEntry: TimeEntry
  cadEntry: TimeEntry
  inspectionEntry: TimeEntry
  reportingEntry: TimeEntry
  managementEntry: TimeEntry
  travelEntry: TimeEntry
  overhead: number   // percentage 0–100
  discount: number   // percentage 0–100
}

// ─── Deliverables Module ──────────────────────────────────────────────────────

export type MeshFormat = 'STL' | 'OBJ' | 'PLY' | 'E57' | 'FBX' | '3MF'
export type InspectionFormat = 'COLOR_MAP' | 'DIMENSION_REPORT_PDF' | 'GD_T' | 'FIRST_ARTICLE' | 'NOMINAL_ACTUAL'
export type Format2D = 'PDF_DRAWING' | 'DXF' | 'DWG' | 'TIFF'

export interface Deliverables {
  rawMeshFormats: MeshFormat[]
  optimizedMeshFormats: MeshFormat[]
  cadFormats: CadOutputFormat[]
  inspectionFormats: InspectionFormat[]
  formats2D: Format2D[]
  cloudUpload: boolean
  physicalMedia: boolean
  deliveryNotes: string
  deadline: string | null  // ISO date string
}

// ─── Native CAD Spec ──────────────────────────────────────────────────────────

export type CadSystem = 'NX' | 'SOLIDWORKS' | 'INVENTOR' | 'CATIA_V5' | 'CATIA_V6' | 'CREO' | 'SOLIDEDGE' | 'FUSION360'
export type DrawingStandard = 'ISO' | 'ANSI' | 'DIN' | 'custom'

export interface NativeCadSpec {
  required: boolean
  system: CadSystem | null
  version: string
  useCustomTemplates: boolean
  templateNotes: string
  drawingStandard: DrawingStandard
  customDrawingStandard: string
  sheetMetalRequired: boolean
  sheetMetalKFactor: number | null
  featureTreeRequired: boolean
  parametricRelations: boolean
  assemblyConstraints: boolean
  notes: string
}

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'draft' | 'in_review' | 'approved' | 'completed' | 'archived'

export interface AuditEntry {
  id: string
  at: string
  action: string
  details: string
}

export interface ProjectRevision {
  version: number
  savedAt: string
  summary: string
}


export type WorkflowStage =
  | 'draft'
  | 'ready_for_review'
  | 'internal_review'
  | 'client_approval'
  | 'approved'
  | 'in_production'
  | 'delivered'
  | 'closed'

export interface ProjectApproval {
  id: string
  role: 'internal_reviewer' | 'client' | 'quality'
  name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  decidedAt: string | null
  comment: string
}

export interface QualityChecklistItem {
  id: string
  area: 'project' | 'object' | 'mesh' | 'recad' | 'time' | 'deliverables' | 'nativecad'
  label: string
  completed: boolean
  required: boolean
}

export interface QuoteVariant {
  id: string
  name: 'basic' | 'standard' | 'premium' | string
  description: string
  includedDeliverables: string[]
  totalPrice: number
  currency: TimeEstimation['currency']
}

export interface RateCardItem {
  id: string
  label: string
  hourlyRate: number
  currency: TimeEstimation['currency']
}

export interface ScanRiskAssessment {
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  warnings: string[]
  recommendations: string[]
  recommendedMethod: ScanningMethod
}

export interface MaterialKnowledge {
  material: string
  scanability: 'easy' | 'medium' | 'hard'
  surfacePreparation: string
  typicalToleranceMm: number | null
  notes: string
}

export interface DeliveryManifestItem {
  id: string
  filename: string
  type: 'mesh' | 'cad' | 'drawing' | 'inspection' | 'report' | 'other'
  format: string
  status: 'planned' | 'generated' | 'delivered'
  checksum: string | null
  notes: string
}

export interface CadCompatibilityNote {
  id: string
  cadSystem: CadSystem
  recommendedFormats: CadOutputFormat[]
  risk: 'low' | 'medium' | 'high'
  note: string
}

export interface CapacityResource {
  id: string
  name: string
  role: string
  weeklyHours: number
  unavailableDates: string[]
}

export interface ProjectKpiSnapshot {
  estimatedRevenue: number
  estimatedHours: number
  marginPercent: number
  overdueRisk: 'low' | 'medium' | 'high'
}

export interface CloudDeliveryTarget {
  provider: 'onedrive' | 'google_drive' | 'dropbox' | 's3' | 'nas' | 'other'
  targetPath: string
  shareUrl: string
  expiresAt: string | null
}

export interface BusinessIntegrationSettings {
  crmSystem: string
  accountingSystem: string
  exportFormat: 'csv' | 'json' | 'xlsx'
}

export interface AiAssistanceSettings {
  generateTechnicalSummary: boolean
  checkConsistency: boolean
  translateNotes: boolean
  lastSummary: string
}

export interface ComplianceSettings {
  confidentiality: 'public' | 'internal' | 'confidential' | 'nda'
  watermark: string
  lockAfterSignature: boolean
  invalidateSignaturesOnChange: boolean
}

export interface PlatformWorkflowSettings {
  mobilePhotoMode: boolean
  desktopSecureStorage: boolean
  autoBackupPath: string
}

export interface AdvancedProjectFeatures {
  workflowStage: WorkflowStage
  approvals: ProjectApproval[]
  checklist: QualityChecklistItem[]
  quoteVariants: QuoteVariant[]
  rateCard: RateCardItem[]
  scanRisk: ScanRiskAssessment
  materialKnowledge: MaterialKnowledge[]
  deliveryManifest: DeliveryManifestItem[]
  cadCompatibility: CadCompatibilityNote[]
  capacityResources: CapacityResource[]
  kpiSnapshot: ProjectKpiSnapshot
  cloudDelivery: CloudDeliveryTarget
  businessIntegrations: BusinessIntegrationSettings
  aiAssistance: AiAssistanceSettings
  compliance: ComplianceSettings
  platformWorkflow: PlatformWorkflowSettings
}

export interface Project {
  id: string
  protocolNumber: string
  title: string
  status: ProjectStatus
  createdAt: string   // ISO date string
  updatedAt: string   // ISO date string
  realizator: CompanyProfile | null
  ziadatel: CompanyProfile | null
  objectSpec?: ObjectSpec        // legacy – migrated to objectSpecs on load
  objectSpecs: ObjectSpec[]
  meshAssessment: MeshAssessment
  reCadPostprocessing: RECadPostprocessing
  timeEstimation: TimeEstimation
  deliverables: Deliverables
  nativeCadSpec: NativeCadSpec
  internalNotes: string
  realizatorSignature: string | null   // base64 PNG
  ziadatelSignature: string | null     // base64 PNG
  signedAt: string | null
  startDate: string | null
  version: number
  auditLog: AuditEntry[]
  revisions: ProjectRevision[]
  advancedFeatures: AdvancedProjectFeatures
}

// ─── Project Templates ────────────────────────────────────────────────────────

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  createdAt: string
  meshAssessment: MeshAssessment
  reCadPostprocessing: RECadPostprocessing
  timeEstimation: TimeEstimation
  deliverables: Deliverables
  nativeCadSpec: NativeCadSpec
}

// ─── App-level State ──────────────────────────────────────────────────────────

export type AppLanguage = 'sk' | 'en' | 'de'
export type AppThemeMode = 'light' | 'dark'

export interface AppSettings {
  language: AppLanguage
  themeMode: AppThemeMode
  defaultRealizatorId: string | null
  anthropicApiKey: string
}

// ─── File Format ──────────────────────────────────────────────────────────────

export interface ReprojFilePayload {
  version: string
  exportedAt: string
  project: Project
  companyProfiles: CompanyProfile[]
}

export interface CompanyExportPayload {
  version: string
  exportedAt: string
  profiles: CompanyProfile[]
}
