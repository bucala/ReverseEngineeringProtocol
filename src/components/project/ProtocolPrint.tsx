import ReactDOMServer from 'react-dom/server'
import type { Project } from '@/types'

// ─── Inline translations ──────────────────────────────────────────────────────

type Translations = Record<string, string>

const SK: Translations = {
  protocolTitle: 'PROTOKOL O ROZSAHU PRÁC',
  protocolSubtitle: 'Protocol of Work Scope',
  section1: '1. Predmet zákazky',
  section2: '2. Hodnotenie skenovania',
  section3: '3. RE & CAD postprocessing',
  section4: '4. Kalkulácia času a nákladov',
  section5: '5. Špecifikácia odovzdávky',
  section6: '6. Natívne CAD prostredie',
  protocolNumber: 'Číslo protokolu',
  date: 'Dátum',
  status: 'Stav',
  realizator: 'Realizátor',
  ziadatel: 'Žiadateľ',
  partName: 'Názov dielca',
  partNumber: 'Číslo dielca',
  serialNumber: 'Sériové číslo',
  material: 'Materiál',
  dimensions: 'Rozmery (Bounding Box)',
  rePurpose: 'Účel reverzného inžinierstva',
  notes: 'Poznámky',
  scanningMethod: 'Metóda skenovania',
  precisionLevel: 'Úroveň presnosti',
  toleranceMm: 'Tolerancia (mm)',
  scanningDifficulty: 'Obtiažnosť skenovania',
  surfaceFinish: 'Povrch dielca',
  geometryComplexity: 'Zložitosť geometrie',
  referenceTargets: 'Referenčné body',
  estimatedScanningHours: 'Odhadovaný čas skenovania',
  strategy: 'Stratégia spracovania',
  surfacingMethod: 'Metóda plošného modelovania',
  meshProcessing: 'Úprava polygónovej siete',
  estimatedCadHours: 'Odhadovaný čas CAD',
  outputFormats: 'Výstupné CAD formáty',
  activity: 'Aktivita',
  hours: 'Hodiny',
  rate: 'Sadzba',
  subtotal: 'Medzisúčet',
  overhead: 'Réžia',
  discount: 'Zľava',
  totalCost: 'Celkové náklady',
  rawMesh: 'Surové mesh dáta',
  optimizedMesh: 'Optimalizované mesh dáta',
  cadFiles: 'CAD súbory',
  formats2D: '2D Dokumentácia',
  inspectionReports: 'Inšpekčné protokoly',
  cloudUpload: 'Nahratie do cloudu',
  physicalMedia: 'Fyzické médium',
  deadline: 'Termín odovzdania',
  deliveryNotes: 'Poznámky k odovzdávke',
  cadSystem: 'CAD systém',
  cadVersion: 'Verzia softvéru',
  drawingStandard: 'Kótovací štandard',
  featureTree: 'Feature Tree',
  parametricRelations: 'Parametrické väzby',
  assemblyConstraints: 'Väzby zostáv',
  sheetMetal: 'Plechové diely',
  kFactor: 'K-factor',
  customTemplates: 'Firemné šablóny',
  signatures: 'Podpisy a pečiatky',
  realizatorSig: 'Za Realizátora',
  ziadatelSig: 'Za Žiadateľa',
  stamp: 'Pečiatka',
  yes: 'Áno',
  no: 'Nie',
  ico: 'IČO',
  dic: 'DIČ',
}

const EN: Translations = {
  ...SK,
  protocolTitle: 'PROTOCOL OF WORK SCOPE',
  protocolSubtitle: 'Protocol of Work Scope',
  section1: '1. Subject of Contract',
  section2: '2. Scanning Assessment',
  section3: '3. RE & CAD Postprocessing',
  section4: '4. Time & Cost Calculation',
  section5: '5. Deliverables Specification',
  section6: '6. Native CAD Environment',
  partName: 'Part Name',
  partNumber: 'Part Number',
  serialNumber: 'Serial Number',
  material: 'Material',
  dimensions: 'Dimensions (Bounding Box)',
  rePurpose: 'Purpose of Reverse Engineering',
  notes: 'Notes',
  scanningMethod: 'Scanning Method',
  precisionLevel: 'Precision Level',
  toleranceMm: 'Tolerance (mm)',
  scanningDifficulty: 'Scanning Difficulty',
  surfaceFinish: 'Surface Finish',
  geometryComplexity: 'Geometry Complexity',
  referenceTargets: 'Reference Targets',
  estimatedScanningHours: 'Estimated Scanning Time',
  strategy: 'Processing Strategy',
  surfacingMethod: 'Surfacing Method',
  meshProcessing: 'Mesh Processing Tasks',
  estimatedCadHours: 'Estimated CAD Time',
  outputFormats: 'Output CAD Formats',
  activity: 'Activity',
  hours: 'Hours',
  rate: 'Rate',
  subtotal: 'Subtotal',
  overhead: 'Overhead',
  discount: 'Discount',
  totalCost: 'Total Cost',
  rawMesh: 'Raw Mesh Data',
  optimizedMesh: 'Optimized Mesh Data',
  cadFiles: 'CAD Files',
  formats2D: '2D Documentation',
  inspectionReports: 'Inspection Reports',
  cloudUpload: 'Cloud Upload',
  physicalMedia: 'Physical Media',
  deadline: 'Delivery Deadline',
  deliveryNotes: 'Delivery Notes',
  cadSystem: 'CAD System',
  cadVersion: 'Software Version',
  drawingStandard: 'Drawing Standard',
  featureTree: 'Feature Tree',
  parametricRelations: 'Parametric Relations',
  assemblyConstraints: 'Assembly Constraints',
  sheetMetal: 'Sheet Metal Parts',
  kFactor: 'K-Factor',
  customTemplates: 'Company Templates',
  signatures: 'Signatures & Stamps',
  realizatorSig: 'On behalf of Contractor',
  ziadatelSig: 'On behalf of Client',
  stamp: 'Stamp',
  yes: 'Yes',
  no: 'No',
}

const DE: Translations = {
  ...SK,
  protocolTitle: 'PROTOKOLL DES ARBEITSUMFANGS',
  protocolSubtitle: 'Protocol of Work Scope',
  section1: '1. Auftragsgegenstand',
  section2: '2. Scan-Bewertung',
  section3: '3. RE & CAD-Nachbearbeitung',
  section4: '4. Zeit- und Kostenkalkulation',
  section5: '5. Lieferobjekte',
  section6: '6. Natives CAD-Umfeld',
  partName: 'Bauteilname',
  partNumber: 'Teilenummer',
  serialNumber: 'Seriennummer',
  material: 'Material',
  dimensions: 'Abmessungen (Bounding Box)',
  rePurpose: 'Zweck des Reverse Engineerings',
  notes: 'Notizen',
  scanningMethod: 'Scanmethode',
  precisionLevel: 'Präzisionsniveau',
  toleranceMm: 'Toleranz (mm)',
  scanningDifficulty: 'Scanschwierigkeit',
  surfaceFinish: 'Oberfläche',
  geometryComplexity: 'Geometriekomplexität',
  referenceTargets: 'Referenzpunkte',
  estimatedScanningHours: 'Geschätzte Scanzeit',
  strategy: 'Verarbeitungsstrategie',
  surfacingMethod: 'Flächenmodellierungsmethode',
  meshProcessing: 'Mesh-Verarbeitungsaufgaben',
  estimatedCadHours: 'Geschätzte CAD-Zeit',
  outputFormats: 'Ausgabe-CAD-Formate',
  activity: 'Aktivität',
  hours: 'Stunden',
  rate: 'Stundensatz',
  subtotal: 'Zwischensumme',
  overhead: 'Gemeinkosten',
  discount: 'Rabatt',
  totalCost: 'Gesamtkosten',
  rawMesh: 'Rohe Mesh-Daten',
  optimizedMesh: 'Optimierte Mesh-Daten',
  cadFiles: 'CAD-Dateien',
  formats2D: '2D-Dokumentation',
  inspectionReports: 'Inspektionsberichte',
  cloudUpload: 'Cloud-Upload',
  physicalMedia: 'Physisches Medium',
  deadline: 'Lieferfrist',
  deliveryNotes: 'Lieferhinweise',
  cadSystem: 'CAD-System',
  cadVersion: 'Softwareversion',
  drawingStandard: 'Zeichnungsnorm',
  featureTree: 'Feature-Tree',
  parametricRelations: 'Parametrische Beziehungen',
  assemblyConstraints: 'Baugruppen-Constraints',
  sheetMetal: 'Blechteile',
  kFactor: 'K-Faktor',
  customTemplates: 'Unternehmensvorlagen',
  signatures: 'Unterschriften & Stempel',
  realizatorSig: 'Im Namen des Auftragnehmers',
  ziadatelSig: 'Im Namen des Auftraggebers',
  stamp: 'Stempel',
  yes: 'Ja',
  no: 'Nein',
}

function getTranslations(language: string): Translations {
  if (language === 'en') return EN
  if (language === 'de') return DE
  return SK
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; font-size: 10pt; color: #212121; background: #fff; }
  .protocol-print { padding: 20mm 18mm; max-width: 210mm; margin: 0 auto; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1565C0; padding-bottom: 12px; margin-bottom: 16px; gap: 12px; }
  .company-block { flex: 1; font-size: 9pt; line-height: 1.5; }
  .company-block.align-right { text-align: right; }
  .company-block .company-name { font-size: 11pt; font-weight: bold; color: #1565C0; }
  .company-logo { max-height: 50px; max-width: 120px; object-fit: contain; display: block; margin-bottom: 6px; }
  .company-block.align-right .company-logo { margin-left: auto; }
  .protocol-title { flex: 1.5; text-align: center; }
  .protocol-title h1 { font-size: 14pt; font-weight: bold; color: #1565C0; text-transform: uppercase; letter-spacing: 1px; }
  .protocol-title h2 { font-size: 10pt; color: #546E7A; margin-top: 4px; }
  .protocol-meta { margin-top: 8px; font-size: 9pt; color: #37474F; border: 1px solid #90CAF9; border-radius: 4px; padding: 6px 10px; background: #E3F2FD; }

  /* Sections */
  .section { margin-bottom: 16px; }
  .section-title { background: #1565C0; color: #fff; padding: 6px 12px; font-size: 11pt; font-weight: bold; border-radius: 3px; margin-bottom: 10px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; font-size: 9pt; }
  th { background: #E3F2FD; color: #1565C0; font-weight: bold; padding: 6px 8px; border: 1px solid #90CAF9; text-align: left; }
  td { padding: 5px 8px; border: 1px solid #BDBDBD; vertical-align: top; }
  tr:nth-child(even) td { background: #FAFAFA; }
  .label-col { font-weight: bold; color: #37474F; width: 35%; background: #F5F5F5; }
  .total-row td { font-weight: bold; background: #E8F5E9; color: #2E7D32; }
  .cost-highlight { background: #1565C0 !important; color: #fff !important; font-weight: bold; font-size: 11pt; }

  /* Chips */
  .chip-list { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 8pt; background: #E3F2FD; color: #1565C0; border: 1px solid #90CAF9; }

  /* Signatures */
  .signatures { margin-top: 24px; border-top: 2px solid #1565C0; padding-top: 16px; }
  .signatures-title { font-size: 11pt; font-weight: bold; color: #1565C0; margin-bottom: 16px; }
  .sig-table { display: flex; gap: 24px; }
  .sig-block { flex: 1; border: 1px solid #BDBDBD; border-radius: 4px; padding: 12px; }
  .sig-block .sig-title { font-weight: bold; color: #1565C0; margin-bottom: 8px; }
  .sig-line { border-top: 1px solid #212121; margin-top: 40px; padding-top: 4px; font-size: 8pt; color: #546E7A; }

  @media print {
    .protocol-print { padding: 0; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`

// ─── Helper renderers ─────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <tr>
      <td className="label-col">{label}</td>
      <td>{String(value)}</td>
    </tr>
  )
}

function ChipCell({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span>—</span>
  return (
    <div className="chip-list">
      {items.map((item) => <span key={item} className="chip">{item}</span>)}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProtocolPrintProps {
  project: Project
  t: (key: string) => string
}

function ProtocolPrint({ project, t }: ProtocolPrintProps) {
  const objectSpecs = project.objectSpecs?.length
    ? project.objectSpecs
    : project.objectSpec ? [project.objectSpec] : []
  const { meshAssessment, reCadPostprocessing, timeEstimation, deliverables, nativeCadSpec } = project
  const realizator = project.realizator
  const ziadatel = project.ziadatel

  const isAuto = timeEstimation.mode === 'auto'
  const scanBase = meshAssessment.estimatedScanningHours ?? 0
  const cadBase = reCadPostprocessing.estimatedCadHours ?? 0
  const complexityMult: Record<string, number> = { simple: 0.8, moderate: 1.0, complex: 1.3, freeform: 1.6 }
  const mult = complexityMult[meshAssessment.geometryComplexity] ?? 1

  const autoHours = {
    preparation: parseFloat((scanBase * 0.2).toFixed(1)),
    scanning: scanBase,
    mesh: parseFloat((scanBase * 0.6 * mult).toFixed(1)),
    cad: cadBase || parseFloat((scanBase * 1.2 * mult).toFixed(1)),
    inspection: reCadPostprocessing.drawingRequired ? 4 : 0,
    reporting: parseFloat((Math.max(2, (scanBase + cadBase) * 0.1)).toFixed(1)),
    management: parseFloat(((scanBase + cadBase) * 0.1).toFixed(1)),
    travel: 0,
  }

  const timeEntries = [
    { key: 'preparationEntry' as const, label: t('preparation'), ah: autoHours.preparation },
    { key: 'scanningEntry' as const, label: t('scanning'), ah: autoHours.scanning },
    { key: 'meshProcessingEntry' as const, label: t('meshProcessing'), ah: autoHours.mesh },
    { key: 'cadEntry' as const, label: t('estimatedCadHours'), ah: autoHours.cad },
    { key: 'inspectionEntry' as const, label: 'Inspection', ah: autoHours.inspection },
    { key: 'reportingEntry' as const, label: t('reporting'), ah: autoHours.reporting },
    { key: 'managementEntry' as const, label: 'Management', ah: autoHours.management },
    { key: 'travelEntry' as const, label: t('travel'), ah: autoHours.travel },
  ]

  let totalHours = 0
  let subtotalCost = 0
  timeEntries.forEach(({ key, ah }) => {
    const entry = timeEstimation[key]
    const h = isAuto ? ah : entry.hours
    totalHours += h
    subtotalCost += h * entry.rate
  })
  const afterOverhead = subtotalCost * (1 + timeEstimation.overhead / 100)
  const afterDiscount = afterOverhead * (1 - timeEstimation.discount / 100)

  const meshTasks = reCadPostprocessing.meshProcessingTasks
  const activeMeshTasks = Object.entries(meshTasks)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const formattedDate = new Date().toLocaleDateString('sk-SK')

  return (
    <div className="protocol-print">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Header */}
      <div className="header">
        <div className="company-block">
          {realizator?.logoBase64 && (
            <img src={realizator.logoBase64} alt="logo" className="company-logo" />
          )}
          {realizator && (
            <>
              <div className="company-name">{realizator.name}</div>
              <div>{realizator.address}</div>
              <div>{realizator.zip} {realizator.city}, {realizator.country}</div>
              <div>{t('ico')}: {realizator.ico} | {t('dic')}: {realizator.dic}</div>
              {realizator.phone && <div>{realizator.phone}</div>}
              {realizator.email && <div>{realizator.email}</div>}
            </>
          )}
        </div>

        <div className="protocol-title">
          <h1>{t('protocolTitle')}</h1>
          <h2>{t('protocolSubtitle')}</h2>
          <div className="protocol-meta">
            {t('protocolNumber')}: <strong>{project.protocolNumber}</strong>
            {' | '}{t('date')}: <strong>{formattedDate}</strong>
            {' | '}{t('status')}: <strong>{project.status}</strong>
          </div>
        </div>

        <div className="company-block align-right">
          {ziadatel?.logoBase64 && (
            <img src={ziadatel.logoBase64} alt="logo" className="company-logo" />
          )}
          {ziadatel && (
            <>
              <div className="company-name">{ziadatel.name}</div>
              <div>{ziadatel.address}</div>
              <div>{ziadatel.zip} {ziadatel.city}, {ziadatel.country}</div>
              <div>{t('ico')}: {ziadatel.ico} | {t('dic')}: {ziadatel.dic}</div>
              {ziadatel.contactPerson && <div>{ziadatel.contactPerson}</div>}
            </>
          )}
        </div>
      </div>

      {/* Section 1: Objects */}
      <div className="section">
        <div className="section-title">{t('section1')}</div>
        {objectSpecs.map((spec, idx) => (
          <div key={idx} style={{ marginBottom: objectSpecs.length > 1 ? 10 : 0 }}>
            {objectSpecs.length > 1 && (
              <div style={{ fontWeight: 'bold', padding: '4px 8px', background: '#E3F2FD', marginBottom: 4, borderRadius: 3 }}>
                {`${t('partName')} ${idx + 1}: ${spec.name || '—'}`}
              </div>
            )}
            <table>
              <tbody>
                <InfoRow label={t('partName')} value={spec.name} />
                <InfoRow label={t('partNumber')} value={spec.partNumber} />
                <InfoRow label={t('serialNumber')} value={spec.serialNumber} />
                <InfoRow label={t('material')} value={spec.material} />
                {(spec.boundingBox.x || spec.boundingBox.y || spec.boundingBox.z) && (
                  <InfoRow label={t('dimensions')}
                    value={`${spec.boundingBox.x ?? '?'} × ${spec.boundingBox.y ?? '?'} × ${spec.boundingBox.z ?? '?'} ${spec.boundingBox.unit}`} />
                )}
                {spec.rePurpose && spec.rePurpose.length > 0 && (
                  <tr><td className="label-col">{t('rePurpose')}</td><td><ChipCell items={spec.rePurpose} /></td></tr>
                )}
                <InfoRow label={t('notes')} value={spec.notes} />
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Section 2: Scanning Assessment */}
      <div className="section">
        <div className="section-title">{t('section2')}</div>
        <table>
          <tbody>
            <InfoRow label={t('scanningMethod')} value={meshAssessment.scanningMethod} />
            <InfoRow label={t('precisionLevel')} value={meshAssessment.precisionLevel} />
            {meshAssessment.toleranceMm !== null && (
              <InfoRow label={t('toleranceMm')} value={`${meshAssessment.toleranceMm} mm`} />
            )}
            <InfoRow label={t('scanningDifficulty')} value={meshAssessment.scanningDifficulty} />
            <InfoRow label={t('surfaceFinish')} value={meshAssessment.surfaceFinish} />
            <InfoRow label={t('geometryComplexity')} value={meshAssessment.geometryComplexity} />
            <InfoRow label={t('referenceTargets')} value={meshAssessment.referenceTargets} />
            <InfoRow label={t('estimatedScanningHours')} value={`${meshAssessment.estimatedScanningHours ?? 0} h`} />
            {meshAssessment.surfacePrepRequired && (
              <InfoRow label="Surface Prep" value={meshAssessment.surfacePrepMethod || 'Required'} />
            )}
            {meshAssessment.requiresCtScan && <InfoRow label="CT Scan" value="Required" />}
            {meshAssessment.requiresDestructive && <InfoRow label="Destructive Method" value="Required" />}
            {meshAssessment.hasDeepCavities && <InfoRow label="Deep Cavities" value="Yes" />}
            {meshAssessment.hasThinWalls && <InfoRow label="Thin Walls" value="Yes" />}
            <InfoRow label={t('notes')} value={meshAssessment.notes} />
          </tbody>
        </table>
      </div>

      {/* Section 3: RE & CAD */}
      <div className="section">
        <div className="section-title">{t('section3')}</div>
        <table>
          <tbody>
            <InfoRow label={t('strategy')} value={reCadPostprocessing.strategy} />
            <InfoRow label={t('surfacingMethod')} value={reCadPostprocessing.surfacingMethod} />
            <InfoRow label={t('estimatedCadHours')} value={`${reCadPostprocessing.estimatedCadHours ?? 0} h`} />
            {reCadPostprocessing.selectedCadFormats.length > 0 && (
              <tr>
                <td className="label-col">{t('outputFormats')}</td>
                <td><ChipCell items={reCadPostprocessing.selectedCadFormats} /></td>
              </tr>
            )}
            {activeMeshTasks.length > 0 && (
              <tr>
                <td className="label-col">{t('meshProcessing')}</td>
                <td><ChipCell items={activeMeshTasks} /></td>
              </tr>
            )}
            <InfoRow label={t('notes')} value={reCadPostprocessing.notes} />
          </tbody>
        </table>
      </div>

      {/* Section 4: Time & Cost */}
      <div className="section">
        <div className="section-title">{t('section4')}</div>
        <table>
          <thead>
            <tr>
              <th>{t('activity')}</th>
              <th style={{ width: '15%' }}>{t('hours')}</th>
              <th style={{ width: '20%' }}>{t('rate')} (€/h)</th>
              <th style={{ width: '20%' }}>{t('subtotal')} ({timeEstimation.currency})</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map(({ key, label, ah }) => {
              const entry = timeEstimation[key]
              const h = isAuto ? ah : entry.hours
              const cost = h * entry.rate
              if (h === 0 && cost === 0) return null
              return (
                <tr key={key}>
                  <td>{label}</td>
                  <td>{h.toFixed(1)} h</td>
                  <td>{entry.rate} €/h</td>
                  <td>{cost.toFixed(2)} {timeEstimation.currency}</td>
                </tr>
              )
            })}
            <tr className="total-row">
              <td colSpan={2}>{t('subtotal')}</td>
              <td>—</td>
              <td>{subtotalCost.toFixed(2)} {timeEstimation.currency}</td>
            </tr>
            {timeEstimation.overhead > 0 && (
              <tr>
                <td colSpan={2}>{t('overhead')} ({timeEstimation.overhead}%)</td>
                <td>—</td>
                <td>{afterOverhead.toFixed(2)} {timeEstimation.currency}</td>
              </tr>
            )}
            {timeEstimation.discount > 0 && (
              <tr>
                <td colSpan={2}>{t('discount')} ({timeEstimation.discount}%)</td>
                <td>—</td>
                <td>-{((afterOverhead - afterDiscount)).toFixed(2)} {timeEstimation.currency}</td>
              </tr>
            )}
            <tr>
              <td colSpan={2} className="cost-highlight">{t('totalCost')}</td>
              <td className="cost-highlight">{totalHours.toFixed(1)} h</td>
              <td className="cost-highlight">{afterDiscount.toFixed(2)} {timeEstimation.currency}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 5: Deliverables */}
      <div className="section">
        <div className="section-title">{t('section5')}</div>
        <table>
          <tbody>
            {deliverables.rawMeshFormats.length > 0 && (
              <tr>
                <td className="label-col">{t('rawMesh')}</td>
                <td><ChipCell items={deliverables.rawMeshFormats} /></td>
              </tr>
            )}
            {deliverables.optimizedMeshFormats.length > 0 && (
              <tr>
                <td className="label-col">{t('optimizedMesh')}</td>
                <td><ChipCell items={deliverables.optimizedMeshFormats} /></td>
              </tr>
            )}
            {deliverables.cadFormats.length > 0 && (
              <tr>
                <td className="label-col">{t('cadFiles')}</td>
                <td><ChipCell items={deliverables.cadFormats} /></td>
              </tr>
            )}
            {deliverables.formats2D && deliverables.formats2D.length > 0 && (
              <tr>
                <td className="label-col">{t('formats2D')}</td>
                <td><ChipCell items={deliverables.formats2D} /></td>
              </tr>
            )}
            {deliverables.inspectionFormats.length > 0 && (
              <tr>
                <td className="label-col">{t('inspectionReports')}</td>
                <td><ChipCell items={deliverables.inspectionFormats} /></td>
              </tr>
            )}
            {deliverables.cloudUpload && <InfoRow label={t('cloudUpload')} value={t('yes')} />}
            {deliverables.physicalMedia && <InfoRow label={t('physicalMedia')} value={t('yes')} />}
            <InfoRow label={t('deadline')} value={deliverables.deadline ?? undefined} />
            <InfoRow label={t('deliveryNotes')} value={deliverables.deliveryNotes} />
          </tbody>
        </table>
      </div>

      {/* Section 6: Native CAD (only if required) */}
      {nativeCadSpec?.required && (
        <div className="section">
          <div className="section-title">{t('section6')}</div>
          <table>
            <tbody>
              <InfoRow label={t('cadSystem')} value={nativeCadSpec.system ?? undefined} />
              <InfoRow label={t('cadVersion')} value={nativeCadSpec.version} />
              <InfoRow label={t('drawingStandard')} value={nativeCadSpec.drawingStandard === 'custom' ? nativeCadSpec.customDrawingStandard : nativeCadSpec.drawingStandard} />
              <InfoRow label={t('featureTree')} value={nativeCadSpec.featureTreeRequired ? t('yes') : t('no')} />
              <InfoRow label={t('parametricRelations')} value={nativeCadSpec.parametricRelations ? t('yes') : t('no')} />
              <InfoRow label={t('assemblyConstraints')} value={nativeCadSpec.assemblyConstraints ? t('yes') : t('no')} />
              {nativeCadSpec.sheetMetalRequired && (
                <>
                  <InfoRow label={t('sheetMetal')} value={t('yes')} />
                  {nativeCadSpec.sheetMetalKFactor !== null && (
                    <InfoRow label={t('kFactor')} value={nativeCadSpec.sheetMetalKFactor} />
                  )}
                </>
              )}
              {nativeCadSpec.useCustomTemplates && (
                <InfoRow label={t('customTemplates')} value={nativeCadSpec.templateNotes || t('yes')} />
              )}
              <InfoRow label={t('notes')} value={nativeCadSpec.notes} />
            </tbody>
          </table>
        </div>
      )}

      {/* Signatures */}
      <div className="signatures">
        <div className="signatures-title">{t('signatures')}</div>
        <div className="sig-table">
          <div className="sig-block">
            <div className="sig-title">{t('realizatorSig')}</div>
            {realizator?.name && <div style={{ fontSize: '9pt', color: '#546E7A' }}>{realizator.name}</div>}
            <div className="sig-line">{t('date')}: _______________________</div>
            <div className="sig-line" style={{ marginTop: 8 }}>{t('stamp')}:</div>
          </div>
          <div className="sig-block">
            <div className="sig-title">{t('ziadatelSig')}</div>
            {ziadatel?.name && <div style={{ fontSize: '9pt', color: '#546E7A' }}>{ziadatel.name}</div>}
            <div className="sig-line">{t('date')}: _______________________</div>
            <div className="sig-line" style={{ marginTop: 8 }}>{t('stamp')}:</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Export function ──────────────────────────────────────────────────────────

export function printProtocol(project: Project, language: string): void {
  const translations = getTranslations(language)
  const t = (key: string): string => translations[key] ?? key

  const html = ReactDOMServer.renderToStaticMarkup(
    <ProtocolPrint project={project} t={t} />
  )

  const fullHtml = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.protocolNumber} – ${t('protocolTitle')}</title>
</head>
<body>
${html}
</body>
</html>`

  const printWindow = window.open('', '_blank', 'width=900,height=700')
  if (!printWindow) {
    alert('Popup blocked. Please allow popups for this site.')
    return
  }
  printWindow.document.open()
  printWindow.document.write(fullHtml)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
  }
}

export default ProtocolPrint
