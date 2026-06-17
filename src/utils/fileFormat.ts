import type { ReprojFilePayload, CompanyExportPayload, Project, CompanyProfile } from '@/types'
import { encrypt, decrypt } from './crypto'

const REPROJ_VERSION = '1.0'
const COMPANY_EXPORT_VERSION = '1.0'

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
  const buffer = await file.arrayBuffer()
  const json = await decrypt(buffer, password)
  const payload = JSON.parse(json) as ReprojFilePayload
  if (!payload.version || !payload.project) {
    throw new Error('Invalid .reproj file structure')
  }
  return payload
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
  const payload = JSON.parse(json) as CompanyExportPayload
  if (!Array.isArray(payload.profiles)) {
    throw new Error('Invalid company profiles file')
  }
  return payload.profiles
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
  return name.replace(/[^a-zA-Z0-9_\-\.]/g, '_').substring(0, 80)
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
