(function () {
  const isFolder =
    document.querySelector('table') &&
    document.querySelector('a[href]') &&
    location.pathname.endsWith('/');

  const isMdFile =
    location.protocol === 'file:' &&
    (location.pathname.endsWith('.md') || location.pathname.endsWith('.markdown'));

  if (isFolder) {
    const links = Array.from(document.querySelectorAll('a[href]'));
    const mdFiles = links.filter(
      (a) => a.href.endsWith('.md') || a.href.endsWith('.markdown')
    );

    if (mdFiles.length > 0) {
      const folderPath = location.href;
      const fileList = mdFiles.map((link) => ({
        name: decodeURIComponent(link.textContent),
        url: link.href,
      }));

      sessionStorage.setItem('mdFolderPath', folderPath);
      sessionStorage.setItem('mdFileList', JSON.stringify(fileList));
      sessionStorage.setItem('mdCurrentIndex', '0');
      location.href = mdFiles[0].href;
    }
    return;
  }

  if (!isMdFile) return;

  const rawContent = document.body.textContent;
  const folderPath = sessionStorage.getItem('mdFolderPath');
  const fileListStr = sessionStorage.getItem('mdFileList');
  const currentIndex = parseInt(sessionStorage.getItem('mdCurrentIndex') || '0', 10);
  const fileList = folderPath && fileListStr ? JSON.parse(fileListStr) : null;

  function getCurrentDocName() {
    if (fileList && fileList[currentIndex]) {
      return fileList[currentIndex].name;
    }
    const segs = location.pathname.split('/').filter(Boolean);
    return decodeURIComponent(segs[segs.length - 1] || 'Document');
  }

  const icons = {
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
    folder: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    sidebarCollapse:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>',
    sidebarExpand:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>',
  };

  document.body.classList.add('md-reader-active');
  document.documentElement.style.height = '100%';
  document.body.innerHTML = '';
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  const app = el('div', 'md-app');
  const header = el('header', 'md-header');
  const menuWrap = el('div', 'md-header-menu-wrap');
  const menuBtn = el('button', 'md-icon-btn');
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-label', 'Menu');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.innerHTML = icons.menu;

  const dropdown = el('div', 'md-dropdown');
  dropdown.setAttribute('role', 'menu');
  const actions = [
    { id: 'raw', label: 'Toggle raw' },
    { id: 'fs', label: 'Toggle fullscreen' },
    { id: 'print', label: 'Print' },
    { id: 'sidebar', label: 'Toggle sidebar' },
    { divider: true },
    { id: 'about', label: 'About' },
  ];
  actions.forEach((a) => {
    if (a.divider) {
      dropdown.appendChild(el('hr'));
      return;
    }
    const b = el('button');
    b.type = 'button';
    b.textContent = a.label;
    b.dataset.action = a.id;
    dropdown.appendChild(b);
  });

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !dropdown.classList.contains('is-open');
    dropdown.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  menuWrap.appendChild(menuBtn);
  menuWrap.appendChild(dropdown);
  header.appendChild(menuWrap);

  const body = el('div', 'md-body');
  const rail = el('nav', 'md-rail');
  rail.setAttribute('aria-label', 'Sidebar tools');

  const btnFolder = el('button', 'md-rail-btn');
  btnFolder.type = 'button';
  btnFolder.innerHTML = icons.folder;
  btnFolder.title = 'Files in folder';
  btnFolder.disabled = !fileList;
  if (!fileList) btnFolder.title = 'Open a folder to browse files';

  const btnSearch = el('button', 'md-rail-btn');
  btnSearch.type = 'button';
  btnSearch.innerHTML = icons.search;
  btnSearch.title = 'Search headings';

  const btnOutline = el('button', 'md-rail-btn');
  btnOutline.type = 'button';
  btnOutline.innerHTML = icons.list;
  btnOutline.title = 'Table of contents';

  rail.appendChild(btnFolder);
  rail.appendChild(btnSearch);
  rail.appendChild(btnOutline);

  const railSpacer = el('div', 'md-rail-spacer');
  rail.appendChild(railSpacer);

  const btnToggleSidebar = el('button', 'md-rail-btn');
  btnToggleSidebar.type = 'button';
  btnToggleSidebar.id = 'md-btn-sidebar-toggle';
  btnToggleSidebar.title = 'Hide sidebar';
  btnToggleSidebar.setAttribute('aria-label', 'Hide sidebar');
  btnToggleSidebar.setAttribute('aria-expanded', 'true');
  btnToggleSidebar.innerHTML = icons.sidebarCollapse;

  const sidebar = el('aside', 'md-sidebar');
  sidebar.setAttribute('aria-label', 'Document outline and files');

  function setSidebarCollapsed(collapsed) {
    sidebar.classList.toggle('is-collapsed', collapsed);
    sidebar.setAttribute('aria-hidden', collapsed ? 'true' : 'false');
    if (collapsed) {
      sidebar.setAttribute('inert', '');
    } else {
      sidebar.removeAttribute('inert');
    }
    btnToggleSidebar.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btnToggleSidebar.setAttribute(
      'aria-label',
      collapsed ? 'Show sidebar' : 'Hide sidebar'
    );
    btnToggleSidebar.title = collapsed ? 'Show sidebar' : 'Hide sidebar';
    btnToggleSidebar.innerHTML = collapsed ? icons.sidebarExpand : icons.sidebarCollapse;
    btnToggleSidebar.classList.toggle('is-active', collapsed);
    try {
      sessionStorage.setItem('mdSidebarCollapsed', collapsed ? '1' : '0');
    } catch (e) {
      /* ignore */
    }
  }

  function ensureSidebarOpen() {
    if (sidebar.classList.contains('is-collapsed')) {
      setSidebarCollapsed(false);
    }
  }

  btnToggleSidebar.addEventListener('click', () => {
    setSidebarCollapsed(!sidebar.classList.contains('is-collapsed'));
  });

  rail.appendChild(btnToggleSidebar);

  const searchWrap = el('div', 'md-sidebar-search');
  const searchInput = el('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Filter headings…';
  searchInput.setAttribute('aria-label', 'Filter table of contents');
  searchWrap.appendChild(searchInput);

  const sidebarScroll = el('div', 'md-sidebar-scroll');

  const panelFiles = el('div', 'md-sidebar-panel');
  const panelToc = el('div', 'md-sidebar-panel');

  if (fileList) {
    const filesTitle = el('h3');
    filesTitle.textContent = 'Markdown files';
    panelFiles.appendChild(filesTitle);

    fileList.forEach((file, index) => {
      const item = el('div', 'md-file-item');
      item.textContent = file.name;
      if (index === currentIndex) item.classList.add('is-current');
      item.addEventListener('click', () => {
        sessionStorage.setItem('mdCurrentIndex', String(index));
        location.href = file.url;
      });
      panelFiles.appendChild(item);
    });
  }

  panelToc.id = 'md-toc-root';
  panelToc.classList.add('is-visible');

  const tocContext = el('div', 'md-toc-context');
  if (fileList) {
    const tocBackBtn = el('button', 'md-toc-back');
    tocBackBtn.type = 'button';
    tocBackBtn.textContent = '← Back to folder';
    tocBackBtn.title = 'Show file list (same as “Files in folder” in the rail)';
    tocBackBtn.setAttribute(
      'aria-label',
      'Back to folder: show markdown file list in sidebar'
    );
    tocContext.appendChild(tocBackBtn);
  }

  const tocCurrentDoc = el('div', 'md-toc-current-doc');
  const tocCurLabel = el('span', 'md-toc-current-label');
  tocCurLabel.textContent = 'Current document';
  const tocCurName = el('span', 'md-toc-current-name');
  tocCurrentDoc.appendChild(tocCurLabel);
  tocCurrentDoc.appendChild(tocCurName);
  tocContext.appendChild(tocCurrentDoc);

  const tocBody = el('div', 'md-toc-body');
  panelToc.appendChild(tocContext);
  panelToc.appendChild(tocBody);

  function updateTocContext() {
    tocCurName.textContent = getCurrentDocName();
  }

  sidebarScroll.appendChild(panelFiles);
  sidebarScroll.appendChild(panelToc);

  sidebar.appendChild(searchWrap);
  sidebar.appendChild(sidebarScroll);

  const main = el('main', 'md-main');
  const mainInner = el('div', 'md-main-inner');
  const article = el('article', null);
  article.id = 'md-content';

  mainInner.appendChild(article);
  main.appendChild(mainInner);

  body.appendChild(rail);
  body.appendChild(sidebar);
  body.appendChild(main);
  app.appendChild(header);
  app.appendChild(body);
  document.body.appendChild(app);

  const heartIcon =
    '<svg class="md-heart" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  const aboutModalRoot = el('div', 'md-modal-root');
  aboutModalRoot.setAttribute('aria-hidden', 'true');
  const aboutBackdrop = el('div', 'md-modal-backdrop');
  const aboutDialog = el('div', 'md-modal');
  aboutDialog.setAttribute('role', 'dialog');
  aboutDialog.setAttribute('aria-modal', 'true');
  aboutDialog.setAttribute('aria-labelledby', 'md-about-title');

  const aboutCloseBtn = el('button', 'md-modal-close');
  aboutCloseBtn.type = 'button';
  aboutCloseBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  aboutCloseBtn.setAttribute('aria-label', 'Close');

  const aboutTitle = el('h2', 'md-modal-title');
  aboutTitle.id = 'md-about-title';
  aboutTitle.textContent = 'Markdown Reader';

  const aboutVersion = el('p', 'md-modal-version');
  aboutVersion.textContent = 'Version 1.0';

  const aboutBody = el('div', 'md-modal-body');
  aboutBody.innerHTML =
    '<p>Markdown Reader is a browser extension that opens local <code>.md</code> files with a clean, documentation-style layout instead of plain text.</p>' +
    '<p><strong>What you can do:</strong></p>' +
    '<ul>' +
    '<li>Read and navigate markdown with a table of contents</li>' +
    '<li>Browse multiple files when you open a folder</li>' +
    '<li>Toggle raw source, fullscreen, and print-friendly view</li>' +
    '<li>Collapse the sidebar when you want more space for reading</li>' +
    '</ul>' +
    '<p class="md-modal-note">Enable <strong>Allow access to file URLs</strong> for this extension in your browser settings so local files can be read.</p>';

  const aboutAttr = el('p', 'md-modal-attribution');
  aboutAttr.innerHTML =
    'Made With ' + heartIcon + ' By Preetam Jakhmola';

  aboutDialog.appendChild(aboutCloseBtn);
  aboutDialog.appendChild(aboutTitle);
  aboutDialog.appendChild(aboutVersion);
  aboutDialog.appendChild(aboutBody);
  aboutDialog.appendChild(aboutAttr);

  aboutModalRoot.appendChild(aboutBackdrop);
  aboutModalRoot.appendChild(aboutDialog);
  app.appendChild(aboutModalRoot);

  function closeAboutModal() {
    aboutModalRoot.classList.remove('is-open');
    aboutModalRoot.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onAboutKeydown);
  }

  function onAboutKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeAboutModal();
    }
  }

  function openAboutModal() {
    aboutModalRoot.classList.add('is-open');
    aboutModalRoot.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onAboutKeydown);
    aboutCloseBtn.focus();
  }

  aboutBackdrop.addEventListener('click', closeAboutModal);
  aboutCloseBtn.addEventListener('click', closeAboutModal);
  aboutDialog.addEventListener('click', (e) => e.stopPropagation());

  let rawMode = false;

  function renderMarkdown() {
    rawMode = false;
    main.classList.remove('md-raw');
    if (typeof marked !== 'undefined' && marked.parse) {
      article.innerHTML = marked.parse(rawContent);
    } else {
      article.innerHTML =
        '<p style="color:#d73a49">Markdown parser unavailable.</p>';
    }
    buildToc();
  }

  function renderRaw() {
    rawMode = true;
    main.classList.add('md-raw');
    article.innerHTML = '';
    const pre = el('pre');
    pre.textContent = rawContent;
    article.appendChild(pre);
    updateTocContext();
    tocBody.innerHTML =
      '<p class="md-toc-empty" style="padding:8px;font-size:13px;color:#586069">Raw view — outline hidden.</p>';
  }

  function buildToc() {
    updateTocContext();
    tocBody.innerHTML = '';
    const headings = article.querySelectorAll('h1, h2, h3, h4');
    if (!headings.length) {
      const p = el('p');
      p.style.cssText = 'font-size:13px;color:#586069;padding:8px';
      p.textContent = 'No headings in this document.';
      tocBody.appendChild(p);
      return;
    }

    let section = null;
    let sectionTitle = 'On this page';

    headings.forEach((heading, index) => {
      const tag = heading.tagName.toLowerCase();
      const level = parseInt(tag[1], 10);
      const id = heading.id || `md-h-${index}`;
      heading.id = id;

      if (tag === 'h1') {
        sectionTitle = heading.textContent.trim() || 'Section';
        section = el('div', 'md-toc-section');
        const st = el('div', 'md-toc-section-title');
        st.innerHTML = heading.innerHTML.trim();
        section.appendChild(st);
        tocBody.appendChild(section);
        return;
      }

      if (!section) {
        section = el('div', 'md-toc-section');
        const st = el('div', 'md-toc-section-title');
        st.textContent = sectionTitle;
        section.appendChild(st);
        tocBody.appendChild(section);
      }

      const a = el('a', 'md-toc-link');
      a.href = '#' + id;
      a.innerHTML = heading.innerHTML.trim();
      a.dataset.level = String(level);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      });
      section.appendChild(a);
    });

    filterToc('');
  }

  function filterToc(q) {
    const lower = (q || '').trim().toLowerCase();
    tocBody.querySelectorAll('.md-toc-link').forEach((link) => {
      const t = link.textContent.toLowerCase();
      const show = !lower || t.includes(lower);
      link.classList.toggle('is-hidden', !show);
    });
    tocBody.querySelectorAll('.md-toc-section').forEach((sec) => {
      const links = sec.querySelectorAll('.md-toc-link');
      if (!links.length) {
        sec.style.display = '';
        return;
      }
      const any = sec.querySelector('.md-toc-link:not(.is-hidden)');
      sec.style.display = any ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', () => filterToc(searchInput.value));

  function showTocPanel() {
    panelToc.classList.add('is-visible');
    if (fileList) panelFiles.classList.remove('is-visible');
  }

  function showFilesPanel() {
    if (!fileList) return;
    panelFiles.classList.add('is-visible');
    panelToc.classList.remove('is-visible');
  }

  function showFilesPanelLikeRail() {
    if (!fileList) return;
    ensureSidebarOpen();
    btnFolder.classList.add('is-active');
    btnSearch.classList.remove('is-active');
    btnOutline.classList.remove('is-active');
    showFilesPanel();
    sidebarScroll.scrollTop = 0;
  }

  if (fileList) {
    const tocBackBtn = panelToc.querySelector('.md-toc-back');
    if (tocBackBtn) {
      tocBackBtn.addEventListener('click', () => {
        showFilesPanelLikeRail();
      });
    }
  }

  btnSearch.addEventListener('click', () => {
    ensureSidebarOpen();
    btnSearch.classList.add('is-active');
    btnOutline.classList.remove('is-active');
    btnFolder.classList.remove('is-active');
    showTocPanel();
    searchInput.focus();
    searchInput.select();
  });

  btnOutline.addEventListener('click', () => {
    ensureSidebarOpen();
    btnOutline.classList.add('is-active');
    btnSearch.classList.remove('is-active');
    btnFolder.classList.remove('is-active');
    showTocPanel();
    sidebarScroll.scrollTop = 0;
  });

  btnFolder.addEventListener('click', () => {
    showFilesPanelLikeRail();
  });

  btnOutline.classList.add('is-active');

  dropdown.addEventListener('click', (e) => {
    const t = e.target;
    if (t.tagName !== 'BUTTON') return;
    const id = t.dataset.action;
    if (id === 'raw') {
      if (rawMode) renderMarkdown();
      else renderRaw();
      dropdown.classList.remove('is-open');
    } else if (id === 'fs') {
      if (!document.fullscreenElement) {
        app.classList.add('is-fullscreen');
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        app.classList.remove('is-fullscreen');
        document.exitFullscreen();
      }
      dropdown.classList.remove('is-open');
    } else if (id === 'print') {
      window.print();
      dropdown.classList.remove('is-open');
    } else if (id === 'sidebar') {
      setSidebarCollapsed(!sidebar.classList.contains('is-collapsed'));
      dropdown.classList.remove('is-open');
    } else if (id === 'about') {
      dropdown.classList.remove('is-open');
      openAboutModal();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) app.classList.remove('is-fullscreen');
  });

  try {
    if (sessionStorage.getItem('mdSidebarCollapsed') === '1') {
      setSidebarCollapsed(true);
    }
  } catch (e) {
    /* ignore */
  }

  renderMarkdown();

  function el(tag, className) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    return n;
  }
})();
