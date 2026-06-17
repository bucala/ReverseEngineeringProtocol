import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AppLanguage, AppThemeMode } from '@/types'
import i18n from '@/i18n'

interface AppState {
  language: AppLanguage
  themeMode: AppThemeMode
  sidebarOpen: boolean
  anthropicApiKey: string

  setLanguage: (lang: AppLanguage) => void
  setThemeMode: (mode: AppThemeMode) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setAnthropicApiKey: (key: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'sk',
      themeMode: 'light',
      sidebarOpen: true,
      anthropicApiKey: '',

      setLanguage: (lang) => {
        i18n.changeLanguage(lang)
        set({ language: lang })
      },

      setThemeMode: (mode) => set({ themeMode: mode }),

      toggleTheme: () =>
        set((s) => ({ themeMode: s.themeMode === 'light' ? 'dark' : 'light' })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setAnthropicApiKey: (key) => set({ anthropicApiKey: key }),
    }),
    {
      name: 'reveng_app_settings',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language)
        }
      },
    }
  )
)
