import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.reveng.protocolmanager',
  appName: 'RevEng Protocol Manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
}

export default config
