import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Project } from '@/types'
import { createDefaultProject, defaultObjectSpec } from './defaults'

function migrateProject(p: any): Project {
  const result = { ...p }
  if (!result.objectSpecs) {
    result.objectSpecs = result.objectSpec ? [result.objectSpec] : [defaultObjectSpec()]
  }
  if (result.startDate === undefined) result.startDate = null
  if (result.realizatorSignature === undefined) result.realizatorSignature = null
  if (result.ziadatelSignature === undefined) result.ziadatelSignature = null
  if (result.signedAt === undefined) result.signedAt = null
  return result as Project
}

interface ProjectState {
  projects: Project[]
  activeProjectId: string | null

  // Selectors
  getActiveProject: () => Project | null
  getProjectById: (id: string) => Project | undefined

  // Mutations
  createProject: () => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string | null) => void
  importProject: (project: Project) => void
  upsertProject: (project: Project) => void
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
        const project = createDefaultProject()
        set((s) => ({
          projects: [project, ...s.projects],
          activeProjectId: project.id,
        }))
        return project
      },

      updateProject: (id, patch) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? { ...p, ...patch, updatedAt: new Date().toISOString() }
              : p
          ),
        }))
      },

      deleteProject: (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        }))
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      importProject: (project) => {
        const migrated = migrateProject(project)
        const exists = get().projects.some((p) => p.id === migrated.id)
        if (exists) {
          set((s) => ({
            projects: s.projects.map((p) => (p.id === migrated.id ? migrated : p)),
            activeProjectId: migrated.id,
          }))
        } else {
          set((s) => ({
            projects: [migrated, ...s.projects],
            activeProjectId: migrated.id,
          }))
        }
      },

      upsertProject: (project) => {
        const exists = get().projects.some((p) => p.id === project.id)
        set((s) => ({
          projects: exists
            ? s.projects.map((p) => (p.id === project.id ? project : p))
            : [project, ...s.projects],
        }))
      },
    }),
    {
      name: 'reveng_projects',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (state: unknown, version: number) => {
        const s = state as { projects?: any[] }
        if (version < 1) {
          s.projects = (s.projects ?? []).map(migrateProject)
        }
        return { ...s }
      },
    }
  )
)
