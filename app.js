// X.Org Documentation App v2
// Local content, full-text search, pin system, themed doc rendering
(function () {
  'use strict';

  // --- SVG Icons ---
  const ICONS = {
    book: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    sliders: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>',
    monitor: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    cpu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>',
    terminal: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    'hard-drive': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>',
    'file-text': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    code: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    server: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'share-2': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    doc: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    x: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  };

  // --- DOM refs ---
  const $ = (sel) => document.querySelector(sel);
  const sidebarNav = $('#sidebar-nav');
  const sectionCards = $('#section-cards');
  const welcomeStats = $('#welcome-stats');
  const welcomeView = $('#welcome-view');
  const docView = $('#doc-view');
  const sectionView = $('#section-view');
  const searchOverlay = $('#search-overlay');
  const searchInput = $('#search-input');
  const searchResults = $('#search-results');
  const docContent = $('#doc-content');
  const docBreadcrumb = $('#doc-breadcrumb');
  const docFormats = $('#doc-formats');
  const sectionTitle = $('#section-title');
  const sectionDesc = $('#section-desc');
  const sectionItems = $('#section-items');
  const sectionFilter = $('#section-filter');
  const sidebar = $('#sidebar');
  const searchStatus = $('#search-status');
  const docFindBar = $('#doc-find-bar');
  const docFindInput = $('#doc-find-input');
  const docFindCount = $('#doc-find-count');
  const pinnedSection = $('#pinned-section');
  const pinnedList = $('#pinned-list');
  const docPinBtn = $('#doc-pin-btn');

  // --- State ---
  let currentView = 'welcome';
  let currentSection = null;
  let currentDocInfo = null; // { sectionId, href, title, path, url }
  let searchHighlightIdx = -1;
  let searchResultItems = [];
  let searchWorker = null;
  let searchReady = false;
  let searchDebounce = null;
  let findHighlights = [];
  let findCurrentIdx = -1;

  // ===========================================
  // PIN SYSTEM
  // ===========================================
  const PIN_KEY = 'xorg-docs-pins';

  function loadPins() {
    try { return JSON.parse(localStorage.getItem(PIN_KEY)) || []; }
    catch { return []; }
  }

  function savePins(pins) {
    localStorage.setItem(PIN_KEY, JSON.stringify(pins));
  }

  function isPinned(docInfo) {
    const key = docInfo.href || docInfo.path;
    return loadPins().some(p => (p.href || p.path) === key);
  }

  function togglePin(docInfo) {
    const pins = loadPins();
    const key = docInfo.href || docInfo.path;
    const idx = pins.findIndex(p => (p.href || p.path) === key);
    if (idx >= 0) {
      pins.splice(idx, 1);
    } else {
      pins.push({
        title: docInfo.title,
        href: docInfo.href || null,
        path: docInfo.path || null,
        url: docInfo.url || null,
        sectionId: docInfo.sectionId || null,
      });
    }
    savePins(pins);
    renderPins();
    updatePinButton();
  }

  function removePin(key) {
    const pins = loadPins().filter(p => (p.href || p.path) !== key);
    savePins(pins);
    renderPins();
    updatePinButton();
  }

  function updatePinButton() {
    if (!currentDocInfo) {
      docPinBtn.classList.remove('pinned');
      docPinBtn.title = 'Pin this page';
      return;
    }
    const pinned = isPinned(currentDocInfo);
    docPinBtn.classList.toggle('pinned', pinned);
    docPinBtn.title = pinned ? 'Unpin this page' : 'Pin this page';
    // Fill vs stroke for pinned state
    const svg = docPinBtn.querySelector('svg');
    if (pinned) {
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('stroke', 'none');
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
    }
  }

  function renderPins() {
    const pins = loadPins();
    if (pins.length === 0) {
      pinnedSection.classList.add('empty');
      pinnedList.innerHTML = '';
      return;
    }
    pinnedSection.classList.remove('empty');
    pinnedList.innerHTML = pins.map(pin => {
      const key = pin.href || pin.path;
      const shortTitle = pin.title.length > 36 ? pin.title.substring(0, 36) + '...' : pin.title;
      return `
        <div class="pinned-item" data-key="${escapeHtml(key)}" data-section="${pin.sectionId || ''}" data-href="${escapeHtml(pin.href || '')}" data-path="${escapeHtml(pin.path || '')}" data-url="${escapeHtml(pin.url || '')}">
          <span class="pinned-title" title="${escapeHtml(pin.title)}">${escapeHtml(shortTitle)}</span>
          <button class="unpin-btn" data-key="${escapeHtml(key)}" title="Unpin">${ICONS.x}</button>
        </div>`;
    }).join('');

    // Click to open
    pinnedList.querySelectorAll('.pinned-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.unpin-btn')) return;
        const sectionId = el.dataset.section;
        const href = el.dataset.href;
        const path = el.dataset.path;
        const url = el.dataset.url;

        if (sectionId && href) {
          const section = DOCS_DATA.find(s => s.id === sectionId);
          const item = section?.items.find(i => i.href === href);
          if (section && item) {
            openDoc(section, item);
            closeMobileSidebar();
            return;
          }
        }
        if (path) {
          openDocByPath(path, url);
          closeMobileSidebar();
        }
      });
    });

    // Unpin buttons
    pinnedList.querySelectorAll('.unpin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removePin(btn.dataset.key);
      });
    });
  }

  docPinBtn.addEventListener('click', () => {
    if (currentDocInfo) togglePin(currentDocInfo);
  });

  // ===========================================
  // SEARCH WORKER
  // ===========================================
  function initSearchWorker() {
    searchWorker = new Worker('search-worker.js');
    searchWorker.onmessage = function (e) {
      const { type, payload } = e.data;
      if (type === 'ready') {
        searchReady = true;
        searchStatus.textContent = `Full-text search across ${payload.count} documents`;
      } else if (type === 'results') {
        renderSearchResults(payload.query, payload.results);
      } else if (type === 'error') {
        searchStatus.textContent = 'Search index failed to load';
      }
    };
    searchWorker.postMessage({ type: 'init' });
  }

  // ===========================================
  // UTILITY
  // ===========================================
  function resolveLocalPath(item, format) {
    if (!format) format = item.formats[0];
    const href = item.href;
    if (/\.\w+$/.test(href)) return 'docs/' + href;
    return 'docs/' + href + (format === 'xhtml' ? '.xhtml' : '.' + format);
  }

  function resolveRemoteUrl(item, format) {
    if (!format) format = item.formats[0];
    const href = item.href;
    if (/\.\w+$/.test(href)) return BASE_URL + href;
    return BASE_URL + href + (format === 'xhtml' ? '.xhtml' : '.' + format);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp('(' + q + ')', 'gi'), '<mark>$1</mark>');
  }

  // ===========================================
  // SIDEBAR
  // ===========================================
  function shortTitle(title) {
    // "ccmakedep — create dependencies..." -> "ccmakedep"
    const sep = title.indexOf(' — ');
    if (sep > 0 && sep < 40) return title.substring(0, sep);
    const dash = title.indexOf(' - ');
    if (dash > 0 && dash < 40) return title.substring(0, dash);
    if (title.length > 32) return title.substring(0, 32) + '...';
    return title;
  }

  function renderSidebar() {
    let html = '';
    DOCS_DATA.forEach((section) => {
      html += `
        <div class="nav-section" data-section="${section.id}">
          <button class="nav-section-btn" data-section="${section.id}">
            ${ICONS[section.icon] || ICONS.book}
            <span>${section.title}</span>
            <span class="nav-section-count">${section.items.length}</span>
            <span class="chevron">${ICONS.chevron}</span>
          </button>
          <div class="nav-items" id="nav-items-${section.id}">
            ${section.items.map((item, idx) => `
              <button class="nav-item" data-section="${section.id}" data-idx="${idx}"
                data-href="${escapeHtml(item.href)}" title="${escapeHtml(item.title)}">
                ${escapeHtml(shortTitle(item.title))}
              </button>
            `).join('')}
          </div>
        </div>`;
    });
    sidebarNav.innerHTML = html;

    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = DOCS_DATA.find(s => s.id === btn.dataset.section);
        if (!section) return;
        const itemsEl = document.getElementById('nav-items-' + section.id);
        const isOpen = itemsEl.classList.contains('open');
        sidebarNav.querySelectorAll('.nav-items').forEach(el => el.classList.remove('open'));
        sidebarNav.querySelectorAll('.nav-section-btn').forEach(el => el.classList.remove('expanded'));
        if (!isOpen) { itemsEl.classList.add('open'); btn.classList.add('expanded'); }
        showSection(section);
      });
    });

    sidebarNav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = DOCS_DATA.find(s => s.id === item.dataset.section);
        if (section) { openDoc(section, section.items[parseInt(item.dataset.idx)]); closeMobileSidebar(); }
      });
    });
  }

  // Highlight active item in sidebar
  function setActiveNavItem(sectionId, href) {
    sidebarNav.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.href === href);
    });
    sidebarNav.querySelectorAll('.nav-section').forEach(el => {
      el.classList.toggle('active-section', el.dataset.section === sectionId);
    });
    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === sectionId);
      if (btn.dataset.section === sectionId) btn.classList.add('expanded');
    });
    const itemsEl = document.getElementById('nav-items-' + sectionId);
    if (itemsEl) itemsEl.classList.add('open');
  }

  // Build section navigation from doc headings
  function buildDocSectionNav(sectionId) {
    // Remove any existing doc-sections nav
    const existing = sidebarNav.querySelector('.nav-doc-sections');
    if (existing) existing.remove();

    // Find all headings in the rendered doc
    const headings = docContent.querySelectorAll('h1, h2, h3');
    if (headings.length < 2) return; // not worth showing

    const container = document.createElement('div');
    container.className = 'nav-doc-sections';
    container.innerHTML = '<div class="nav-doc-sections-title">On this page</div>';

    headings.forEach((h, i) => {
      // Ensure heading has an id for scroll-to
      if (!h.id) h.id = 'doc-heading-' + i;
      const text = h.textContent.trim();
      if (!text || text.length > 60) return;

      const btn = document.createElement('button');
      btn.className = 'nav-doc-section' + (h.tagName === 'H3' ? ' depth-3' : '');
      btn.textContent = text;
      btn.dataset.target = h.id;
      btn.addEventListener('click', () => {
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active
        container.querySelectorAll('.nav-doc-section').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      container.appendChild(btn);
    });

    // Insert after the active section's nav-items
    const activeSection = sidebarNav.querySelector('.nav-section[data-section="' + sectionId + '"]');
    if (activeSection) {
      activeSection.after(container);
    } else {
      sidebarNav.appendChild(container);
    }

    // Scroll-spy: track which heading is in view
    setupScrollSpy(headings, container);
  }

  let scrollSpyCleanup = null;
  function setupScrollSpy(headings, container) {
    if (scrollSpyCleanup) { scrollSpyCleanup(); scrollSpyCleanup = null; }

    const buttons = container.querySelectorAll('.nav-doc-section');
    const headingArray = Array.from(headings).filter(h => h.id);

    function onScroll() {
      const scrollTop = docContent.scrollTop;
      let activeIdx = 0;
      for (let i = headingArray.length - 1; i >= 0; i--) {
        if (headingArray[i].offsetTop <= scrollTop + 100) {
          activeIdx = i;
          break;
        }
      }
      buttons.forEach((btn, i) => btn.classList.toggle('active', i === activeIdx));
    }

    docContent.addEventListener('scroll', onScroll);
    scrollSpyCleanup = () => docContent.removeEventListener('scroll', onScroll);
    onScroll();
  }

  function clearDocSectionNav() {
    const existing = sidebarNav.querySelector('.nav-doc-sections');
    if (existing) existing.remove();
    if (scrollSpyCleanup) { scrollSpyCleanup(); scrollSpyCleanup = null; }
    sidebarNav.classList.remove('doc-open');
  }

  // ===========================================
  // WELCOME VIEW
  // ===========================================
  function renderWelcome() {
    let totalDocs = 0;
    let cardsHtml = '';
    DOCS_DATA.forEach(section => {
      totalDocs += section.items.length;
      cardsHtml += `
        <div class="section-card" data-section="${section.id}">
          <div class="section-card-icon">${ICONS[section.icon] || ICONS.book}</div>
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.description)}</p>
          <div class="section-card-count">${section.items.length} document${section.items.length !== 1 ? 's' : ''}</div>
        </div>`;
    });
    sectionCards.innerHTML = cardsHtml;
    welcomeStats.innerHTML = `
      <div class="stat-item"><span class="stat-number">${DOCS_DATA.length}</span> sections</div>
      <div class="stat-item"><span class="stat-number">${totalDocs}</span> documents</div>
      <div class="stat-item"><span class="stat-number">1500+</span> pages indexed</div>`;
    sectionCards.querySelectorAll('.section-card').forEach(card => {
      card.addEventListener('click', () => {
        const section = DOCS_DATA.find(s => s.id === card.dataset.section);
        if (section) showSection(section);
      });
    });
  }

  // ===========================================
  // VIEW SWITCHING
  // ===========================================
  function showView(view) {
    currentView = view;
    welcomeView.classList.toggle('hidden', view !== 'welcome');
    sectionView.classList.toggle('hidden', view !== 'section');
    docView.classList.toggle('hidden', view !== 'doc');
    if (view !== 'doc') {
      $('#main-content').scrollTop = 0;
      closeFindBar();
      clearDocSectionNav();
    }
  }

  // ===========================================
  // SECTION VIEW
  // ===========================================
  function showSection(section) {
    currentSection = section;
    sectionTitle.textContent = section.title;
    sectionDesc.textContent = section.description;
    sectionFilter.value = '';
    renderSectionItems(section.items, section);
    showView('section');
    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.section === section.id));
  }

  function renderSectionItems(items, section) {
    if (items.length === 0) {
      sectionItems.innerHTML = '<div class="search-empty">No matching documents.</div>';
      return;
    }
    sectionItems.innerHTML = items.map(item => `
      <div class="doc-item" data-href="${escapeHtml(item.href)}">
        <span class="doc-item-title">${escapeHtml(item.title)}</span>
        <div class="doc-item-formats">
          ${item.formats.map(f =>
            `<a class="format-badge ${f}" href="${resolveRemoteUrl(item, f)}" target="_blank" rel="noopener" title="Open ${f.toUpperCase()} on x.org" onclick="event.stopPropagation()">${f}</a>`
          ).join('')}
        </div>
      </div>`).join('');
    sectionItems.querySelectorAll('.doc-item').forEach((el, idx) => {
      el.addEventListener('click', () => openDoc(section, items[idx]));
    });
  }

  sectionFilter.addEventListener('input', () => {
    if (!currentSection) return;
    const q = sectionFilter.value.toLowerCase().trim();
    if (!q) { renderSectionItems(currentSection.items, currentSection); return; }
    const filtered = currentSection.items.filter(item =>
      item.title.toLowerCase().includes(q) || item.tags.some(t => t.includes(q)));
    renderSectionItems(filtered, currentSection);
  });

  // ===========================================
  // DOCUMENT VIEWER
  // ===========================================
  async function openDoc(section, item) {
    showView('doc');

    const primaryFormat = item.formats.includes('html') ? 'html' :
                          item.formats.includes('xhtml') ? 'xhtml' : item.formats[0];

    currentDocInfo = {
      title: item.title,
      href: item.href,
      sectionId: section.id,
      path: null,
      url: resolveRemoteUrl(item, primaryFormat),
    };
    updatePinButton();
    setActiveNavItem(section.id, item.href);

    docBreadcrumb.innerHTML = `
      <span>${escapeHtml(section.title)}</span>
      <span class="bc-sep">/</span>
      <span class="bc-current">${escapeHtml(item.title)}</span>`;

    docFormats.innerHTML = item.formats.map(f =>
      `<a class="format-badge ${f}" href="${resolveRemoteUrl(item, f)}" target="_blank" rel="noopener" title="${f.toUpperCase()} on x.org">${f}</a>`
    ).join('');

    docContent.innerHTML = '<div class="doc-loading"><div class="spinner"></div>Loading...</div>';

    const localPath = resolveLocalPath(item, primaryFormat);
    try {
      const resp = await fetch(localPath);
      if (!resp.ok) throw new Error(resp.status);
      renderDocContent(await resp.text(), primaryFormat, item);
    } catch {
      try {
        const resp = await fetch(resolveRemoteUrl(item, primaryFormat));
        if (!resp.ok) throw new Error(resp.status);
        renderDocContent(await resp.text(), primaryFormat, item);
      } catch {
        docContent.innerHTML = `<div class="doc-loading"><p>Could not load.</p>
          <p style="margin-top:12px"><a href="${currentDocInfo.url}" target="_blank" rel="noopener" class="back-btn" style="display:inline-flex;text-decoration:none">Open on x.org</a></p></div>`;
      }
    }
  }

  async function openDocByPath(path, originalUrl) {
    showView('doc');
    const title = path.split('/').pop().replace(/\.\w+$/, '');

    currentDocInfo = { title, href: null, sectionId: null, path, url: originalUrl };
    updatePinButton();

    docBreadcrumb.innerHTML = `<span>Search Result</span><span class="bc-sep">/</span><span class="bc-current">${escapeHtml(title)}</span>`;
    docFormats.innerHTML = originalUrl
      ? `<a class="format-badge html" href="${originalUrl}" target="_blank" rel="noopener">x.org</a>` : '';

    docContent.innerHTML = '<div class="doc-loading"><div class="spinner"></div>Loading...</div>';

    try {
      const resp = await fetch('docs/' + path);
      if (!resp.ok) throw new Error(resp.status);
      const ext = path.split('.').pop().toLowerCase();
      renderDocContent(await resp.text(), ext === 'txt' ? 'txt' : (ext === 'xhtml' ? 'xhtml' : 'html'),
        { href: path, formats: [ext] });
    } catch {
      docContent.innerHTML = originalUrl
        ? `<div class="doc-loading"><p>Could not load locally.</p><p style="margin-top:12px"><a href="${originalUrl}" target="_blank" rel="noopener" class="back-btn" style="display:inline-flex;text-decoration:none">Open on x.org</a></p></div>`
        : '<div class="doc-loading">Failed to load document.</div>';
    }
  }

  function renderDocContent(html, format, item) {
    if (format === 'txt') {
      docContent.innerHTML = `<div class="doc-content-inner"><pre style="white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(html)}</pre></div>`;
      return;
    }

    let bodyContent = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) bodyContent = bodyMatch[1];

    // Strip inline styles from x.org docs so our theme takes over
    bodyContent = bodyContent.replace(/\sstyle="[^"]*"/gi, '');
    bodyContent = bodyContent.replace(/\sstyle='[^']*'/gi, '');

    // Strip <style> blocks
    bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Strip bgcolor, color, face attributes
    bodyContent = bodyContent.replace(/\s(bgcolor|color|face|background)="[^"]*"/gi, '');

    // Strip <font> tags but keep content
    bodyContent = bodyContent.replace(/<\/?font[^>]*>/gi, '');

    // Make links open in new tab for non-anchor links
    bodyContent = bodyContent.replace(
      /(<a\s[^>]*href=")([^"]*?)(")/gi,
      (match, pre, href, post) => {
        if (href.startsWith('#')) return match;
        if (href.startsWith('http')) return pre + href + post + ' target="_blank" rel="noopener"';
        return pre + href + post + ' target="_blank" rel="noopener"';
      }
    );

    // Rewrite image src
    bodyContent = bodyContent.replace(
      /(<img\s[^>]*src=")([^"]*?)(")/gi,
      (match, pre, src, post) => {
        if (src.startsWith('http') || src.startsWith('data:')) return match;
        const docDir = resolveLocalPath(item).replace(/[^/]*$/, '');
        return pre + docDir + src + post;
      }
    );

    docContent.innerHTML = `<div class="doc-content-inner">${bodyContent}</div>`;
    docContent.scrollTop = 0;

    // Post-process: strip native TOCs and rebuild
    rebuildTOC();

    // Build sidebar section nav from headings
    if (currentDocInfo && currentDocInfo.sectionId) {
      sidebarNav.classList.add('doc-open');
      buildDocSectionNav(currentDocInfo.sectionId);
    }
  }

  function rebuildTOC() {
    const inner = docContent.querySelector('.doc-content-inner');
    if (!inner) return;

    // Gather all headings
    const headings = inner.querySelectorAll('h2, h3');
    if (headings.length < 2) return;

    // Detect and remove native TOC patterns:
    // Pattern 1: groff man pages — a <p> containing only <a href="#heading..."><br> at the top
    // Pattern 2: DocBook — .toc or .TOC divs
    // Pattern 3: loose <p> with only anchor links before the first <h2>

    // Remove .toc / .TOC elements
    inner.querySelectorAll('.toc, .TOC, .table-of-contents').forEach(el => el.remove());

    // Remove groff-style: first <p> that's just anchor links + <br>
    const firstH2 = inner.querySelector('h2');
    if (firstH2) {
      let el = inner.firstElementChild;
      // Skip past the h1 title if present
      if (el && el.tagName === 'H1') el = el.nextElementSibling;
      // Remove any <p> blocks before first <h2> that are just navigation links
      while (el && el !== firstH2) {
        const next = el.nextElementSibling;
        if (el.tagName === 'P' || el.tagName === 'DIV') {
          const text = el.textContent.trim();
          const links = el.querySelectorAll('a[href^="#"]');
          if (links.length > 0 && links.length >= (text.split(/\s+/).length / 3)) {
            el.remove();
          }
        }
        // Also remove <hr> right after native TOC
        if (el.tagName === 'HR' && (!el.previousElementSibling || el.previousElementSibling.tagName === 'H1')) {
          el.remove();
        }
        el = next;
      }
    }

    // Build our styled TOC
    const toc = document.createElement('nav');
    toc.className = 'doc-toc';
    const title = document.createElement('div');
    title.className = 'doc-toc-title';
    title.textContent = 'Contents';
    toc.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'doc-toc-list';

    headings.forEach((h, i) => {
      if (!h.id) h.id = 'doc-heading-' + i;
      const text = h.textContent.trim();
      if (!text) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = text;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    toc.appendChild(list);

    // Insert after the first h1, or at the top
    const h1 = inner.querySelector('h1');
    if (h1 && h1.nextSibling) {
      h1.after(toc);
    } else {
      inner.prepend(toc);
    }
  }

  // Back buttons
  $('#back-btn').addEventListener('click', () => {
    currentDocInfo = null;
    sidebarNav.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    sidebarNav.querySelectorAll('.nav-section').forEach(el => el.classList.remove('active-section'));
    if (currentSection) showSection(currentSection);
    else showView('welcome');
  });
  $('#section-back-btn').addEventListener('click', () => {
    currentSection = null;
    showView('welcome');
    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn => btn.classList.remove('active'));
    sidebarNav.querySelectorAll('.nav-section').forEach(el => el.classList.remove('active-section'));
  });

  // ===========================================
  // FIND IN DOCUMENT
  // ===========================================
  function openFindBar() { docFindBar.classList.remove('hidden'); docFindInput.focus(); docFindInput.select(); }
  function closeFindBar() { docFindBar.classList.add('hidden'); docFindInput.value = ''; docFindCount.textContent = ''; clearFindHighlights(); }

  function clearFindHighlights() {
    findHighlights.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) { parent.replaceChild(document.createTextNode(mark.textContent), mark); parent.normalize(); }
    });
    findHighlights = [];
    findCurrentIdx = -1;
  }

  function doFind(query) {
    clearFindHighlights();
    if (!query) { docFindCount.textContent = ''; return; }
    const walker = document.createTreeWalker(docContent, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const qLower = query.toLowerCase();
    findHighlights = [];

    for (const node of nodes) {
      const text = node.textContent;
      const lower = text.toLowerCase();
      let idx = 0, lastEnd = 0;
      const parts = [];
      while ((idx = lower.indexOf(qLower, idx)) !== -1) {
        if (idx > lastEnd) parts.push({ text: text.substring(lastEnd, idx), hl: false });
        parts.push({ text: text.substring(idx, idx + query.length), hl: true });
        lastEnd = idx + query.length;
        idx = lastEnd;
      }
      if (parts.length > 0) {
        if (lastEnd < text.length) parts.push({ text: text.substring(lastEnd), hl: false });
        const frag = document.createDocumentFragment();
        for (const p of parts) {
          if (p.hl) {
            const mark = document.createElement('mark');
            mark.className = 'find-highlight';
            mark.textContent = p.text;
            frag.appendChild(mark);
            findHighlights.push(mark);
          } else frag.appendChild(document.createTextNode(p.text));
        }
        node.parentNode.replaceChild(frag, node);
      }
    }
    docFindCount.textContent = findHighlights.length > 0 ? `${findHighlights.length} found` : 'No matches';
    if (findHighlights.length > 0) { findCurrentIdx = 0; showFindCurrent(); }
  }

  function showFindCurrent() {
    findHighlights.forEach((m, i) => m.classList.toggle('active', i === findCurrentIdx));
    if (findHighlights[findCurrentIdx]) {
      findHighlights[findCurrentIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      docFindCount.textContent = `${findCurrentIdx + 1} / ${findHighlights.length}`;
    }
  }
  function findNext() { if (!findHighlights.length) return; findCurrentIdx = (findCurrentIdx + 1) % findHighlights.length; showFindCurrent(); }
  function findPrev() { if (!findHighlights.length) return; findCurrentIdx = (findCurrentIdx - 1 + findHighlights.length) % findHighlights.length; showFindCurrent(); }

  let findDebounce = null;
  docFindInput.addEventListener('input', () => { clearTimeout(findDebounce); findDebounce = setTimeout(() => doFind(docFindInput.value), 200); });
  docFindInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.shiftKey ? findPrev() : findNext(); } if (e.key === 'Escape') closeFindBar(); });
  $('#doc-find-btn').addEventListener('click', openFindBar);
  $('#doc-find-next').addEventListener('click', findNext);
  $('#doc-find-prev').addEventListener('click', findPrev);
  $('#doc-find-close').addEventListener('click', closeFindBar);

  // ===========================================
  // SEARCH
  // ===========================================
  function openSearch() {
    searchOverlay.classList.remove('hidden');
    searchInput.value = '';
    searchInput.focus();
    searchResults.innerHTML = renderSearchHints();
    searchHighlightIdx = -1;
    searchResultItems = [];
  }
  function closeSearch() { searchOverlay.classList.add('hidden'); searchInput.value = ''; }

  function renderSearchHints() {
    return `<div class="search-empty">
      <div class="empty-icon">${ICONS.book}</div>
      <p>Search across all 1500+ documents</p>
      <p style="font-size:0.75rem;margin-top:4px;color:var(--text-tertiary)">Titles, tags, and full document text</p>
    </div>`;
  }

  function performSearch(query) {
    const q = query.trim();
    if (!q) { searchResults.innerHTML = renderSearchHints(); searchResultItems = []; searchHighlightIdx = -1; return; }
    if (!searchReady) { searchResults.innerHTML = '<div class="search-empty">Search index loading...</div>'; return; }

    const quickResults = [];
    const qLower = q.toLowerCase();
    for (const section of DOCS_DATA) {
      for (const item of section.items) {
        if (item.title.toLowerCase().includes(qLower) || item.tags.some(t => t.includes(qLower)))
          quickResults.push({ section, item });
      }
    }

    if (quickResults.length > 0) {
      let html = '<div class="search-result-group"><div class="search-result-group-title">Title matches</div>';
      html += quickResults.slice(0, 10).map(r => `
        <div class="search-result-item" data-section="${r.section.id}" data-href="${escapeHtml(r.item.href)}">
          <div class="result-row"><span class="result-icon">${ICONS.doc}</span><span class="result-title">${highlightMatch(r.item.title, q)}</span></div>
        </div>`).join('');
      html += '</div><div id="fulltext-results"><div class="search-empty" style="padding:12px;font-size:0.78rem">Searching full text...</div></div>';
      searchResults.innerHTML = html;
      bindSearchResultClicks();
    }

    searchWorker.postMessage({ type: 'search', payload: { query: q, maxResults: 30 } });
  }

  function renderSearchResults(query, results) {
    if (!query.trim()) return;
    const fulltextEl = document.getElementById('fulltext-results');
    if (fulltextEl) {
      if (results.length === 0) { fulltextEl.innerHTML = ''; bindSearchResultClicks(); return; }
      let html = '<div class="search-result-group"><div class="search-result-group-title">Full-text matches</div>';
      html += results.slice(0, 20).map(r => `
        <div class="search-result-item" data-path="${escapeHtml(r.path)}" data-url="${escapeHtml(r.url)}">
          <div class="result-row"><span class="result-icon">${ICONS.doc}</span><span class="result-title">${highlightMatch(r.title, query)}</span></div>
          ${r.snippet ? `<div class="result-snippet">${highlightMatch(r.snippet, query)}</div>` : ''}
        </div>`).join('');
      html += '</div>';
      fulltextEl.innerHTML = html;
      bindSearchResultClicks();
      return;
    }

    if (results.length === 0) {
      searchResults.innerHTML = `<div class="search-empty"><div class="empty-icon">${ICONS.info}</div><p>No results for "${escapeHtml(query)}"</p></div>`;
      searchResultItems = [];
      return;
    }

    let html = '<div class="search-result-group"><div class="search-result-group-title">Results</div>';
    html += results.map(r => `
      <div class="search-result-item" data-path="${escapeHtml(r.path)}" data-url="${escapeHtml(r.url)}">
        <div class="result-row"><span class="result-icon">${ICONS.doc}</span><span class="result-title">${highlightMatch(r.title, query)}</span></div>
        ${r.snippet ? `<div class="result-snippet">${highlightMatch(r.snippet, query)}</div>` : ''}
      </div>`).join('');
    html += '</div>';
    searchResults.innerHTML = html;
    bindSearchResultClicks();
  }

  function bindSearchResultClicks() {
    searchResultItems = searchResults.querySelectorAll('.search-result-item');
    searchHighlightIdx = -1;
    searchResultItems.forEach(el => {
      el.addEventListener('click', () => {
        const { section: sid, href, path, url } = el.dataset;
        if (sid && href) {
          const section = DOCS_DATA.find(s => s.id === sid);
          const item = section?.items.find(i => i.href === href);
          if (section && item) { closeSearch(); openDoc(section, item); closeMobileSidebar(); return; }
        }
        if (path) { closeSearch(); closeMobileSidebar(); openDocByPath(path, url); }
      });
    });
  }

  searchInput.addEventListener('input', () => { clearTimeout(searchDebounce); searchDebounce = setTimeout(() => performSearch(searchInput.value), 150); });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (searchResultItems.length) { searchHighlightIdx = Math.min(searchHighlightIdx + 1, searchResultItems.length - 1); updateSearchHighlight(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (searchResultItems.length) { searchHighlightIdx = Math.max(searchHighlightIdx - 1, 0); updateSearchHighlight(); } }
    else if (e.key === 'Enter') { e.preventDefault(); if (searchHighlightIdx >= 0 && searchResultItems[searchHighlightIdx]) searchResultItems[searchHighlightIdx].click(); }
  });

  function updateSearchHighlight() {
    searchResultItems.forEach((el, i) => el.classList.toggle('highlighted', i === searchHighlightIdx));
    if (searchHighlightIdx >= 0 && searchResultItems[searchHighlightIdx]) searchResultItems[searchHighlightIdx].scrollIntoView({ block: 'nearest' });
  }

  $('#search-trigger').addEventListener('click', openSearch);
  $('#mobile-search-btn')?.addEventListener('click', openSearch);
  searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });

  // ===========================================
  // THEME
  // ===========================================
  function getTheme() { return localStorage.getItem('xorg-docs-theme') || 'dark'; }
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('xorg-docs-theme', theme);
    $('#theme-icon-dark').classList.toggle('hidden', theme === 'light');
    $('#theme-icon-light').classList.toggle('hidden', theme === 'dark');
  }
  $('#theme-toggle').addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));

  // ===========================================
  // MOBILE SIDEBAR
  // ===========================================
  let overlayEl = null;
  function openMobileSidebar() {
    sidebar.classList.add('open');
    if (!overlayEl) { overlayEl = document.createElement('div'); overlayEl.className = 'sidebar-overlay'; document.body.appendChild(overlayEl); overlayEl.addEventListener('click', closeMobileSidebar); }
    overlayEl.classList.add('open');
  }
  function closeMobileSidebar() { sidebar.classList.remove('open'); if (overlayEl) overlayEl.classList.remove('open'); }
  $('#mobile-menu-btn')?.addEventListener('click', openMobileSidebar);

  // ===========================================
  // KEYBOARD SHORTCUTS
  // ===========================================
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchOverlay.classList.contains('hidden') ? openSearch() : closeSearch(); }
    if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'f' && currentView === 'doc') { e.preventDefault(); openFindBar(); }
  });

  // ===========================================
  // INIT
  // ===========================================
  setTheme(getTheme());
  renderSidebar();
  renderWelcome();
  renderPins();
  showView('welcome');
  initSearchWorker();
})();
