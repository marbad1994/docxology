// X.Org Documentation App v3
// Bundled X.Org docs stay read-only; workspace docs are imported/authored locally.
(function () {
  'use strict';

    const PIN_KEY = 'xorg-docs-pins';
  const WORKSPACE_DOCS_KEY = 'doc-browser-workspace-docs-v2';
  const WORKSPACE_STATE_KEY = 'doc-browser-workspace-state-v2';

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
    x: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };


  const RELEASE_MODE = Boolean(window.__DOC_WORKSPACE_RELEASE__);
  const BUILTIN_WORKSPACE_URL = 'content/workspace.json';
  const DEFAULT_WORKSPACE_TITLE = 'Doc Workspace Documentation';
  const DEFAULT_WORKSPACE_VERSION = 'v1.0';
  const DEFAULT_WORKSPACE_DESCRIPTION = 'Built-in product documentation for using, extending, and publishing with Doc Workspace.';

  const $ = (sel) => document.querySelector(sel);
  const sidebarNav = $('#sidebar-nav');
  const sectionCards = $('#section-cards');
  const welcomeStats = $('#welcome-stats');
  const welcomeView = $('#welcome-view');
  const workspaceView = $('#workspace-view');
  const editorView = $('#editor-view');
  const docView = $('#doc-view');
  const sectionView = $('#section-view');
  const searchOverlay = $('#search-overlay');
  const searchInput = $('#search-input');
  const searchResults = $('#search-results');
  const docContent = $('#doc-content');
  const docBreadcrumb = $('#doc-breadcrumb');
  const docFormats = $('#doc-formats');
  const docEditBtn = $('#doc-edit-btn');
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
  const workspaceDocList = $('#workspace-doc-list');
  const workspaceImportInput = $('#workspace-import-input');
  const workspaceViewTitle = $('#workspace-view-title');
  const workspaceViewDesc = $('#workspace-view-desc');
  const appTitle = $('#app-title');
  const appVersion = $('#app-version');
  const mobileTitle = $('#mobile-title');
  const welcomeTitle = $('#welcome-title');
  const welcomeSubtitle = $('#welcome-subtitle');
  const welcomeHint = $('#welcome-hint');
  const workspaceEditBtn = $('#workspace-edit-btn');
  const workspaceHeaderCategoryBtn = $('#workspace-header-category-btn');
  const workspaceExportBtn = $('#workspace-export-btn');
  const editorTitle = $('#editor-title');
  const editorDocTitle = $('#editor-doc-title');
  const editorDocSummary = $('#editor-doc-summary');
  const editorDocCategory = $('#editor-doc-category');
  const editorDocOrder = $('#editor-doc-order');
  const editorDocShowInIndex = $('#editor-doc-show-in-index');
  const editorDocTags = $('#editor-doc-tags');
  const editorDocIcon = $('#editor-doc-icon');
  const editorDocIconHint = $('#editor-doc-icon-hint');
  const editorNumberHeadings = $('#editor-doc-number-headings');
  const editorDocSource = $('#editor-doc-source');
  const editorPreview = $('#editor-preview');
  const categoryEditorView = $('#category-editor-view');
  const workspaceMetaEditorView = $('#workspace-meta-editor-view');
  const categoryEditorTitle = $('#category-editor-title');
  const categoryTitleInput = $('#category-title');
  const categoryDescriptionInput = $('#category-description');
  const categoryOrderInput = $('#category-order');
  const categoryIconInput = $('#category-icon');
  const categorySaveBtn = $('#category-save-btn');
  const categoryDeleteBtn = $('#category-delete-btn');
  const workspaceMetaTitleInput = $('#workspace-meta-title');
  const workspaceMetaVersionInput = $('#workspace-meta-version');
  const workspaceMetaDescriptionInput = $('#workspace-meta-description');
  const workspaceMetaSaveBtn = $('#workspace-meta-save-btn');
  if (RELEASE_MODE) document.documentElement.setAttribute('data-app-mode', 'release');
  const editorDeleteBtn = $('#editor-delete-btn');
  const editorToolbar = document.querySelector('.editor-toolbar');

  let currentView = 'welcome';
  let currentSection = null;
  let currentDocInfo = null;
  let searchHighlightIdx = -1;
  let searchResultItems = [];
  let searchDebounce = null;
  let findHighlights = [];
  let findCurrentIdx = -1;
  let scrollSpyCleanup = null;
  let overlayEl = null;
  let workspaceSearchResults = [];
  let currentEditingDocId = null;
  let currentEditingSourceType = 'authored';
  let currentEditingCategoryId = null;

  const initialWorkspaceState = loadWorkspaceState();
  let workspaceState = initialWorkspaceState;
  let workspaceCategories = [];
  let workspaceDocs = [];
  let APP_DOCS_DATA = [];

  function slugify(value, fallback) {
    const out = String(value || fallback || 'doc')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return out || fallback || 'doc';
  }

  function defaultCategory() {
    return {
      id: `category-${Date.now()}`,
      title: 'General',
      description: 'General documentation.',
      icon: 'book',
      order: (workspaceCategories.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function defaultWorkspace() {
    return {
      title: DEFAULT_WORKSPACE_TITLE,
      version: DEFAULT_WORKSPACE_VERSION,
      description: DEFAULT_WORKSPACE_DESCRIPTION,
      categories: [],
      docs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function normalizeCategory(category, index) {
    const base = category && typeof category === 'object' ? category : {};
    const title = typeof base.title === 'string' && base.title.trim() ? base.title.trim() : `Category ${index + 1}`;
    return {
      id: typeof base.id === 'string' && base.id ? base.id : `category-${slugify(title, String(index))}-${Date.now()}`,
      title,
      description: typeof base.description === 'string' ? base.description : '',
      icon: typeof base.icon === 'string' && base.icon ? base.icon : 'book',
      order: Number.isFinite(Number(base.order)) ? Math.max(1, Number(base.order)) : index + 1,
      createdAt: base.createdAt || new Date().toISOString(),
      updatedAt: base.updatedAt || new Date().toISOString(),
    };
  }

  function sortCategories(categories) {
    return (Array.isArray(categories) ? categories.slice() : []).sort((a, b) => {
      const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
      if (orderDiff) return orderDiff;
      return String(a.title || '').localeCompare(String(b.title || ''));
    });
  }

  function defaultWorkspaceDoc(categoryId) {
    const sameCategoryDocs = workspaceDocs.filter(doc => doc.categoryId === categoryId);
    return {
      id: `workspace-doc-${Date.now()}`,
      categoryId: categoryId || '',
      title: 'Untitled Workspace Doc',
      summary: '',
      order: (sameCategoryDocs.length ? Math.max(...sameCategoryDocs.map(doc => Number(doc.order) || 0)) : 0) + 1,
      showInIndex: true,
      tags: [],
      sourceType: 'authored',
      sourceFormat: 'markdown',
      sourceText: '',
      iconOverride: '',
      numberHeadings: false,
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function normalizeWorkspaceDoc(doc, index, categoryIds) {
    const base = doc && typeof doc === 'object' ? doc : {};
    const validCategoryIds = Array.isArray(categoryIds) ? categoryIds : [];
    const title = typeof base.title === 'string' && base.title.trim() ? base.title.trim() : `Workspace Doc ${index + 1}`;
    const sourceText = typeof base.sourceText === 'string' ? base.sourceText : blocksToEditableText(Array.isArray(base.blocks) ? base.blocks : []);
    const sourceFormat = typeof base.sourceFormat === 'string' ? base.sourceFormat : 'markdown';
    const parsed = parseInputToBlocks(sourceText, sourceFormat);
    const categoryId = typeof base.categoryId === 'string' && validCategoryIds.includes(base.categoryId)
      ? base.categoryId
      : (validCategoryIds[0] || '');
    return {
      id: typeof base.id === 'string' && base.id ? base.id : `workspace-${slugify(title, String(index))}-${Date.now()}`,
      categoryId,
      title,
      summary: typeof base.summary === 'string' ? base.summary : '',
      order: Number.isFinite(Number(base.order)) ? Math.max(1, Number(base.order)) : index + 1,
      showInIndex: base.showInIndex !== false,
      tags: Array.isArray(base.tags) ? base.tags.map(tag => String(tag).trim()).filter(Boolean) : [],
      sourceType: base.sourceType === 'imported' ? 'imported' : 'authored',
      sourceFormat,
      sourceText,
      iconOverride: typeof base.iconOverride === 'string' ? base.iconOverride : '',
      numberHeadings: Boolean(base.numberHeadings),
      blocks: parsed.blocks,
      createdAt: base.createdAt || new Date().toISOString(),
      updatedAt: base.updatedAt || new Date().toISOString(),
    };
  }

  function sortWorkspaceDocs(docs) {
    return (Array.isArray(docs) ? docs.slice() : []).sort((a, b) => {
      const categoryDiff = String(a.categoryId || '').localeCompare(String(b.categoryId || ''));
      if (categoryDiff) return categoryDiff;
      const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
      if (orderDiff) return orderDiff;
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });
  }

  function shouldReplacePlaceholderWorkspace(base) {
    const rawCategories = Array.isArray(base && base.categories) ? base.categories : [];
    const rawDocs = Array.isArray(base && base.docs) ? base.docs : [];
    if (!rawCategories.length && !rawDocs.length) return true;
    const categoryTitles = rawCategories.map(category => String(category && category.title || '').trim()).filter(Boolean);
    const docTitles = rawDocs.map(doc => String(doc && doc.title || '').trim()).filter(Boolean);
    const looksLikeDummyCategories = !categoryTitles.length || categoryTitles.every(title => title === 'General' || /^Category \d+$/.test(title));
    const looksLikeDummyDocs = !docTitles.length || docTitles.every(title => (
      title === 'Untitled Workspace Doc' ||
      /^Workspace Doc \d+$/.test(title) ||
      /^Imported document$/i.test(title)
    ));
    return looksLikeDummyCategories && looksLikeDummyDocs;
  }

  function normalizeWorkspaceState(rawWorkspace) {
    const base = rawWorkspace && typeof rawWorkspace === 'object' ? rawWorkspace : {};
    let categories = sortCategories((Array.isArray(base.categories) ? base.categories : []).map(normalizeCategory));
    const rawDocs = Array.isArray(base.docs) ? base.docs : [];

    if (!categories.length && rawDocs.length) {
      categories = [normalizeCategory(defaultCategory(), 0)];
    }

    const categoryIds = categories.map(category => category.id);
    const docs = sortWorkspaceDocs(rawDocs.map((doc, index) => normalizeWorkspaceDoc(doc, index, categoryIds)));

    return {
      title: typeof base.title === 'string' && base.title.trim() ? base.title.trim() : DEFAULT_WORKSPACE_TITLE,
      version: typeof base.version === 'string' && base.version.trim() ? base.version.trim() : DEFAULT_WORKSPACE_VERSION,
      description: typeof base.description === 'string' ? base.description : DEFAULT_WORKSPACE_DESCRIPTION,
      categories,
      docs,
      createdAt: base.createdAt || new Date().toISOString(),
      updatedAt: base.updatedAt || new Date().toISOString(),
    };
  }

  function guessSourceFormat(path) {
    const value = String(path || '').toLowerCase();
    if (value.endsWith('.html') || value.endsWith('.htm') || value.endsWith('.xhtml')) return 'html';
    if (value.endsWith('.json')) return 'json';
    if (value.endsWith('.txt')) return 'text';
    return 'markdown';
  }

  async function loadBuiltInWorkspace() {
    try {
      const embeddedWorkspace = window.__DOC_WORKSPACE_CONTENT__;
      if (embeddedWorkspace && typeof embeddedWorkspace === 'object') {
        return normalizeWorkspaceState(embeddedWorkspace);
      }
      const response = await fetch(BUILTIN_WORKSPACE_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to load workspace manifest: ${response.status}`);
      const manifest = await response.json();
      const rawDocs = Array.isArray(manifest && manifest.docs) ? manifest.docs : [];
      const docs = await Promise.all(rawDocs.map(async (doc) => {
        const base = doc && typeof doc === 'object' ? doc : {};
        const sourcePath = typeof base.sourcePath === 'string' ? base.sourcePath : '';
        let sourceText = typeof base.sourceText === 'string' ? base.sourceText : '';
        if (!sourceText && sourcePath) {
          const docResponse = await fetch(sourcePath, { cache: 'no-store' });
          if (!docResponse.ok) throw new Error(`Failed to load document source: ${sourcePath}`);
          sourceText = await docResponse.text();
        }
        return {
          ...base,
          sourcePath,
          sourceText,
          sourceType: base.sourceType === 'imported' ? 'imported' : 'authored',
          sourceFormat: typeof base.sourceFormat === 'string' && base.sourceFormat ? base.sourceFormat : guessSourceFormat(sourcePath),
        };
      }));
      return normalizeWorkspaceState({
        ...manifest,
        docs,
      });
    } catch (error) {
      console.warn('Unable to load built-in workspace content.', error);
      return null;
    }
  }

  async function hydrateBuiltInWorkspace() {
    if (!shouldReplacePlaceholderWorkspace(workspaceState)) return;
    const builtInWorkspace = await loadBuiltInWorkspace();
    if (!builtInWorkspace) return;
    workspaceState = builtInWorkspace;
    syncWorkspaceState();
    renderDocCategoryOptions();
    renderSidebar();
    renderWelcome();
    renderWorkspaceList();
    renderPins();
    updateEditorPreview();
  }

  function loadWorkspaceState() {
    try {
      const raw = JSON.parse(localStorage.getItem(WORKSPACE_STATE_KEY));
      if (raw && raw.workspace) return normalizeWorkspaceState(raw.workspace);
      if (raw && Array.isArray(raw.workspaces) && raw.workspaces.length) {
        const preferredId = typeof raw.activeWorkspaceId === 'string' ? raw.activeWorkspaceId : raw.workspaces[0].id;
        const selected = raw.workspaces.find(item => item && item.id === preferredId) || raw.workspaces[0];
        return normalizeWorkspaceState(selected);
      }
      if (raw && (Array.isArray(raw.docs) || Array.isArray(raw.categories))) return normalizeWorkspaceState(raw);
    } catch {}

    try {
      const legacyDocs = JSON.parse(localStorage.getItem(WORKSPACE_DOCS_KEY)) || [];
      if (Array.isArray(legacyDocs) && legacyDocs.length) {
        return normalizeWorkspaceState({
          title: DEFAULT_WORKSPACE_TITLE,
          version: DEFAULT_WORKSPACE_VERSION,
          description: DEFAULT_WORKSPACE_DESCRIPTION,
          docs: legacyDocs,
        });
      }
    } catch {}

    return normalizeWorkspaceState(defaultWorkspace());
  }

  function saveWorkspaceState() {
    localStorage.setItem(WORKSPACE_STATE_KEY, JSON.stringify({ workspace: workspaceState }));
  }

  function getCategoryById(id) {
    return workspaceCategories.find(category => category.id === id) || null;
  }

  function getDocsForCategory(categoryId) {
    return sortWorkspaceDocs(workspaceDocs.filter(doc => doc.categoryId === categoryId));
  }

  function syncWorkspaceState(options) {
    const opts = options || {};
    workspaceState = normalizeWorkspaceState(workspaceState);
    workspaceCategories = sortCategories(workspaceState.categories || []);
    workspaceDocs = sortWorkspaceDocs(workspaceState.docs || []);
    workspaceState.categories = workspaceCategories.slice();
    workspaceState.docs = workspaceDocs.slice();
    rebuildAppDocsData();
    if (opts.persist !== false) saveWorkspaceState();
  }

  function updateWorkspaceMeta(patch) {
    workspaceState.title = typeof patch.title === 'string' && patch.title.trim() ? patch.title.trim() : workspaceState.title;
    workspaceState.version = typeof patch.version === 'string' && patch.version.trim() ? patch.version.trim() : (workspaceState.version || DEFAULT_WORKSPACE_VERSION);
    workspaceState.description = typeof patch.description === 'string' ? patch.description : workspaceState.description;
    workspaceState.updatedAt = new Date().toISOString();
    syncWorkspaceState();
    renderSidebar();
    renderWelcome();
    renderWorkspaceList();
  }

  function rebuildAppDocsData() {
    APP_DOCS_DATA = workspaceCategories.map(category => ({
      id: category.id,
      title: category.title,
      icon: category.icon,
      description: category.description,
      items: getDocsForCategory(category.id)
        .filter(doc => doc.showInIndex !== false)
        .map(doc => ({
          id: `workspace-item:${doc.id}`,
          title: doc.title,
          href: `workspace/${doc.id}`,
          formats: ['local'],
          tags: doc.tags,
          path: `workspace/${doc.id}`,
          url: null,
          isWorkspaceDoc: true,
          workspaceDocId: doc.id,
          summary: doc.summary,
          sourceType: doc.sourceType,
          icon: category.icon,
        })),
    }));
  }

  function getWorkspaceDocById(id) {
    return workspaceDocs.find(doc => doc.id === id) || null;
  }

  function persistWorkspaceCollections() {
    workspaceState.categories = sortCategories(workspaceCategories);
    workspaceState.docs = sortWorkspaceDocs(workspaceDocs);
    workspaceState.updatedAt = new Date().toISOString();
    syncWorkspaceState();
  }

  function upsertCategory(category) {
    const normalized = normalizeCategory(category, workspaceCategories.length);
    const idx = workspaceCategories.findIndex(existing => existing.id === normalized.id);
    if (idx >= 0) workspaceCategories[idx] = normalized;
    else workspaceCategories.push(normalized);
    persistWorkspaceCollections();
    renderSidebar();
    renderWelcome();
    renderWorkspaceList();
    return normalized;
  }

  function deleteCategory(categoryId) {
    if (workspaceDocs.some(doc => doc.categoryId === categoryId)) return false;
    workspaceCategories = workspaceCategories.filter(category => category.id !== categoryId);
    persistWorkspaceCollections();
    renderSidebar();
    renderWelcome();
    renderWorkspaceList();
    return true;
  }

  function upsertWorkspaceDoc(doc) {
    const normalized = normalizeWorkspaceDoc(doc, workspaceDocs.length, workspaceCategories.map(category => category.id));
    const idx = workspaceDocs.findIndex(existing => existing.id === normalized.id);
    if (idx >= 0) workspaceDocs[idx] = normalized;
    else workspaceDocs.push(normalized);
    persistWorkspaceCollections();
    renderSidebar();
    renderWelcome();
    renderWorkspaceList();
    return normalized;
  }

  function deleteWorkspaceDoc(id) {
    workspaceDocs = workspaceDocs.filter(doc => doc.id !== id);
    persistWorkspaceCollections();
    renderSidebar();
    renderWelcome();
    renderWorkspaceList();
  }

  function openCategoryEditor(category) {
    if (RELEASE_MODE) { showWorkspaceView(); return; }
    const existing = category || normalizeCategory(defaultCategory(), workspaceCategories.length);
    currentEditingCategoryId = category && category.id ? category.id : null;
    categoryEditorTitle.textContent = category ? 'Edit Category' : 'New Category';
    categoryTitleInput.value = existing.title || '';
    categoryDescriptionInput.value = existing.description || '';
    categoryOrderInput.value = String(existing.order || (workspaceCategories.length + 1));
    categoryIconInput.value = existing.icon || 'book';
    categoryDeleteBtn.classList.toggle('hidden', !category);
    showView('category-editor');
  }

  function editWorkspaceMeta() {
    if (RELEASE_MODE) { showWorkspaceView(); return; }
    workspaceMetaTitleInput.value = workspaceState.title || DEFAULT_WORKSPACE_TITLE;
    workspaceMetaVersionInput.value = workspaceState.version || DEFAULT_WORKSPACE_VERSION;
    workspaceMetaDescriptionInput.value = workspaceState.description || '';
    showView('workspace-meta-editor');
  }

  function saveWorkspaceMeta() {
    if (RELEASE_MODE) return;
    const title = workspaceMetaTitleInput.value.trim();
    if (!title) {
      alert('A documentation title is required.');
      workspaceMetaTitleInput.focus();
      return;
    }
    updateWorkspaceMeta({
      title,
      version: workspaceMetaVersionInput.value.trim() || DEFAULT_WORKSPACE_VERSION,
      description: workspaceMetaDescriptionInput.value.trim(),
    });
    showWorkspaceView();
  }

  function renderDocCategoryOptions(selectedId) {
    if (!editorDocCategory) return;
    const options = workspaceCategories.map(category => `<option value="${category.id}">${escapeHtml(category.title)}</option>`).join('');
    editorDocCategory.innerHTML = options || '<option value="">Create a category first</option>';
    if (selectedId && workspaceCategories.some(category => category.id === selectedId)) editorDocCategory.value = selectedId;
    else if (workspaceCategories[0]) editorDocCategory.value = workspaceCategories[0].id;
  }

  function saveCategory() {
    if (RELEASE_MODE) return;
    const title = categoryTitleInput.value.trim();
    if (!title) {
      alert('A category title is required.');
      categoryTitleInput.focus();
      return;
    }
    const existing = currentEditingCategoryId ? getCategoryById(currentEditingCategoryId) : null;
    const saved = upsertCategory({
      id: existing ? existing.id : `category-${slugify(title, 'category')}-${Date.now()}`,
      title,
      description: categoryDescriptionInput.value.trim(),
      icon: categoryIconInput.value || 'book',
      order: Math.max(1, parseInt(categoryOrderInput.value || '1', 10) || 1),
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    currentEditingCategoryId = saved.id;
    showWorkspaceView();
  }

  function ensureCategoryExistsBeforeDoc() {
    if (workspaceCategories.length) return true;
    alert('Create a category first. Documents belong inside a category.');
    openCategoryEditor(null);
    return false;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sanitizeLinkUrl(url) {
    const trimmed = String(url || '').trim();
    if (!trimmed) return '';
    if (/^(https?:|mailto:|#|\/)/i.test(trimmed)) return trimmed;
    return 'https://' + trimmed.replace(/^\/+/, '');
  }

  function renderInlineText(text) {
    const placeholders = [];
    let rendered = escapeHtml(text);

    rendered = rendered.replace(/`([^`]+)`/g, (_, code) => {
      const token = `__INLINE_${placeholders.length}__`;
      placeholders.push(`<code>${escapeHtml(code)}</code>`);
      return token;
    });

    rendered = rendered.replace(/\[([^\]]+)\]\(([^)\s]+(?:\s+\&quot;.*?\&quot;)?[^)]*)\)/g, (_, label, href) => {
      const cleanHref = sanitizeLinkUrl(href.replace(/\&quot;/g, '"').trim().split(/\s+"/)[0]);
      const token = `__INLINE_${placeholders.length}__`;
      placeholders.push(cleanHref
        ? `<a href="${escapeHtml(cleanHref)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`
        : escapeHtml(label));
      return token;
    });

    placeholders.forEach((html, index) => {
      rendered = rendered.replace(`__INLINE_${index}__`, html);
    });

    return rendered;
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp('(' + q + ')', 'gi'), '<mark>$1</mark>');
  }

  function shortTitle(title) {
    const sep = title.indexOf(' — ');
    if (sep > 0 && sep < 40) return title.substring(0, sep);
    const dash = title.indexOf(' - ');
    if (dash > 0 && dash < 40) return title.substring(0, dash);
    if (title.length > 32) return title.substring(0, 32) + '...';
    return title;
  }

  function iconMarkup(iconName) {
    return `<span class="doc-inline-icon">${ICONS[iconName] || ICONS['file-text']}</span>`;
  }

  function suggestDocIcon(docLike) {
    const haystack = [
      docLike && docLike.title,
      docLike && docLike.summary,
      Array.isArray(docLike && docLike.tags) ? docLike.tags.join(' ') : '',
      docLike && docLike.sourceText,
    ].filter(Boolean).join(' ').toLowerCase();

    if (/(api|function|class|code|javascript|typescript|react|component|hook)/.test(haystack)) return 'code';
    if (/(cli|terminal|command|shell|bash|zsh|script)/.test(haystack)) return 'terminal';
    if (/(server|backend|deploy|hosting|nginx|express)/.test(haystack)) return 'server';
    if (/(config|setting|option|preferences)/.test(haystack)) return 'sliders';
    if (/(architecture|system|layer|stack|flow)/.test(haystack)) return 'layers';
    if (/(ui|screen|display|frontend|window)/.test(haystack)) return 'monitor';
    if (/(performance|cpu|process|worker|thread)/.test(haystack)) return 'cpu';
    if (/(guide|manual|docs|documentation|readme|overview)/.test(haystack)) return 'book';
    if (/(link|url|resource|reference)/.test(haystack)) return 'share-2';
    if (/(about|info|faq|explain|what is)/.test(haystack)) return 'info';
    return 'file-text';
  }

  function resolveDocIcon(docLike) {
    return docLike && docLike.iconOverride ? docLike.iconOverride : suggestDocIcon(docLike || {});
  }

  function resolveLocalPath(item, format) {
    const fmt = format || item.formats[0];
    const href = item.href;
    if (/\.\w+$/.test(href)) return 'docs.xorg/' + href;
    return 'docs.xorg/' + href + (fmt === 'xhtml' ? '.xhtml' : '.' + fmt);
  }

  function resolveRemoteUrl(item, format) {
    const fmt = format || item.formats[0];
    const href = item.href;
    return '';
  }

  function renderWorkspaceBadges(doc) {
    const typeLabel = doc.sourceType === 'imported' ? 'Imported' : 'Authored';
    return `<span class="format-badge local">${typeLabel}</span>`;
  }

  function renderSectionFormatBadges(item) {
    if (item.isWorkspaceDoc) {
      const doc = getWorkspaceDocById(item.workspaceDocId);
      return doc ? renderWorkspaceBadges(doc) : '<span class="format-badge local">Local</span>';
    }
    return item.formats.map(f =>
      `<a class="format-badge ${f}" href="${resolveRemoteUrl(item, f)}" target="_blank" rel="noopener" title="Open ${f.toUpperCase()} on x.org" onclick="event.stopPropagation()">${f}</a>`
    ).join('');
  }

  function renderDocToolbarFormats(item, workspaceDoc) {
    if (item && item.isWorkspaceDoc && workspaceDoc) return renderWorkspaceBadges(workspaceDoc);
    if (!item) return '';
    return item.formats.map(f =>
      `<a class="format-badge ${f}" href="${resolveRemoteUrl(item, f)}" target="_blank" rel="noopener" title="${f.toUpperCase()} on x.org">${f}</a>`
    ).join('');
  }

  function sanitizeExportName(value, fallback) {
    const out = String(value || fallback || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return out || fallback || 'file';
  }

  function sourceExtensionForFormat(format) {
    switch (String(format || '').toLowerCase()) {
      case 'html': return 'html';
      case 'xhtml': return 'xhtml';
      case 'text': return 'txt';
      case 'json': return 'json';
      case 'markdown':
      default: return 'md';
    }
  }

  function buildExportWorkspaceBundle() {
    const files = [];
    const usedPaths = new Set();
    const docsManifest = sortWorkspaceDocs(workspaceDocs).map((doc, index) => {
      const category = getCategoryById(doc.categoryId);
      const categorySlug = sanitizeExportName(category && category.title, `category-${index + 1}`);
      const titleSlug = sanitizeExportName(doc.title, `document-${index + 1}`);
      const extension = sourceExtensionForFormat(doc.sourceFormat);
      let sourcePath = `content/docs/${categorySlug}/${titleSlug}.${extension}`;
      let collision = 2;
      while (usedPaths.has(sourcePath)) {
        sourcePath = `content/docs/${categorySlug}/${titleSlug}-${collision}.${extension}`;
        collision += 1;
      }
      usedPaths.add(sourcePath);
      files.push({ path: sourcePath, content: doc.sourceText || '' });
      return {
        id: doc.id,
        categoryId: doc.categoryId,
        title: doc.title,
        summary: doc.summary || '',
        order: Number(doc.order) || index + 1,
        showInIndex: doc.showInIndex !== false,
        tags: Array.isArray(doc.tags) ? doc.tags.slice() : [],
        sourceType: doc.sourceType === 'imported' ? 'imported' : 'authored',
        sourceFormat: doc.sourceFormat || 'markdown',
        sourcePath,
        iconOverride: doc.iconOverride || '',
        numberHeadings: Boolean(doc.numberHeadings),
      };
    });

    const workspaceManifest = {
      title: workspaceState.title || DEFAULT_WORKSPACE_TITLE,
      version: workspaceState.version || DEFAULT_WORKSPACE_VERSION,
      description: workspaceState.description || DEFAULT_WORKSPACE_DESCRIPTION,
      categories: sortCategories(workspaceCategories).map(category => ({
        id: category.id,
        title: category.title,
        description: category.description || '',
        icon: category.icon || 'book',
        order: Number(category.order) || 1,
      })),
      docs: docsManifest,
    };

    files.unshift({
      path: 'content/workspace.json',
      content: JSON.stringify(workspaceManifest, null, 2) + '\n',
    });

    return files;
  }

  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  }

  const CRC_TABLE = makeCrcTable();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function writeUint16(view, offset, value) {
    view.setUint16(offset, value & 0xffff, true);
  }

  function writeUint32(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
  }

  function createZipBlob(files) {
    const encoder = new TextEncoder();
    const entries = files.map(file => {
      const nameBytes = encoder.encode(file.path);
      const dataBytes = encoder.encode(file.content);
      return {
        name: file.path,
        nameBytes,
        dataBytes,
        crc: crc32(dataBytes),
      };
    });

    let offset = 0;
    const localParts = [];
    const centralParts = [];

    entries.forEach(entry => {
      const localHeader = new Uint8Array(30 + entry.nameBytes.length);
      const localView = new DataView(localHeader.buffer);
      writeUint32(localView, 0, 0x04034b50);
      writeUint16(localView, 4, 20);
      writeUint16(localView, 6, 0);
      writeUint16(localView, 8, 0);
      writeUint16(localView, 10, 0);
      writeUint16(localView, 12, 0);
      writeUint32(localView, 14, entry.crc);
      writeUint32(localView, 18, entry.dataBytes.length);
      writeUint32(localView, 22, entry.dataBytes.length);
      writeUint16(localView, 26, entry.nameBytes.length);
      writeUint16(localView, 28, 0);
      localHeader.set(entry.nameBytes, 30);
      localParts.push(localHeader, entry.dataBytes);

      const centralHeader = new Uint8Array(46 + entry.nameBytes.length);
      const centralView = new DataView(centralHeader.buffer);
      writeUint32(centralView, 0, 0x02014b50);
      writeUint16(centralView, 4, 20);
      writeUint16(centralView, 6, 20);
      writeUint16(centralView, 8, 0);
      writeUint16(centralView, 10, 0);
      writeUint16(centralView, 12, 0);
      writeUint16(centralView, 14, 0);
      writeUint32(centralView, 16, entry.crc);
      writeUint32(centralView, 20, entry.dataBytes.length);
      writeUint32(centralView, 24, entry.dataBytes.length);
      writeUint16(centralView, 28, entry.nameBytes.length);
      writeUint16(centralView, 30, 0);
      writeUint16(centralView, 32, 0);
      writeUint16(centralView, 34, 0);
      writeUint16(centralView, 36, 0);
      writeUint32(centralView, 38, 0);
      writeUint32(centralView, 42, offset);
      centralHeader.set(entry.nameBytes, 46);
      centralParts.push(centralHeader);

      offset += localHeader.length + entry.dataBytes.length;
    });

    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    writeUint32(endView, 0, 0x06054b50);
    writeUint16(endView, 4, 0);
    writeUint16(endView, 6, 0);
    writeUint16(endView, 8, entries.length);
    writeUint16(endView, 10, entries.length);
    writeUint32(endView, 12, centralSize);
    writeUint32(endView, 16, offset);
    writeUint16(endView, 20, 0);

    return new Blob([...localParts, ...centralParts, endRecord], { type: 'application/zip' });
  }

  function downloadWorkspaceExport() {
    if (RELEASE_MODE) return;
    const files = buildExportWorkspaceBundle();
    const zipBlob = createZipBlob(files);
    const exportName = `${sanitizeExportName(workspaceState.title, 'documentation') || 'documentation'}-${sanitizeExportName(workspaceState.version || 'export', 'export')}.zip`;
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function blocksToEditableText(blocks) {
    const out = [];
    (Array.isArray(blocks) ? blocks : []).forEach(block => {
      if (block.type === 'heading') out.push(`${'#'.repeat(block.level || 2)} ${block.text}`);
      else if (block.type === 'paragraph') out.push(block.text || '');
      else if (block.type === 'code') out.push('```\n' + (block.text || '') + '\n```');
      else if (block.type === 'list') out.push((block.items || []).map(item => `- ${item}`).join('\n'));
      else if (block.type === 'table') {
        const header = Array.isArray(block.header) ? block.header : [];
        const rows = Array.isArray(block.rows) ? block.rows : [];
        if (header.length) {
          out.push('| ' + header.join(' | ') + ' |');
          out.push('| ' + header.map(() => '---').join(' | ') + ' |');
          rows.forEach(row => out.push('| ' + row.join(' | ') + ' |'));
        }
      }
      out.push('');
    });
    return out.join('\n').trim();
  }

  function makeSearchTextFromBlocks(blocks) {
    return (Array.isArray(blocks) ? blocks : []).map(block => {
      if (block.type === 'list') return (block.items || []).join(' ');
      if (block.type === 'table') return [...(block.header || []), ...((block.rows || []).flat())].join(' ');
      return block.text || '';
    }).join('\n');
  }

  function splitMarkdownTableRow(line) {
    const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map(cell => cell.trim());
  }

  function isMarkdownTableSeparator(line) {
    return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
  }

  function isMarkdownTableRow(line) {
    const trimmed = line.trim();
    return trimmed.includes('|') && !/^```/.test(trimmed);
  }




  function parseTextBlocks(raw) {
    return raw.split(/\n\s*\n+/)
      .map(chunk => chunk.trim())
      .filter(Boolean)
      .map(text => ({ type: 'paragraph', text }));
  }

  function parseMarkdownBlocks(raw) {
    const lines = raw.replace(/\r\n?/g, '\n').split('\n');
    const blocks = [];
    let paragraph = [];
    let listItems = [];
    let codeLines = [];
    let inCode = false;

    function flushParagraph() {
      if (paragraph.length) {
        blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() });
        paragraph = [];
      }
    }

    function flushList() {
      if (listItems.length) {
        blocks.push({ type: 'list', items: listItems.slice() });
        listItems = [];
      }
    }

    function flushCode() {
      if (codeLines.length) {
        blocks.push({ type: 'code', text: codeLines.join('\n') });
        codeLines = [];
      }
    }

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';

      if (line.trim().startsWith('```')) {
        if (inCode) flushCode();
        else {
          flushParagraph();
          flushList();
        }
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        codeLines.push(line);
        continue;
      }
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2].trim() });
        continue;
      }
      if (isMarkdownTableRow(line) && isMarkdownTableSeparator(nextLine)) {
        flushParagraph();
        flushList();
        const header = splitMarkdownTableRow(line);
        const rows = [];
        i += 2;
        while (i < lines.length && isMarkdownTableRow(lines[i]) && lines[i].trim()) {
          rows.push(splitMarkdownTableRow(lines[i]));
          i += 1;
        }
        i -= 1;
        blocks.push({ type: 'table', header, rows });
        continue;
      }
      const listMatch = line.match(/^\s*(?:[-*+] |\d+\. )(.*)$/);
      if (listMatch) {
        flushParagraph();
        listItems.push(listMatch[1].trim());
        continue;
      }
      if (!line.trim()) {
        flushParagraph();
        flushList();
        continue;
      }
      flushList();
      paragraph.push(line.trim());
    }

    if (inCode) flushCode();
    flushParagraph();
    flushList();
    return blocks;
  }

  function parseHtmlBlocks(raw) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'text/html');
    const root = doc.body || doc.documentElement;
    const blocks = [];
    Array.from(root.children).forEach(node => {
      const tag = node.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        blocks.push({ type: 'heading', level: parseInt(tag[1], 10), text: node.textContent.trim() });
      } else if (tag === 'pre') {
        blocks.push({ type: 'code', text: node.textContent.replace(/^\n+|\n+$/g, '') });
      } else if (tag === 'ul' || tag === 'ol') {
        const items = Array.from(node.querySelectorAll(':scope > li')).map(li => li.textContent.trim()).filter(Boolean);
        if (items.length) blocks.push({ type: 'list', items });
      } else if (tag === 'table') {
        const headerCells = Array.from(node.querySelectorAll('thead th')).map(cell => cell.textContent.trim()).filter(Boolean);
        const bodyRows = Array.from(node.querySelectorAll('tbody tr')).map(row =>
          Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim())
        ).filter(row => row.some(Boolean));
        const fallbackRows = !headerCells.length && !bodyRows.length
          ? Array.from(node.querySelectorAll('tr')).map(row =>
              Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent.trim())
            ).filter(row => row.some(Boolean))
          : [];
        const rows = headerCells.length || bodyRows.length ? bodyRows : fallbackRows;
        const header = headerCells.length ? headerCells : (rows.shift() || []);
        if (header.length) blocks.push({ type: 'table', header, rows });
      } else if (node.textContent.trim()) {
        blocks.push({ type: 'paragraph', text: node.textContent.trim() });
      }
    });
    return blocks.length ? blocks : parseTextBlocks(root.textContent || '');
  }

  function parseInputToBlocks(raw, formatHint) {
    const text = String(raw || '').replace(/\u0000/g, '').trim();
    const hint = (formatHint || 'markdown').toLowerCase();
    if (!text) return { format: 'markdown', blocks: [] };
    if (hint === 'html' || hint === 'xhtml' || /^\s*</.test(text)) return { format: 'html', blocks: parseHtmlBlocks(text) };
    if (hint === 'txt' || hint === 'text') return { format: 'txt', blocks: parseTextBlocks(text) };
    return { format: 'markdown', blocks: parseMarkdownBlocks(text) };
  }

  function renderStructuredBlocks(blocks, options) {
    const opts = options || {};
    const counters = [0, 0, 0, 0, 0, 0];
    const html = (Array.isArray(blocks) ? blocks : []).map((block, index) => {
      if (block.type === 'heading') {
        const level = Math.min(6, Math.max(1, block.level || 2));
        let prefix = '';
        if (opts.numberHeadings) {
          counters[level - 1] += 1;
          for (let i = level; i < counters.length; i += 1) counters[i] = 0;
          prefix = counters.slice(0, level).filter(Boolean).join('.') + '. ';
        }
        return `<h${level} id="doc-heading-${index}">${prefix ? `<span class="doc-heading-index">${escapeHtml(prefix)}</span>` : ''}${renderInlineText(block.text || '')}</h${level}>`;
      }
      if (block.type === 'code') return `<pre><code>${escapeHtml(block.text || '')}</code></pre>`;
      if (block.type === 'list') return `<ul>${(block.items || []).map(item => `<li>${renderInlineText(item)}</li>`).join('')}</ul>`;
      if (block.type === 'table') {
        const header = Array.isArray(block.header) ? block.header : [];
        const rows = Array.isArray(block.rows) ? block.rows : [];
        if (!header.length) return '';
        return `<div class="doc-table-wrap"><table><thead><tr>${header.map(cell => `<th>${renderInlineText(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${renderInlineText(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      }
      return `<p>${renderInlineText(block.text || '')}</p>`;
    }).join('');
    return `<div class="doc-content-inner">${html || '<p>No content yet.</p>'}</div>`;
  }

  function buildDocSectionNav(sectionId) {
    const existing = sidebarNav.querySelector('.nav-doc-sections');
    if (existing) existing.remove();
    const headings = Array.from(docContent.querySelectorAll('h1, h2, h3, h4')).filter(h => {
      const text = h.textContent.trim();
      return text && text.length <= 60;
    });
    if (headings.length < 2) return;

    headings.forEach((h, i) => {
      if (!h.id) h.id = 'doc-heading-' + i;
    });

    const root = [];
    const stack = [];
    headings.forEach(heading => {
      const node = {
        heading,
        text: heading.textContent.trim(),
        level: parseInt(heading.tagName[1], 10),
        children: [],
      };
      while (stack.length && stack[stack.length - 1].level >= node.level) stack.pop();
      if (stack.length) stack[stack.length - 1].children.push(node);
      else root.push(node);
      stack.push(node);
    });

    const container = document.createElement('div');
    container.className = 'nav-doc-sections';
    container.innerHTML = '<div class="nav-doc-sections-title">On this page</div>';

    function setActiveHeadingState(activeId) {
      container.querySelectorAll('.nav-doc-section').forEach(btn => {
        const isActive = btn.dataset.headingId === activeId;
        btn.classList.toggle('active', isActive);
      });
      container.querySelectorAll('.nav-doc-row').forEach(row => {
        const btn = row.querySelector('.nav-doc-section');
        row.classList.toggle('active', Boolean(btn && btn.dataset.headingId === activeId));
      });
    }

    function makeHeadingButton(node) {
      const btn = document.createElement('button');
      btn.className = 'nav-doc-section depth-' + node.level;
      btn.dataset.headingId = node.heading.id;
      btn.textContent = node.text;
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        node.heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveHeadingState(node.heading.id);
      });
      return btn;
    }

    function renderNode(node, depth) {
      if (!node.children.length) {
        const leaf = makeHeadingButton(node);
        leaf.classList.add('tree-depth-' + depth);
        return leaf;
      }

      const group = document.createElement('div');
      group.className = 'nav-doc-group expanded tree-depth-' + depth + ' depth-' + node.level;
      group.dataset.groupHeadingId = node.heading.id;

      const row = document.createElement('div');
      row.className = 'nav-doc-row';

      const toggle = document.createElement('button');
      toggle.className = 'nav-doc-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Toggle subheadings');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.innerHTML = ICONS.chevron;

      const button = makeHeadingButton(node);
      button.classList.add('tree-depth-' + depth);

      function toggleGroup(event) {
        if (event) event.stopPropagation();
        const isExpanded = group.classList.toggle('expanded');
        toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      }

      toggle.addEventListener('click', toggleGroup);
      row.addEventListener('click', (event) => {
        if (event.target.closest('.nav-doc-section')) return;
        toggleGroup(event);
      });

      row.appendChild(toggle);
      row.appendChild(button);
      group.appendChild(row);

      const children = document.createElement('div');
      children.className = 'nav-doc-children';
      node.children.forEach(child => children.appendChild(renderNode(child, depth + 1)));
      group.appendChild(children);
      return group;
    }

    root.forEach(node => container.appendChild(renderNode(node, 0)));

    const activeSection = sidebarNav.querySelector('.nav-section[data-section="' + sectionId + '"]');
    if (activeSection) activeSection.after(container);
    else sidebarNav.appendChild(container);
    setupScrollSpy(headings, container);
  }

  function setupScrollSpy(headings, container) {
    if (scrollSpyCleanup) { scrollSpyCleanup(); scrollSpyCleanup = null; }
    const headingArray = Array.from(headings).filter(h => h.id);

    function onScroll() {
      const scrollTop = docContent.scrollTop;
      let activeHeading = headingArray[0] || null;
      for (let i = headingArray.length - 1; i >= 0; i -= 1) {
        if (headingArray[i].offsetTop <= scrollTop + 100) {
          activeHeading = headingArray[i];
          break;
        }
      }
      if (!activeHeading) return;

      const activeId = activeHeading.id;
      container.querySelectorAll('.nav-doc-section').forEach(btn => {
        const isActive = btn.dataset.headingId === activeId;
        btn.classList.toggle('active', isActive);
      });
      container.querySelectorAll('.nav-doc-row').forEach(row => {
        const btn = row.querySelector('.nav-doc-section');
        row.classList.toggle('active', Boolean(btn && btn.dataset.headingId === activeId));
      });
      container.querySelectorAll('.nav-doc-group').forEach(group => {
        const containsActive = group.querySelector('.nav-doc-section.active');
        if (containsActive) {
          group.classList.add('expanded');
          const toggle = group.querySelector(':scope > .nav-doc-row .nav-doc-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }
      });
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

  function rebuildTOC() {
    const inner = docContent.querySelector('.doc-content-inner');
    if (!inner) return;
    inner.querySelectorAll('.toc, .TOC, .table-of-contents').forEach(el => el.remove());
    const headings = inner.querySelectorAll('h2, h3, h4');
    if (headings.length < 2) return;
    const toc = document.createElement('nav');
    toc.className = 'doc-toc';
    toc.innerHTML = '<div class="doc-toc-title">Contents</div>';
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
    const h1 = inner.querySelector('h1');
    if (h1 && h1.nextSibling) h1.after(toc);
    else inner.prepend(toc);
  }

  function loadPins() {
    try { return JSON.parse(localStorage.getItem(PIN_KEY)) || []; }
    catch { return []; }
  }

  function savePins(pins) {
    localStorage.setItem(PIN_KEY, JSON.stringify(pins));
  }

  function isPinned(docInfo) {
    const key = docInfo.href || docInfo.path;
    return loadPins().some(pin => (pin.href || pin.path) === key);
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
    const svg = docPinBtn.querySelector('svg');
    if (svg) {
      if (pinned) {
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('stroke', 'none');
      } else {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
      }
    }
  }

  function togglePin(docInfo) {
    const pins = loadPins();
    const key = docInfo.href || docInfo.path;
    const idx = pins.findIndex(pin => (pin.href || pin.path) === key);
    if (idx >= 0) pins.splice(idx, 1);
    else pins.push({
      title: docInfo.title,
      href: docInfo.href || null,
      path: docInfo.path || null,
      url: docInfo.url || null,
      sectionId: docInfo.sectionId || null,
    });
    savePins(pins);
    renderPins();
    updatePinButton();
  }

  function removePin(key) {
    savePins(loadPins().filter(pin => (pin.href || pin.path) !== key));
    renderPins();
    updatePinButton();
  }

  function renderPins() {
    const pins = loadPins();
    if (!pins.length) {
      pinnedSection.classList.add('empty');
      pinnedList.innerHTML = '';
      return;
    }
    pinnedSection.classList.remove('empty');
    pinnedList.innerHTML = pins.map(pin => {
      const key = pin.href || pin.path;
      return `
        <div class="pinned-item" data-key="${escapeHtml(key)}" data-section="${pin.sectionId || ''}" data-href="${escapeHtml(pin.href || '')}" data-path="${escapeHtml(pin.path || '')}" data-url="${escapeHtml(pin.url || '')}">
          <span class="pinned-title" title="${escapeHtml(pin.title)}">${escapeHtml(pin.title)}</span>
          <button class="unpin-btn" data-key="${escapeHtml(key)}" title="Unpin">${ICONS.x}</button>
        </div>`;
    }).join('');
    pinnedList.querySelectorAll('.pinned-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.unpin-btn')) return;
        const sid = el.dataset.section;
        const href = el.dataset.href;
        const path = el.dataset.path;
        const url = el.dataset.url;
        if (sid && href) {
          const section = APP_DOCS_DATA.find(s => s.id === sid);
          const item = section && section.items.find(it => it.href === href);
          if (section && item) { openDoc(section, item); closeMobileSidebar(); }
          return;
        }
        if (path) { openDocByPath(path, url); closeMobileSidebar(); }
      });
    });
    pinnedList.querySelectorAll('.unpin-btn').forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removePin(btn.dataset.key);
    }));
  }

  function setActiveNavItem(sectionId, href) {
    sidebarNav.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.href === href));
    sidebarNav.querySelectorAll('.nav-section').forEach(el => el.classList.toggle('active-section', el.dataset.section === sectionId));
    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === sectionId);
      if (btn.dataset.section === sectionId) btn.classList.add('expanded');
    });
    const itemsEl = document.getElementById('nav-items-' + sectionId);
    if (itemsEl) itemsEl.classList.add('open');
  }

  function renderSidebar() {
    sidebarNav.innerHTML = APP_DOCS_DATA.map(section => `
      <div class="nav-section" data-section="${section.id}">
        <button class="nav-section-btn" data-section="${section.id}">
          ${ICONS[section.icon] || ICONS.book}
          <span>${escapeHtml(section.title)}</span>
          <span class="nav-section-count">${section.items.length}</span>
          <span class="chevron">${ICONS.chevron}</span>
        </button>
        <div class="nav-items" id="nav-items-${section.id}">
          ${section.items.map((item, idx) => `
            <button class="nav-item" data-section="${section.id}" data-idx="${idx}" data-href="${escapeHtml(item.href)}" title="${escapeHtml(item.title)}">
              ${escapeHtml(shortTitle(item.title))}
            </button>`).join('')}
        </div>
      </div>`).join('');

    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = APP_DOCS_DATA.find(s => s.id === btn.dataset.section);
        if (!section) return;
        const itemsEl = document.getElementById('nav-items-' + section.id);
        const isOpen = itemsEl.classList.contains('open');
        sidebarNav.querySelectorAll('.nav-items').forEach(el => el.classList.remove('open'));
        sidebarNav.querySelectorAll('.nav-section-btn').forEach(el => {
          el.classList.remove('expanded');
          el.classList.remove('active');
        });
        if (!isOpen) { itemsEl.classList.add('open'); btn.classList.add('expanded'); }
        btn.classList.add('active');
        showSection(section);
      });
    });

    sidebarNav.querySelectorAll('.nav-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const section = APP_DOCS_DATA.find(s => s.id === itemEl.dataset.section);
        if (!section) return;
        const item = section.items[parseInt(itemEl.dataset.idx, 10)];
        if (item) { openDoc(section, item); closeMobileSidebar(); }
      });
    });
  }

  function renderWelcome() {
    const title = workspaceState.title || DEFAULT_WORKSPACE_TITLE;
    const version = workspaceState.version || DEFAULT_WORKSPACE_VERSION;
    const description = workspaceState.description || DEFAULT_WORKSPACE_DESCRIPTION;
    if (appTitle) appTitle.textContent = title;
    if (appVersion) appVersion.textContent = version;
    if (mobileTitle) mobileTitle.textContent = title;
    if (welcomeTitle) welcomeTitle.textContent = title;
    if (welcomeSubtitle) welcomeSubtitle.innerHTML = escapeHtml(description);
    if (welcomeHint) welcomeHint.innerHTML = 'The released X.Org corpus is archived in <code>docs.xorg/</code> and stays separate from the active documentation workspace.';
    sectionCards.innerHTML = APP_DOCS_DATA.map(section => `
      <article class="section-card" data-section="${section.id}">
        <div class="section-card-icon">${ICONS[section.icon] || ICONS.book}</div>
        <h3>${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.description || 'No description yet.')}</p>
        <div class="section-card-count">${section.items.length} document${section.items.length !== 1 ? 's' : ''}</div>
      </article>`).join('');
    welcomeStats.innerHTML = `
      <div class="stat-item"><span class="stat-number">${workspaceCategories.length}</span> categories</div>
      <div class="stat-item"><span class="stat-number">${workspaceDocs.length}</span> documents</div>
      <div class="stat-item"><span class="stat-number">${workspaceDocs.filter(doc => doc.showInIndex !== false).length}</span> in published index</div>`;
    sectionCards.querySelectorAll('.section-card').forEach(card => card.addEventListener('click', () => {
      const section = APP_DOCS_DATA.find(item => item.id === card.dataset.section);
      if (section) showSection(section);
    }));
  }

  function renderWorkspaceList() {
    workspaceViewTitle.textContent = workspaceState.title || DEFAULT_WORKSPACE_TITLE;
    workspaceViewDesc.textContent = workspaceState.description || DEFAULT_WORKSPACE_DESCRIPTION;

    if (!workspaceCategories.length) {
      workspaceDocList.innerHTML = '<div class="empty-state"><p>No categories yet.</p><p style="margin-top:8px">Create a category first, then add documents inside it.</p></div>';
      return;
    }

    workspaceDocList.innerHTML = workspaceCategories.map(category => {
      const docs = getDocsForCategory(category.id);
      const docsHtml = docs.length
        ? docs.map(doc => `
          <article class="workspace-doc-card" data-doc-id="${doc.id}">
            <div class="workspace-doc-card-main">
              <div class="workspace-doc-title">
                ${iconMarkup(resolveDocIcon(doc))}
                <h3>${escapeHtml(String(doc.order || 1))}. ${escapeHtml(doc.title)}</h3>
                ${doc.summary ? `<span class="workspace-doc-inline-summary">${escapeHtml(doc.summary)}</span>` : ''}
              </div>
              <div class="workspace-doc-meta">
                <span>${doc.sourceType === 'imported' ? 'Imported' : 'Authored'}</span>
                <span>${doc.showInIndex !== false ? 'Shown in index' : 'Hidden from index'}</span>
                <span>${(doc.tags || []).slice(0, 4).map(escapeHtml).join(' • ') || 'No tags'}</span>
                <span>Updated ${new Date(doc.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div class="workspace-doc-actions">
              <button class="secondary-btn" data-action="open">Open</button>
              ${RELEASE_MODE ? '' : '<button class="secondary-btn" data-action="edit">Edit</button><button class="danger-btn" data-action="delete">Delete</button>'}
            </div>
          </article>`).join('')
        : '<div class="workspace-category-empty">No documents in this category yet.</div>';

      return `
        <section class="workspace-category-group" data-category-id="${category.id}">
          <div class="workspace-category-card">
            <div class="workspace-category-header">
              <div>
                <div class="workspace-category-title">${iconMarkup(category.icon)}<h3>${escapeHtml(category.title)}</h3></div>
                <p class="workspace-category-desc">${escapeHtml(category.description || 'No description yet.')}</p>
                <div class="workspace-category-meta">
                  <span>${docs.length} document${docs.length !== 1 ? 's' : ''}</span>
                  <span>Order ${Number(category.order) || 1}</span>
                </div>
              </div>
              <div class="workspace-category-actions">
                <button class="secondary-btn" data-action="open-category">Open</button>
                ${RELEASE_MODE ? '' : '<button class="secondary-btn" data-action="edit-category">Edit</button><button class="secondary-btn" data-action="new-doc">New Doc</button>'}
              </div>
            </div>
            <div class="workspace-category-docs">${docsHtml}</div>
          </div>
        </section>`;
    }).join('');

    workspaceDocList.querySelectorAll('.workspace-category-group').forEach(group => {
      const categoryId = group.dataset.categoryId;
      const category = getCategoryById(categoryId);
      const section = APP_DOCS_DATA.find(item => item.id === categoryId);
      group.querySelector('[data-action="open-category"]').addEventListener('click', () => {
        if (section) showSection(section);
      });
      if (!RELEASE_MODE) {
        group.querySelector('[data-action="edit-category"]').addEventListener('click', () => {
          if (category) openCategoryEditor(category);
        });
        group.querySelector('[data-action="new-doc"]').addEventListener('click', () => openEditorForDoc(defaultWorkspaceDoc(categoryId)));
      }
    });

    workspaceDocList.querySelectorAll('.workspace-doc-card').forEach(card => {
      const id = card.dataset.docId;
      card.querySelector('[data-action="open"]').addEventListener('click', () => openWorkspaceDocById(id));
      if (!RELEASE_MODE) {
        card.querySelector('[data-action="edit"]').addEventListener('click', () => openEditorForDoc(getWorkspaceDocById(id)));
        card.querySelector('[data-action="delete"]').addEventListener('click', () => {
          if (!confirm('Delete this workspace document?')) return;
          deleteWorkspaceDoc(id);
          if (currentDocInfo && currentDocInfo.workspaceDocId === id) showWorkspaceView();
        });
      }
    });
  }

  function showView(view) {
    currentView = view;
    welcomeView.classList.toggle('hidden', view !== 'welcome');
    workspaceView.classList.toggle('hidden', view !== 'workspace');
    editorView.classList.toggle('hidden', view !== 'editor');
    categoryEditorView.classList.toggle('hidden', view !== 'category-editor');
    workspaceMetaEditorView.classList.toggle('hidden', view !== 'workspace-meta-editor');
    sectionView.classList.toggle('hidden', view !== 'section');
    docView.classList.toggle('hidden', view !== 'doc');
    if (view !== 'doc') {
      $('#main-content').scrollTop = 0;
      closeFindBar();
      clearDocSectionNav();
    }
  }

  function showWorkspaceView() {
    renderWorkspaceList();
    showView('workspace');
    currentSection = null;
  }

  function showSection(section) {
    currentSection = section;
    sectionTitle.textContent = section.title;
    sectionDesc.textContent = section.description;
    sectionFilter.value = '';
    renderSectionItems(section.items, section);
    showView('section');
  }

  function renderSectionItems(items, section) {
    if (!items.length) {
      sectionItems.innerHTML = '<div class="search-empty">No matching documents.</div>';
      return;
    }
    sectionItems.innerHTML = items.map(item => `
      <div class="doc-item" data-href="${escapeHtml(item.href)}">
        <span class="doc-item-title">${iconMarkup(item.icon || 'file-text')}<span class="doc-item-title-text">${escapeHtml(item.title)}</span></span>
        <div class="doc-item-formats">${renderSectionFormatBadges(item)}</div>
      </div>`).join('');
    sectionItems.querySelectorAll('.doc-item').forEach((el, idx) => el.addEventListener('click', () => openDoc(section, items[idx])));
  }

  function openWorkspaceDocById(id) {
    const doc = getWorkspaceDocById(id);
    if (!doc) return;
    const category = getCategoryById(doc.categoryId);
    const section = APP_DOCS_DATA.find(item => item.id === doc.categoryId) || null;
    const listItem = section ? section.items.find(it => it.workspaceDocId === id) || null : null;
    showView('doc');
    currentDocInfo = {
      title: doc.title,
      href: `workspace/${doc.id}`,
      sectionId: category ? category.id : null,
      path: `workspace/${doc.id}`,
      url: null,
      workspaceDocId: doc.id,
    };
    updatePinButton();
    if (category) setActiveNavItem(category.id, `workspace/${doc.id}`);
    docBreadcrumb.innerHTML = `<span>${escapeHtml(workspaceState.title || 'Documentation')}</span><span class="bc-sep">/</span><span>${escapeHtml(category ? category.title : 'Uncategorized')}</span><span class="bc-sep">/</span><span class="bc-current">${escapeHtml(doc.title)}</span>`;
    docFormats.innerHTML = renderDocToolbarFormats(listItem, doc);
    docEditBtn.classList.toggle('hidden', RELEASE_MODE);
    docContent.innerHTML = renderStructuredBlocks(doc.blocks, { numberHeadings: doc.numberHeadings });
    docContent.scrollTop = 0;
    rebuildTOC();
    sidebarNav.classList.add('doc-open');
    if (category) buildDocSectionNav(category.id);
  }

  async function openDoc(section, item) {
    if (item.isWorkspaceDoc) {
      openWorkspaceDocById(item.workspaceDocId);
      return;
    }
    showView('doc');
    const primaryFormat = item.formats.includes('html') ? 'html' : item.formats.includes('xhtml') ? 'xhtml' : item.formats[0];
    currentDocInfo = {
      title: item.title,
      href: item.href,
      sectionId: section.id,
      path: null,
      url: resolveRemoteUrl(item, primaryFormat),
      workspaceDocId: null,
    };
    updatePinButton();
    setActiveNavItem(section.id, item.href);
    docBreadcrumb.innerHTML = `<span>${escapeHtml(section.title)}</span><span class="bc-sep">/</span><span class="bc-current">${escapeHtml(item.title)}</span>`;
    docFormats.innerHTML = renderDocToolbarFormats(item, null);
    docEditBtn.classList.add('hidden');
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
        docContent.innerHTML = `<div class="doc-loading"><p>Could not load.</p><p style="margin-top:12px"><a href="${currentDocInfo.url}" target="_blank" rel="noopener" class="back-btn" style="display:inline-flex;text-decoration:none">Open on x.org</a></p></div>`;
      }
    }
  }

  async function openDocByPath(path, originalUrl) {
    if (path.startsWith('workspace/')) {
      openWorkspaceDocById(path.replace(/^workspace\//, ''));
      return;
    }
    showView('doc');
    const title = path.split('/').pop().replace(/\.\w+$/, '');
    currentDocInfo = { title, href: null, sectionId: null, path, url: originalUrl, workspaceDocId: null };
    updatePinButton();
    docEditBtn.classList.add('hidden');
    docBreadcrumb.innerHTML = `<span>Search Result</span><span class="bc-sep">/</span><span class="bc-current">${escapeHtml(title)}</span>`;
    docFormats.innerHTML = originalUrl ? `<a class="format-badge html" href="${originalUrl}" target="_blank" rel="noopener">x.org</a>` : '';
    docContent.innerHTML = '<div class="doc-loading"><div class="spinner"></div>Loading...</div>';
    try {
      const resp = await fetch('docs.xorg/' + path);
      if (!resp.ok) throw new Error(resp.status);
      const ext = path.split('.').pop().toLowerCase();
      renderDocContent(await resp.text(), ext === 'txt' ? 'txt' : (ext === 'xhtml' ? 'xhtml' : 'html'), { href: path, formats: [ext] });
    } catch {
      docContent.innerHTML = originalUrl ? `<div class="doc-loading"><p>Could not load locally.</p><p style="margin-top:12px"><a href="${originalUrl}" target="_blank" rel="noopener" class="back-btn" style="display:inline-flex;text-decoration:none">Open on x.org</a></p></div>` : '<div class="doc-loading">Failed to load document.</div>';
    }
  }

  function renderDocContent(html, format, item) {
    if (format === 'txt') {
      docContent.innerHTML = `<div class="doc-content-inner"><pre style="white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(html)}</pre></div>`;
    } else {
      let bodyContent = html;
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) bodyContent = bodyMatch[1];
      bodyContent = bodyContent.replace(/\sstyle="[^"]*"/gi, '');
      bodyContent = bodyContent.replace(/\sstyle='[^']*'/gi, '');
      bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      bodyContent = bodyContent.replace(/\s(bgcolor|color|face|background)="[^"]*"/gi, '');
      bodyContent = bodyContent.replace(/<\/?font[^>]*>/gi, '');
      bodyContent = bodyContent.replace(/(<a\s[^>]*href=")([^"]*?)(")/gi, (match, pre, href, post) => {
        if (href.startsWith('#')) return match;
        return pre + href + post + ' target="_blank" rel="noopener"';
      });
      bodyContent = bodyContent.replace(/(<img\s[^>]*src=")([^"]*?)(")/gi, (match, pre, src, post) => {
        if (src.startsWith('http') || src.startsWith('data:')) return match;
        const docDir = resolveLocalPath(item).replace(/[^/]*$/, '');
        return pre + docDir + src + post;
      });
      docContent.innerHTML = `<div class="doc-content-inner">${bodyContent}</div>`;
    }
    docContent.scrollTop = 0;
    rebuildTOC();
    if (currentDocInfo && currentDocInfo.sectionId) {
      sidebarNav.classList.add('doc-open');
      buildDocSectionNav(currentDocInfo.sectionId);
    }
  }

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
      let idx = 0;
      let lastEnd = 0;
      const parts = [];
      while ((idx = lower.indexOf(qLower, idx)) !== -1) {
        if (idx > lastEnd) parts.push({ text: text.substring(lastEnd, idx), hl: false });
        parts.push({ text: text.substring(idx, idx + query.length), hl: true });
        lastEnd = idx + query.length;
        idx = lastEnd;
      }
      if (!parts.length) continue;
      if (lastEnd < text.length) parts.push({ text: text.substring(lastEnd), hl: false });
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (part.hl) {
          const mark = document.createElement('mark');
          mark.className = 'find-highlight';
          mark.textContent = part.text;
          frag.appendChild(mark);
          findHighlights.push(mark);
        } else frag.appendChild(document.createTextNode(part.text));
      });
      node.parentNode.replaceChild(frag, node);
    }
    docFindCount.textContent = findHighlights.length ? `${findHighlights.length} found` : 'No matches';
    if (findHighlights.length) { findCurrentIdx = 0; showFindCurrent(); }
  }

  function showFindCurrent() {
    findHighlights.forEach((mark, idx) => mark.classList.toggle('active', idx === findCurrentIdx));
    if (findHighlights[findCurrentIdx]) {
      findHighlights[findCurrentIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      docFindCount.textContent = `${findCurrentIdx + 1} / ${findHighlights.length}`;
    }
  }
  function findNext() { if (!findHighlights.length) return; findCurrentIdx = (findCurrentIdx + 1) % findHighlights.length; showFindCurrent(); }
  function findPrev() { if (!findHighlights.length) return; findCurrentIdx = (findCurrentIdx - 1 + findHighlights.length) % findHighlights.length; showFindCurrent(); }

  function initSearchWorker() {
    searchStatus.textContent = 'Workspace search across your authored and imported docs';
  }

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
    return `<div class="search-empty"><div class="empty-icon">${ICONS.book}</div><p>Search your workspace docs</p><p style="font-size:0.75rem;margin-top:4px;color:var(--text-tertiary)">Titles, tags, and the content of docs you create or import here</p></div>`;
  }

  function searchWorkspaceDocs(query) {
    const q = query.toLowerCase();
    return workspaceDocs.map(doc => {
      const text = makeSearchTextFromBlocks(doc.blocks);
      const lower = text.toLowerCase();
      const titleLower = doc.title.toLowerCase();
      let score = 0;
      if (titleLower.includes(q)) score += 50;
      if (doc.tags.some(tag => tag.toLowerCase().includes(q))) score += 20;
      if (lower.includes(q)) score += 10;
      if (!score) return null;
      const matchPos = lower.indexOf(q);
      const snippet = matchPos >= 0
        ? (matchPos > 60 ? '...' : '') + text.substring(Math.max(0, matchPos - 60), Math.min(text.length, matchPos + q.length + 120)).replace(/\n/g, ' ') + (matchPos + q.length + 120 < text.length ? '...' : '')
        : (text.substring(0, 180).replace(/\n/g, ' ') + (text.length > 180 ? '...' : ''));
      return { path: `workspace/${doc.id}`, title: doc.title, url: '', snippet, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12);
  }

  function renderCombinedSearch(query, quickResults, workspaceResults) {
    if (!query.trim()) return;
    if (!quickResults.length && !workspaceResults.length) {
      searchResults.innerHTML = `<div class="search-empty"><div class="empty-icon">${ICONS.info}</div><p>No results for "${escapeHtml(query)}"</p></div>`;
      searchResultItems = [];
      return;
    }
    let html = '';
    if (quickResults.length) {
      html += '<div class="search-result-group"><div class="search-result-group-title">Title matches</div>';
      html += quickResults.slice(0, 12).map(r => `
        <div class="search-result-item" data-section="${r.section.id}" data-href="${escapeHtml(r.item.href)}">
          <div class="result-row"><span class="result-icon">${ICONS.doc}</span><span class="result-title">${highlightMatch(r.item.title, query)}</span></div>
        </div>`).join('');
      html += '</div>';
    }
    if (workspaceResults.length) {
      html += '<div class="search-result-group"><div class="search-result-group-title">Workspace text matches</div>';
      html += workspaceResults.map(r => `
        <div class="search-result-item" data-path="${escapeHtml(r.path)}">
          <div class="result-row"><span class="result-icon">${ICONS.doc}</span><span class="result-title">${highlightMatch(r.title, query)}</span></div>
          ${r.snippet ? `<div class="result-snippet">${highlightMatch(r.snippet, query)}</div>` : ''}
        </div>`).join('');
      html += '</div>';
    }
    searchResults.innerHTML = html;
    bindSearchResultClicks();
    return;
  }

  function performSearch(query) {
    const q = query.trim();
    if (!q) { searchResults.innerHTML = renderSearchHints(); searchResultItems = []; searchHighlightIdx = -1; return; }
    workspaceSearchResults = searchWorkspaceDocs(q);
    const quickResults = [];
    const qLower = q.toLowerCase();
    APP_DOCS_DATA.forEach(section => section.items.forEach(item => {
      if (item.title.toLowerCase().includes(qLower) || item.tags.some(tag => tag.toLowerCase().includes(qLower))) quickResults.push({ section, item });
    }));
    renderCombinedSearch(q, quickResults, workspaceSearchResults);
  }

  function bindSearchResultClicks() {
    searchResultItems = searchResults.querySelectorAll('.search-result-item');
    searchHighlightIdx = -1;
    searchResultItems.forEach(el => el.addEventListener('click', () => {
      const { section: sid, href, path, url } = el.dataset;
      if (sid && href) {
        const section = APP_DOCS_DATA.find(s => s.id === sid);
        const item = section && section.items.find(it => it.href === href);
        if (section && item) { closeSearch(); openDoc(section, item); closeMobileSidebar(); }
        return;
      }
      if (path) { closeSearch(); closeMobileSidebar(); openDocByPath(path, url || ''); }
    }));
  }

  function insertEditorSnippet(kind) {
    const textarea = editorDocSource;
    const value = textarea.value;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const linePrefix = value.slice(lineStart, start);
    const hasTextBeforeCursor = /\S/.test(linePrefix);
    const wasAtEnd = start === end && end === value.length;
    const leading = hasTextBeforeCursor ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const trailing = after.startsWith('\n\n') ? '' : (after.startsWith('\n') ? '\n' : '\n\n');

    let insertText = '';
    let selectionStartOffset = 0;
    let selectionEndOffset = 0;

    if (kind === 'heading' || kind === 'subheading') {
      const marker = kind === 'subheading' ? '## ' : '# ';
      const label = selected || (kind === 'subheading' ? 'Subheading' : 'Heading');
      insertText = marker + label;
      selectionStartOffset = marker.length;
      selectionEndOffset = marker.length + label.length;
    } else if (kind === 'list') {
      const lines = selected
        ? selected.split(/\r?\n/).filter(Boolean).map(line => '- ' + line.replace(/^[-*+]\s+/, ''))
        : ['- List item', '- Another item'];
      insertText = lines.join('\n');
      selectionStartOffset = 2;
      selectionEndOffset = 11;
    } else if (kind === 'code') {
      const body = selected || 'code block';
      insertText = '```\n' + body + '\n```';
      selectionStartOffset = 4;
      selectionEndOffset = 4 + body.length;
    } else if (kind === 'table') {
      if (selected.includes('\t')) {
        const rows = selected.split(/\r?\n/).filter(Boolean).map(line => line.split('\t').map(cell => cell.trim()));
        if (rows.length) {
          const header = rows.shift();
          insertText = '| ' + header.join(' | ') + ' |\n';
          insertText += '| ' + header.map(() => '---').join(' | ') + ' |\n';
          insertText += rows.map(row => '| ' + row.join(' | ') + ' |').join('\n');
        }
      }
      if (!insertText) insertText = '| Column | Value |\n| --- | --- |\n| Example | Text |\n| Another | More text |';
      selectionStartOffset = 2;
      const firstCellEnd = insertText.indexOf(' |');
      selectionEndOffset = firstCellEnd > 2 ? firstCellEnd : 2;
    } else if (kind === 'link') {
      const label = selected || 'Link text';
      insertText = '[' + label + '](https://example.com)';
      selectionStartOffset = 1;
      selectionEndOffset = 1 + label.length;
    } else {
      return;
    }

    const finalText = leading + insertText + trailing;
    textarea.setRangeText(finalText, start, end, 'start');
    const insertionStart = start + leading.length;
    textarea.selectionStart = insertionStart + selectionStartOffset;
    textarea.selectionEnd = insertionStart + selectionEndOffset;
    textarea.focus();
    if (wasAtEnd) {
      textarea.scrollTop = textarea.scrollHeight;
    }
    updateEditorPreview();
  }

  function openEditorForDoc(doc) {
    if (RELEASE_MODE) { showWorkspaceView(); return; }
    if (!ensureCategoryExistsBeforeDoc()) return;
    const existing = doc || defaultWorkspaceDoc(workspaceCategories[0] ? workspaceCategories[0].id : '');
    currentEditingDocId = doc && doc.id ? doc.id : null;
    currentEditingSourceType = existing.sourceType || 'authored';
    editorTitle.textContent = doc ? 'Edit Workspace Doc' : 'New Workspace Doc';
    editorDocTitle.value = existing.title || '';
    editorDocSummary.value = existing.summary || '';
    renderDocCategoryOptions(existing.categoryId);
    editorDocOrder.value = String(existing.order || 1);
    editorDocShowInIndex.checked = existing.showInIndex !== false;
    editorDocTags.value = (existing.tags || []).join(', ');
    editorDocIcon.value = existing.iconOverride || '';
    editorNumberHeadings.checked = Boolean(existing.numberHeadings);
    editorDocSource.value = existing.sourceText || blocksToEditableText(existing.blocks || []);
    editorDeleteBtn.classList.toggle('hidden', !doc);
    updateEditorPreview();
    showView('editor');
  }

  function updateEditorPreview() {
    const parsed = parseInputToBlocks(editorDocSource.value, 'markdown');
    editorPreview.innerHTML = renderStructuredBlocks(parsed.blocks, { numberHeadings: editorNumberHeadings.checked });
    if (editorDocIconHint) {
      const suggestedIcon = suggestDocIcon({
        title: editorDocTitle.value,
        summary: editorDocSummary.value,
        tags: editorDocTags.value.split(',').map(tag => tag.trim()).filter(Boolean),
        sourceText: editorDocSource.value,
      });
      editorDocIconHint.textContent = editorDocIcon.value ? `Using ${editorDocIcon.value}` : `Auto suggests ${suggestedIcon}`;
    }
  }

  function saveEditorDoc() {
    if (RELEASE_MODE) return;
    const title = editorDocTitle.value.trim();
    if (!title) {
      alert('A title is required.');
      editorDocTitle.focus();
      return;
    }
    if (!editorDocCategory.value) {
      alert('Choose a category for this document.');
      editorDocCategory.focus();
      return;
    }
    const orderValue = Math.max(1, parseInt(editorDocOrder.value || '1', 10) || 1);
    const parsed = parseInputToBlocks(editorDocSource.value, 'markdown');
    const existing = currentEditingDocId ? getWorkspaceDocById(currentEditingDocId) : null;
    const saved = upsertWorkspaceDoc({
      id: existing ? existing.id : `workspace-${slugify(title, 'doc')}-${Date.now()}`,
      categoryId: editorDocCategory.value,
      title,
      summary: editorDocSummary.value.trim(),
      order: orderValue,
      showInIndex: editorDocShowInIndex.checked,
      tags: editorDocTags.value.split(',').map(tag => tag.trim()).filter(Boolean),
      sourceType: existing ? existing.sourceType : currentEditingSourceType,
      sourceFormat: 'markdown',
      sourceText: editorDocSource.value,
      iconOverride: editorDocIcon.value,
      numberHeadings: editorNumberHeadings.checked,
      blocks: parsed.blocks,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    currentEditingDocId = saved.id;
    openWorkspaceDocById(saved.id);
  }

  function importFile(file) {
    if (RELEASE_MODE) return;
    if (!ensureCategoryExistsBeforeDoc()) return;
    const reader = new FileReader();
    reader.onload = () => {
      const name = file.name || 'Imported document';
      const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : 'txt';
      const format = ['html', 'htm', 'xhtml'].includes(ext) ? 'html' : (['txt', 'text'].includes(ext) ? 'txt' : 'markdown');
      const sourceText = String(reader.result || '');
      const parsed = parseInputToBlocks(sourceText, format);
      openEditorForDoc({
        id: '',
        categoryId: workspaceCategories[0] ? workspaceCategories[0].id : '',
        title: name.replace(/\.[^.]+$/, ''),
        summary: `Imported from ${name}`,
        order: (workspaceDocs.length ? Math.max(...workspaceDocs.map(doc => Number(doc.order) || 0)) : 0) + 1,
        showInIndex: true,
        tags: [ext],
        sourceType: 'imported',
        sourceFormat: format,
        sourceText,
        iconOverride: '',
        numberHeadings: false,
        blocks: parsed.blocks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      currentEditingDocId = null;
      currentEditingSourceType = 'imported';
    };
    reader.readAsText(file);
  }

  function getTheme() { return localStorage.getItem('xorg-docs-theme') || 'dark'; }
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('xorg-docs-theme', theme);
    $('#theme-icon-dark').classList.toggle('hidden', theme === 'light');
    $('#theme-icon-light').classList.toggle('hidden', theme === 'dark');
  }

  function openMobileSidebar() {
    sidebar.classList.add('open');
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.className = 'sidebar-overlay';
      document.body.appendChild(overlayEl);
      overlayEl.addEventListener('click', closeMobileSidebar);
    }
    overlayEl.classList.add('open');
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    if (overlayEl) overlayEl.classList.remove('open');
  }

  function handleEditorListKeydown(event) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    const textarea = editorDocSource;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    if (start !== end) return;

    const value = textarea.value;
    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const lineEndIdx = value.indexOf('\n', start);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const line = value.slice(lineStart, lineEnd);
    const match = line.match(/^(\s*)([-*+] |\d+\. )(.*)$/);
    if (!match) return;

    event.preventDefault();
    const indent = match[1] || '';
    const markerText = match[2] || '- ';
    const content = match[3] || '';

    if (!content.trim()) {
      const removeEnd = lineEndIdx === -1 ? value.length : lineEndIdx + 1;
      textarea.setRangeText('', lineStart, removeEnd, 'start');
      textarea.selectionStart = lineStart;
      textarea.selectionEnd = lineStart;
      updateEditorPreview();
      return;
    }

    const insertText = '\n' + indent + markerText;
    textarea.setRangeText(insertText, start, end, 'end');
    textarea.scrollTop = textarea.scrollHeight;
    updateEditorPreview();
  }

  sectionFilter.addEventListener('input', () => {
    if (!currentSection) return;
    const q = sectionFilter.value.toLowerCase().trim();
    if (!q) { renderSectionItems(currentSection.items, currentSection); return; }
    renderSectionItems(currentSection.items.filter(item => item.title.toLowerCase().includes(q) || item.tags.some(tag => tag.toLowerCase().includes(q))), currentSection);
  });

  docPinBtn.addEventListener('click', () => { if (currentDocInfo) togglePin(currentDocInfo); });
  docEditBtn.addEventListener('click', () => {
    if (!currentDocInfo || !currentDocInfo.workspaceDocId) return;
    const doc = getWorkspaceDocById(currentDocInfo.workspaceDocId);
    if (doc) openEditorForDoc(doc);
  });

  let findDebounce = null;
  docFindInput.addEventListener('input', () => { clearTimeout(findDebounce); findDebounce = setTimeout(() => doFind(docFindInput.value), 200); });
  docFindInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); e.shiftKey ? findPrev() : findNext(); }
    if (e.key === 'Escape') closeFindBar();
  });
  $('#doc-find-btn').addEventListener('click', openFindBar);
  $('#doc-find-next').addEventListener('click', findNext);
  $('#doc-find-prev').addEventListener('click', findPrev);
  $('#doc-find-close').addEventListener('click', closeFindBar);

  searchInput.addEventListener('input', () => { clearTimeout(searchDebounce); searchDebounce = setTimeout(() => performSearch(searchInput.value), 150); });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (searchResultItems.length) { searchHighlightIdx = Math.min(searchHighlightIdx + 1, searchResultItems.length - 1); updateSearchHighlight(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (searchResultItems.length) { searchHighlightIdx = Math.max(searchHighlightIdx - 1, 0); updateSearchHighlight(); } }
    else if (e.key === 'Enter') { e.preventDefault(); if (searchHighlightIdx >= 0 && searchResultItems[searchHighlightIdx]) searchResultItems[searchHighlightIdx].click(); }
  });

  function updateSearchHighlight() {
    searchResultItems.forEach((el, idx) => el.classList.toggle('highlighted', idx === searchHighlightIdx));
    if (searchHighlightIdx >= 0 && searchResultItems[searchHighlightIdx]) searchResultItems[searchHighlightIdx].scrollIntoView({ block: 'nearest' });
  }

  $('#search-trigger').addEventListener('click', openSearch);
  $('#mobile-search-btn') && $('#mobile-search-btn').addEventListener('click', openSearch);
  searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  $('#theme-toggle').addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
  $('#mobile-menu-btn') && $('#mobile-menu-btn').addEventListener('click', openMobileSidebar);

  $('#workspace-open-btn').addEventListener('click', showWorkspaceView);
  $('#workspace-add-btn').addEventListener('click', () => { if (!RELEASE_MODE) openCategoryEditor(null); });
  $('#workspace-import-btn').addEventListener('click', () => {
    if (RELEASE_MODE) return;
    if (!ensureCategoryExistsBeforeDoc()) return;
    workspaceImportInput.click();
  });
  $('#workspace-header-new-btn').addEventListener('click', () => { if (!RELEASE_MODE) openEditorForDoc(null); });
  $('#workspace-header-import-btn').addEventListener('click', () => {
    if (RELEASE_MODE) return;
    if (!ensureCategoryExistsBeforeDoc()) return;
    workspaceImportInput.click();
  });
  workspaceHeaderCategoryBtn.addEventListener('click', () => { if (!RELEASE_MODE) openCategoryEditor(null); });
  workspaceExportBtn.addEventListener('click', () => { if (!RELEASE_MODE) downloadWorkspaceExport(); });
  workspaceEditBtn.addEventListener('click', () => { if (!RELEASE_MODE) editWorkspaceMeta(); });
  $('#workspace-back-btn').addEventListener('click', () => showView('welcome'));
  $('#editor-back-btn').addEventListener('click', () => showWorkspaceView());
  $('#category-editor-back-btn').addEventListener('click', () => showWorkspaceView());
  $('#workspace-meta-back-btn').addEventListener('click', () => showWorkspaceView());
  $('#editor-save-btn').addEventListener('click', saveEditorDoc);
  categorySaveBtn.addEventListener('click', () => { if (!RELEASE_MODE) saveCategory(); });
  workspaceMetaSaveBtn.addEventListener('click', () => { if (!RELEASE_MODE) saveWorkspaceMeta(); });
  editorDeleteBtn.addEventListener('click', () => {
    if (RELEASE_MODE) return;
    if (!currentEditingDocId) return;
    if (!confirm('Delete this workspace document?')) return;
    deleteWorkspaceDoc(currentEditingDocId);
    currentEditingDocId = null;
    showWorkspaceView();
  });
  categoryDeleteBtn.addEventListener('click', () => {
    if (RELEASE_MODE) return;
    if (!currentEditingCategoryId) return;
    if (!confirm('Delete this category?')) return;
    if (!deleteCategory(currentEditingCategoryId)) {
      alert('Move or delete the documents in this category before deleting it.');
      return;
    }
    currentEditingCategoryId = null;
    showWorkspaceView();
  });
  workspaceImportInput.addEventListener('change', () => {
    if (RELEASE_MODE) { workspaceImportInput.value = ''; return; }
    const file = workspaceImportInput.files && workspaceImportInput.files[0];
    if (file) importFile(file);
    workspaceImportInput.value = '';
  });
  if (editorToolbar) {
    editorToolbar.querySelectorAll('[data-insert]').forEach(button => {
      button.addEventListener('click', () => insertEditorSnippet(button.dataset.insert));
    });
  }
  editorDocSource.addEventListener('input', updateEditorPreview);
  editorDocSource.addEventListener('keydown', handleEditorListKeydown);
  editorDocTitle.addEventListener('input', updateEditorPreview);
  editorDocSummary.addEventListener('input', updateEditorPreview);
  editorDocTags.addEventListener('input', updateEditorPreview);
  editorDocIcon.addEventListener('change', updateEditorPreview);
  editorNumberHeadings.addEventListener('change', updateEditorPreview);

  $('#back-btn').addEventListener('click', () => {
    const wasWorkspaceDoc = Boolean(currentDocInfo && currentDocInfo.workspaceDocId);
    currentDocInfo = null;
    sidebarNav.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    sidebarNav.querySelectorAll('.nav-section').forEach(el => el.classList.remove('active-section'));
    if (currentSection) showSection(currentSection);
    else if (wasWorkspaceDoc) showWorkspaceView();
    else showView('welcome');
  });
  $('#section-back-btn').addEventListener('click', () => {
    currentSection = null;
    showView('welcome');
    sidebarNav.querySelectorAll('.nav-section-btn').forEach(btn => btn.classList.remove('active'));
    sidebarNav.querySelectorAll('.nav-section').forEach(el => el.classList.remove('active-section'));
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchOverlay.classList.contains('hidden') ? openSearch() : closeSearch(); }
    if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'f' && currentView === 'doc') { e.preventDefault(); openFindBar(); }
  });

  syncWorkspaceState({ persist: false });
  setTheme(getTheme());
  renderDocCategoryOptions();
  renderSidebar();
  renderWelcome();
  renderWorkspaceList();
  renderPins();
  updateEditorPreview();
  showView('welcome');
  hydrateBuiltInWorkspace();
})();
