/* ══════════════════════════════════════════════
   AdiOS Platform — app.js
   Terminal animations, scroll reveals, form, modals
══════════════════════════════════════════════ */

'use strict';

/* ─── DOM Ready ─── */
document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  initNavbar();
  initHamburger();
  initDropdowns();
  initComingSoonTooltips();
  initTerminalAnimation();
  initNodeGraph();
  initScrollReveal();
  initConfidenceBars();
  initWaitlistForm();
  initModals();
  initFooterModals();
  initScrollSpy();
  initSidebarScrollSpy();
  initNewsletterForm();
});

/* ══════════════════════════════════════════════
   IN-MEMORY STATE — all state stored in module-level variables
══════════════════════════════════════════════ */
var _state = {
  cookieConsented: false,
  waitlistEntries: [],
};

function _getItem(key) {
  if (key === 'adios_cookie_consent') return _state.cookieConsented ? 'true' : null;
  if (key === 'adios_waitlist') return JSON.stringify(_state.waitlistEntries);
  return null;
}

function _setItem(key, value) {
  if (key === 'adios_cookie_consent') _state.cookieConsented = (value === 'true');
  if (key === 'adios_waitlist') {
    try { _state.waitlistEntries = JSON.parse(value); } catch(e) {}
  }
}

/* ══════════════════════════════════════════════
   COOKIE BANNER
══════════════════════════════════════════════ */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const privacyLink = document.getElementById('cookie-privacy-link');
  if (!banner) return;

  if (_getItem('adios_cookie_consent') === 'true') {
    banner.classList.add('hidden');
    return;
  }

  acceptBtn?.addEventListener('click', () => {
    _setItem('adios_cookie_consent', 'true');
    banner.classList.add('hidden');
  });

  privacyLink?.addEventListener('click', () => {
    openModal('privacy-modal');
  });
}

/* ══════════════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
══════════════════════════════════════════════ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('active');
    menu.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on nav link click
  menu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ══════════════════════════════════════════════
   DROPDOWNS
══════════════════════════════════════════════ */
function initDropdowns() {
  const items = document.querySelectorAll('.nav-item.has-dropdown');

  items.forEach(item => {
    const trigger = item.querySelector('.dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      // Close others
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.addEventListener('click', () => {
    items.forEach(item => {
      item.classList.remove('open');
      item.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  // Keyboard escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      items.forEach(item => {
        item.classList.remove('open');
        item.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ══════════════════════════════════════════════
   COMING SOON TOOLTIPS
══════════════════════════════════════════════ */
function initComingSoonTooltips() {
  const tooltip = document.getElementById('cs-tooltip');
  const targets = document.querySelectorAll('[data-soon="true"]');
  if (!tooltip) return;

  targets.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      showTooltip(e.currentTarget, tooltip);
    });
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    el.addEventListener('focus', (e) => {
      showTooltip(e.currentTarget, tooltip);
    });
    el.addEventListener('blur', () => {
      tooltip.classList.remove('visible');
    });
    el.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

function showTooltip(target, tooltip) {
  const rect = target.getBoundingClientRect();
  tooltip.style.top = (rect.bottom + 8) + 'px';
  tooltip.style.left = (rect.left + rect.width / 2) + 'px';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.classList.add('visible');
}

/* ══════════════════════════════════════════════
   TERMINAL BOOT ANIMATION
══════════════════════════════════════════════ */
function initTerminalAnimation() {
  const cmdEl = document.getElementById('typing-cmd');
  const cursorEl = document.getElementById('term-cursor');
  const outputEl = document.getElementById('term-output');
  if (!cmdEl || !outputEl) return;

  const command = ' boot --sovereign';
  const bootSequence = [
    { text: 'Initializing AdiOS v2.4.1...', cls: '', delay: 80 },
    { text: '  [OK] Brain engine loaded   → Oxigraph + RocksDB', cls: 'term-ok', delay: 60 },
    { text: '  [OK] Lakehouse mounted     → DuckDB + Iceberg', cls: 'term-ok', delay: 60 },
    { text: '  [OK] Governance kernel     → Sentinel + RegionKit', cls: 'term-ok', delay: 60 },
    { text: '  [OK] IPC Bus initialized   → zero-copy transport', cls: 'term-ok', delay: 60 },
    { text: '  [OK] DPDP compliance layer → policy embedded', cls: 'term-ok', delay: 80 },
    { text: '  [~~] Routing sovereign models...', cls: 'term-warn', delay: 100 },
    { text: '  [OK] Model router ready    → 127ms query time', cls: 'term-ok', delay: 80 },
    { text: '', cls: '', delay: 40 },
    { text: 'ADIOS PLATFORM READY. SOVEREIGNTY ACTIVE.', cls: 'term-ok', delay: 60 },
  ];

  // Type the command character by character
  let i = 0;
  function typeCmd() {
    if (i < command.length) {
      cmdEl.textContent += command[i];
      i++;
      setTimeout(typeCmd, 65 + Math.random() * 40);
    } else {
      // Show cursor, wait, then start boot output
      setTimeout(startBoot, 400);
    }
  }

  // Delay before starting so page renders
  setTimeout(typeCmd, 800);

  let lineIdx = 0;
  function startBoot() {
    // Hide cursor during output
    if (cursorEl) cursorEl.style.display = 'none';
    showNextLine();
  }

  function showNextLine() {
    if (lineIdx >= bootSequence.length) {
      // Restore blinking cursor
      if (cursorEl) {
        cursorEl.style.display = 'inline';
        cursorEl.textContent = '█';
      }
      return;
    }
    const line = bootSequence[lineIdx];
    const div = document.createElement('div');
    div.className = 'term-output-line' + (line.cls ? ' ' + line.cls : '');
    div.textContent = line.text || '\u00A0';
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
    lineIdx++;
    setTimeout(showNextLine, line.delay + Math.random() * 40);
  }
}

/* ══════════════════════════════════════════════
   NODE GRAPH CANVAS ANIMATION
══════════════════════════════════════════════ */
function initNodeGraph() {
  const canvas = document.getElementById('node-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;

  const NODE_COUNT = 60;
  const CONNECTION_DIST = 160;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const isCore = Math.random() < 0.08;
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: isCore ? 3 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
        color: isCore ? '#d4a843' : (Math.random() < 0.3 ? '#4ecdc4' : 'rgba(212,168,67,0.4)'),
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.strokeStyle = `rgba(212,168,67,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + node.pulsePhase);
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Move
      node.x += node.vx;
      node.y += node.vy;

      // Bounce
      if (node.x < 0 || node.x > canvas.width)  node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height)  node.vy *= -1;
    });

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();

  const ro = new ResizeObserver(() => {
    resize();
    createNodes();
  });
  ro.observe(canvas.parentElement || document.body);

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      draw();
    }
  });
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children within the same parent
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.reveal-up')]
          : [];
        const sibIdx = siblings.indexOf(entry.target);
        const delay = sibIdx >= 0 ? sibIdx * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   CONFIDENCE BAR ANIMATIONS
══════════════════════════════════════════════ */
function initConfidenceBars() {
  const bars = document.querySelectorAll('.conf-bar');
  if (!bars.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => io.observe(bar));
}

/* ══════════════════════════════════════════════
   WAITLIST FORM
══════════════════════════════════════════════ */
function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleWaitlistSubmit(form);
  });

  // Live validation feedback
  form.querySelectorAll('.form-input, .form-select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
    });
  });
}

function handleWaitlistSubmit(form) {
  const errorEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoader = submitBtn?.querySelector('.btn-loader');

  // Gather fields
  const name    = form.querySelector('#wl-name');
  const email   = form.querySelector('#wl-email');
  const company = form.querySelector('#wl-company');
  const role    = form.querySelector('#wl-role');
  const interest= form.querySelector('#wl-interest');
  const privacy = form.querySelector('#wl-privacy');

  // Clear errors
  errorEl.textContent = '';
  [name, email, company, role, interest].forEach(f => f?.classList.remove('invalid'));

  // Validate
  const errors = [];
  if (!name?.value.trim())    { errors.push('Name is required.'); name?.classList.add('invalid'); }
  if (!email?.value.trim() || !email.value.includes('@')) {
    errors.push('Valid work email is required.');
    email?.classList.add('invalid');
  }
  if (!company?.value.trim()) { errors.push('Company name is required.'); company?.classList.add('invalid'); }
  if (!role?.value.trim())    { errors.push('Role / Title is required.'); role?.classList.add('invalid'); }
  if (!interest?.value)       { errors.push('Please select a sector of interest.'); interest?.classList.add('invalid'); }
  if (!privacy?.checked)      { errors.push('You must agree to the Privacy Policy and Terms to proceed.'); }

  if (errors.length) {
    errorEl.textContent = errors[0];
    return;
  }

  // Show loading
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = '';
  if (submitBtn) submitBtn.disabled = true;

  // Simulate processing then save
  setTimeout(() => {
    const entry = {
      id: 'AOS-' + Math.random().toString(36).slice(2,8).toUpperCase(),
      name: name.value.trim(),
      email: email.value.trim(),
      company: company.value.trim(),
      role: role.value.trim(),
      company_size: form.querySelector('#wl-size')?.value || 'unspecified',
      interest_area: interest.value,
      timestamp: new Date().toISOString(),
      source: 'portal_v2_waitlist',
    };

    // Save to in-memory state
    const existing = JSON.parse(_getItem('adios_waitlist') || '[]');
    existing.push(entry);
    _setItem('adios_waitlist', JSON.stringify(existing));

    // Show success
    showFormSuccess(entry.id);
  }, 1200);
}

function showFormSuccess(requestId) {
  const fields = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  const idEl = document.getElementById('success-id');

  if (fields)  fields.style.display = 'none';
  if (success) { success.setAttribute('aria-hidden', 'false'); success.style.display = 'flex'; }
  if (idEl)    idEl.textContent = requestId;
}

/* ══════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════ */
function initModals() {
  // Open via form links
  document.getElementById('open-privacy')?.addEventListener('click', () => openModal('privacy-modal'));
  document.getElementById('open-terms')?.addEventListener('click',   () => openModal('terms-modal'));

  // Close buttons and overlays
  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      closeModal(el.dataset.modalClose);
    });
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
    }
  });
}

function initFooterModals() {
  document.getElementById('footer-privacy')?.addEventListener('click', () => openModal('privacy-modal'));
  document.getElementById('footer-terms')?.addEventListener('click',   () => openModal('terms-modal'));
  document.getElementById('footer-cookie')?.addEventListener('click',  () => openModal('cookie-modal'));
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close')?.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.open')) {
    document.body.style.overflow = '';
  }
}

/* ══════════════════════════════════════════════
   SCROLL SPY (highlight active section)
══════════════════════════════════════════════ */
function initScrollSpy() {
  // Minimal — just smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR SCROLL-SPY
══════════════════════════════════════════════ */
function initSidebarScrollSpy() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
  if (!sidebarLinks.length) return;

  const sectionIds = [...sidebarLinks].map(l => l.dataset.section);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if (!sections.length) return;

  // Mark first section active initially
  sidebarLinks[0]?.classList.add('active');

  // IntersectionObserver for scroll-spy
  let activeId = sectionIds[0];

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId = entry.target.id;
        sidebarLinks.forEach(link => {
          const isActive = link.dataset.section === activeId;
          link.classList.toggle('active', isActive);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  });

  sections.forEach(s => io.observe(s));

  // Smooth scroll on sidebar link click
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   NEWSLETTER FORM
══════════════════════════════════════════════ */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    if (!input?.value.trim() || !input.value.includes('@')) {
      input?.focus();
      return;
    }
    if (btn) {
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      btn.style.background = '#4ecdc4';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        btn.style.background = '';
        if (input) input.value = '';
      }, 3000);
    }
  });
}

/* ══════════════════════════════════════════════
   IMPACT COUNTER ANIMATION
══════════════════════════════════════════════ */
(function initCounters() {
  const impactEl = document.querySelector('.impact-num');
  if (!impactEl) return;

  let animated = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        // Subtle flash effect on the number
        entry.target.style.transition = 'text-shadow 0.3s';
        entry.target.style.textShadow = '0 0 120px rgba(212,168,67,0.5)';
        setTimeout(() => {
          entry.target.style.textShadow = '0 0 80px rgba(212,168,67,0.25)';
        }, 600);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  io.observe(impactEl);
})();
