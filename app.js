/* ══════════════════════════════════════════════
   AdiOS Platform — app.js v3.0
   Rich animations, UX improvements, scroll magic
══════════════════════════════════════════════ */

'use strict';

/* ─── DOM Ready ─── */
document.addEventListener('DOMContentLoaded', () => {
  initBootScreen();
  initCookieBanner();
  initNavbar();
  initHamburger();
  initDropdowns();
  initComingSoonTooltips();
  initTerminalAnimation();
  initNodeGraph();
  initScrollReveal();
  initStaggeredCards();
  initConfidenceBars();
  initWaitlistForm();
  initModals();
  initFooterModals();
  initScrollSpy();
  initSidebarScrollSpy();
  initNewsletterForm();
  initHeroWordByWord();
  initStatCounters();
  initIpcBusPulse();
  initEngineConnectors();
  initSeeItWork();
  initStackLayers();
  initScrollToTop();
  initScrollProgress();
  initParallax();
  initKeyboardNav();
  initMobileSwipe();
  initSectionTypewriters();
  initBouncingArrow();
  initLiveDotPulse();
});

/* ══════════════════════════════════════════════
   IN-MEMORY STATE
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
   BOOT SCREEN — 0.5s BOOTING animation before page
══════════════════════════════════════════════ */
function initBootScreen() {
  // Create boot screen element
  const boot = document.createElement('div');
  boot.id = 'boot-screen';
  boot.className = 'boot-screen';
  boot.innerHTML = `
    <div class="boot-inner">
      <div class="boot-logo-pulse">
        <svg viewBox="0 0 60 60" fill="none" width="60" height="60" aria-hidden="true">
          <rect x="5" y="5" width="50" height="50" rx="8" stroke="#d4a843" stroke-width="1.5" fill="none" opacity="0.3"/>
          <rect x="12" y="12" width="36" height="36" rx="5" stroke="#d4a843" stroke-width="1.5" fill="none" opacity="0.5"/>
          <path d="M22 30 L30 22 L38 30 L30 38 Z" stroke="#d4a843" stroke-width="2" fill="#d4a84320"/>
          <circle cx="30" cy="30" r="3" fill="#d4a843"/>
        </svg>
      </div>
      <div class="boot-text">BOOTING AdiOS</div>
      <div class="boot-bar"><div class="boot-bar-fill"></div></div>
    </div>
  `;
  document.body.prepend(boot);

  // Remove after 0.8s
  setTimeout(() => {
    boot.classList.add('boot-fade');
    setTimeout(() => boot.remove(), 500);
  }, 800);
}

/* ══════════════════════════════════════════════
   COOKIE BANNER — slide up from bottom
══════════════════════════════════════════════ */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const privacyLink = document.getElementById('cookie-privacy-link');
  if (!banner) return;

  if (_getItem('adios_cookie_consent') === 'true') {
    banner.style.display = 'none';
    return;
  }

  // Slide up after a delay
  setTimeout(() => {
    banner.classList.add('banner-visible');
  }, 1200);

  acceptBtn?.addEventListener('click', () => {
    _setItem('adios_cookie_consent', 'true');
    banner.classList.remove('banner-visible');
    banner.classList.add('banner-hiding');
    setTimeout(() => { banner.style.display = 'none'; }, 400);
  });

  privacyLink?.addEventListener('click', () => {
    openModal('privacy-modal');
  });
}

/* ══════════════════════════════════════════════
   NAVBAR SCROLL — intensify blur on scroll
══════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    // Progressively intensify blur
    const blur = Math.min(16 + y * 0.04, 32);
    nav.style.backdropFilter = `blur(${blur}px) saturate(180%)`;
    nav.style.webkitBackdropFilter = `blur(${blur}px) saturate(180%)`;
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
   COMING SOON TOOLTIPS — slide-in animation
══════════════════════════════════════════════ */
function initComingSoonTooltips() {
  const tooltip = document.getElementById('cs-tooltip');
  const targets = document.querySelectorAll('[data-soon="true"]');
  if (!tooltip) return;

  let hideTimeout;

  targets.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      clearTimeout(hideTimeout);
      showTooltip(e.currentTarget, tooltip);
    });
    el.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => tooltip.classList.remove('visible', 'tooltip-slide-in'), 150);
    });
    el.addEventListener('focus', (e) => {
      clearTimeout(hideTimeout);
      showTooltip(e.currentTarget, tooltip);
    });
    el.addEventListener('blur', () => {
      tooltip.classList.remove('visible', 'tooltip-slide-in');
    });
    el.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

function showTooltip(target, tooltip) {
  const rect = target.getBoundingClientRect();
  tooltip.style.top = (rect.bottom + 10) + 'px';
  tooltip.style.left = (rect.left + rect.width / 2) + 'px';
  tooltip.style.transform = 'translateX(-50%) translateY(-4px)';
  tooltip.style.opacity = '0';
  tooltip.classList.add('visible');
  requestAnimationFrame(() => {
    tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateX(-50%) translateY(0)';
  });
}

/* ══════════════════════════════════════════════
   HERO — WORD BY WORD HEADLINE
══════════════════════════════════════════════ */
function initHeroWordByWord() {
  const heroHeadline = document.querySelector('.hero-headline');
  if (!heroHeadline) return;

  // Don't wrap until terminal completes — wait 3s
  setTimeout(() => {
    // Wrap title spans word by word
    const titleMain = heroHeadline.querySelector('.title-main');
    const titleAccent = heroHeadline.querySelector('.title-accent');
    const titleSub = heroHeadline.querySelector('.title-sub');
    const heroDesc = heroHeadline.querySelector('.hero-desc');
    const eyebrow = heroHeadline.querySelector('.hero-eyebrow');

    const elements = [eyebrow, titleMain, titleAccent, titleSub, heroDesc].filter(Boolean);

    elements.forEach((el, elIdx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, elIdx * 180 + 100);
    });
  }, 2800);
}

/* ══════════════════════════════════════════════
   STAT COUNTERS — count up from 0
══════════════════════════════════════════════ */
function initStatCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);

      const numEl = entry.target.querySelector('.stat-num');
      if (!numEl) return;

      const original = numEl.textContent.trim();

      // Parse numeric values
      if (original === '127ms') {
        animateCount(numEl, 0, 127, 1200, v => v + 'ms');
      } else if (original === '7') {
        animateCount(numEl, 0, 7, 1000, v => String(v));
      }
      // Non-numeric ones just fade in with a scale
      else {
        numEl.style.transform = 'scale(0.8)';
        numEl.style.opacity = '0';
        numEl.style.transition = 'transform 0.6s var(--ease-spring), opacity 0.6s ease';
        requestAnimationFrame(() => {
          numEl.style.transform = 'scale(1)';
          numEl.style.opacity = '1';
        });
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => io.observe(el));
}

function animateCount(el, from, to, duration, format) {
  const startTime = performance.now();
  el.style.opacity = '0';

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(from + (to - from) * eased);
    el.textContent = format(value);
    el.style.opacity = '1';
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════════════
   LIVE DOT PULSE — after boot
══════════════════════════════════════════════ */
function initLiveDotPulse() {
  // Already animated via CSS, but we add an extra pulse burst after boot
  const dots = document.querySelectorAll('.live-dot');
  setTimeout(() => {
    dots.forEach(dot => {
      dot.style.transition = 'box-shadow 0.3s ease';
      dot.style.boxShadow = '0 0 20px var(--c-teal), 0 0 40px var(--c-teal)';
      setTimeout(() => {
        dot.style.boxShadow = '';
      }, 600);
    });
  }, 3500);

  // Also pulse the green terminal dot after boot completes
  const greenDot = document.querySelector('.terminal-titlebar .dot-green');
  if (greenDot) {
    setTimeout(() => {
      greenDot.classList.add('dot-pulse-online');
    }, 3200);
  }
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

  let i = 0;
  function typeCmd() {
    if (i < command.length) {
      cmdEl.textContent += command[i];
      i++;
      setTimeout(typeCmd, 65 + Math.random() * 40);
    } else {
      setTimeout(startBoot, 400);
    }
  }

  setTimeout(typeCmd, 1400); // Delay to allow boot screen to clear

  let lineIdx = 0;
  function startBoot() {
    if (cursorEl) cursorEl.style.display = 'none';
    showNextLine();
  }

  function showNextLine() {
    if (lineIdx >= bootSequence.length) {
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
    // Slide in from left
    div.style.opacity = '0';
    div.style.transform = 'translateX(-8px)';
    outputEl.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      div.style.opacity = '1';
      div.style.transform = 'translateX(0)';
    });
    outputEl.scrollTop = outputEl.scrollHeight;
    lineIdx++;
    setTimeout(showNextLine, line.delay + Math.random() * 40);
  }
}

/* ══════════════════════════════════════════════
   NODE GRAPH CANVAS — with floating animation
══════════════════════════════════════════════ */
function initNodeGraph() {
  const canvas = document.getElementById('node-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;
  let scrollY = 0;

  const NODE_COUNT = 65;
  const CONNECTION_DIST = 160;

  // Listen for scroll for parallax
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

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
        baseY: 0, // set after
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: isCore ? 3 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
        color: isCore ? '#d4a843' : (Math.random() < 0.3 ? '#4ecdc4' : 'rgba(212,168,67,0.4)'),
        pulsePhase: Math.random() * Math.PI * 2,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.4,
      });
    }
    nodes.forEach(n => n.baseY = n.y);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    // Parallax offset — nodes shift slightly on scroll
    const parallaxShift = scrollY * 0.08;

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = (nodes[i].y - parallaxShift) - (nodes[j].y - parallaxShift);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.strokeStyle = `rgba(212,168,67,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y - parallaxShift);
          ctx.lineTo(nodes[j].x, nodes[j].y - parallaxShift);
          ctx.stroke();
        }
      }
    }

    // Draw nodes with floating animation
    nodes.forEach(node => {
      const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + node.pulsePhase);
      // Floating: gentle sin wave
      const floatY = Math.sin(t * node.floatSpeed + node.floatOffset) * 4;
      const drawY = node.y - parallaxShift + floatY;

      ctx.beginPath();
      ctx.arc(node.x, drawY, node.r * pulse, 0, Math.PI * 2);
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      draw();
    }
  });
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL — more dramatic entrance
══════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.reveal-up')]
          : [];
        const sibIdx = siblings.indexOf(entry.target);
        const delay = sibIdx >= 0 ? sibIdx * 100 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   STAGGERED CARDS — one by one reveal
══════════════════════════════════════════════ */
function initStaggeredCards() {
  // Story cards
  staggerGroup('.story-cards', '.story-card', 200);
  // Pillar cards
  staggerGroup('.pillars-grid', '.pillar-card', 200);
  // Business model cards
  staggerGroup('.business-grid', '.biz-card', 180);
  // Marketplace tiles
  staggerGroup('.mp-categories', '.mp-cat', 150);
  // Compare table rows
  staggerGroup('.seeit-compare-table', '.seeit-compare-row:not(.seeit-compare-header)', 150);
  // Trust steps
  staggerGroup('.trust-steps', '.trust-step', 220);
}

function staggerGroup(parentSelector, childSelector, delayMs) {
  const parents = document.querySelectorAll(parentSelector);
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, idx) => {
      // Start hidden
      child.style.opacity = '0';
      child.style.transform = 'translateY(32px)';
      child.style.transition = `opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.2,0.64,1)`;
    });

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.unobserve(parent);
        children.forEach((child, idx) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, idx * delayMs);
        });
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    io.observe(parent);
  });
}

/* ══════════════════════════════════════════════
   CONFIDENCE BARS — smoother animation
══════════════════════════════════════════════ */
function initConfidenceBars() {
  const bars = document.querySelectorAll('.conf-bar, .trust-bar');
  if (!bars.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, idx * 200);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => io.observe(bar));
}

/* ══════════════════════════════════════════════
   IPC BUS PULSE — data flowing left to right
══════════════════════════════════════════════ */
function initIpcBusPulse() {
  const ipcBus = document.querySelector('.ipc-bus');
  if (!ipcBus) return;

  // Add a flowing pulse bar to the IPC bus
  const pulseTrack = document.createElement('div');
  pulseTrack.className = 'ipc-pulse-track';
  pulseTrack.innerHTML = '<div class="ipc-pulse-dot"></div>';
  ipcBus.appendChild(pulseTrack);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ipcBus.classList.add('ipc-active');
        io.unobserve(ipcBus);
      }
    });
  }, { threshold: 0.4 });

  io.observe(ipcBus);
}

/* ══════════════════════════════════════════════
   ENGINE CONNECTORS — line drawing between cards
══════════════════════════════════════════════ */
function initEngineConnectors() {
  const grid = document.querySelector('.pillars-grid');
  if (!grid) return;

  // Create SVG connector overlay
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'engine-connector-svg');
  svg.setAttribute('aria-hidden', 'true');
  grid.style.position = 'relative';
  grid.appendChild(svg);

  let drawn = false;

  function drawConnectors() {
    if (drawn) return;
    const cards = grid.querySelectorAll('.pillar-card');
    if (cards.length < 2) return;

    const gridRect = grid.getBoundingClientRect();

    svg.innerHTML = '';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';
    svg.style.zIndex = '0';

    // Only draw on desktop (grid layout)
    if (window.innerWidth < 900) return;

    const cardRects = [...cards].map(c => c.getBoundingClientRect());

    for (let i = 0; i < cardRects.length - 1; i++) {
      const r1 = cardRects[i];
      const r2 = cardRects[i + 1];

      const x1 = r1.right - gridRect.left;
      const y1 = r1.top + r1.height / 2 - gridRect.top;
      const x2 = r2.left - gridRect.left;
      const y2 = r2.top + r2.height / 2 - gridRect.top;

      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'url(#connGrad)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '6 4');
      line.setAttribute('opacity', '0.4');
      line.setAttribute('class', 'engine-connector-line');

      // Animated dot on line
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', '#4ecdc4');
      circle.setAttribute('opacity', '0.8');

      const anim = document.createElementNS(svgNS, 'animateMotion');
      anim.setAttribute('dur', `${2.5 + i * 0.5}s`);
      anim.setAttribute('repeatCount', 'indefinite');
      anim.innerHTML = `<mpath href="#path${i}"/>`;

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('id', `path${i}`);
      path.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);
      path.setAttribute('fill', 'none');

      circle.appendChild(anim);

      // Define gradient
      const defs = document.createElementNS(svgNS, 'defs');
      const grad = document.createElementNS(svgNS, 'linearGradient');
      grad.setAttribute('id', 'connGrad');
      grad.setAttribute('x1', '0%');
      grad.setAttribute('y1', '0%');
      grad.setAttribute('x2', '100%');
      grad.setAttribute('y2', '0%');
      const stop1 = document.createElementNS(svgNS, 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#d4a843');
      stop1.setAttribute('stop-opacity', '0.6');
      const stop2 = document.createElementNS(svgNS, 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#4ecdc4');
      stop2.setAttribute('stop-opacity', '0.6');
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);

      svg.appendChild(defs);
      svg.appendChild(path);
      svg.appendChild(line);
      svg.appendChild(circle);
    }
    drawn = true;
  }

  // Draw after cards are visible
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(drawConnectors, 600);
      io.unobserve(grid);
    }
  }, { threshold: 0.3 });

  io.observe(grid);

  window.addEventListener('resize', () => {
    drawn = false;
    svg.innerHTML = '';
    if (window.innerWidth >= 900) drawConnectors();
  });
}

/* ══════════════════════════════════════════════
   SEE IT WORK — typing, processing, dramatic callout
══════════════════════════════════════════════ */
function initSeeItWork() {
  const seeitSection = document.getElementById('seeit');
  if (!seeitSection) return;

  let animated = false;

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      io.unobserve(seeitSection);
      runSeeItWorkAnimations();
    }
  }, { threshold: 0.15 });

  io.observe(seeitSection);
}

function runSeeItWorkAnimations() {
  // Reveal the seeit layout containers first
  const layout = document.querySelector('.seeit-layout-animate');
  if (layout) layout.classList.add('seeit-revealed');

  // 1. Animate the agriculture query terminal
  const queryEl = document.querySelector('.seeit-term-query');
  const outputLines = document.querySelectorAll('.seeit-out-line');
  const compareRows = document.querySelectorAll('.seeit-compare-row:not(.seeit-compare-header)');
  const callout = document.querySelector('.impact-callout');

  // Initially hide output lines
  outputLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
  });

  if (queryEl) {
    const originalText = queryEl.textContent;
    queryEl.textContent = '';
    queryEl.style.opacity = '1';

    // Type the query
    setTimeout(() => {
      typeText(queryEl, originalText, 30, () => {
        // Show "processing..." then reveal output lines
        showProcessingAndOutput(outputLines, compareRows, callout);
      });
    }, 600);
  } else {
    showProcessingAndOutput(outputLines, compareRows, callout);
  }
}

function typeText(el, text, speed, onComplete) {
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, speed + Math.random() * 20);
    } else {
      if (onComplete) onComplete();
    }
  }
  type();
}

function showProcessingAndOutput(outputLines, compareRows, callout) {
  const outputContainer = document.querySelector('.seeit-term-output');

  // Add processing indicator
  const processingEl = document.createElement('div');
  processingEl.className = 'seeit-processing';
  processingEl.textContent = 'PROCESSING...';
  if (outputContainer) outputContainer.prepend(processingEl);

  // After 1s, remove processing and show lines
  setTimeout(() => {
    processingEl.remove();
    outputLines.forEach((line, idx) => {
      setTimeout(() => {
        line.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        line.style.opacity = '1';
        line.style.transform = 'translateX(0)';
      }, idx * 200);
    });

    // After output shows, animate compare rows
    setTimeout(() => {
      compareRows.forEach((row, idx) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-16px)';
        setTimeout(() => {
          row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          row.style.opacity = '1';
          row.style.transform = 'translateX(0)';
        }, idx * 200);
      });

      // Dramatic callout entrance
      if (callout) {
        setTimeout(() => {
          callout.style.transform = 'scale(0.3)';
          callout.style.opacity = '0';
          callout.style.transition = 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              callout.style.transform = 'scale(1)';
              callout.style.opacity = '1';
            });
          });
        }, compareRows.length * 200 + 300);
      }
    }, outputLines.length * 200 + 600);
  }, 1000);
}

/* ══════════════════════════════════════════════
   STACK LAYERS — build bottom to top
══════════════════════════════════════════════ */
function initStackLayers() {
  const stackDiagram = document.querySelector('.stack-diagram');
  if (!stackDiagram) return;

  const layers = stackDiagram.querySelectorAll('.stack-layer');
  if (!layers.length) return;

  // Initially hide all layers
  layers.forEach(layer => {
    layer.style.opacity = '0';
    layer.style.transform = 'translateY(16px)';
  });

  let animated = false;
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      io.unobserve(stackDiagram);

      // Build from bottom to top
      const layersArr = [...layers].reverse();
      layersArr.forEach((layer, idx) => {
        setTimeout(() => {
          layer.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.2,0.64,1)';
          layer.style.opacity = '1';
          layer.style.transform = 'translateY(0)';
        }, idx * 150);
      });
    }
  }, { threshold: 0.2 });

  io.observe(stackDiagram);
}

/* ══════════════════════════════════════════════
   SECTION TYPEWRITERS — headers animate on scroll
══════════════════════════════════════════════ */
function initSectionTypewriters() {
  const headers = document.querySelectorAll('.section-header .section-title');
  if (!headers.length) return;

  headers.forEach(title => {
    const original = title.textContent;
    title.dataset.original = original;
    // Don't modify hero title
    if (title.closest('.hero')) return;

    title.style.opacity = '0';

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.unobserve(title);
        title.style.opacity = '1';
        title.textContent = '';
        typewriterEffect(title, original, 28);
      }
    }, { threshold: 0.5 });

    io.observe(title);
  });
}

function typewriterEffect(el, text, speed) {
  let i = 0;
  el.textContent = '';
  el.classList.add('typing');
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, speed + Math.random() * 15);
    } else {
      // Remove typing cursor after done
      setTimeout(() => el.classList.remove('typing'), 600);
    }
  }
  type();
}

/* ══════════════════════════════════════════════
   SCROLL TO TOP — fixed button
══════════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR — sidebar line fill
══════════════════════════════════════════════ */
function initScrollProgress() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const progressBar = document.createElement('div');
  progressBar.className = 'sidebar-progress';
  progressBar.innerHTML = '<div class="sidebar-progress-fill"></div>';
  sidebar.querySelector('.sidebar-inner')?.appendChild(progressBar);

  const fill = progressBar.querySelector('.sidebar-progress-fill');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);
    if (fill) fill.style.height = (progress * 100) + '%';
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   PARALLAX — subtle terminal window shift
══════════════════════════════════════════════ */
function initParallax() {
  const terminal = document.querySelector('.terminal-window');
  if (!terminal) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Terminal moves up slightly as user scrolls past hero
        const shift = Math.min(scrollY * 0.15, 40);
        terminal.style.transform = `translateY(-${shift}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   KEYBOARD NAVIGATION — arrow keys between sections
══════════════════════════════════════════════ */
function initKeyboardNav() {
  const sectionIds = ['home', 'story', 'solution', 'seeit', 'trust', 'stack', 'business', 'marketplace', 'waitlist'];
  let currentIdx = 0;

  document.addEventListener('keydown', (e) => {
    // Don't interfere with form inputs
    if (document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT') return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      currentIdx = Math.min(currentIdx + 1, sectionIds.length - 1);
      scrollToSection(sectionIds[currentIdx]);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      currentIdx = Math.max(currentIdx - 1, 0);
      scrollToSection(sectionIds[currentIdx]);
    }
  });

  // Update currentIdx based on scroll
  window.addEventListener('scroll', () => {
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el && el.getBoundingClientRect().top <= 100) {
        currentIdx = i;
        break;
      }
    }
  }, { passive: true });

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }
}

/* ══════════════════════════════════════════════
   MOBILE SWIPE — between sections
══════════════════════════════════════════════ */
function initMobileSwipe() {
  if (window.innerWidth > 768) return;

  const sectionIds = ['home', 'story', 'solution', 'seeit', 'trust', 'stack', 'business', 'marketplace', 'waitlist'];
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwipeLocked = false;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isSwipeLocked) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    const dt = Date.now() - touchStartTime;

    // Fast swipe: >60px in <300ms
    if (Math.abs(dy) > 60 && dt < 300) {
      isSwipeLocked = true;
      setTimeout(() => isSwipeLocked = false, 800);

      // Find current section
      let currentIdx = 0;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.getBoundingClientRect().top <= 80) {
          currentIdx = i;
          break;
        }
      }

      const nextIdx = dy > 0
        ? Math.min(currentIdx + 1, sectionIds.length - 1)
        : Math.max(currentIdx - 1, 0);

      const target = document.getElementById(sectionIds[nextIdx]);
      if (target && nextIdx !== currentIdx) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   BOUNCING ARROW — 'Watch How It Works ↓'
══════════════════════════════════════════════ */
function initBouncingArrow() {
  const scrollNext = document.querySelector('.scroll-next');
  if (!scrollNext) return;
  scrollNext.classList.add('bouncing-arrow-cta');
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

  const name    = form.querySelector('#wl-name');
  const email   = form.querySelector('#wl-email');
  const company = form.querySelector('#wl-company');
  const role    = form.querySelector('#wl-role');
  const interest= form.querySelector('#wl-interest');
  const privacy = form.querySelector('#wl-privacy');

  errorEl.textContent = '';
  [name, email, company, role, interest].forEach(f => f?.classList.remove('invalid'));

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

  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = '';
  if (submitBtn) submitBtn.disabled = true;

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

    const existing = JSON.parse(_getItem('adios_waitlist') || '[]');
    existing.push(entry);
    _setItem('adios_waitlist', JSON.stringify(existing));

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
  document.getElementById('open-privacy')?.addEventListener('click', () => openModal('privacy-modal'));
  document.getElementById('open-terms')?.addEventListener('click',   () => openModal('terms-modal'));

  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
      closeModal(el.dataset.modalClose);
    });
  });

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
   SCROLL SPY
══════════════════════════════════════════════ */
function initScrollSpy() {
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

  sidebarLinks[0]?.classList.add('active');

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
