/**
 * Feuerwehr Esselborn - Hauptskript
 * Lädt Mannschaft und Termine aus JSON-Dateien
 * WCAG 2.1 AA konform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Scroll Progress Bar
    initScrollProgress();
    
    // Preloader ausblenden
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        });
    }
    
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
        
        // Mitglieder-Anzahl immer auf 65 setzen (hartkodiert) und animieren
        const countElement = document.getElementById('mitglieder-count');
        if (countElement) {
            countElement.textContent = '0';
            animateCounter('mitglieder-count', 65, 2000);
        }
        
        // Animation für 125 Jahre Hochzähl-Effekt
        animateCounter('jahre-count', 125, 2000);
        
        // Zufällige Platzhalter zuweisen wenn nötig
        const platzhalterPool = ['placeholder-1.svg', 'placeholder-2.svg', 'placeholder-3.svg', 
                                  'placeholder-4.svg', 'placeholder-5.svg', 'placeholder-6.svg',
                                  'placeholder-7.svg', 'placeholder-8.svg'];
        
        // HTML generieren
        if (aktiveMitglieder.length === 0) {
            container.innerHTML = '<p class="loading-text">Mannschaftsdaten werden aktualisiert.</p>';
            return;
        }
        
        container.innerHTML = aktiveMitglieder.map((mitglied, index) => {
            let bildDatei = mitglied.bild;
            // Wenn Platzhalter, wähle zufällig aus Pool (aber konsistent pro Mitglied via Index)
            if (!bildDatei || bildDatei.includes('placeholder')) {
                bildDatei = platzhalterPool[index % platzhalterPool.length];
            }
            const bildHtml = bildDatei 
                ? `<img src="img/${escapeHtml(bildDatei)}" alt="${escapeHtml(mitglied.name)}" loading="lazy">`
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
        const termine2026 = data.termine_2026 || [];
        const wiederkehrend = data.wiederkehrend || [];
        
        // Hilfetexte für Kalender-Integration
        const hilfetexte = data.hilfetexte || {};
        
        if (termine2026.length === 0 && wiederkehrend.length === 0) {
            container.innerHTML = '<p class="loading-text">Aktuell keine Termine verfügbar.</p>';
            return;
        }
        
        let html = '';
        
        // Termine 2026 anzeigen
        if (termine2026.length > 0) {
            // Sortiere nach Datum
            const sortedTermine = [...termine2026].sort((a, b) => new Date(a.datum) - new Date(b.datum));
            
            // Gruppiere nach Monat
            const termineByMonth = {};
            sortedTermine.forEach(termin => {
                const date = new Date(termin.datum);
                const monthKey = date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
                if (!termineByMonth[monthKey]) {
                    termineByMonth[monthKey] = [];
                }
                termineByMonth[monthKey].push(termin);
            });
            
            html += '<h3>Termine 2026</h3>';
            
            Object.keys(termineByMonth).forEach(month => {
                html += `<h4 class="termin-monat">${month}</h4>`;
                html += termineByMonth[month].map(termin => {
                    const date = new Date(termin.datum);
                    const tag = date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
                    const endDate = new Date(date.getTime() + termin.dauer_stunden * 60 * 60 * 1000);
                    const zeit = `${termin.uhrzeit} Uhr`;
                    
                    return `
                        <div class="termin-card" role="article" aria-label="${escapeHtml(termin.titel)}">
                            <h4>${escapeHtml(termin.titel)}</h4>
                            <p class="termin-meta">
                                <time datetime="${termin.datum}T${termin.uhrzeit.replace(':', '')}:00">${escapeHtml(tag)}</time> 
                                um ${escapeHtml(zeit)}<br>
                                ${escapeHtml(termin.ort)}
                            </p>
                            <p>${escapeHtml(termin.beschreibung)}</p>
                        </div>
                    `;
                }).join('');
            });
        }
        

        
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
        
        // Countdown zum nächsten Termin berechnen
        updateCountdown(termine2026);
        
    } catch (error) {
        console.error('Fehler beim Laden der Termine:', error);
        container.innerHTML = '<p class="error-text">Termine konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>';
    }
}

/**
 * Zeigt Countdown zum nächsten Termin an
 */
function updateCountdown(termine) {
    const countdownContainer = document.getElementById('termin-countdown');
    const tageElement = document.getElementById('countdown-tage');
    const terminElement = document.getElementById('countdown-termin');
    
    if (!countdownContainer || !tageElement || !terminElement) return;
    
    // Speichere nächsten Termin für Scroll-Funktion
    let naechsterTerminDatum = null;
    
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    
    // Finde den nächsten Termin
    const zukuenftigeTermine = termine
        .map(t => ({ ...t, dateObj: new Date(t.datum) }))
        .filter(t => t.dateObj >= heute)
        .sort((a, b) => a.dateObj - b.dateObj);
    
    if (zukuenftigeTermine.length === 0) {
        countdownContainer.style.display = 'none';
        return;
    }
    
    const naechsterTermin = zukuenftigeTermine[0];
    naechsterTerminDatum = naechsterTermin.datum;
    const diffZeit = naechsterTermin.dateObj - heute;
    const diffTage = Math.ceil(diffZeit / (1000 * 60 * 60 * 24));
    
    tageElement.textContent = diffTage;
    
    const terminText = diffTage === 0 
        ? 'Heute: ' + naechsterTermin.titel
        : diffTage === 1 
            ? 'Morgen: ' + naechsterTermin.titel
            : naechsterTermin.titel + ' am ' + naechsterTermin.dateObj.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' });
    
    terminElement.textContent = terminText;
    countdownContainer.style.display = 'block';
    
    // Klick-Handler: Scroll zum Termin
    countdownContainer.style.cursor = 'pointer';
    countdownContainer.title = 'Zum nächsten Termin scrollen';
    countdownContainer.addEventListener('click', () => {
        if (naechsterTerminDatum) {
            const terminElement = document.querySelector(`time[datetime^="${naechsterTerminDatum}"]`);
            if (terminElement) {
                terminElement.closest('.termin-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
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
 * Animiert einen Zähler von 0 bis zum Zielwert
 */
function animateCounter(elementId, targetValue, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Intersection Observer zum Starten der Animation wenn sichtbar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(element);
    
    function startCounting() {
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing-Funktion für sanftes Auslaufen
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
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

/**
 * Lightbox für Galerie initialisieren
 */
document.addEventListener('DOMContentLoaded', function() {
    initLightbox();
});

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox || !lightboxImg) return;
    
    const galerieItems = document.querySelectorAll('.galerie-item img');
    let currentIndex = 0;
    
    // Öffnen bei Klick auf Bild
    galerieItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            currentIndex = index;
            openLightbox(img);
        });
    });
    
    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        // Caption aus figcaption holen falls vorhanden
        const figcaption = img.closest('figure')?.querySelector('figcaption');
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Fokus zurück auf das aktuelle Bild
        if (galerieItems[currentIndex]) {
            galerieItems[currentIndex].focus();
        }
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + galerieItems.length) % galerieItems.length;
        const img = galerieItems[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        const figcaption = img.closest('figure')?.querySelector('figcaption');
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % galerieItems.length;
        const img = galerieItems[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        const figcaption = img.closest('figure')?.querySelector('figcaption');
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;
    }
    
    // Event Listener
    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', showPrev);
    nextBtn?.addEventListener('click', showNext);
    
    // Schließen bei Klick auf Hintergrund
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Tastatur-Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });
}

/**
 * Scroll Progress Bar initialisieren
 */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }
    
    // Throttle für Performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial setzen
    updateProgress();
}
/**
 * Schema.org Structured Data als JSON-LD einfügen
 */
function insertSchemaOrgData() {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Freiwillige Feuerwehr Esselborn",
        "url": "https://feuerwehr.gemeinde-esselborn.de/",
        "logo": "https://feuerwehr.gemeinde-esselborn.de/img/og-image.svg",
        "foundingDate": "1899",
        "description": "Freiwillige Feuerwehr Esselborn - Retten, Löschen, Bergen, Schützen seit 1899",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Obergasse 11",
            "addressLocality": "Esselborn",
            "postalCode": "55234",
            "addressCountry": "DE"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "feuerwehr@gemeinde-esselborn.de",
            "contactType": "Wehrführung"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

/**
 * Service Worker registrieren
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('[SW] Registriert:', registration.scope);
                })
                .catch((error) => {
                    console.log('[SW] Registrierung fehlgeschlagen:', error);
                });
        });
    }
}


/**
 * Schema.org Structured Data als JSON-LD einfügen
 */
function insertSchemaOrgData() {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Freiwillige Feuerwehr Esselborn",
        "url": "https://feuerwehr.gemeinde-esselborn.de/",
        "logo": "https://feuerwehr.gemeinde-esselborn.de/img/og-image.svg",
        "foundingDate": "1899",
        "description": "Freiwillige Feuerwehr Esselborn - Retten, Löschen, Bergen, Schützen seit 1899",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Obergasse 11",
            "addressLocality": "Esselborn",
            "postalCode": "55234",
            "addressCountry": "DE"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "feuerwehr@gemeinde-esselborn.de",
            "contactType": "Wehrführung"
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

/**
 * Service Worker registrieren
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('[SW] Registriert:', registration.scope);
                })
                .catch((error) => {
                    console.log('[SW] Registrierung fehlgeschlagen:', error);
                });
        });
    }
}
