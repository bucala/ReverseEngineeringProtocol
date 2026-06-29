import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Project } from '@/types'
import { createDefaultProject, defaultAdvancedFeatures, defaultObjectSpec } from './defaults'

interface ImportOptions {
  asCopy?: boolean
}

interface ImportOptions {
  asCopy?: boolean
}

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null

  getActiveProject: () => Project | null
  getProjectById: (id: string) => Project | undefined

  createProject: () => Project
  updateProject: (id: string, patch: Partial<Project>, summary?: string) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string | null) => void
  importProject: (project: Project, options?: ImportOptions) => Project
  upsertProject: (project: Project) => void
}

function nextProtocolNumber(projects: Project[]): string {
  const year = new Date().getFullYear()
  const prefix = `RE-${year}-`
  const max = projects.reduce((acc, project) => {
    if (!project.protocolNumber.startsWith(prefix)) return acc
    const n = Number.parseInt(project.protocolNumber.slice(prefix.length), 10)
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return `${prefix}${String(max + 1).padStart(4, '0')}`
}

function normalizeProject(project: Project): Project {
  const now = new Date().toISOString()
  const objectSpecs = project.objectSpecs ?? (project.objectSpec ? [project.objectSpec] : [defaultObjectSpec()])
  const version = project.version ?? 1
  return {
    ...project,
    objectSpecs,
    version,
    auditLog: project.auditLog ?? [{ id: uuidv4(), at: project.createdAt ?? now, action: 'imported', details: 'Legacy project normalized' }],
    revisions: project.revisions ?? [{ version, savedAt: project.updatedAt ?? now, summary: 'Imported legacy version' }],
    advancedFeatures: project.advancedFeatures ?? defaultAdvancedFeatures(),
  }
}

function cloneImportedProject(project: Project, protocolNumber: string): Project {
  const now = new Date().toISOString()
  return normalizeProject({
    ...project,
    id: uuidv4(),
    protocolNumber,
    title: project.title ? `${project.title} (copy)` : project.title,
    createdAt: now,
    updatedAt: now,
    version: 1,
    auditLog: [{ id: uuidv4(), at: now, action: 'imported_copy', details: 'Imported as a new copy' }],
    revisions: [{ version: 1, savedAt: now, summary: 'Imported as copy' }],
  })
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      getActiveProject: () => {
        const { projects, activeProjectId } = get()
        return projects.find((p) => p.id === activeProjectId) ?? null
      },

      getProjectById: (id) => get().projects.find((p) => p.id === id),

      createProject: () => {
        const project = createDefaultProject(nextProtocolNumber(get().projects))
        set((s) => ({
          projects: [project, ...s.projects],
          activeProjectId: project.id,
        }))
        return project
      },

      updateProject: (id, patch, summary = 'Project updated') => {
        const now = new Date().toISOString()
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p
            const nextVersion = (p.version ?? 1) + 1
            return {
              ...p,
              ...patch,
              updatedAt: now,
              version: nextVersion,
              auditLog: [
                ...(p.auditLog ?? []),
                { id: uuidv4(), at: now, action: 'updated', details: summary },
              ],
              revisions: [
                ...(p.revisions ?? []),
                { version: nextVersion, savedAt: now, summary },
              ].slice(-50),
            }
          }),
        }))
      },

      deleteProject: (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        }))
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      importProject: (project, options = {}) => {
        const exists = get().projects.some((p) => p.id === project.id)
        const incoming = options.asCopy
          ? cloneImportedProject(project, nextProtocolNumber(get().projects))
          : normalizeProject(project)
        set((s) => ({
          projects: exists && !options.asCopy
            ? s.projects.map((p) => (p.id === project.id ? incoming : p))
            : [incoming, ...s.projects],
          activeProjectId: incoming.id,
        }))
        return incoming
      },

      upsertProject: (project) => {
        const normalized = normalizeProject(project)
        const exists = get().projects.some((p) => p.id === normalized.id)
        set((s) => ({
          projects: exists
            ? s.projects.map((p) => (p.id === normalized.id ? normalized : p))
            : [normalized, ...s.projects],
        }))
      },
    }),
    {
      name: 'reveng_projects',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (state: unknown) => {
        const s = state as { projects?: Project[] }
        s.projects = (s.projects ?? []).map(normalizeProject)
        return s as ProjectState
      },
    }
  )
)
