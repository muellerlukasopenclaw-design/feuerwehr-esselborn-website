# Migrations-Dokumentation: Feuerwehr Esselborn Website

## Analyse der bestehenden Website (feuerwehr.gemeinde-esselborn.de)

### Übernommene Inhalte

| Inhalt | Alt-Struktur | Neue Struktur | Anmerkung |
|--------|--------------|---------------|-----------|
| **Mannschaft** | Statische HTML-Tabelle | `data/mannschaft.json` + PHP | ✅ Jetzt pflegbar ohne Code-Kenntnisse |
| **Termine** | Nur iCal-Link | `data/termine.json` + Dokumentation | ✅ Klare Anleitung für Mitglieder |
| **Förderverein-Infos** | Fließtext | Strukturierte Abschnitte | ✅ Bessere Lesbarkeit |
| **Kontaktdaten** | Im Text verstreut | Zentrale Kontakt-Box | ✅ Sofort auffindbar |
| **125-Jahre-Jubiläum** | Kurz erwähnt | Eigener Bereich mit Statistik | ✅ Höherer Stellenwert |

### Strukturelle Verbesserungen

| Aspekt | Alt | Neu | Begründung |
|--------|-----|-----|------------|
| **Navigation** | Einfache Liste | Fixed Header mit Smooth-Scroll | Mobile-Optimierung |
| **Hero-Bereich** | Nur Überschrift | Vollständiges Hero mit CTA | Bessere Conversion |
| **Mannschaftsdarstellung** | Tabelle | Cards mit Dienstgrad-Badges | Moderner, übersichtlicher |
| **Kalender-Integration** | Nur Link | Visuell aufbereitet + Anleitungen | Benutzerfreundlicher |
| **Responsive Design** | Nicht vorhanden | Mobile-first Ansatz | 50%+ mobile Nutzer |
| **SEO** | Keine Meta-Tags | Vollständige Meta-Daten | Bessere Auffindbarkeit |

### Entfernte Altlasten

| Element | Grund |
|---------|-------|
| **Veraltete Bilder/Galerie** | Keine aktuellen Bilder vorhanden, Platzhalter konzipiert |
| **Überflüssige JavaScript-Libraries** | Keine externen Abhängigkeiten mehr |
| **Inline-Styles** | Komplett in CSS-Datei ausgelagert |
| **Tabellen-Layout** | Modernes Grid-System statt Tabellen |

### Redaktionell zu prüfen (siehe README.md)

- ⚠️ Bilder der Mannschaft (derzeit Platzhalter)
- ⚠️ Aktuelle Termine (derzeit nur wiederkehrende)
- ⚠️ 125-Jahre-Jubiläum-Inhalte (nur Stats, keine Historie)
- ⚠️ Downloads (Bereich vorbereitet, aber leer)
- ⚠️ Aktuelle Einsatzberichte (nicht in alter Seite gefunden)

## Architektur-Vergleich

### Alt (Single-File-Approach)
```
index.html (alles inline, ~5000 Zeilen)
```

### Neu (Strukturierte Trennung)
```
/index.php              # Logik & Struktur
/css/style.css        # Design (wartbar)
/js/scripts.js        # Interaktivität (minimal)
/data/mannschaft.json # Pflegbare Inhalte
/data/termine.json    # Pflegbare Inhalte
/img/                 # Bilder (optimiert)
/downloads/           # PDFs etc.
/legal/               # Impressum & Datenschutz
```

## Wartungsarmut-Entscheidungen

1. **Kein Build-Prozess** → Direktes Editieren möglich
2. **JSON statt Datenbank** → Mit Texteditor pflegbar
3. **Keine externen CDN** → Keine Abhängigkeitsrisiken
4. **Semantic HTML** → Barrierefreiheit out-of-the-box
5. **CSS-Variablen** → Farben zentral änderbar

## Performance-Optimierungen

- CSS: 9.8 KB (minifiziert ~7 KB)
- JS: 4 KB (minifiziert ~3 KB)
- Keine externen Requests
- Lazy Loading für Bilder vorbereitet
- Keine Framework-Overhead

---

*Erstellt am: 7. April 2026*
*Migration durchgeführt von: OpenClaw*
