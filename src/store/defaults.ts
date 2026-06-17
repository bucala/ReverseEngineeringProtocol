import type {
  MeshAssessment,
  RECadPostprocessing,
  TimeEstimation,
  Deliverables,
  ObjectSpec,
  Project,
  NativeCadSpec,
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

export const createDefaultProject = (): Project => {
  const now = new Date().toISOString()
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return {
    id: uuidv4(),
    protocolNumber: `RE-${year}-${random}`,
    title: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    realizator: null,
    ziadatel: null,
    objectSpec: defaultObjectSpec(),
    meshAssessment: defaultMeshAssessment(),
    reCadPostprocessing: defaultRECad(),
    timeEstimation: defaultTimeEstimation(),
    deliverables: defaultDeliverables(),
    nativeCadSpec: defaultNativeCadSpec(),
    internalNotes: '',
  }
}
