import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CompanyProfile } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface CompanyState {
  profiles: CompanyProfile[]
  defaultRealizatorId: string | null

  // Selectors
  getProfile: (id: string) => CompanyProfile | undefined
  getDefaultRealizator: () => CompanyProfile | null

  // Mutations
  addProfile: (profile: Omit<CompanyProfile, 'id'>) => CompanyProfile
  updateProfile: (id: string, patch: Partial<CompanyProfile>) => void
  deleteProfile: (id: string) => void
  setDefaultRealizator: (id: string | null) => void
  importProfiles: (profiles: CompanyProfile[], merge?: boolean) => void
}

const emptyProfile = (): Omit<CompanyProfile, 'id'> => ({
  name: '',
  address: '',
  city: '',
  zip: '',
  country: 'Slovensko',
  ico: '',
  dic: '',
  phone: '',
  email: '',
  website: '',
  contactPerson: '',
  logoBase64: null,
})

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      profiles: [],
      defaultRealizatorId: null,

      getProfile: (id) => get().profiles.find((p) => p.id === id),

      getDefaultRealizator: () => {
        const { profiles, defaultRealizatorId } = get()
        return profiles.find((p) => p.id === defaultRealizatorId) ?? null
      },

      addProfile: (data) => {
        const profile: CompanyProfile = { id: uuidv4(), ...emptyProfile(), ...data }
        set((s) => ({ profiles: [...s.profiles, profile] }))
        return profile
      },

      updateProfile: (id, patch) => {
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },

      deleteProfile: (id) => {
        set((s) => ({
          profiles: s.profiles.filter((p) => p.id !== id),
          defaultRealizatorId:
            s.defaultRealizatorId === id ? null : s.defaultRealizatorId,
        }))
      },

      setDefaultRealizator: (id) => set({ defaultRealizatorId: id }),

      importProfiles: (incoming, merge = true) => {
        if (!merge) {
          set({ profiles: incoming })
          return
        }
        set((s) => {
          const existingIds = new Set(s.profiles.map((p) => p.id))
          const newProfiles = incoming.map((p) =>
            existingIds.has(p.id) ? { ...p, id: uuidv4() } : p
          )
          return { profiles: [...s.profiles, ...newProfiles] }
        })
      },
    }),
    {
      name: 'reveng_companies',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
