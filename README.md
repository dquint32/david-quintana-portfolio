# David Quintana — Portfolio

**Clinical Data Engineer · Health Care Information Systems**
Live site: **https://davidquintana.dev**

Source for my portfolio. I build Python/pandas ETL pipelines and HL7/FHIR tools that extract, clean, and validate clinical data under HIPAA and GCP. B.S. HCIS, MSU Denver (2026). Fully bilingual (English / Spanish).

## Featured work

| Project | What it shows | Links |
|---|---|---|
| **EVA CTMS Archive** | 10-stage local Python ETL pipeline; 9,925 clinical-trial documents inventoried; an 18% patient-ID integrity failure caught before migration, with zero PHI exposure | [Case study](https://davidquintana.dev/eva-ctms-case-study.html) |
| **Bilingual Patient Intake → FHIR R4** | FastAPI + Pydantic v2 validation, self-contained FHIR R4 Bundle (SNOMED CT), 69 tests | [Case study](https://davidquintana.dev/intake-web-app.html) · [Code](https://github.com/dquint32/bilingual-patient-intake-fhir) |
| **HL7 v2.x Infectious Disease Parser** | ORU^R01 parsing, LOINC check-digit validation, located error reporting, 81 tests | [Case study](https://davidquintana.dev/hl7-parser.html) · [Code](https://github.com/dquint32/hl7-infectious-disease-parser) |
| **Pediatric CDS Dosage Calculator** | Weight-based dosing with a hard stop and 80% caution threshold, bilingual instructions | [Case study](https://davidquintana.dev/pediatric-cds-calculator.html) · [Code](https://github.com/dquint32/bilingual-pediatric-CDS-dosage-calculator) |
| **FHIR Patient Converter** | US Core Patient mapping with a batch CLI, 53 tests | [Code](https://github.com/dquint32/fhir-patient-converter) |

I also build bilingual websites for small businesses through Servicios Quintana LLC — see [web development](https://davidquintana.dev/web-dev.html).

## How the site is built

Plain HTML, CSS, and JavaScript — no framework, no build step — hosted on GitHub Pages.

| Path | Purpose |
|---|---|
| `*.html` | One file per page. Every translatable element appears twice, with `data-lang="en"` and `data-lang="es"`. |
| `styles.css` | Single stylesheet: design tokens, dark (default) and light themes, components. |
| `main.js` | Language and theme toggles (saved in `localStorage`), mobile menu, screenshot lightbox, back-to-top. |
| `assets/img/` | WebP images, organized by project. `og-card.png` is the link-preview image. |
| `sitemap.xml`, `robots.txt`, `404.html`, `favicon.svg` | Search and hosting support files. |

**Editing text:** change both the `data-lang="en"` and the `data-lang="es"` versions of an element. CSS hides whichever language is inactive.

**Adding a screenshot:** export it as WebP (about 1600 px wide), put it in `assets/img/<project>/`, and give the `<img>` `width`, `height`, `alt`, and `class="zoomable"` so it opens in the lightbox.

**Accessibility:** pages are checked with axe-core (WCAG 2 A/AA) in both languages and themes, at desktop and phone widths.

## Contact

[LinkedIn](https://www.linkedin.com/in/quintanadm95) · [GitHub](https://github.com/dquint32) · WhatsApp / phone: 303-500-4122

---

© 2026 Servicios Quintana LLC. David Quintana Dev is a registered trade name of Servicios Quintana LLC. See [LICENSE](LICENSE).

---

## 🇪🇸 En español

**Ingeniero de Datos Clínicos · Sistemas de Información de Salud** — https://davidquintana.dev

Construyo pipelines ETL en Python/pandas y herramientas HL7/FHIR que extraen, limpian y validan datos clínicos bajo HIPAA y GCP. Licenciatura en HCIS, MSU Denver (2026). Totalmente bilingüe.

El sitio es HTML, CSS y JavaScript sin frameworks ni paso de compilación, publicado en GitHub Pages. Cada texto existe dos veces (`data-lang="en"` y `data-lang="es"`); al editar, cambia ambas versiones.
