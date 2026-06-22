# Changelog

## [1.4.0] – 2026-06-22

### Fixed (audit – 10 findings)
- **Photo upload size limit**: `ObjectSpecModule` now enforces a 5 MB maximum per image; oversized files are silently skipped and the user sees an `Alert` warning. Previously any-size uploads could exceed the localStorage quota and silently corrupt the persisted store.
- **`.reproj` import – company profiles lost**: `ImportDialog` now saves `payload.companyProfiles` to the company store via the new `importProjectProfiles()` action after decrypting the file. Previously company data was decoded but immediately discarded, leaving protocol print headers blank on a fresh device.
- **`.reproj` import – legacy `objectSpec` lost**: `importProject()` now runs the same migration as the Zustand persist middleware (`objectSpec → objectSpecs`, null-backfill for `startDate`, `realizatorSignature`, `ziadatelSignature`, `signedAt`). Previously legacy projects imported via file lost all object data silently.
- **Persist migration idempotency**: The `migrate` callback in `projectStore` now returns a new object reference so Zustand correctly persists the updated schema version on first run.
- **Gantt – manual mode ignored in PDF**: The Gantt section in `ProtocolPrint` now respects `timeEstimation.mode`; when set to `manual` it reads `<phase>Entry.hours` instead of always using auto-computed values.
- **CAD hours falsy-zero bug**: `autoHours.cad` used `cadBase || formula` — when the user explicitly set CAD hours to `0` the auto-formula fired instead. Fixed to `estimatedCadHours != null ? value : formula`.
- **`window.open()` blocked by popup blocker**: Moved before the `await QRCode.toDataURL()` call so it executes synchronously in the user-gesture context. Previously it fired inside a Promise continuation and was blocked by default in Chrome/Firefox/Safari.
- **PDF crash with many photos**: Capped photo rendering at 8 images per object spec in the PDF output to prevent an unbounded base64 HTML string from crashing the browser tab.
- **Three.js memory leak**: `ModelViewer3D` cleanup now traverses the scene and calls `geometry.dispose()` + `material.dispose()` on all mesh children before disposing the renderer. Previously GPU buffers accumulated on every model change, eventually causing WebGL context loss.
- **`importProfiles(merge=false)` dangling pointer**: Replacing all company profiles now resets `defaultRealizatorId` when the previously-default profile is not present in the new set. Added `importProjectProfiles()` action that merges profiles while preserving their original IDs.
- **Duplicate Gantt column header**: The bar visualisation column in the Gantt table PDF section was labeled `t('ganttPhase')` (same as the first column). Now uses `t('ganttTimeline')` — translations added to SK / EN / DE.

---

## [1.3.0] – 2026-06-22

### Added
- **Object photos in PDF protocol (Section 1)**: Each `ObjectSpec.images[]` renders as a 4-column photo grid below the object info table; hidden when no photos are present.
- **Gantt timeline in PDF protocol (Section 7)**: New section with colour-coded bar chart for all 8 project phases (preparation → travel). Bar widths are proportional to hours. If `project.startDate` is set, sequential start/end date columns are shown per phase (8 h = 1 workday).
- **OBJ format in 3D viewer**: `ModelViewer3D` now loads `.obj` files with `OBJLoader` (previously showed a placeholder wireframe cube).
- **i18n**: All new Gantt/photo labels added to SK / EN / DE inline translations in `ProtocolPrint` and to i18next locale files.

### Fixed
- **Company profiles import**: `importCompanyProfiles` now accepts three formats — plain array, `{ profiles: [] }`, and the full `{ version, exportedAt, profiles: [] }` wrapper. Previously only the exact wrapped format was accepted, causing "Chyba: invalid file" on valid exports.
- **Import error message**: `CompanyProfiles` page now shows the actual error message on import failure instead of a generic "invalid file" string.

---

## [1.2.0] – 2026-06-21

### Added
- **3D model viewer** (`ModelViewer3D`): interactive Three.js viewer with OrbitControls, STL support, ambient + directional lighting; embedded in `ObjectSpecModule`.
- **QR code on PDF protocol**: `qrcode` package generates a QR from the protocol number; rendered top-right of the print header.
- **Project templates** (`TemplateDialog`, `templateStore`): save any project as a reusable template; load from the dashboard to pre-fill a new project.
- **Digital e-signature** (`SignatureDialog`): `signature_pad` canvas for realizator and žiadateľ; signatures stored as base64 PNG and rendered in the PDF signatures section.
- **AI time estimation**: Anthropic Claude API integration in `TimeEstimationModule`; estimates all 8 phase entries from object spec + scanning context; requires API key in Settings.
- **Gantt timeline step** (step 8): `GanttModule` renders a horizontal waterfall chart with phase colours, hours, workday counts, and date offsets from `project.startDate`.
- **Multi-object spec**: `objectSpecs: ObjectSpec[]` array replaces single `objectSpec`; `ObjectSpecModule` renders an accordion per object with Add / Remove controls; PDF Section 1 iterates all specs.
- **Compact dashboard**: card layout, status chips, last-updated date, direct Edit / Print actions per project row.
- **Object photo upload**: drag-and-drop image upload per `ObjectSpec` with thumbnail preview and description field.
- **CAD formats & 2D documentation moved to Native CAD step**: sections now appear conditionally inside the Native CAD module when `nativeCadSpec.required` is true.

### Fixed
- **Deadline field**: changed from year-only `type="number"` input to a full calendar date picker (`type="date"`) with `InputLabelProps={{ shrink: true }}`.
- **Slider label clipping**: added `pt: 3` to the wrapping Box in `MeshAssessmentModule` so `valueLabelDisplay="on"` bubbles are not clipped at the top of the container.

---

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
