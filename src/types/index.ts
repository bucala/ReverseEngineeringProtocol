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

export interface ObjectSpec {
  name: string
  partNumber: string
  material: string
  images: ObjectImage[]
  boundingBox: BoundingBox
  notes: string
}

// ─── Mesh Assessment Module ────────────────────────────────────────────────────

export type ScanningDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type SurfaceFinish = 'matte' | 'glossy' | 'reflective' | 'transparent' | 'mixed'
export type GeometryComplexity = 'simple' | 'moderate' | 'complex' | 'freeform'

export interface MeshAssessment {
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

export interface RECadPostprocessing {
  strategy: REStrategy
  surfacingMethod: SurfacingMethod
  featureBasedModeling: boolean
  sketches2D: boolean
  drawingRequired: boolean
  toleranceAnalysis: boolean
  selectedCadFormats: CadOutputFormat[]
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
  scanningEntry: TimeEntry
  meshProcessingEntry: TimeEntry
  cadEntry: TimeEntry
  inspectionEntry: TimeEntry
  managementEntry: TimeEntry
  travelEntry: TimeEntry
  overhead: number   // percentage 0–100
  discount: number   // percentage 0–100
}

// ─── Deliverables Module ──────────────────────────────────────────────────────

export type MeshFormat = 'STL' | 'OBJ' | 'PLY' | 'E57' | 'FBX' | '3MF'
export type InspectionFormat = 'COLOR_MAP' | 'DRAWING_2D' | 'REPORT_PDF' | 'GD_T'

export interface Deliverables {
  rawMeshFormats: MeshFormat[]
  optimizedMeshFormats: MeshFormat[]
  cadFormats: CadOutputFormat[]
  inspectionFormats: InspectionFormat[]
  cloudUpload: boolean
  physicalMedia: boolean
  deliveryNotes: string
  deadline: string | null  // ISO date string
}

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'draft' | 'in_review' | 'approved' | 'completed' | 'archived'

export interface Project {
  id: string
  protocolNumber: string
  title: string
  status: ProjectStatus
  createdAt: string   // ISO date string
  updatedAt: string   // ISO date string
  realizator: CompanyProfile | null
  ziadatel: CompanyProfile | null
  objectSpec: ObjectSpec
  meshAssessment: MeshAssessment
  reCadPostprocessing: RECadPostprocessing
  timeEstimation: TimeEstimation
  deliverables: Deliverables
  internalNotes: string
}

// ─── App-level State ──────────────────────────────────────────────────────────

export type AppLanguage = 'sk' | 'en' | 'de'
export type AppThemeMode = 'light' | 'dark'

export interface AppSettings {
  language: AppLanguage
  themeMode: AppThemeMode
  defaultRealizatorId: string | null
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
