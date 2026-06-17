# RevEng Protocol Manager

**Aplikácia pre správu protokolov reverzného inžinierstva**

RevEng Protocol Manager je profesionálna webová a desktopová aplikácia určená pre firmy a inžinierov pracujúcich v oblasti reverzného inžinierstva. Umožňuje vytvárať, spravovať a exportovať podrobné protokoly o rozsahu prác (Protocol of Work Scope) pre 3D skenovanie, mesh processing a CAD postprocessing.

---

## Obsah

- [Popis projektu](#popis-projektu)
- [Funkcie](#funkcie)
- [Technológie](#technológie)
- [Inštalácia a spustenie](#inštalácia-a-spustenie)
- [Zostavenie (Build)](#zostavenie-build)
- [Bezpečnosť dát](#bezpečnosť-dát)
- [Generovanie PDF protokolu](#generovanie-pdf-protokolu)
- [Viacjazyčná podpora](#viacjazyčná-podpora)
- [Modulárna architektúra](#modulárna-architektúra)

---

## Popis projektu

Aplikácia rieši potrebu štandardizovaného dokumentovania rozsahu prác pri projektoch reverzného inžinierstva. Každý protokol prechádza 7-krokovým sprievodcom, kde sa zadávajú všetky technické parametre od špecifikácie objektu, cez hodnotenie skenovateľnosti, CAD postprocessing, kalkuláciu nákladov až po detaily odovzdávky a natívne CAD prostredie zákazníka.

Protokol je možné exportovať do zabezpečeného `.reproj` súboru (AES-256-GCM) alebo vygenerovať ako printovateľný HTML/PDF dokument priamo v prehliadači.

---

## Funkcie

### 7-krokový sprievodca projektom

1. **Hlavička projektu** – základné údaje (realizátor, žiadateľ, číslo protokolu, stav)
2. **Špecifikácia objektu** – názov dielca, číslo dielca, sériové číslo, materiál, fotografie, bounding box, účel reverzného inžinierstva (multi-select)
3. **Hodnotenie skenovania (Mesh Assessment)** – metóda skenovania (6 možností), úroveň presnosti (3 úrovne), tolerancia, obtiažnosť, povrch, geometria, referenčné body, prepínače (dutiny, tenké steny, CT scan, deštruktívna metóda...)
4. **RE & CAD postprocessing** – stratégia spracovania, metóda plošného modelovania, výstupné CAD formáty, úlohy mesh processingu (6 prepínačov: čistenie chýb, vyhladzovanie, zarovnanie, optimalizácia, watertight, decimácia)
5. **Kalkulácia času a nákladov** – tabuľka s 8 položkami (príprava, skenovanie, mesh, CAD, inšpekcia, reporting, management, cestovné), réžia, zľava, automatický/manuálny režim
6. **Špecifikácia odovzdávky** – mesh formáty (STL/OBJ/PLY/E57/FBX/3MF), CAD formáty, 2D dokumentácia (PDF/DXF/DWG/TIFF), inšpekčné protokoly (5 typov), termín, doručenie
7. **Natívne CAD prostredie** – požiadavky zákazníka na CAD systém (8 systémov), verziu, štandard kótovania, feature tree, parametrické väzby, plechové diely, šablóny

### Profily spoločností
- Správa profilov realizátorov a žiadateľov
- Upload loga (base64)
- Export/import profilov (`.company` formát)

### Projekty
- Vytváranie, úprava, mazanie projektov
- Automatické číslovanie protokolov (RE-YYYY-XXXX)
- Export/import projektov (`.reproj` formát, AES-256-GCM šifrovanie)

### Generovanie PDF protokolu
- Profesionálny HTML/PDF dokument s hlavičkou firmy
- Všetky sekcie s vyplnenými dátami
- Podpisové bloky pre realizátora a žiadateľa

---

## Technológie

| Technológia | Verzia | Účel |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Typová bezpečnosť |
| Vite | 5.4 | Build tool |
| MUI (Material UI) | 5.16 | Komponentová knižnica |
| Zustand | 5.0 | State management |
| i18next | 23 | Lokalizácia |
| react-router-dom | 6 | Smerovanie |
| react-dropzone | 14 | Upload obrázkov |
| Web Crypto API | – | AES-256-GCM šifrovanie |
| Tauri | 1.6 | Desktopová aplikácia (voliteľné) |
| Capacitor | 6 | Mobilná aplikácia (voliteľné) |

---

## Inštalácia a spustenie

### Požiadavky
- Node.js 18+ (odporúčané 20+)
- npm 9+

### Inštalácia závislostí

```bash
npm install
```

### Spustenie vývojového servera

```bash
npm run dev
```

Aplikácia bude dostupná na `http://localhost:5173`.

---

## Zostavenie (Build)

### Webová aplikácia

```bash
npm run build
```

Výsledok bude v priečinku `dist/`.

### Desktopová aplikácia (Tauri)

```bash
npm run tauri build
```

Vyžaduje nainštalovaný Rust a Tauri CLI.

### Mobilná aplikácia (Capacitor / Android)

```bash
npm run build
npm run cap:sync
npm run cap:android
```

Vyžaduje Android Studio a Android SDK.

---

## Bezpečnosť dát

Projekty sa ukladajú lokálne v `localStorage` prehliadača. Pri exporte do `.reproj` súboru je možné nastaviť heslo – súbor je šifrovaný algoritmom **AES-256-GCM** pomocou natívneho Web Crypto API:

- Kľúč je odvodený z hesla pomocou PBKDF2 (100 000 iterácií, SHA-256)
- Každý export má unikátny IV (initialization vector)
- Bez správneho hesla nie je možné súbor dešifrovať

---

## Generovanie PDF protokolu

Protokol je generovaný priamo v prehliadači cez `ReactDOMServer.renderToStaticMarkup()`:

1. Kliknúť na tlačidlo **"Generovať protokol (PDF)"** v hornej lište editora projektu
2. Otvorí sa nové okno s HTML dokumentom
3. Automaticky sa spustí dialóg tlačiarne
4. Uložiť ako PDF alebo vytlačiť

Dokument obsahuje:
- Hlavičku s logami a kontaktmi oboch strán (realizátor vľavo, žiadateľ vpravo)
- Sekcia 1: Predmet zákazky (objekt, materiál, účel RE)
- Sekcia 2: Hodnotenie skenovania
- Sekcia 3: RE & CAD postprocessing
- Sekcia 4: Kalkulácia času a nákladov (tabuľka)
- Sekcia 5: Špecifikácia odovzdávky
- Sekcia 6: Natívne CAD prostredie (len ak je požadované)
- Podpisové bloky s miestom pre pečiatku

---

## Viacjazyčná podpora

Aplikácia podporuje 3 jazyky:

| Jazyk | Kód | Súbor |
|---|---|---|
| Slovenčina | `sk` | `src/i18n/locales/sk.json` |
| Angličtina | `en` | `src/i18n/locales/en.json` |
| Nemčina | `de` | `src/i18n/locales/de.json` |

Jazyk sa mení v Nastaveniach. PDF protokol sa generuje v jazyku, ktorý je práve aktívny v aplikácii.

---

## Modulárna architektúra

```
src/
├── components/
│   ├── common/         # SectionCard, ConfirmDialog
│   ├── company/        # CompanyProfileDialog
│   ├── layout/         # AppShell, TopBar, SideNav
│   ├── modules/        # Všetky 7 modulov sprievodcu
│   └── project/        # ProjectHeader, ExportDialog, ProtocolPrint
├── i18n/
│   └── locales/        # sk.json, en.json, de.json
├── pages/              # Dashboard, ProjectEditor, CompanyProfiles, Settings
├── store/              # appStore, projectStore, companyStore, defaults
├── theme/              # MUI téma
├── types/              # TypeScript typy (index.ts)
└── utils/              # crypto.ts, fileFormat.ts
```

### Kľúčové typy (`src/types/index.ts`)

- `Project` – hlavný dátový model projektu (s `nativeCadSpec`)
- `ObjectSpec` – špecifikácia objektu (s `serialNumber`, `rePurpose`, `rePurposeNotes`)
- `MeshAssessment` – hodnotenie skenovania (s `scanningMethod`, `precisionLevel`, `toleranceMm`, `referenceTargets`, `hasDeepCavities`, `hasThinWalls`, `requiresCtScan`, `requiresDestructive`)
- `RECadPostprocessing` – CAD postprocessing (s `MeshProcessingTasks`)
- `TimeEstimation` – 8 časových položiek (s `preparationEntry`, `reportingEntry`) + réžia/zľava
- `Deliverables` – formáty odovzdávky (mesh, CAD, 2D `Format2D[]`, inšpekcia s 5 novými typmi)
- `NativeCadSpec` – špecifikácia natívneho CAD prostredia (nový modul)
- `CompanyProfile` – profil spoločnosti

---

## Licencia

Interný projekt – všetky práva vyhradené.
