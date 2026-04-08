/**
 * Feuerwehr Esselborn - Hauptskript
 * Lädt Mannschaft und Termine aus JSON-Dateien
 * WCAG 2.1 AA konform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Aktuelles Jahr im Footer setzen
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
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
        
        // Aktive Mitglieder filtern und sortieren
        const aktiveMitglieder = mannschaft
            .filter(mitglied => mitglied.aktiv)
            .sort((a, b) => (a.reihenfolge || 99) - (b.reihenfolge || 99));
        
        // Mitglieder-Anzahl aktualisieren
        const countElement = document.getElementById('mitglieder-count');
        if (countElement) {
            countElement.textContent = aktiveMitglieder.length;
        }
        
        // HTML generieren
        if (aktiveMitglieder.length === 0) {
            container.innerHTML = '<p class="loading-text">Mannschaftsdaten werden aktualisiert.</p>';
            return;
        }
        
        container.innerHTML = aktiveMitglieder.map(mitglied => {
            const bildHtml = mitglied.bild 
                ? `<img src="img/${escapeHtml(mitglied.bild)}" alt="${escapeHtml(mitglied.name)}" loading="lazy">`
                : `<div class="mitglied-placeholder" aria-hidden="true">👤</div>`;
            
            return `
                <article class="mitglied-card" tabindex="0" aria-label="${escapeHtml(mitglied.name)}, ${escapeHtml(mitglied.dienstgrad)}">
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
        container.innerHTML = '<p class="error-text">Mannschaftsdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>';
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
        
        // Hilfetexte für Kalender-Integration
        const hilfetexte = data.hilfetexte || {};
        
        if (termine.length === 0) {
            container.innerHTML = '<p class="loading-text">Aktuell keine Termine verfügbar.</p>';
            return;
        }
        
        let html = `
            <h3>Wöchentliche Termine</h3>
            ${termine.map(termin => `
                <div class="termin-card" role="article" aria-label="${escapeHtml(termin.titel)}">
                    <h4>${escapeHtml(termin.titel)}</h4>
                    <p class="termin-meta">
                        <time datetime="${getWeekdayDate(termin.tag)}">${escapeHtml(termin.tag)}</time> 
                        um ${escapeHtml(termin.uhrzeit)}<br>
                        ${escapeHtml(termin.ort)}
                    </p>
                    <p>${escapeHtml(termin.beschreibung)}</p>
                </div>
            `).join('')}
        `;
        
        // Hilfetexte aktualisieren falls vorhanden
        if (hilfetexte.outlook) {
            const outlookHilfe = document.getElementById('outlook-hilfe');
            if (outlookHilfe) outlookHilfe.textContent = hilfetexte.outlook;
        }
        if (hilfetexte.ios) {
            const iosHilfe = document.getElementById('ios-hilfe');
            if (iosHilfe) iosHilfe.textContent = hilfetexte.ios;
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Fehler beim Laden der Termine:', error);
        container.innerHTML = '<p class="error-text">Termine konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>';
    }
}

/**
 * Initialisiert die mobile Navigation mit WCAG-Konformität
 */
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];
    
    if (!menuToggle || !navMenu) return;
    
    let lastFocusedElement = null;
    
    function openMenu() {
        menuToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('active');
        menuToggle.setAttribute('aria-label', 'Navigation schließen');
        lastFocusedElement = document.activeElement;
        
        // Fokus auf erstes Element setzen
        if (navLinks.length > 0) {
            navLinks[0].focus();
        }
        
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClickOutside);
    }
    
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-label', 'Navigation öffnen');
        
        // Fokus zurücksetzen
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
        
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside);
    }
    
    function handleKeyDown(e) {
        // ESC schließt Menu
        if (e.key === 'Escape') {
            closeMenu();
            return;
        }
        
        // Tab-Navigation im Menu
        if (e.key === 'Tab' && navMenu.classList.contains('active')) {
            const firstLink = navLinks[0];
            const lastLink = navLinks[navLinks.length - 1];
            
            if (e.shiftKey && document.activeElement === firstLink) {
                e.preventDefault();
                lastLink.focus();
            } else if (!e.shiftKey && document.activeElement === lastLink) {
                e.preventDefault();
                firstLink.focus();
            }
        }
    }
    
    function handleClickOutside(e) {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    }
    
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
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

/**
 * Hilfsfunktion: Berechnet nächsten Wochentag für datetime Attribut
 */
function getWeekdayDate(weekday) {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const today = new Date();
    const currentDay = today.getDay();
    const targetDay = days.indexOf(weekday);
    
    if (targetDay === -1) return '';
    
    const diff = targetDay - currentDay;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff + (diff <= 0 ? 7 : 0));
    
    return nextDate.toISOString().split('T')[0];
}