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
├── index.php              # Hauptseite (PHP nur für JSON-Ladung)
├── css/
│   └── style.css          # Vollständiges CSS (11.7 KB, kommentiert)
├── js/
│   └── main.js            # Minimales JS (3.2 KB, kommentiert)
├── img/                   # Bildverzeichnis (derzeit Platzhalter)
├── downloads/             # PDFs, Dokumente (vorbereitet)
├── data/
│   ├── mannschaft.json    # ✅ Pflegbare Mitgliederliste
│   └── termine.json       # ✅ Pflegbare Termine
├── legal/
│   ├── impressum.html     # Impressum
│   └── datenschutz.html   # Datenschutzerklärung
├── MIGRATION.md           # Dokumentation der Migration
└── README.md            # Diese Datei
```

---

## 🔧 Pflegehinweise

### Mitgliederliste aktualisieren

**Datei:** `data/mannschaft.json`

```json
{
  "name": "Max Mustermann",
  "dienstgrad": "Oberbrandmeister",
  "funktion": "Wehrführer",
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
- `bild`: Leer lassen = Platzhalter wird angezeigt
- `aktiv`: Auf `false` setzen = Mitglied wird ausgeblendet
- `reihenfolge`: Bestimmt die Reihenfolge in der Anzeige

### Termine aktualisieren

**Datei:** `data/termine.json`

Wiederkehrende Termine und Sondertermine getrennt pflegen.

### Design anpassen

**Farben:** In `css/style.css` die CSS-Variablen oben ändern:

```css
--color-primary: #B91C1C;  /* Feuerwehr-Rot */
--color-text: #1F2937;     /* Textfarbe */
```

---

## 🚀 Deployment

### Voraussetzungen

- PHP 7.4+ (nur für `file_get_contents()`)
- Webspace mit PHP-Unterstützung
- Optional: SSL-Zertifikat (HTTPS)

### Schritte

1. **Alle Dateien hochladen** per FTP/SFTP
2. **Rechte prüfen:** Dateien lesbar, bei Bedarf schreibbar für Uploads
3. **Fertig** – keine Installation, keine Datenbank

### Empfohlene Ordnerstruktur auf Server

```
/public_html/  oder  /www/
  ├── index.php
  ├── css/
  ├── js/
  ├── img/
  ├── downloads/
  ├── data/
  └── legal/
```

---

## 📊 Technische Spezifikation

| Aspekt | Implementierung | Begründung |
|--------|-----------------|------------|
| **Architektur** | Statisch + PHP JSON-Loader | Wartungsarm, keine DB |
| **CSS** | Vanilla CSS mit Variablen | Kein Build-Prozess nötig |
| **JS** | Vanilla JS (3.2 KB) | Keine Framework-Abhängigkeit |
| **Bilder** | Lazy Loading vorbereitet | Performance |
| **Accessibility** | WCAG 2.1 AA | Screenreader, Tastatur, Kontrast |
| **SEO** | Semantic HTML, Meta-Tags | Auffindbarkeit |

---

## ✅ Migration: Alt → Neu

### Übernommene Inhalte

| Inhalt | Umsetzung |
|--------|-----------|
| **17 Mitglieder** | Vollständig übernommen, jetzt in JSON pflegbar |
| **Kalender-Link** | Übernommen, visuell aufbereitet |
| **Förderverein-Infos** | Strukturiert aufbereitet |
| **Kontaktdaten** | Zentralisiert |
| **125-Jahre-Jubiläum** | Eigener Bereich mit Statistiken |

### Verbesserungen

| Aspekt | Alt | Neu |
|--------|-----|-----|
| Mobile Optimierung | ❌ Nicht vorhanden | ✅ Mobile-first |
| Barrierearmut | ❌ Grundlegend | ✅ WCAG 2.1 AA |
| SEO | ❌ Keine Meta-Tags | ✅ Vollständig |
| Performance | ❌ Unoptimiert | ✅ 11 KB CSS, 3 KB JS |
| Pflegbarkeit | ❌ HTML-Editierung | ✅ JSON-Dateien |

### Entfernte Altlasten

- Veraltete Bildergalerie (keine aktuellen Bilder)
- Überflüssige externe Skripte
- Tabellen-Layout (ersetzt durch CSS Grid)
- Inline-Styles (alles in CSS ausgelagert)

---

## ⚠️ Redaktionell zu prüfen

Die folgenden Inhalte sollten manuell überprüft und ergänzt werden:

### 🔴 Priorität: Hoch

- [ ] **Mannschaftsfotos** - Derzeit Platzhalter (👤), echte Fotos einfügen
- [ ] **Aktuelle Termine** - Derzeit nur wiederkehrende Übungen, Sondertermine ergänzen

### 🟡 Priorität: Mittel

- [ ] **Downloads** - Bereich vorbereitet, aber leer:
  - Mitgliedsanträge als PDF
  - Informationsblätter
  - Pressemitteilungen
- [ ] **Einsatzberichte** - Nicht in alter Seite vorhanden, neu erstellen?

### 🟢 Priorität: Niedrig

- [ ] **Historie 125 Jahre** - Derzeit nur Statistiken, detaillierte Historie möglich
- [ ] **Bildergalerie** - Modernes System vorbereitet, Bilder fehlen
- [ ] **Social Media Links** - Falls vorhanden

### 📋 Prüf-Workflow

```
1. Fotos von aktiven Mitgliedern sammeln
2. In /img/ hochladen
3. data/mannschaft.json aktualisieren (bild: "dateiname.jpg")
4. Termine prüfen und in data/termine.json ergänzen
5. Im Browser testen
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

### Performance

- Keine externen Requests (kein CDN, keine Fonts)
- Lazy Loading für Bilder
- Minimaler JavaScript-Code
- Keine Render-blocking Ressourcen

---

## 📄 Lizenz & Rechte

© 2024 Freiwillige Feuerwehr Esselborn

Diese Website wurde für die Feuerwehr Esselborn erstellt und ist für deren exklusive Nutzung bestimmt.

---

## 🔧 Entwickler-Notizen

**Migration durchgeführt von:** OpenClaw  
**Datum:** 7. April 2026  
**Version:** 1.0 (Production Ready)  

**Technische Entscheidungen:**
- Kein CSS-Framework (Bootstrap etc.) → Zu viel Overhead
- Kein JavaScript-Framework → Nicht notwendig für diese Seite
- JSON statt Datenbank → Einfachere Pflege
- PHP nur für file_get_contents → Könnte auch JS-fetch sein, aber PHP robuster

**Zukunftssicherheit:**
- CSS-Variablen für einfaches Rebranding
- Semantisches HTML für lange Wartbarkeit
- Keine veralteten Techniken (kein jQuery, kein IE-Support nötig)

---

**Fragen oder Probleme?**  
Kontakt: feuerwehr@gemeinde-esselborn.de
