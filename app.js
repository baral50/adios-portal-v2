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

/* ═══════════════════════════════════════════════════════════════
   CHARTS & ANIMATED EXPLAINERS — v1.0
   Hero counters, Gap diagram, Adoption bars, Engine flow,
   Comparison charts, India map, Market chart, TAM donut
═══════════════════════════════════════════════════════════════ */

/* ── Utility: easing ──────────────────────────────────────── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
}

/* ── Utility: animate a numeric counter ───────────────────── */
function animateCounter(el, from, to, duration, format, onComplete) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const value = from + (to - from) * eased;
    el.textContent = format(value);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = format(to);
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════
   1. HERO COUNTER RIBBON
═══════════════════════════════════════════════════════════ */
function initCounterRibbon() {
  const ribbon = document.getElementById('counter-ribbon');
  if (!ribbon) return;

  const items = ribbon.querySelectorAll('.counter-item');
  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();

        // Animate counter items in
        items.forEach((item, i) => {
          setTimeout(() => {
            item.classList.add('counter-visible');
          }, i * 180);
        });

        // Market: $0B → $126B
        const marketEl = document.getElementById('ctr-market-val');
        if (marketEl) {
          setTimeout(() => {
            animateCounter(marketEl, 0, 126, 2200, v => '$' + Math.round(v) + 'B');
          }, 200);
        }

        // GPUs: 0 → 200,000
        const gpuEl = document.getElementById('ctr-gpu-val');
        if (gpuEl) {
          setTimeout(() => {
            animateCounter(gpuEl, 0, 200000, 2400, v => {
              return Math.round(v).toLocaleString('en-IN');
            });
          }, 400);
        }

        // Growth: 1× → 6.5× with burst
        const growthEl = document.getElementById('ctr-growth-val');
        if (growthEl) {
          setTimeout(() => {
            animateCounter(growthEl, 1, 6.5, 2000, v => v.toFixed(1) + '×', () => {
              growthEl.classList.add('burst-active');
              setTimeout(() => growthEl.classList.remove('burst-active'), 400);
            });
          }, 600);
        }
      }
    });
  }, { threshold: 0.3 });

  io.observe(ribbon);
}

/* ═══════════════════════════════════════════════════════════
   2. GAP DIAGRAM — AdiOS slides in to fill the gap
═══════════════════════════════════════════════════════════ */
function initGapDiagram() {
  const wrapper = document.getElementById('gap-diagram');
  if (!wrapper) return;

  const adiosBlock = document.getElementById('adios-gap-block');
  const lineIds = ['adios-line-tl','adios-line-tr','adios-line-bl','adios-line-br'];
  let triggered = false;

  // Initial state
  if (adiosBlock) {
    adiosBlock.style.opacity = '0';
    adiosBlock.style.transform = 'scaleX(0)';
    adiosBlock.style.transition = 'none';
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();

        // Delay then animate AdiOS block in
        setTimeout(() => {
          if (adiosBlock) {
            adiosBlock.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
            adiosBlock.style.opacity = '1';
            adiosBlock.style.transform = 'scaleX(1)';
          }
        }, 800);

        // Show connection lines after block appears
        setTimeout(() => {
          lineIds.forEach((id, i) => {
            const line = document.getElementById(id);
            if (line) {
              setTimeout(() => {
                line.style.transition = 'opacity 0.4s ease';
                line.style.opacity = '0.6';
              }, i * 100);
            }
          });
        }, 1400);
      }
    });
  }, { threshold: 0.3 });

  io.observe(wrapper);
}

/* ═══════════════════════════════════════════════════════════
   3. ADOPTION BAR CHART
═══════════════════════════════════════════════════════════ */
function initAdoptionChart() {
  const chart = document.getElementById('adoption-chart');
  if (!chart) return;

  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();

        // Animate bar 1: 87%
        const bar1 = document.getElementById('adopt-bar-1');
        if (bar1) {
          setTimeout(() => { bar1.style.width = '87%'; }, 200);
        }
        // Bar 2 stays at 0 (red) — dramatic effect
        const bar2 = document.getElementById('adopt-bar-2');
        if (bar2) {
          // Flash red briefly
          setTimeout(() => {
            bar2.style.width = '3%';
            setTimeout(() => { bar2.style.width = '0%'; }, 600);
          }, 800);
        }
      }
    });
  }, { threshold: 0.3 });

  io.observe(chart);
}

/* ═══════════════════════════════════════════════════════════
   4. ENGINE FLOW — Engine pulse effects + pill animations
═══════════════════════════════════════════════════════════ */
function initEngineFlowDiagram() {
  const wrapper = document.getElementById('engine-flow');
  if (!wrapper) return;

  // The SVG animate elements handle the dot travel automatically.
  // Add pulsing glow to engine circles based on dot position.
  const engines = [
    { id: 'engine-brain', color: '#d4a843', delay: 750 },
    { id: 'engine-lake',  color: '#4ecdc4', delay: 1500 },
    { id: 'engine-gov',   color: '#e85d5d', delay: 2250 },
  ];

  engines.forEach(({ id, color, delay }) => {
    const el = document.getElementById(id);
    if (!el) return;
    setInterval(() => {
      el.style.transition = 'filter 0.25s ease, opacity 0.25s ease';
      el.style.filter = `drop-shadow(0 0 12px ${color})`;
      el.style.opacity = '1';
      setTimeout(() => {
        el.style.filter = '';
        el.style.opacity = '0.85';
      }, 400);
    }, 3000);
    // Stagger the start
    setTimeout(() => {
      el.style.filter = `drop-shadow(0 0 12px ${color})`;
      el.style.opacity = '1';
      setTimeout(() => { el.style.filter = ''; el.style.opacity = '0.85'; }, 400);
    }, delay);
  });

  // Animate the metric pills with cycling numbers
  const lakeEl = document.getElementById('lake-time');
  if (lakeEl) {
    const times = ['127ms','124ms','131ms','127ms','129ms','127ms'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % times.length;
      lakeEl.textContent = times[idx];
    }, 2200);
  }

  const brainEl = document.getElementById('brain-conf');
  if (brainEl) {
    const confs = ['0.95+','0.97','0.94','0.96','0.95+'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % confs.length;
      brainEl.textContent = confs[idx];
    }, 2800);
  }
}

/* ═══════════════════════════════════════════════════════════
   5. SEEIT COMPARISON CHARTS
═══════════════════════════════════════════════════════════ */
function initSeeItCharts() {
  const container = document.getElementById('seeit-charts');
  if (!container) return;

  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();
        animateSeeItCharts();
      }
    });
  }, { threshold: 0.2 });

  io.observe(container);
}

function animateSeeItCharts() {
  // Bar 1: Traditional (slow red)
  const tradBar = document.getElementById('speed-bar-trad');
  if (tradBar) {
    setTimeout(() => { tradBar.style.width = '95%'; }, 200);
  }

  // Bar 2: AdiOS (instant tiny green)
  const adiosBar = document.getElementById('speed-bar-adios');
  if (adiosBar) {
    setTimeout(() => { adiosBar.style.width = '0.8%'; }, 2600);
  }

  // Donut charts
  setTimeout(() => {
    // Traditional: full red ring (289 = 2*PI*46 ≈ circumference)
    const donutTrad = document.getElementById('donut-trad');
    if (donutTrad) {
      donutTrad.style.transition = 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)';
      donutTrad.setAttribute('stroke-dasharray', '289 0');
    }

    // AdiOS: stays at 0, but stroke the outline with minimal dash
    const donutAdios = document.getElementById('donut-adios');
    if (donutAdios) {
      donutAdios.style.transition = 'stroke-dasharray 0.5s ease';
      donutAdios.setAttribute('stroke-dasharray', '2 287');
      setTimeout(() => {
        const check = document.getElementById('donut-check');
        if (check) check.classList.add('check-show');
      }, 600);
    }
  }, 400);
}

/* ═══════════════════════════════════════════════════════════
   6. INDIA MAP — Hover interactions
═══════════════════════════════════════════════════════════ */
function initIndiaMap() {
  const mapSvg = document.getElementById('india-map-svg');
  const tooltip = document.getElementById('map-tooltip');
  if (!mapSvg || !tooltip) return;

  const dotGroups = mapSvg.querySelectorAll('.map-dot-group');
  const connectionLines = document.getElementById('map-connection-lines');
  const adiosLabel = document.getElementById('map-adios-label');

  dotGroups.forEach(group => {
    const label = group.getAttribute('data-label') || '';
    const type = group.getAttribute('data-type') || '';
    const colors = { kvk: '#d4a843', icar: '#4ecdc4', fpo: '#e85d5d' };
    const color = colors[type] || '#d4a843';

    group.style.cursor = 'pointer';

    group.addEventListener('mouseenter', (e) => {
      tooltip.style.opacity = '1';
      tooltip.style.color = color;
      tooltip.textContent = label + ' — Unified by AdiOS';

      // Show connections
      if (connectionLines) {
        connectionLines.style.transition = 'opacity 0.3s ease';
        connectionLines.style.opacity = '1';
      }
      if (adiosLabel) {
        adiosLabel.style.opacity = '1';
      }
    });

    group.addEventListener('mousemove', (e) => {
      const rect = mapSvg.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top  = (e.clientY - rect.top  - 28) + 'px';
    });

    group.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      if (connectionLines) {
        connectionLines.style.opacity = '0';
      }
      if (adiosLabel) {
        adiosLabel.style.opacity = '0';
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   7. MARKET GROWTH LINE CHART (Canvas)
═══════════════════════════════════════════════════════════ */
function initMarketGrowthChart() {
  const canvas = document.getElementById('market-growth-canvas');
  const wrapper = document.getElementById('market-chart-wrapper');
  if (!canvas || !wrapper) return;

  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();
        drawMarketChart(canvas);
      }
    });
  }, { threshold: 0.3 });

  io.observe(wrapper);
}

function drawMarketChart(canvas) {
  // Data points: [year, value in $B]
  const data = [
    { year: 2020, val: 2.97, label: '$2.97B' },
    { year: 2022, val: 4.8,  label: '$4.8B' },
    { year: 2024, val: 7.6,  label: '$7.6B' },
    { year: 2025, val: 11,   label: '$11B' },
    { year: 2026, val: 17,   label: '$17B', marker: true },
    { year: 2028, val: 55,   label: '$55B' },
    { year: 2030, val: 126,  label: '$126B' },
  ];

  const dpr = window.devicePixelRatio || 1;
  const W = canvas.parentElement.offsetWidth || 800;
  const H = 200;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pad = { top: 20, right: 30, bottom: 40, left: 55 };
  const w = W - pad.left - pad.right;
  const h = H - pad.top  - pad.bottom;

  const minYear = 2020, maxYear = 2030;
  const minVal = 0, maxVal = 135;

  function xp(year) { return pad.left + (year - minYear) / (maxYear - minYear) * w; }
  function yp(val)  { return pad.top  + h - (val - minVal) / (maxVal - minVal) * h; }

  // Animate the line drawing
  let progress = 0;
  const duration = 2000;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    progress = Math.min(easeInOutCubic(elapsed / duration), 1);

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    [0, 25, 50, 75, 100, 125].forEach(v => {
      ctx.beginPath();
      ctx.moveTo(pad.left, yp(v));
      ctx.lineTo(W - pad.right, yp(v));
      ctx.stroke();
    });

    // Y axis labels
    ctx.fillStyle = 'rgba(232,230,227,0.4)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    [0, 25, 50, 75, 100, 125].forEach(v => {
      ctx.fillText('$' + v + 'B', pad.left - 6, yp(v) + 4);
    });

    // X axis labels
    ctx.textAlign = 'center';
    data.forEach(d => {
      ctx.fillText(d.year, xp(d.year), H - pad.bottom + 16);
    });

    // Determine points to draw based on progress
    // Build partial path
    const totalPoints = data.length;
    const drawCount = progress * (totalPoints - 1);

    // Build filled path (gradient area)
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
    grad.addColorStop(0, 'rgba(78,205,196,0.25)');
    grad.addColorStop(1, 'rgba(78,205,196,0)');

    ctx.beginPath();
    ctx.moveTo(xp(data[0].year), yp(data[0].val));

    for (let i = 1; i < totalPoints; i++) {
      const frac = i - 1; // segment index
      if (frac >= drawCount) break;
      const segProgress = Math.min(drawCount - frac, 1);
      const px = xp(data[i-1].year) + (xp(data[i].year) - xp(data[i-1].year)) * segProgress;
      const py = yp(data[i-1].val)  + (yp(data[i].val)  - yp(data[i-1].val))  * segProgress;
      ctx.lineTo(px, py);
    }

    // Close path for fill
    const lastDrawnIdx = Math.min(Math.floor(drawCount), totalPoints - 2);
    const segP = Math.min(drawCount - lastDrawnIdx, 1);
    const lastX = xp(data[lastDrawnIdx].year) + (xp(data[lastDrawnIdx+1].year) - xp(data[lastDrawnIdx].year)) * segP;

    ctx.lineTo(lastX, pad.top + h);
    ctx.lineTo(xp(data[0].year), pad.top + h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw the line on top
    ctx.beginPath();
    ctx.moveTo(xp(data[0].year), yp(data[0].val));
    for (let i = 1; i < totalPoints; i++) {
      const frac = i - 1;
      if (frac >= drawCount) break;
      const segProgress = Math.min(drawCount - frac, 1);
      const px = xp(data[i-1].year) + (xp(data[i].year) - xp(data[i-1].year)) * segProgress;
      const py = yp(data[i-1].val)  + (yp(data[i].val)  - yp(data[i-1].val))  * segProgress;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Data point dots
    data.forEach((d, i) => {
      const dotProgress = Math.min(drawCount - (i - 1), 1);
      if (i === 0 || dotProgress > 0) {
        const alpha = i === 0 ? 1 : Math.max(0, dotProgress);
        ctx.beginPath();
        ctx.arc(xp(d.year), yp(d.val), 4, 0, Math.PI * 2);
        ctx.fillStyle = d.marker ? '#f0c84a' : '#4ecdc4';
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Label on final frame
        if (progress >= 1 && (d.year === 2024 || d.year === 2030 || d.year === 2026)) {
          ctx.fillStyle = d.marker ? '#f0c84a' : 'rgba(232,230,227,0.7)';
          ctx.font = d.year === 2030 ? 'bold 11px JetBrains Mono, monospace' : '10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, xp(d.year), yp(d.val) - 10);
        }
      }
    });

    // AdiOS entry marker (2026)
    if (progress >= 0.7) {
      const x2026 = xp(2026);
      const markerAlpha = Math.min((progress - 0.7) / 0.3, 1);
      ctx.globalAlpha = markerAlpha;

      // Vertical dashed line
      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      ctx.moveTo(x2026, pad.top);
      ctx.lineTo(x2026, pad.top + h);
      ctx.strokeStyle = '#f0c84a';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#f0c84a';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AdiOS', x2026, pad.top + 12);
      ctx.fillText('enters →', x2026, pad.top + 24);

      ctx.globalAlpha = 1;
    }

    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/* ═══════════════════════════════════════════════════════════
   8. GPU PROGRESS BAR
═══════════════════════════════════════════════════════════ */
function initGpuProgressBar() {
  const wrapper = document.getElementById('gpu-progress');
  if (!wrapper) return;

  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();

        // Animate fill to ~19% (38000/200000)
        const fill = document.getElementById('gpu-bar-fill');
        if (fill) {
          setTimeout(() => { fill.style.width = '19%'; }, 300);
        }
      }
    });
  }, { threshold: 0.3 });

  io.observe(wrapper);
}

/* ═══════════════════════════════════════════════════════════
   9. TAM DONUT CHART
═══════════════════════════════════════════════════════════ */
function initTamDonut() {
  const wrapper = document.getElementById('tam-chart');
  if (!wrapper) return;

  // circumference = 2 * PI * 90 ≈ 565.5
  const CIRC = 2 * Math.PI * 90;
  // Enterprise: 71/126 = 56.3% → 318.4
  const enterpriseDash = CIRC * (71 / 126);
  // Consumer: 55/126 = 43.7% → 247.1
  const consumerDash = CIRC * (55 / 126);
  // AdiOS target: ~20% overlay
  const adiosDash = CIRC * 0.20;

  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        io.disconnect();
        animateTamDonut(CIRC, enterpriseDash, consumerDash, adiosDash);
      }
    });
  }, { threshold: 0.3 });

  io.observe(wrapper);
}

function animateTamDonut(CIRC, entDash, consDash, adiosDash) {
  const segEnt  = document.getElementById('tam-seg-enterprise');
  const segCons = document.getElementById('tam-seg-consumer');
  const segAdios = document.getElementById('tam-seg-adios');

  if (!segEnt || !segCons) return;

  // Enterprise segment (amber) — starts from 0 position
  setTimeout(() => {
    segEnt.style.transition = 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)';
    segEnt.setAttribute('stroke-dasharray', entDash + ' ' + (CIRC - entDash));
    // offset: 0 (starts at top)
    segEnt.setAttribute('stroke-dashoffset', '0');
  }, 200);

  // Consumer segment (teal) — offset so it starts after enterprise
  setTimeout(() => {
    segCons.style.transition = 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)';
    // The consumer segment starts where enterprise ends
    // dashoffset = -(enterprise arc length) so it appears right after
    const offset = -(entDash);
    segCons.setAttribute('stroke-dasharray', consDash + ' ' + (CIRC - consDash));
    segCons.setAttribute('stroke-dashoffset', offset.toString());
  }, 700);

  // AdiOS highlight ring (amber glow) — on top of both
  setTimeout(() => {
    if (segAdios) {
      segAdios.style.transition = 'stroke-dasharray 0.8s ease, opacity 0.5s ease';
      segAdios.setAttribute('stroke-dasharray', adiosDash + ' ' + (CIRC - adiosDash));
      segAdios.setAttribute('stroke-dashoffset', (-entDash * 0.3).toString()); // centered on enterprise
      segAdios.style.opacity = '0.9';
    }
  }, 1800);
}

/* ═══════════════════════════════════════════════════════════
   INIT ALL CHARTS
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCounterRibbon();
  initGapDiagram();
  initAdoptionChart();
  initEngineFlowDiagram();
  initSeeItCharts();
  initIndiaMap();
  initMarketGrowthChart();
  initGpuProgressBar();
  initTamDonut();
});

/* ══════════════════════════════════════════════
   THE MOMENT IS NOW — JavaScript Enhancements
   v1.0 — Counters, particles, paths, audience cards
══════════════════════════════════════════════ */

/* ─── Init on DOMContentLoaded ─── */
document.addEventListener('DOMContentLoaded', () => {
  initMomentCounters();
  initTwoPathsParticles();
  initTwoPathsScrollEffect();
  initAudienceCards();
  initFinalStatement();
  initAudienceCTAPrefill();
  initFinalCtaPrefill();
  initSuccessParticles();
});

/* ══════════════════════════════════════════════
   PART 1: Moment Counters — count up on scroll
══════════════════════════════════════════════ */
function initMomentCounters() {
  const govEl  = document.getElementById('mc-gov');
  const gpuEl  = document.getElementById('mc-gpu');
  const mktEl  = document.getElementById('mc-mkt');

  if (!govEl && !gpuEl && !mktEl) return;

  let fired = false;

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      io.disconnect();

      // ₹10,372 Cr — animate as integer
      if (govEl) animateMomentCount(govEl, 0, 10372, 2200, v => '\u20b9' + v.toLocaleString('en-IN') + ' Cr');

      // 200,000 GPUs
      if (gpuEl) {
        setTimeout(() => {
          animateMomentCount(gpuEl, 0, 200000, 2400, v => v.toLocaleString('en-IN'));
        }, 200);
      }

      // $126B
      if (mktEl) {
        setTimeout(() => {
          animateMomentCount(mktEl, 0, 126, 2200, v => '$' + v + 'B');
        }, 400);
      }
    }
  }, { threshold: 0.4 });

  const countersEl = document.querySelector('.moment-counters');
  if (countersEl) io.observe(countersEl);
}

function animateMomentCount(el, from, to, duration, format) {
  const startTime = performance.now();

  // dramatic ease: fast start, slow finish
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(t);
    const value = Math.round(from + (to - from) * eased);
    el.textContent = format(value);
    if (t < 1) requestAnimationFrame(tick);
  }

  el.style.opacity = '0';
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s ease';
    el.style.opacity = '1';
    requestAnimationFrame(tick);
  }, 60);
}

/* ══════════════════════════════════════════════
   PART 2: Two Paths — Particle Canvases
══════════════════════════════════════════════ */
function initTwoPathsParticles() {
  initWithoutParticles();
  initWithParticles();
}

function initWithoutParticles() {
  const canvas = document.getElementById('canvas-without');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let active = false;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 2,
        // drift apart: random outward velocity
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: 0.3 + Math.random() * 0.5,
        decay: 0.0008 + Math.random() * 0.0006,
        color: Math.random() > 0.5 ? '#e85d5d' : '#8b4545',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!active) { animFrame = requestAnimationFrame(draw); return; }

    particles.forEach(p => {
      // Drift apart
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = Math.max(0, p.alpha - p.decay);

      // Reset if faded or out of bounds
      if (p.alpha <= 0.05 || p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
        p.x = canvas.width / 2 + (Math.random() - 0.5) * 80;
        p.y = canvas.height / 2 + (Math.random() - 0.5) * 80;
        p.alpha = 0.3 + Math.random() * 0.5;
        p.vx = (Math.random() - 0.5) * 0.6;
        p.vy = (Math.random() - 0.5) * 0.6;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  new ResizeObserver(() => { resize(); createParticles(); }).observe(canvas);

  // Expose activation
  canvas._activate = () => { active = true; };
  canvas._deactivate = () => { active = false; };
}

function initWithParticles() {
  const canvas = document.getElementById('canvas-with');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let active = false;

  // Orbital ring points (AdiOS logo style)
  const ORBIT_RADIUS = [40, 70, 95];
  const ORBIT_SPEED = [0.008, -0.005, 0.003];
  const ORBIT_COUNT = [6, 10, 14];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ORBIT_RADIUS.forEach((r, ri) => {
      const count = ORBIT_COUNT[ri];
      const speed = ORBIT_SPEED[ri];
      for (let i = 0; i < count; i++) {
        const baseAngle = (i / count) * Math.PI * 2;
        particles.push({
          cx, cy,
          orbitR: r,
          angle: baseAngle,
          speed: speed,
          r: ri === 0 ? 3 : ri === 1 ? 2 : 1.5,
          color: ri === 0 ? '#d4a843' : ri === 1 ? '#4ecdc4' : 'rgba(212,168,67,0.6)',
          alpha: 0,
          targetAlpha: 0.7 + Math.random() * 0.3,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    if (active) {
      // Draw faint orbital rings
      ORBIT_RADIUS.forEach(r => {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212,168,67,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    particles.forEach(p => {
      if (active) {
        p.angle += p.speed;
        p.alpha = Math.min(p.alpha + 0.02, p.targetAlpha);
      } else {
        p.alpha = Math.max(p.alpha - 0.02, 0);
      }

      const pulseFactor = 0.85 + 0.15 * Math.sin(t * 2 + p.pulse);
      const x = p.cx + Math.cos(p.angle) * p.orbitR;
      const y = p.cy + Math.sin(p.angle) * p.orbitR;

      ctx.beginPath();
      ctx.arc(x, y, p.r * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  draw();

  new ResizeObserver(resize).observe(canvas);

  canvas._activate = () => { active = true; };
  canvas._deactivate = () => { active = false; };
}

/* ══════════════════════════════════════════════
   TWO PATHS — Scroll-based dim/glow effect
══════════════════════════════════════════════ */
function initTwoPathsScrollEffect() {
  const withoutCard = document.getElementById('path-without');
  const withCard = document.getElementById('path-with');
  if (!withoutCard || !withCard) return;

  const canvasWithout = document.getElementById('canvas-without');
  const canvasWith = document.getElementById('canvas-with');

  let triggered = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        // Activate particles
        if (canvasWithout?._activate) canvasWithout._activate();
        if (canvasWith?._activate) canvasWith._activate();

        // Staggered effect: without dims, with glows
        setTimeout(() => {
          withoutCard.classList.add('paths-dimming');
          withCard.classList.add('paths-glowing');
        }, 600);
      } else if (!entry.isIntersecting && triggered) {
        // When scrolled away, pause
        if (canvasWith?._deactivate) canvasWith._deactivate();
        if (canvasWithout?._deactivate) canvasWithout._deactivate();
      }
    });
  }, { threshold: 0.25 });

  io.observe(withoutCard.parentElement || withoutCard);
}

/* ══════════════════════════════════════════════
   PART 3: Audience Cards — Stagger reveal
══════════════════════════════════════════════ */
function initAudienceCards() {
  const grid = document.getElementById('audience-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.audience-card');

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      io.disconnect();
      cards.forEach((card, idx) => {
        const delay = parseInt(card.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => {
          card.classList.add('revealed');
        }, delay + 100);
      });
    }
  }, { threshold: 0.1 });

  io.observe(grid);
}

/* ══════════════════════════════════════════════
   PART 4: Final Statement Canvas — ambient particles
══════════════════════════════════════════════ */
function initFinalStatement() {
  const canvas = document.getElementById('final-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animFrame;
  let active = false;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.25 - 0.05, // drift upward
        twinkle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.6 ? '#d4a843' : Math.random() > 0.5 ? '#4ecdc4' : '#ffffff',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;

    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
      if (s.x < -5) s.x = canvas.width + 5;
      if (s.x > canvas.width + 5) s.x = -5;

      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha * twinkle;
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    // Central ambient glow
    const grd = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, 200
    );
    grd.addColorStop(0, 'rgba(212,168,67,0.04)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  draw();
  new ResizeObserver(resize).observe(canvas);
}

/* ══════════════════════════════════════════════
   AUDIENCE CARD CTA PRE-FILL
══════════════════════════════════════════════ */
function initAudienceCTAPrefill() {
  const ctaLinks = document.querySelectorAll('.audience-cta[data-prefill]');
  const interestSelect = document.getElementById('wl-interest');

  ctaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const interest = link.getAttribute('data-prefill');

      // Pre-fill the interest dropdown
      if (interestSelect && interest) {
        interestSelect.value = interest;
        // Visual flash on the field
        interestSelect.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
        interestSelect.style.borderColor = 'rgba(212,168,67,0.8)';
        interestSelect.style.boxShadow = '0 0 12px rgba(212,168,67,0.3)';
        setTimeout(() => {
          interestSelect.style.borderColor = '';
          interestSelect.style.boxShadow = '';
        }, 1500);
      }

      // Smooth scroll to waitlist
      const waitlist = document.getElementById('waitlist');
      if (waitlist) {
        waitlist.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   FINAL CTA BUTTON — pre-fills and scrolls
══════════════════════════════════════════════ */
function initFinalCtaPrefill() {
  const finalBtn = document.getElementById('final-cta-btn');
  if (!finalBtn) return;

  finalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const waitlist = document.getElementById('waitlist');
    if (waitlist) {
      waitlist.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ══════════════════════════════════════════════
   SUCCESS PARTICLES — confetti burst on submit
══════════════════════════════════════════════ */
function initSuccessParticles() {
  // Observe for when the form success state is shown
  const successEl = document.getElementById('form-success');
  if (!successEl) return;

  // We hook into the existing form submission by observing DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mut => {
      if (mut.type === 'attributes' && mut.attributeName === 'aria-hidden') {
        const isVisible = successEl.getAttribute('aria-hidden') === 'false';
        if (isVisible) {
          setTimeout(launchSuccessParticles, 200);
        }
      }
      // Also catch style display changes
      if (mut.type === 'attributes' && mut.attributeName === 'style') {
        const visible = successEl.style.display !== 'none' && successEl.style.display !== '';
        if (visible) {
          setTimeout(launchSuccessParticles, 200);
        }
      }
    });
  });

  observer.observe(successEl, { attributes: true });
}

function launchSuccessParticles() {
  const canvas = document.getElementById('success-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  canvas.width = parent.offsetWidth || 400;
  canvas.height = parent.offsetHeight || 300;

  const colors = ['#d4a843', '#4ecdc4', '#f0c84a', '#ffffff', '#a8e6cf'];
  const particles = [];

  // Create 60 confetti particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 4,
      r: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      gravity: 0.3 + Math.random() * 0.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      isRect: Math.random() > 0.5,
    });
  }

  let frame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.alpha -= 0.016;
      p.rotation += p.rotSpeed;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;

        if (p.isRect) {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (alive) frame = requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  animate();
}

