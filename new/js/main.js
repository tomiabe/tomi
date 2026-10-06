/* ==========================================================================
   Tomi Abe Ecosystem: Shared Interactive Script
   ========================================================================== */

(function () {
  'use strict';

  // 1. Theme Management (automatic: light 7am-7pm Sydney, dark otherwise)
  const root = document.documentElement;

  function initTheme() {
    try {
      const hour = Number(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Australia/Sydney',
          hour: 'numeric',
          hourCycle: 'h23',
        }).format(new Date())
      );
      root.dataset.theme = hour >= 7 && hour < 19 ? 'light' : 'dark';
    } catch {
      root.dataset.theme = 'light';
    }
  }

  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  }

  initTheme();

  document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle buttons (rooms only; index theme is automatic)
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    // Live clock: visitor's local time by default, small toggle for Tomi's time
    const clockEl = document.querySelector('[data-live-time]');
    const clockToggle = document.querySelector('.clock-toggle');
    let clockMode = 'local';
    try {
      if (localStorage.getItem('tomi-clock-mode-v1') === 'owner') clockMode = 'owner';
    } catch (e) {
      /* ignore */
    }

    const formatClock = () => {
      const opts = { hour: 'numeric', minute: '2-digit', hour12: true };
      if (clockMode === 'owner') opts.timeZone = 'Australia/Sydney';
      return new Intl.DateTimeFormat('en-US', opts).format(new Date());
    };

    const syncClock = () => {
      if (!clockEl) return;
      clockEl.textContent = formatClock();
      clockEl.setAttribute('datetime', new Date().toISOString());
    };

    const syncClockToggle = () => {
      if (!clockToggle) return;
      const owner = clockMode === 'owner';
      clockToggle.classList.toggle('is-active', owner);
      clockToggle.setAttribute('aria-pressed', String(owner));
      const label = owner ? 'Show your local time' : "Show Tomi's time";
      clockToggle.setAttribute('aria-label', label);
      clockToggle.title = label;
    };

    if (clockEl) {
      syncClock();
      syncClockToggle();
      setInterval(syncClock, 30000);
      if (clockToggle) {
        clockToggle.addEventListener('click', () => {
          clockMode = clockMode === 'owner' ? 'local' : 'owner';
          try {
            localStorage.setItem('tomi-clock-mode-v1', clockMode);
          } catch (e) {
            /* ignore */
          }
          syncClock();
          syncClockToggle();
        });
      }
    }

    // Nav style: floating top pill vs floating bottom dock
    const styleBtns = document.querySelectorAll('.nav-style-toggle');

    function syncNavStyle() {
      const style = root.dataset.navstyle === 'dock' ? 'dock' : 'pill';
      const target = style === 'pill' ? 'dock' : 'pill';
      styleBtns.forEach((btn) => {
        const icon = target === 'dock' ? 'ph-arrow-line-down' : 'ph-arrow-line-up';
        const label = target === 'dock' ? 'Move navigation to bottom' : 'Move navigation to top';
        btn.innerHTML = `<i class="ph ${icon}" aria-hidden="true"></i>`;
        btn.setAttribute('aria-label', label);
        btn.title = label;
      });
    }

    styleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = root.dataset.navstyle === 'dock' ? 'pill' : 'dock';
        root.dataset.navstyle = next;
        try {
          localStorage.setItem('tomi-nav-style-v1', next);
        } catch (e) {
          console.warn('LocalStorage unavailable for nav style saving:', e);
        }
        syncNavStyle();
      });
    });

    syncNavStyle();

    // Active link marker determination based on current URL path
    const pathname = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    const rooms = ['me', 'work', 'studio', 'writing', 'photos', 'career'];

    // Which room are we on?
    let currentRoom = 'overview';
    rooms.forEach((room) => {
      if (pathname.includes(`/${room}/`)) currentRoom = room;
    });

    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.remove('is-active');

      // Match relative ("me/index.html") and absolute ("/me/index.html") hrefs
      const linkedRoom = rooms.find((room) => href.includes(`/${room}/`) || href.startsWith(`${room}/`)) || null;

      if (currentRoom === 'overview') {
        const isHomeLink = !linkedRoom && (href === 'index.html' || href === './' || href === '/' || href === '../index.html');
        if (isHomeLink) link.classList.add('is-active');
      } else if (linkedRoom === currentRoom) {
        link.classList.add('is-active');
      }
    });

    // Mobile pill menu: compact summary expands into a floating room list
    const pillNav = document.querySelector('.nav-pill');
    const pillSummary = document.querySelector('.pill-summary');
    if (pillNav && pillSummary) {
      const summaryLabel = pillSummary.querySelector('.pill-summary-label');

      const syncSummary = () => {
        const current = pillNav.querySelector('.nav-link.is-active');
        if (current && summaryLabel) summaryLabel.textContent = current.textContent.trim();
      };

      const closePill = () => {
        pillNav.classList.remove('is-open');
        pillSummary.setAttribute('aria-expanded', 'false');
      };

      syncSummary();

      pillSummary.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = pillNav.classList.toggle('is-open');
        pillSummary.setAttribute('aria-expanded', String(open));
      });

      pillNav.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', closePill);
      });

      document.addEventListener('click', (e) => {
        if (!pillNav.contains(e.target)) closePill();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePill();
      });
    }

    // Side navigation: sliding drawer on mobile
    const menuBtn = document.querySelector('.menu-toggle');
    const sideNav = document.querySelector('.side-nav');
    const navOverlay = document.querySelector('.nav-overlay');

    if (menuBtn && sideNav) {
      const setMenu = (open) => {
        sideNav.classList.toggle('is-open', open);
        if (navOverlay) navOverlay.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      };

      menuBtn.addEventListener('click', () => {
        setMenu(!sideNav.classList.contains('is-open'));
      });

      sideNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
      });

      if (navOverlay) {
        navOverlay.addEventListener('click', () => setMenu(false));
      }

      const navClose = document.querySelector('.nav-close');
      if (navClose) {
        navClose.addEventListener('click', () => setMenu(false));
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
      });
    }

    // Scrollspy: highlight the section in view
    const sideLinks = Array.from(document.querySelectorAll('.side-links a[href^="#"]'));
    const watchedSections = sideLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (watchedSections.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sideLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
            });
          });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      watchedSections.forEach((section) => observer.observe(section));
    }

    // Year update
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });

  // 2. Interactive Field Canvas
  const canvas = document.querySelector('#field');
  if (canvas) {
    const context = canvas.getContext('2d');
    let fieldWidth = 0;
    let fieldHeight = 0;
    let frameId = 0;
    let lastFrame = 0;
    let fieldTime = 0;
    let pointer = { x: -1000, y: -1000 };

    function resizeField() {
      if (!context) return;
      fieldWidth = window.innerWidth;
      fieldHeight = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(fieldWidth * ratio);
      canvas.height = Math.round(fieldHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawField(timestamp) {
      if (timestamp - lastFrame >= 33) {
        fieldTime += Math.min(timestamp - lastFrame, 50) * 0.00012;
        lastFrame = timestamp;
        context.clearRect(0, 0, fieldWidth, fieldHeight);
        
        const color = root.dataset.theme === 'dark' ? '65,234,212' : '12,15,10';
        const spacing = 32;

        for (let col = 0; col < fieldWidth; col += spacing) {
          for (let row = 0; row < fieldHeight; row += spacing) {
            const wave = Math.sin(col * 0.007 + fieldTime) * Math.cos(row * 0.008 - fieldTime * 0.6);
            const dist = Math.hypot(col - pointer.x, row - pointer.y);
            const influence = Math.max(0, 1 - dist / 220);
            const intensity = Math.max(0, wave - 0.1) * 0.08 + influence * 0.1;
            
            if (intensity < 0.015) continue;
            context.fillStyle = `rgba(${color},${intensity})`;
            const size = 1.5 + influence * 1.5;
            context.fillRect(col, row, size, size);
          }
        }
      }
      frameId = requestAnimationFrame(drawField);
    }

    window.addEventListener('pointermove', (e) => {
      pointer = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      pointer = { x: -1000, y: -1000 };
    });

    window.addEventListener('resize', resizeField);
    resizeField();
    
    // Respect reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reducedMotion.matches) {
      lastFrame = performance.now();
      frameId = requestAnimationFrame(drawField);
    }
  }
})();
