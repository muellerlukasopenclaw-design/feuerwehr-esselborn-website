# Feuerwehr Esselborn - Moderne Website

🌐 **Live-Version:** https://feuerwehr.gemeinde-esselborn.de/ (voraussichtlich ab April 2026)

🖼️ **Demo-Version:** https://muellerlukasopenclaw-design.github.io/feuerwehr-esselborn-website/

**Status:** ✅ Abgeschlossen | **Version:** 1.0 | **Datum:** April 2026

---

## 🎯 Projektziel

Modernisierung der bestehenden Feuerwehr-Website mit Fokus auf:

- **Wartungsarmut:** Keine Datenbank, kein CMS, keine komplexe Toolchain
- **Barrierearmut:** WCAG 2.1 AA konform, Tastaturbedienbar, Screenreader-freundlich
- **Performance:** Minimale Requests, optimierte Assets, schnelle Ladezeiten
- **Pflegbarkeit:** Inhalte über einfache JSON-Dateien editierbar

---

## 📁 Projektstruktur

```
feuerwehr-esselborn-site/
├── index.html             # Hauptseite (statisch)
├── css/
│   └── style.css          # Vollständiges CSS (kommentiert)
├── js/
│   └── main.js            # Minimales JS (kommentiert)
├── img/                   # Bildverzeichnis
│   ├── feuerwehr-*.jpg    # Galerie-Bilder
│   ├── 125/               # Jubiläums-Bilder
│   └── placeholder-*.svg  # Platzhalter für Mitglieder
├── data/
│   ├── mannschaft.json    # ✅ Pflegbare Mitgliederliste (16 Mitglieder)
│   ├── termine.json       # ✅ Termine 2026 (23 Termine)
│   └── termine-2026.ics   # 📅 iCal-Datei zum Download
├── legal/
│   ├── impressum.html     # Impressum
│   └── datenschutz.html   # Datenschutzerklärung
└── README.md              # Diese Datei
```

---

## 🔧 Pflegehinweise

### Mitgliederliste aktualisieren

**Datei:** `data/mannschaft.json`

```json
{
  "name": "Max Mustermann",
  "dienstgrad": "Oberbrandmeister",
  "funktion": "Wehrführer, AGT",
  "bild": "foto.jpg",
  "aktiv": true,
  "reihenfolge": 1
}
```

**Für Nicht-Entwickler:**
1. Datei in einfachem Texteditor (Notepad/Editor) öffnen
2. Text zwischen Anführungszeichen ändern
3. Speichern
4. Fertig – keine Programmierkenntnisse nötig

**Hinweise:**
- `bild`: `placeholder-X.svg` = bunter Platzhalter, `"foto.jpg"` = echtes Foto
- `aktiv`: Auf `false` setzen = Mitglied wird ausgeblendet
- `reihenfolge`: Bestimmt die Reihenfolge in der Anzeige (1-16)

### Termine aktualisieren

**Datei:** `data/termine.json`

Alle Termine für 2026 sind dort hinterlegt – einfach Datum, Uhrzeit oder Titel ändern. Die iCal-Datei (`termine-2026.ics`) wird manuell aus den JSON-Daten erstellt.

### Design anpassen

**Farben:** In `css/style.css` die CSS-Variablen oben ändern:

```css
--color-primary: #B91C1C;  /* Feuerwehr-Rot */
--color-text: #1F2937;     /* Textfarbe */
```

---

## 🚀 Deployment

### Voraussetzungen

- Statischer Webspace (kein PHP nötig!)
- Optional: SSL-Zertifikat (HTTPS empfohlen)

### Schritte

1. **Alle Dateien hochladen** per FTP/SFTP
2. **Fertig** – keine Installation, keine Datenbank

### Empfohlene Ordnerstruktur auf Server

```
/public_html/  oder  /www/
  ├── index.html
  ├── css/
  ├── js/
  ├── img/
  ├── data/
  └── legal/
```

---

## 📊 Technische Spezifikation

| Aspekt | Implementierung | Begründung |
|--------|-----------------|------------|
| **Architektur** | 100% Statisch | Kein Server nötig, GitHub Pages kompatibel |
| **CSS** | Vanilla CSS mit Variablen | Kein Build-Prozess nötig |
| **JS** | Vanilla JS (~5 KB) | Keine Framework-Abhängigkeit |
| **Bilder** | Lazy Loading + SVG-Platzhalter | Performance |
| **Accessibility** | WCAG 2.1 AA | Screenreader, Tastatur, Kontrast |
| **SEO** | Semantic HTML, Meta-Tags | Auffindbarkeit |
| **Karte** | OpenStreetMap Link | Datenschutzfreundlich (kein automatisches Tracking) |

---

## ✅ Migration: Alt → Neu

### Übernommene Inhalte

| Inhalt | Umsetzung |
|--------|-----------|
| **16 Mitglieder** | Vollständig übernommen, jetzt in JSON pflegbar |
| **Kalender** | iCal-Datei zum Download, OpenStreetMap statt Google |
| **Förderverein-Infos** | Strukturiert aufbereitet |
| **Kontaktdaten** | Zentralisiert |
| **125-Jahre-Jubiläum** | Eigener Bereich mit Statistiken + 11 Jubiläumsbildern |

### Verbesserungen

| Aspekt | Alt | Neu |
|--------|-----|-----|
| Mobile Optimierung | ❌ Nicht vorhanden | ✅ Mobile-first |
| Barrierearmut | ❌ Grundlegend | ✅ WCAG 2.1 AA |
| SEO | ❌ Keine Meta-Tags | ✅ Vollständig |
| Performance | ❌ Unoptimiert | ✅ ~15 KB CSS+JS |
| Pflegbarkeit | ❌ HTML-Editierung | ✅ JSON-Dateien |
| Bildergalerie | ❌ Veraltet | ✅ Moderne Lightbox |
| Datenschutz | ❌ Google Maps | ✅ OpenStreetMap + DSGVO-konform |

### Entfernte Altlasten

- Veraltete Tabellen-Layout (ersetzt durch CSS Grid)
- Inline-Styles (alles in CSS ausgelagert)
- Überflüssige externe Skripte
- PHP-Abhängigkeit (jetzt 100% statisch)

---

## ⚠️ Redaktionell zu prüfen

Die folgenden Inhalte sollten manuell überprüft und ergänzt werden:

### 🔴 Priorität: Hoch

- [ ] **Mannschaftsfotos** - Derzeit bunte SVG-Platzhalter, echte Fotos einfügen
  - Fotos in `/img/` hochladen
  - `data/mannschaft.json` aktualisieren (`bild: "name.jpg"`)

### 🟡 Priorität: Mittel

- [ ] **Downloads** - Bereich vorbereitet, aber leer:
  - Mitgliedsanträge als PDF
  - Informationsblätter
- [ ] **Einsatzberichte** - Neue Rubrik möglich

### 🟢 Priorität: Niedrig

- [ ] **Historie 125 Jahre** - Derzeit nur Statistiken, detaillierte Historie möglich
- [ ] **Social Media Links** - Falls vorhanden

### 📋 Prüf-Workflow

```
1. Aktuelle Mitgliederliste von Wehrführer anfordern
2. Fotos von aktiven Mitgliedern sammeln (Einheitlicher Hintergrund)
3. Bilder in /img/ hochladen (empfohlen: 400x400px, JPG)
4. data/mannschaft.json aktualisieren
5. Git commit & push
```

---

## 🛡️ Sicherheit & Barrierearmut

### WCAG 2.1 AA Konformität

- ✅ **Kontraste:** Alle Texte 4.5:1 oder höher
- ✅ **Tastatur:** Vollständige Navigation ohne Maus möglich
- ✅ **Skip-Link:** Sprung zum Hauptinhalt
- ✅ **ARIA-Labels:** Screenreader-Unterstützung
- ✅ **Alt-Texte:** Für alle Bilder vorgesehen
- ✅ **Fokus-Indikatoren:** Deutlich sichtbar

### Datenschutz

- ✅ Keine externen Tracking-Skripte
- ✅ Keine Cookies (außer technisch notwendige)
- ✅ OpenStreetMap erst bei Klick (kein automatisches IP-Tracking)
- ✅ Statisches Hosting möglich (kein Server-Processing)

### Performance

- Keine externen Requests (kein CDN, keine Fonts)
- Lazy Loading für Bilder
- Minimaler JavaScript-Code
- Keine Render-blocking Ressourcen

---

## 📄 Lizenz & Rechte

© 2026 Freiwillige Feuerwehr Esselborn

Diese Website wurde für die Feuerwehr Esselborn erstellt und ist für deren exklusive Nutzung bestimmt.

---

## 🔧 Entwickler-Notizen

**Migration durchgeführt von:** OpenClaw  
**Letzte Aktualisierung:** April 2026  
**Version:** 1.0 (Production Ready)

**Technische Entscheidungen:**
- Kein CSS-Framework (Bootstrap etc.) → Zu viel Overhead
- Kein JavaScript-Framework → Nicht notwendig für diese Seite
- JSON statt Datenbank → Einfachere Pflege
- 100% statisch → GitHub Pages kompatibel, kein PHP nötig

**Features:**
- Bildergalerie mit Lightbox (15 Bilder von alter Seite übernommen)
- Animationen für Statistiken (Hochzählen)
- Responsive Navigation mit Burger-Menü
- Termine 2026 mit iCal-Download
- Platzhalter-System für Mitglieder ohne Foto

**Zukunftssicherheit:**
- CSS-Variablen für einfaches Rebranding
- Semantisches HTML für lange Wartbarkeit
- Keine veralteten Techniken (kein jQuery, kein IE-Support nötig)

---

**Fragen oder Probleme?**  
Kontakt: feuerwehr@gemeinde-esselborn.de
