import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Project } from '@/types'
import { createDefaultProject, defaultObjectSpec } from './defaults'

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
        const exists = get().projects.some((p) => p.id === project.id)
        if (exists) {
          set((s) => ({
            projects: s.projects.map((p) => (p.id === project.id ? project : p)),
            activeProjectId: project.id,
          }))
        } else {
          set((s) => ({
            projects: [project, ...s.projects],
            activeProjectId: project.id,
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
          s.projects = (s.projects ?? []).map((p: any) => {
            if (!p.objectSpecs) {
              return { ...p, objectSpecs: p.objectSpec ? [p.objectSpec] : [defaultObjectSpec()] }
            }
            return p
          })
        }
        return s as any
      },
    }
  )
)
