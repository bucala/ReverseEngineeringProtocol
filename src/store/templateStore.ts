import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Project, ProjectTemplate } from '@/types'

interface TemplateState {
  templates: ProjectTemplate[]
  saveTemplate: (name: string, description: string, project: Project) => void
  applyTemplate: (templateId: string) => Partial<Project> | null
  deleteTemplate: (id: string) => void
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],

      saveTemplate: (name, description, project) => {
        const template: ProjectTemplate = {
          id: uuidv4(),
          name,
          description,
          createdAt: new Date().toISOString(),
          meshAssessment: project.meshAssessment,
          reCadPostprocessing: project.reCadPostprocessing,
          timeEstimation: project.timeEstimation,
          deliverables: project.deliverables,
          nativeCadSpec: project.nativeCadSpec,
        }
        set((s) => ({ templates: [...s.templates, template] }))
      },

      applyTemplate: (templateId) => {
        const template = get().templates.find((t) => t.id === templateId)
        if (!template) return null
        return {
          meshAssessment: template.meshAssessment,
          reCadPostprocessing: template.reCadPostprocessing,
          timeEstimation: template.timeEstimation,
          deliverables: template.deliverables,
          nativeCadSpec: template.nativeCadSpec,
        }
      },

      deleteTemplate: (id) => {
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) }))
      },
    }),
    {
      name: 'reveng_templates',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
