# Changelog

## [Unreleased]

### Fixed
- **Text selection**: Disabled text/UI selection globally via CSS (`user-select: none`) to prevent accidental text highlighting on app controls; inputs and textareas retain normal text selection
- **Dokončiť button**: Removed incorrect `disabled` state on the Finish button — clicking it on the last step now marks the project as `completed` and navigates back to dashboard
- **Project import**: Replaced the broken no-op file input with a proper `ImportDialog` component that handles `.reproj` file selection, password decryption (AES-256-GCM) and project import into the store
- **Scanning hours slider**: Improved slider marks (added 60h mark, changed `valueLabelDisplay` to `"on"` so the current value is always visible)

---

## [1.1.0] – 2025-06-09

### Added
- NativeCadModule (step 7): native CAD environment spec, sheet metal K-factor, feature tree/parametric/assembly flags
- PDF protocol print via `window.print()` (A4, SK/EN/DE inline translations)
- Extended MeshAssessmentModule: scanning method, precision level, tolerance, reference targets, 4 new boolean flags
- RECadModule: second card for Mesh Processing Tasks (6 toggles)
- TimeEstimationModule: 8-row cost table (auto/manual modes), overhead & discount, currency selector
- DeliverablesModule: Format2D section (PDF, DXF, DWG, TIFF), updated inspection formats
- ObjectSpecModule: RE purpose chip picker, serial number field
- Full DE translations
- README.md (SK) covering all 7 modules, tech stack, build, security, i18n

## [1.0.0] – 2025-06-07

### Added
- Initial project scaffold: React 18 + TypeScript + Vite + MUI v5
- 7-step stepper project editor
- Zustand persistent store (`reveng_projects`, `reveng_company`, `reveng_app`)
- AES-256-GCM encryption for `.reproj` export/import
- Company profiles management with logo upload
- i18n SK/EN with `react-i18next`
- Dark/light theme with MUI
- Tauri + Capacitor targets configured
