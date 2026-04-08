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
    
    // Mobile Navigation
    initMobileNav();
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
 * Hilfsfunktion: Escapes HTML-Sonderzeichen
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
