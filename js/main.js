/**
 * Feuerwehr Esselborn - Minimal JavaScript
 * Fokus: Barrierearmut, Performance, keine externen Abhängigkeiten
 */

(function() {
  'use strict';
  
  // Mobile Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = navLinks.classList.toggle('active');
      this.setAttribute('aria-expanded', isExpanded);
    });
    
    // Schließen bei Klick auf Link
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Schließen bei Escape-Taste
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }
  
  // Aktive Navigation beim Scrollen
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  
  if (sections.length && navItems.length) {
    let currentSection = '';
    
    window.addEventListener('scroll', function() {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(function(section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = section.getAttribute('id');
        }
      });
      
      navItems.forEach(function(item) {
        item.removeAttribute('aria-current');
        if (item.getAttribute('href') === '#' + currentSection) {
          item.setAttribute('aria-current', 'page');
        }
      });
    });
  }
  
  // Header-Shadow bei Scroll
  const header = document.querySelector('.main-nav');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }
    });
  }
  
  // Tastatur-Navigation für Cards
  const cards = document.querySelectorAll('.mitglied-card');
  cards.forEach(function(card) {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.focus();
      }
    });
  });
  
})();

// Konsolen-Info (nicht blockierend)
if (console && console.log) {
  console.log('Freiwillige Feuerwehr Esselborn - Website geladen');
}
