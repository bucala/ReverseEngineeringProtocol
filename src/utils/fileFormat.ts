import type { ReprojFilePayload, CompanyExportPayload, Project, CompanyProfile } from '@/types'
import { encrypt, decrypt } from './crypto'

const REPROJ_VERSION = '1.0'
const COMPANY_EXPORT_VERSION = '1.0'
const MAX_IMPORT_SIZE = 50 * 1024 * 1024

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function validateCompanyProfile(value: unknown): CompanyProfile {
  if (!isRecord(value) || !isString(value.id) || !isString(value.name)) {
    throw new Error('Invalid company profile')
  }
  return {
    id: value.id,
    name: value.name,
    address: isString(value.address) ? value.address : '',
    city: isString(value.city) ? value.city : '',
    zip: isString(value.zip) ? value.zip : '',
    country: isString(value.country) ? value.country : '',
    ico: isString(value.ico) ? value.ico : '',
    dic: isString(value.dic) ? value.dic : '',
    phone: isString(value.phone) ? value.phone : '',
    email: isString(value.email) ? value.email : '',
    website: isString(value.website) ? value.website : '',
    contactPerson: isString(value.contactPerson) ? value.contactPerson : '',
    logoBase64: isString(value.logoBase64) ? value.logoBase64 : null,
  }
}

function validateProject(value: unknown): Project {
  if (!isRecord(value) || !isString(value.id) || !isString(value.protocolNumber)) {
    throw new Error('Invalid project structure')
  }
  const requiredObjects = ['meshAssessment', 'reCadPostprocessing', 'timeEstimation', 'deliverables', 'nativeCadSpec']
  for (const key of requiredObjects) {
    if (!isRecord(value[key])) throw new Error(`Invalid project: missing ${key}`)
  }
  if (!Array.isArray(value.objectSpecs) && !isRecord(value.objectSpec)) {
    throw new Error('Invalid project: missing object specifications')
  }
  return value as unknown as Project
}

function validateReprojPayload(value: unknown): ReprojFilePayload {
  if (!isRecord(value) || !isString(value.version) || !isRecord(value.project)) {
    throw new Error('Invalid .reproj file structure')
  }
  return {
    version: value.version,
    exportedAt: isString(value.exportedAt) ? value.exportedAt : new Date().toISOString(),
    project: validateProject(value.project),
    companyProfiles: Array.isArray(value.companyProfiles)
      ? value.companyProfiles.map(validateCompanyProfile)
      : [],
  }
}

// ─── .reproj (encrypted project) ─────────────────────────────────────────────

export async function exportReproj(
  project: Project,
  companyProfiles: CompanyProfile[],
  password: string
): Promise<Blob> {
  const payload: ReprojFilePayload = {
    version: REPROJ_VERSION,
    exportedAt: new Date().toISOString(),
    project,
    companyProfiles,
  }
  const json = JSON.stringify(payload)
  const encrypted = await encrypt(json, password)
  return new Blob([encrypted], { type: 'application/octet-stream' })
}

export async function importReproj(
  file: File,
  password: string
): Promise<ReprojFilePayload> {
  if (file.size > MAX_IMPORT_SIZE) throw new Error('Import file is too large')
  const buffer = await file.arrayBuffer()
  const json = await decrypt(buffer, password)
  return validateReprojPayload(JSON.parse(json))
}

// ─── Company profile JSON export/import ──────────────────────────────────────

export function exportCompanyProfiles(profiles: CompanyProfile[]): Blob {
  const payload: CompanyExportPayload = {
    version: COMPANY_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    profiles,
  }
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
}

export function importCompanyProfiles(json: string): CompanyProfile[] {
  const data = JSON.parse(json) as unknown
  if (Array.isArray(data)) return data.map(validateCompanyProfile)
  if (isRecord(data) && Array.isArray(data.profiles)) return data.profiles.map(validateCompanyProfile)
  throw new Error('Invalid company profiles file')
}

// ─── File download helper ─────────────────────────────────────────────────────

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-.]/g, '_').substring(0, 80)
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsText(file)
  })
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsDataURL(file)
  })
}
