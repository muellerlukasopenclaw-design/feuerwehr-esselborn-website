<?php
/**
 * Feuerwehr Esselborn - Hauptseite
 * Lädt Mannschaft und Termine aus JSON-Dateien
 */

// Daten laden
$mannschaftJson = @file_get_contents('data/mannschaft.json');
$termineJson = @file_get_contents('data/termine.json');

$mannschaftData = $mannschaftJson ? json_decode($mannschaftJson, true) : null;
$termineData = $termineJson ? json_decode($termineJson, true) : null;

$mannschaft = ($mannschaftData && isset($mannschaftData['mannschaft'])) ? $mannschaftData['mannschaft'] : [];
$wiederkehrendeTermine = ($termineData && isset($termineData['wiederkehrend'])) ? $termineData['wiederkehrend'] : [];
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Freiwillige Feuerwehr Esselborn - Retten, Löschen, Bergen, Schützen. Informieren Sie sich über unsere Mannschaft, Termine und Mitgliedschaft.">
    <meta name="theme-color" content="#B91C1C">
    <title>Freiwillige Feuerwehr Esselborn</title>
    
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
    
    <header class="hero" role="banner">
        <nav class="main-nav" aria-label="Hauptnavigation">
            <div class="container">
                <a href="index.php" class="logo" aria-label="Freiwillige Feuerwehr Esselborn - Startseite">
                    Feuerwehr Esselborn
                </a>
                
                <button class="menu-toggle" 
                        aria-label="Navigation öffnen" 
                        aria-expanded="false"
                        aria-controls="nav-menu">
                    <span aria-hidden="true">☰</span>
                </button>
                
                <ul class="nav-links" id="nav-menu" role="menubar">
                    <li role="none"><a href="#mannschaft" role="menuitem">Mannschaft</a></li>
                    <li role="none"><a href="#termine" role="menuitem">Termine</a></li>
                    <li role="none"><a href="#mitglied" role="menuitem">Mitglied werden</a></li>
                    <li role="none"><a href="legal/impressum.html" role="menuitem">Impressum</a></li>
                </ul>
            </div>
        </nav>
        
        <div class="hero-content">
            <div class="container">
                <h1>Freiwillige Feuerwehr Esselborn</h1>
                <p class="hero-subtitle" aria-label="Unsere Aufgaben: Retten, Löschen, Bergen, Schützen">
                    Retten · Löschen · Bergen · Schützen
                </p>
                <p class="hero-text">
                    Seit 1899 für die Sicherheit unserer Gemeinde im Einsatz. 
                    Wir sind Ihre Freiwillige Feuerwehr in Esselborn.
                </p>
                <a href="#mitglied" class="btn btn-primary">
                    Mitglied werden
                </a>
            </div>
        </div>
    </header>

    <main id="main-content">
        <!-- Mannschaft -->
        <section id="mannschaft" aria-labelledby="mannschaft-heading">
            <div class="container">
                <div class="section-title">
                    <h2 id="mannschaft-heading">Unsere Mannschaft</h2>
                    <p class="section-intro">
                        Engagierte Feuerwehrmänner und -frauen für Ihre Sicherheit
                    </p>
                </div>
                
                <?php if (!empty($mannschaft)): ?>
                <div class="mannschaft-grid">
                    <?php foreach ($mannschaft as $mitglied): ?>
                    <?php if (!empty($mitglied['aktiv'])): ?>
                    <article class="mitglied-card" tabindex="0">
                        <div class="mitglied-bild">
                            <?php if (!empty($mitglied['bild'])): ?>
                                <img src="img/<?php echo htmlspecialchars($mitglied['bild']); ?>" 
                                     alt="<?php echo htmlspecialchars($mitglied['name']); ?>"
                                     loading="lazy">
                            <?php else: ?>
                                <div class="mitglied-placeholder" aria-hidden="true">👤</div>
                            <?php endif; ?>
                        </div>
                        <div class="mitglied-info">
                            <h3><?php echo htmlspecialchars($mitglied['name']); ?></h3>
                            <span class="dienstgrad"><?php echo htmlspecialchars($mitglied['dienstgrad']); ?></span>
                            <p class="funktion"><?php echo htmlspecialchars($mitglied['funktion']); ?></p>
                        </div>
                    </article>
                    <?php endif; ?>
                    <?php endforeach; ?>
                </div>
                <?php else: ?>
                <p>Mannschaftsdaten werden aktualisiert.</p>
                <?php endif; ?>
            </div>
        </section>

        <!-- Termine -->
        <section id="termine" aria-labelledby="termine-heading">
            <div class="container">
                <div class="section-title">
                    <h2 id="termine-heading">Termine</h2>
                    <p class="section-intro">
                        Abonnieren Sie unseren Kalender für aktuelle Einsätze und Übungen
                    </p>
                </div>
                
                <div class="termine-content">
                    <?php if (!empty($wiederkehrendeTermine)): ?>
                    <h3>Wöchentliche Termine</h3>
                    <?php foreach ($wiederkehrendeTermine as $termin): ?>
                    <div class="termin-card">
                        <h4><?php echo htmlspecialchars($termin['titel']); ?></h4>
                        <p class="termin-meta">
                            <?php echo htmlspecialchars($termin['tag']); ?> 
                            um <?php echo htmlspecialchars($termin['uhrzeit']); ?><br>
                            <?php echo htmlspecialchars($termin['ort']); ?>
                        </p>
                        <p><?php echo htmlspecialchars($termin['beschreibung']); ?></p>
                    </div>
                    <?php endforeach; ?>
                    <?php endif; ?>
                    
                    <div style="margin-top: 2rem; text-align: center;">
                        <a href="https://calendar.google.com/calendar/ical/862fol2ms73o2mnncd36vdkuus%40group.calendar.google.com/public/basic.ics" 
                           class="btn btn-secondary kalender-link"
                           target="_blank"
                           rel="noopener noreferrer">
                            📅 Kalender abonnieren (iCal)
                        </a>
                        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-text-light);">
                            Kompatibel mit Outlook, iOS, Google Calendar
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mitglied werden -->
        <section id="mitglied" aria-labelledby="mitglied-heading">
            <div class="container">
                <div class="section-title">
                    <h2 id="mitglied-heading">Mitglied werden</h2>
                </div>
                
                <div class="mitglied-grid">
                    <div class="mitglied-art">
                        <h3>Als Feuerwehrmann/frau</h3>
                        <p>
                            Unterstützen Sie uns aktiv im Einsatz. Wir suchen motivierte Menschen, 
                            die sich für den Brandschutz und die Hilfeleistung in unserer Gemeinde engagieren möchten.
                        </p>
                        <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                            <li>Spannende Aufgaben</li>
                            <li>Kostenlose Ausbildung</li>
                            <li>Kameradschaft</li>
                            <li>Gemeinsame Erlebnisse</li>
                        </ul>
                        <a href="mailto:feuerwehr@gemeinde-esselborn.de?subject=Mitgliedsanfrage" class="btn btn-primary">
                            Kontakt aufnehmen
                        </a>
                    </div>
                    
                    <div class="mitglied-art">
                        <h3>Förderverein</h3>
                        <p>
                            Unterstützen Sie unsere Arbeit auch ohne aktiven Einsatzdienst. 
                            Als Mitglied im Förderverein helfen Sie uns finanziell und ideell.
                        </p>
                        <div style="background: var(--color-background-alt); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                            <p style="margin: 0; font-weight: 600;">Steuervorteil</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">
                                Mitgliedsbeiträge und Spenden sind steuerlich absetzbar.
                            </p>
                        </div>
                        
                        <div class="kontakt-box">
                            <p style="margin: 0; font-weight: 600;">Kontakt Förderverein</p>
                            <address style="margin-top: 0.5rem; font-style: normal;">
                                Jan Niklas Best<br>
                                Untergasse 21a<br>
                                55234 Esselborn<br>
                                <a href="mailto:feuerwehr@gemeinde-esselborn.de">feuerwehr@gemeinde-esselborn.de</a>
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Jubiläum -->
        <section id="jubilaeum" aria-labelledby="jubilaeum-heading">
            <div class="container" style="text-align: center;">
                <h2 id="jubilaeum-heading">125 Jahre Feuerwehr Esselborn</h2>
                <p style="max-width: 600px; margin: 0 auto 2rem; font-size: 1.125rem;">
                    Seit 1899 stehen wir für die Sicherheit in Esselborn. Über 125 Jahre ehrenamtliches Engagement 
                    für unsere Gemeinde.
                </p>
                
                <div class="stats-grid">
                    <div class="stat">
                        <span class="stat-number">125</span>
                        <span class="stat-label">Jahre</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number"><?php echo count($mannschaft); ?></span>
                        <span class="stat-label">aktive Mitglieder</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">1899</span>
                        <span class="stat-label">gegründet</span>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div>
                    <p style="font-weight: 600;">Freiwillige Feuerwehr Esselborn</p>
                    <p style="font-size: 0.875rem; opacity: 0.8;">Retten · Löschen · Bergen · Schützen</p>
                </div>
                <nav class="footer-nav" aria-label="Footer-Navigation">
                    <a href="legal/impressum.html">Impressum</a>
                    <a href="legal/datenschutz.html">Datenschutz</a>
                </nav>
            </div>
            <p class="copyright">
                &copy; <?php echo date('Y'); ?> Freiwillige Feuerwehr Esselborn
            </p>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
