/**
 * Feuerwehr Esselborn - Hauptskript
 * Lädt Mannschaft und Termine aus JSON-Dateien
 * WCAG 2.1 AA konform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Aktuelles Jahr im Footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Letztes Aktualisierungsdatum
    const lastUpdatedElement = document.getElementById('last-updated-date');
    if (lastUpdatedElement) {
        const today = new Date();
        const formattedDate = formatGermanDate(today);
        lastUpdatedElement.textContent = formattedDate;
    }

    // Scroll Progress Bar
    initScrollProgress();

    // Sticky Header Scroll-Effekt
    initStickyHeader();

    // Preloader ausblenden
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        });
    }

    // Navigation: Aktiver Bereich beim Scrollen markieren
    initScrollSpy();

    // Mannschaft laden
    loadMannschaft();

    // Termine laden
    loadTermine();

    // Newsletter laden
    loadNewsletter();

    // Mobile Navigation
    initMobileNav();

    // Dark Mode
    initThemeToggle();

    // Lightbox
    initLightbox();
});

/**
 * Formatiert ein Datum im deutschen Format: "11.04.2026"
 */
function formatGermanDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
}

/**
 * Formatiert eine Uhrzeit im deutschen Format: "19:30 Uhr"
 */
function formatGermanTime(timeStr) {
    if (!timeStr) return '';
    // Bereits im Format HH:MM
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
        return `${timeStr} Uhr`;
    }
    return timeStr;
}

/**
 * Formatiert ein Datum mit Wochentag: "Sa, 11.04."
 */
function formatGermanDateShort(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const wd = weekdays[date.getDay()];
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${wd}, ${d}.${m}.`;
}

/**
 * Sticky Header: Klassen beim Scrollen togglen
 */
function initStickyHeader() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Scroll Spy: Aktiven Nav-Link markieren
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    let ticking = false;

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial
    updateActiveLink();
}

/**
 * Lädt die Mannschaftsdaten aus JSON
 */
async function loadMannschaft() {
    const container = document.getElementById('mannschaft-container');
    if (!container) return;

    try {
        const response = await fetch('data/mannschaft.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const mannschaft = data.mannschaft || [];

        // Aktive Mitglieder filtern und sortieren
        const aktiveMitglieder = mannschaft
            .filter(mitglied => mitglied.aktiv)
            .sort((a, b) => (a.reihenfolge || 99) - (b.reihenfolge || 99));

        // Anzahl aktive Wehr (Einsatzkräfte)
        const aktiveMitgliederCount = mannschaft.filter(m => m.aktiv === true).length;

        // Statistik: Vereinsmitglieder = fix 65
        const countElement = document.getElementById('mitglieder-count');
        if (countElement) {
            countElement.textContent = '–';
            countElement.setAttribute('data-target', '65');
        }

        // Statistik: Aktive Wehr
        const aktiveCountElement = document.getElementById('aktive-count');
        if (aktiveCountElement) {
            aktiveCountElement.textContent = '–';
            aktiveCountElement.setAttribute('data-target', String(aktiveMitgliederCount));
        }

        // Statistik: Jahre seit Gründung (dynamisch)
        const currentYear = new Date().getFullYear();
        const yearsSinceFounding = currentYear - 1891;
        const jahreElement = document.getElementById('jahre-count');
        if (jahreElement) {
            jahreElement.textContent = '–';
            jahreElement.setAttribute('data-target', String(yearsSinceFounding));
            jahreElement.setAttribute('data-suffix', '+');
        }

        // Counter-Animation starten (IntersectionObserver)
        initCounters();

        // HTML generieren
        if (aktiveMitglieder.length === 0) {
            container.innerHTML = '<p class="loading-text">Mannschaftsdaten werden aktualisiert.</p>';
            return;
        }

        container.innerHTML = aktiveMitglieder.map((mitglied) => {
            const bildDatei = mitglied.bild || 'rank-fm.svg';
            const isRankIcon = bildDatei.startsWith('rank-');
            const altText = isRankIcon
                ? `Dienstgrad ${mitglied.dienstgrad}`
                : mitglied.name;
            const imgClass = isRankIcon ? 'rank-icon' : '';
            const fallback = `img/rank-fm.svg`;

            return `
                <article class="mitglied-card" tabindex="0">
                    <div class="mitglied-bild">
                        <img src="img/${escapeHtml(bildDatei)}"
                             alt="${escapeHtml(altText)}"
                             loading="lazy"
                             width="260"
                             height="180"
                             class="${imgClass}"
                             onerror="this.src='${fallback}'; this.alt='Dienstgrad ${escapeHtml(mitglied.dienstgrad)}';">
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
        container.innerHTML = `
            <div class="error-text" role="alert">
                <p><strong>Mannschaftsdaten konnten nicht geladen werden.</strong></p>
                <p>Bitte versuchen Sie es später erneut.</p>
            </div>
        `;
    }
}

/**
 * Lädt die Termindaten aus JSON
 */
async function loadTermine() {
    const container = document.getElementById('termine-container');
    if (!container) return;

    try {
        const response = await fetch('data/termine.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const termine2026 = data.termine_2026 || [];
        const wiederkehrend = data.wiederkehrend || [];
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

            Object.keys(termineByMonth).forEach(month => {
                html += `<h3 class="termin-monat">${escapeHtml(month)}</h3>`;
                html += termineByMonth[month].map(termin => {
                    const tag = formatGermanDateShort(termin.datum);
                    const zeit = formatGermanTime(termin.uhrzeit);
                    const datetimeAttr = `${termin.datum}T${termin.uhrzeit.replace(':', '')}:00`;

                    return `
                        <article class="termin-card">
                            <h4>${escapeHtml(termin.titel)}</h4>
                            <p class="termin-meta">
                                <time datetime="${datetimeAttr}">${escapeHtml(tag)}</time>
                                um ${escapeHtml(zeit)}<br>
                                ${escapeHtml(termin.ort)}
                            </p>
                            <p>${escapeHtml(termin.beschreibung)}</p>
                        </article>
                    `;
                }).join('');
            });
        }

        // Wiederkehrende Termine
        if (wiederkehrend.length > 0) {
            html += '<h3 class="termin-wiederkehrend-titel">Regelmäßige Termine</h3>';
            html += wiederkehrend.map(termin => `
                <article class="termin-card termin-card-secondary">
                    <h4>${escapeHtml(termin.titel)}</h4>
                    <p class="termin-meta">
                        ${escapeHtml(termin.wochentag)}s, ${escapeHtml(termin.uhrzeit)} Uhr<br>
                        ${escapeHtml(termin.ort)}
                    </p>
                    <p>${escapeHtml(termin.beschreibung)}</p>
                </article>
            `).join('');
        }

        // Hilfetexte aktualisieren
        if (hilfetexte.outlook) {
            const outlookHilfe = document.getElementById('outlook-hilfe');
            if (outlookHilfe) outlookHilfe.textContent = hilfetexte.outlook;
        }
        if (hilfetexte.ios) {
            const iosHilfe = document.getElementById('ios-hilfe');
            if (iosHilfe) iosHilfe.textContent = hilfetexte.ios;
        }

        container.innerHTML = html;

        // Countdown zum nächsten Termin
        updateCountdown(termine2026);

    } catch (error) {
        console.error('Fehler beim Laden der Termine:', error);
        container.innerHTML = `
            <div class="error-text" role="alert">
                <p><strong>Termine konnten nicht geladen werden.</strong></p>
                <p>Bitte versuchen Sie es später erneut.</p>
            </div>
        `;
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

    let naechsterTerminDatum = null;

    const heute = new Date();
    heute.setHours(0, 0, 0, 0);

    // Nächsten zukünftigen Termin finden
    const zukuenftigeTermine = termine
        .map(t => ({ ...t, dateObj: new Date(t.datum) }))
        .filter(t => {
            const tDate = new Date(t.datum);
            tDate.setHours(0, 0, 0, 0);
            return tDate >= heute;
        })
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

    // Text je nach Distanz
    let terminText;
    if (diffTage === 0) {
        terminText = `Heute: ${naechsterTermin.titel}`;
    } else if (diffTage === 1) {
        terminText = `Morgen: ${naechsterTermin.titel}`;
    } else {
        const terminDatum = formatGermanDateShort(naechsterTermin.datum);
        terminText = `${naechsterTermin.titel} am ${terminDatum}`;
    }

    terminElement.textContent = terminText;
    countdownContainer.style.display = 'block';

    // Klick-Handler: Scroll zum Termin
    const badge = countdownContainer.querySelector('.countdown-badge');
    if (badge) {
        badge.addEventListener('click', () => {
            if (naechsterTerminDatum) {
                const timeElement = document.querySelector(`time[datetime^="${naechsterTerminDatum}"]`);
                if (timeElement) {
                    const card = timeElement.closest('.termin-card');
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.focus();
                    }
                }
            }
        });

        // Tastatur-Navigation
        badge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                badge.click();
            }
        });
    }
}

/**
 * Initialisiert die mobile Navigation
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

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClickOutside);
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeMenu();
            return;
        }

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
 * Counter-Animation mit IntersectionObserver
 * Keine Nullwerte – stattdessen Fallback oder "–" bis Daten geladen sind
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const fallback = el.getAttribute('data-fallback') || '–';

                if (!isNaN(target) && target > 0) {
                    animateCounter(el, target, 2000, suffix);
                } else if (!isNaN(target) && target === 0) {
                    // 0 ist valide (z.B. keine aktiven Termine), zeige Fallback
                    el.textContent = fallback;
                } else {
                    // Keine Daten verfügbar
                    el.textContent = fallback;
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, targetValue, duration, suffix = '') {
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: easeOutQuart
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(targetValue * easeOutQuart);

        element.textContent = currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Lädt die Newsletter-/Aktuelles-Daten
 */
async function loadNewsletter() {
    const container = document.getElementById('newsletter-container');
    if (!container) return;

    try {
        const response = await fetch('data/news.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const beitraege = data.beitraege || [];
        const aktiveBeitraege = beitraege.filter(b => b.aktiv);

        if (aktiveBeitraege.length === 0) {
            container.innerHTML = `
                <div class="newsletter-empty" style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
                    <p style="font-size: 1.125rem; margin-bottom: 1rem; color: var(--grau-500);">
                        <span class="icon" aria-hidden="true">📷</span> Aktuelle Berichte und Bilder finden Sie auf Instagram.
                    </p>
                    <a href="https://www.instagram.com/feuerwehr_esselborn"
                       class="btn btn-primary"
                       target="_blank"
                       rel="noopener noreferrer">
                        <span class="icon" aria-hidden="true">📷</span> @feuerwehr_esselborn
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = aktiveBeitraege.map(beitrag => {
            const bildHtml = beitrag.bild
                ? `<img src="img/${escapeHtml(beitrag.bild)}"
                       alt="${escapeHtml(beitrag.titel)}"
                       loading="lazy"
                       width="400"
                       height="300">`
                : `<div class="newsletter-placeholder" aria-hidden="true">📷</div>`;

            const datum = beitrag.datum
                ? formatGermanDate(new Date(beitrag.datum))
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
            <div class="newsletter-error" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="margin-bottom: 1rem;"><strong>Beiträge konnten nicht geladen werden.</strong></p>
                <p style="color: var(--grau-500); margin-bottom: 1.5rem;">Aktuelle Inhalte finden Sie auf unserem Instagram-Account.</p>
                <a href="https://www.instagram.com/feuerwehr_esselborn"
                   class="btn btn-primary"
                   target="_blank"
                   rel="noopener noreferrer">
                    <span class="icon" aria-hidden="true">📷</span> Instagram
                </a>
            </div>
        `;
    }
}

/**
 * Theme Toggle (Dark Mode)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️';
        themeToggle.setAttribute('aria-label', 'Light Mode umschalten');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', newTheme === 'dark' ? 'Light Mode umschalten' : 'Dark Mode umschalten');
    });
}

/**
 * Scroll Progress Bar
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

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });

    updateProgress();
}

/**
 * Lightbox für Galerie
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox || !lightboxImg) return;

    const galerieItems = document.querySelectorAll('.galerie-item');
    let currentIndex = 0;

    function openLightbox(index) {
        const item = galerieItems[index];
        if (!item) return;

        const img = item.querySelector('img');
        const figcaption = item.querySelector('figcaption');

        if (!img) return;

        currentIndex = index;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Fokus auf Schließen-Button
        if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Fokus zurück auf aktuelles Bild
        const currentItem = galerieItems[currentIndex];
        if (currentItem) {
            const img = currentItem.querySelector('img');
            if (img) img.focus();
        }
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galerieItems.length) % galerieItems.length;
        const item = galerieItems[currentIndex];
        const img = item.querySelector('img');
        const figcaption = item.querySelector('figcaption');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galerieItems.length;
        const item = galerieItems[currentIndex];
        const img = item.querySelector('img');
        const figcaption = item.querySelector('figcaption');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = figcaption ? figcaption.textContent : img.alt;
    }

    // Event Listener für Galerie-Items
    galerieItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (!img) return;

        img.style.cursor = 'pointer';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Vergrößern: ${img.alt}`);

        img.addEventListener('click', () => openLightbox(index));
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Lightbox Controls
    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', showPrev);
    nextBtn?.addEventListener('click', showNext);

    // Schließen bei Klick auf Hintergrund
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Tastatur-Navigation in Lightbox
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
 * Hilfsfunktion: Escapes HTML-Sonderzeichen
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Service Worker registrieren
 */
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
