/**
 * Feuerwehr Esselborn - Hauptskript
 * Lädt Mannschaft und Termine aus JSON-Dateien
 */

document.addEventListener('DOMContentLoaded', function() {
    // Aktuelles Jahr im Footer setzen
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mannschaft laden
    loadMannschaft();
    
    // Termine laden
    loadTermine();
    
    // Newsletter laden
    loadNewsletter();
    
    // Mobile Navigation
    initMobileNav();
    
    // Dark Mode
    initDarkMode();
});

/**
 * Lädt die Mannschaftsdaten aus JSON
 */
async function loadMannschaft() {
    const container = document.getElementById('mannschaft-container');
    
    try {
        const response = await fetch('data/mannschaft.json');
        if (!response.ok) {
            throw new Error('Netzwerkfehler beim Laden der Mannschaftsdaten');
        }
        
        const data = await response.json();
        const mannschaft = data.mannschaft || [];
        
        // Aktive Mitglieder filtern
        const aktiveMitglieder = mannschaft.filter(mitglied => mitglied.aktiv);
        
        // Mitglieder-Anzahl aktualisieren
        document.getElementById('mitglieder-count').textContent = aktiveMitglieder.length;
        
        // HTML generieren
        if (aktiveMitglieder.length === 0) {
            container.innerHTML = '<p>Mannschaftsdaten werden aktualisiert.</p>';
            return;
        }
        
        container.innerHTML = aktiveMitglieder.map(mitglied => {
            const bildHtml = mitglied.bild 
                ? `<img src="img/${escapeHtml(mitglied.bild)}" alt="${escapeHtml(mitglied.name)}" loading="lazy">`
                : `<div class="mitglied-placeholder" aria-hidden="true">👤</div>`;
            
            return `
                <article class="mitglied-card" tabindex="0">
                    <div class="mitglied-bild">
                        ${bildHtml}
                    </div>
                    <div class="mitglied-info">
                        <h3>${escapeHtml(mitglied.name)}</h3>
                        <span class="dienstgrad">${escapeHtml(mitglied.dienstgrad)}</span>
                        <p class="funktion">${escapeHtml(mitglied.funktion)}</p>
                    </div>
                </article>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Fehler beim Laden der Mannschaft:', error);
        container.innerHTML = '<p>Mannschaftsdaten konnten nicht geladen werden.</p>';
    }
}

/**
 * Lädt die Termindaten aus JSON
 */
async function loadTermine() {
    const container = document.getElementById('termine-container');
    
    try {
        const response = await fetch('data/termine.json');
        if (!response.ok) {
            throw new Error('Netzwerkfehler beim Laden der Termindaten');
        }
        
        const data = await response.json();
        const termine = data.wiederkehrend || [];
        
        if (termine.length === 0) {
            container.innerHTML = '<p>Aktuell keine Termine verfügbar.</p>';
            return;
        }
        
        container.innerHTML = `
            <h3>Wöchentliche Termine</h3>
            ${termine.map(termin => `
                <div class="termin-card">
                    <h4>${escapeHtml(termin.titel)}</h4>
                    <p class="termin-meta">
                        ${escapeHtml(termin.tag)} um ${escapeHtml(termin.uhrzeit)}<br>
                        ${escapeHtml(termin.ort)}
                    </p>
                    <p>${escapeHtml(termin.beschreibung)}</p>
                </div>
            `).join('')}
        `;
        
    } catch (error) {
        console.error('Fehler beim Laden der Termine:', error);
        container.innerHTML = '<p>Termine konnten nicht geladen werden.</p>';
    }
}

/**
 * Initialisiert die mobile Navigation
 */
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
}

/**
 * Lädt die Newsletter-/Aktuelles-Daten aus JSON
 */
async function loadNewsletter() {
    const container = document.getElementById('newsletter-container');
    if (!container) return;
    
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) {
            throw new Error('Netzwerkfehler beim Laden der News');
        }
        
        const data = await response.json();
        const beitraege = data.beitraege || [];
        
        // Nur aktive Beiträge anzeigen
        const aktiveBeitraege = beitraege.filter(b => b.aktiv);
        
        if (aktiveBeitraege.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl) 0;">
                    <p style="font-size: var(--font-size-lg); margin-bottom: var(--space-md);">
                        📷 Folge uns auf Instagram für aktuelle Bilder und Berichte!
                    </p>
                    <a href="https://www.instagram.com/feuerwehr_esselborn" 
                       class="btn btn-primary"
                       target="_blank"
                       rel="noopener noreferrer">
                        @feuerwehr_esselborn
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = aktiveBeitraege.map(beitrag => {
            const bildHtml = beitrag.bild 
                ? `<img src="img/${escapeHtml(beitrag.bild)}" alt="${escapeHtml(beitrag.titel)}" loading="lazy">`
                : `<div class="newsletter-placeholder" aria-hidden="true">📷</div>`;
            
            const datum = beitrag.datum 
                ? new Date(beitrag.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : '';
            
            return `
                <article class="newsletter-card">
                    <div class="newsletter-bild">
                        ${bildHtml}
                    </div>
                    <div class="newsletter-content">
                        <h3>${escapeHtml(beitrag.titel)}</h3>
                        <p class="newsletter-meta">${escapeHtml(datum)}</p>
                        <p class="newsletter-text">${escapeHtml(beitrag.text)}</p>
                    </div>
                </article>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Fehler beim Laden der News:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center;">
                <p>Beiträge konnten nicht geladen werden.</p>
                <a href="https://www.instagram.com/feuerwehr_esselborn" 
                   class="btn btn-primary"
                   target="_blank"
                   rel="noopener noreferrer">
                    📷 Instagram
                </a>
            </div>
        `;
    }
}

/**
 * Initialisiert den Dark Mode mit Toggle-Button
 */
function initDarkMode() {
    const navContainer = document.querySelector('.main-nav .container');
    if (!navContainer) return;
    
    // Prüfe gespeicherte Präferenz
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'true' || (savedMode === null && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    // Statischen Toggle-Button aus HTML verwenden
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;
    
    // Initialen Zustand setzen
    toggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', document.body.classList.contains('dark-mode') ? 'Light Mode umschalten' : 'Dark Mode umschalten');
    
    toggle.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        this.innerHTML = isDark ? '☀️' : '🌙';
        this.setAttribute('aria-label', isDark ? 'Light Mode umschalten' : 'Dark Mode umschalten');
    });
}

/**
 * Hilfsfunktion: Escapes HTML-Sonderzeichen
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
