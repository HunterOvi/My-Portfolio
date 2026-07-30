/* ============================================================
   PORTFOLIO SCRIPT
   Plain, beginner-friendly JavaScript (no build tools needed).
   Every piece of page text and content (nav, hero, about,
   projects, skills, education, updates, contact, footer) lives
   in data.json and is loaded and rendered here with fetch().
   ============================================================ */

var siteData = null;

/* ============================================================
   CLEAN URL: strip any "#section" fragment from the address bar
   on load (e.g. a shared link like site.com/#projects) so the
   visible URL always stays https://mehedihasanovi.site/ while
   still landing on the right section via the id below.
   Runs immediately (script is parsed at the end of <body>, before
   the browser's own load-time hash-scroll), not inside
   DOMContentLoaded, so the fragment never lingers in the URL bar.
   ============================================================ */
function removeHashFromUrl() {
  if (!window.location.hash) return;

  var targetId = window.location.hash.slice(1);
  history.replaceState(null, '', window.location.pathname + window.location.search);

  var target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ block: 'start' });
  }
}
removeHashFromUrl();

/* ============================================================
   SMALL MONOCHROME ICONS
   Used next to skills and tech badges.
   Kept as plain strings so they are easy to read and edit.
   ============================================================ */
/* All icons below share one style: 24x24 viewBox, stroke-width 1.8,
   round line caps/joins, no fill (Lucide-style outline icons). */
var SKILL_ICON_DEFAULT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>';

var SKILL_ICONS = {
  /* Java -> Coffee */
  java: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h15a4 4 0 1 1 0 8h-1"/></svg>',
  /* JavaScript -> FileCode2 */
  javascript: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m5 12-3 3 3 3"/><path d="m9 18 3-3-3-3"/></svg>',
  /* C -> Code2 */
  c: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
  /* HTML5 -> FileCode */
  html: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.5 13.5 8.5 16l2 2.5"/><path d="M13.5 13.5 15.5 16l-2 2.5"/></svg>',
  /* CSS3 -> Palette */
  css: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none"/></svg>',
  /* JSON -> Braces */
  json: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>',
  /* Node.js -> Server */
  nodejs: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/></svg>',
  /* Express.js -> Network */
  expressjs: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>',
  /* Electron -> Monitor */
  electron: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  /* MySQL -> Database */
  mysql: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>',
  /* GitHub -> Github */
  github: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 1.5 5 1.5 5 1.5c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 8.5c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.5 2-5-2-7-2"/></svg>',
  /* VS Code -> Code2 */
  vscode: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
  /* Vercel -> Triangle */
  vercel: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.73 4a2 2 0 0 0-3.46 0L2.11 18a2 2 0 0 0 1.73 3h16.32a2 2 0 0 0 1.73-3Z"/></svg>',
  /* Arduino -> Cpu */
  arduino: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>'
};

var SKILL_ICON_ALIASES = {
  html5: 'html', css3: 'css', javascript: 'javascript', java: 'java',
  c: 'c', json: 'json', mysql: 'mysql',
  github: 'github', vscode: 'vscode', vercel: 'vercel', arduino: 'arduino',
  nodejs: 'nodejs', expressjs: 'expressjs', electron: 'electron'
};

function skillIconKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9+]/g, '');
}

function skillIcon(name) {
  var key = SKILL_ICON_ALIASES[skillIconKey(name)];
  if (key && SKILL_ICONS[key]) {
    return SKILL_ICONS[key];
  }
  return SKILL_ICON_DEFAULT;
}

/* ============================================================
   ICONS FOR "ABOUT" AND "CONTACT" SECTIONS
   Looked up by the "icon" key set on each item in data.json.
   ============================================================ */
var SECTION_ICONS = {
  /* about > status list */
  cap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2 9l10 5 10-5-10-5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 10v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  building: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M3 13h18" stroke="currentColor" stroke-width="1.7"/></svg>',
  /* contact list */
  mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  github: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0-2-1.5-3-1.5-3-1.5-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 8.5c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  map: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>'
};

/* Small external-link arrow shown on contact rows that open a new tab */
var EXTERNAL_ARROW = '<span class="contact-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span>';

/* ============================================================
   RENDER: NAVIGATION (desktop rail + mobile drawer)
   ============================================================ */
function renderNav() {
  var railList = document.getElementById('railNav');
  var drawerList = document.getElementById('drawerNav');

  if (!railList || !drawerList) return;

  var railHtml = '';
  var drawerHtml = '';
  for (var i = 0; i < siteData.nav.length; i++) {
    var item = siteData.nav[i];
    railHtml += '<li><a href="#' + item.id + '" data-label="' + item.label + '"><span class="node"></span></a></li>';
    drawerHtml += '<li><a href="#' + item.id + '" data-label="' + item.label + '"><span class="mobile-drawer-indicator" aria-hidden="true"></span>' + item.label + '</a></li>';
  }
  railList.innerHTML = railHtml;
  drawerList.innerHTML = drawerHtml;
}

/* ============================================================
   RENDER: SECTION HEADERS
   Fills in the small "tag" label and the <h2> heading for every
   section that has one, plus the extra intro text on Projects.
   All of this text lives in siteData.sectionHeaders.
   ============================================================ */
function renderSectionHeaders() {
  var headers = siteData.sectionHeaders;
  var sectionIds = ['about', 'projects', 'skills', 'education', 'news', 'contact'];

  for (var i = 0; i < sectionIds.length; i++) {
    var id = sectionIds[i];
    var info = headers[id];
    if (!info) continue;

    var tagEl = document.getElementById(id + 'Tag');
    var headingEl = document.getElementById(id + 'Heading');
    if (tagEl) tagEl.textContent = info.tag;
    if (headingEl) headingEl.textContent = info.heading;
  }

  var projectsInfo = headers.projects;
  if (projectsInfo) {
    var subEl = document.getElementById('projectsSubtitle');
    var noteEl = document.getElementById('projectsNote');
    if (subEl) subEl.textContent = projectsInfo.subtitle;
    if (noteEl) noteEl.textContent = projectsInfo.note;
  }
}

/* ============================================================
   RENDER: HERO
   ============================================================ */
function renderHero() {
  var h = siteData.hero;

  var firstEl = document.getElementById('heroFirstName');
  var lastEl = document.getElementById('heroLastName');
  var subEl = document.getElementById('heroSub');
  var resumeEl = document.getElementById('heroResumeLink');
  var resumeLabelEl = document.getElementById('heroResumeLabel');
  var ctaLabelEl = document.getElementById('heroCtaLabel');
  var photoEl = document.getElementById('heroPhoto');
  var scrollCueEl = document.getElementById('scrollCue');

  if (firstEl) firstEl.textContent = h.firstName;
  if (lastEl) lastEl.textContent = h.lastName;
  if (subEl) subEl.textContent = h.subtitle;
  if (resumeEl) resumeEl.setAttribute('href', h.resumeFile);
  if (resumeLabelEl) resumeLabelEl.textContent = h.resumeLabel;
  if (ctaLabelEl) ctaLabelEl.textContent = h.ctaLabel;
  if (scrollCueEl) scrollCueEl.textContent = h.scrollCue;
  if (photoEl) {
    photoEl.setAttribute('src', h.photo);
    photoEl.setAttribute('alt', h.photoAlt);
  }
}

/* ============================================================
   RENDER: ABOUT
   ============================================================ */
function renderAbout() {
  var a = siteData.about;

  var textEl = document.getElementById('aboutParagraphs');
  var chipsEl = document.getElementById('aboutChips');
  var labelEl = document.getElementById('aboutStatusLabel');
  var listEl = document.getElementById('aboutStatusList');

  if (textEl) {
    var paraHtml = '';
    for (var i = 0; i < a.paragraphs.length; i++) {
      paraHtml += '<p>' + a.paragraphs[i] + '</p>';
    }
    textEl.innerHTML = paraHtml;
  }

  if (chipsEl) {
    var chipHtml = '';
    for (var j = 0; j < a.competencies.length; j++) {
      chipHtml += '<span class="chip">' + a.competencies[j] + '</span>';
    }
    chipsEl.innerHTML = chipHtml;
  }

  if (labelEl) labelEl.textContent = a.statusLabel;

  if (listEl) {
    var rowsHtml = '';
    for (var k = 0; k < a.status.length; k++) {
      var row = a.status[k];
      rowsHtml += '<li class="status-row">';
      rowsHtml += '  <span class="status-icon">' + (SECTION_ICONS[row.icon] || '') + '</span>';
      rowsHtml += '  <div class="status-text">';
      rowsHtml += '    <span class="status-key mono">' + row.key + '</span>';
      rowsHtml += '    <span class="status-value">' + row.value + '</span>';
      rowsHtml += '  </div>';
      rowsHtml += '</li>';
    }
    listEl.innerHTML = rowsHtml;
  }
}

/* ============================================================
   RENDER: CONTACT
   ============================================================ */
function renderContact() {
  var c = siteData.contact;

  var introEl = document.getElementById('contactIntro');
  var gridEl = document.getElementById('contactGrid');
  var ctaEl = document.getElementById('contactCta');

  if (introEl) introEl.textContent = c.intro;

  if (gridEl) {
    var html = '';
    for (var i = 0; i < c.items.length; i++) {
      var item = c.items[i];
      var isLink = item.external ? ' contact-item-link' : '';
      var target = item.external ? ' target="_blank" rel="noopener"' : '';

      html += '<a class="contact-item' + isLink + '" href="' + item.href + '" title="' + item.value + '"' + target + '>';
      html += '  <span class="contact-icon" aria-hidden="true">' + (SECTION_ICONS[item.icon] || '') + '</span>';
      html += '  <span class="contact-text">';
      html += '    <span class="contact-label mono">' + item.label + '</span>';
      html += '    <span class="contact-value">' + item.value + '</span>';
      html += '  </span>';
      html += item.external ? EXTERNAL_ARROW : '';
      html += '</a>';
    }
    gridEl.innerHTML = html;
  }

  if (ctaEl) {
    var mailItem = null;
    for (var j = 0; j < c.items.length; j++) {
      if (c.items[j].icon === 'mail') { mailItem = c.items[j]; break; }
    }
    if (mailItem) ctaEl.setAttribute('href', mailItem.href);

    var ctaLabelEl = document.getElementById('contactCtaLabel');
    if (ctaLabelEl) ctaLabelEl.textContent = c.ctaLabel;
  }
}

/* ============================================================
   RENDER: FOOTER
   ============================================================ */
function renderFooter() {
  var el = document.getElementById('footerCopyright');
  if (el) el.textContent = siteData.footer.copyright;
}

/* ============================================================
   RENDER: PROJECTS
   ============================================================ */
function renderProjects() {
  var grid = document.getElementById('projectGrid');
  if (!grid) return;

  var html = '';
  for (var i = 0; i < siteData.projects.length; i++) {
    var p = siteData.projects[i];

    var pointsHtml = '';
    for (var j = 0; j < p.points.length; j++) {
      pointsHtml += '<li>' + p.points[j] + '</li>';
    }

    var stackHtml = '';
    for (var k = 0; k < p.stack.length; k++) {
      stackHtml += '<span class="stack-tag mono">' + p.stack[k] + '</span>';
    }

    html += '<article class="project-card reveal">';
    html += '  <div class="project-card-body">';
    html += '    <div class="project-card-top">';
    html += '      <h3 class="project-title">' + p.title + '</h3>';
    html += '      <span class="status-pill status-' + p.status + '">' + p.badge + '</span>';
    html += '    </div>';
    html += '    <span class="project-role mono">' + p.role + '</span>';
    html += '    <ul class="project-points">' + pointsHtml + '</ul>';
    html += '    <div class="stack-row">' + stackHtml + '</div>';
    html += '  </div>';
    html += '</article>';
  }

  grid.innerHTML = html;
}

/* ============================================================
   RENDER: TECHNICAL SKILLS
   ============================================================ */
function renderSkills() {
  var board = document.getElementById('skillsBoard');
  if (!board) return;

  var html = '';
  for (var i = 0; i < siteData.skillGroups.length; i++) {
    var group = siteData.skillGroups[i];

    var itemsHtml = '';
    for (var j = 0; j < group.items.length; j++) {
      var name = group.items[j];
      itemsHtml += '<div class="skill-item"><span class="skill-icon">' + skillIcon(name) + '</span>' + name + '</div>';
    }

    html += '<div class="skill-group reveal">';
    html += '  <span class="skill-group-label">' + group.label + '</span>';
    html += itemsHtml;
    html += '</div>';
  }

  board.innerHTML = html;
}

/* ============================================================
   RENDER: EDUCATION TIMELINE
   ============================================================ */
function renderTimeline() {
  var el = document.getElementById('timeline');
  if (!el) return;

  var items = siteData.education.slice();
  items.sort(function (a, b) {
    return parseDate(b.date) - parseDate(a.date);
  });

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var certClass = item.type === 'certification' ? 'cert' : '';

    var detailHtml = '';
    if (item.detail && item.detail.length) {
      for (var j = 0; j < item.detail.length; j++) {
        detailHtml += '<p class="timeline-detail">' + item.detail[j] + '</p>';
      }
    }

    html += '<div class="timeline-item reveal ' + certClass + '">';
    html += '  <span class="timeline-date mono">' + item.dateLabel + '</span>';
    html += '  <h3 class="timeline-title">' + item.title + '</h3>';
    html += '  <p class="timeline-place">' + item.place + '</p>';
    html += detailHtml;
    html += '</div>';
  }

  el.innerHTML = html;
}

/* ============================================================
   RENDER: LATEST UPDATES
   If an entry in data.json has no "date", today's date is
   used automatically.
   ============================================================ */
function renderNews() {
  var feed = document.getElementById('newsFeed');
  if (!feed) return;

  var items = siteData.news.slice();
  for (var i = 0; i < items.length; i++) {
    if (!items[i].date) {
      items[i].date = todayStr();
    }
  }
  items.sort(function (a, b) {
    return parseDate(b.date) - parseDate(a.date);
  });

  var html = '';
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    html += '<article class="news-item reveal">';
    html += '  <div><span class="news-date">' + formatDate(item.date) + '</span></div>';
    html += '  <div>';
    html += '    <p class="news-title">' + item.title + '</p>';
    html += '    <p class="news-body">' + item.body + '</p>';
    html += '    <span class="news-tag">#' + item.tag + '</span>';
    html += '  </div>';
    html += '</article>';
  }

  feed.innerHTML = html;
}

/* ============================================================
   DATE HELPERS
   ============================================================ */
function todayStr() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return d.getFullYear() + '-' + month + '-' + day;
}

function parseDate(str) {
  // Supports "YYYY-MM-DD", "YYYY-MM", "YYYY"
  var parts = str.split('-');
  var year = Number(parts[0]);
  var month = parts[1] ? Number(parts[1]) : 1;
  var day = parts[2] ? Number(parts[2]) : 1;
  return new Date(year, month - 1, day).getTime();
}

function formatDate(str) {
  var parts = str.split('-');
  var year = Number(parts[0]);
  var month = parts[1] ? Number(parts[1]) : 1;
  var day = parts[2] ? Number(parts[2]) : 1;
  var d = new Date(year, month - 1, day);

  if (str.length === 4) {
    return str; // year only
  }
  if (str.length === 7) {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ============================================================
   HERO TERMINAL TYPED LINE
   Simple typewriter effect: types a line, pauses, deletes it,
   then moves to the next line.
   ============================================================ */
function initTypedLine() {
  var el = document.getElementById('typedLine');
  if (!el || !siteData.hero.typedLines.length) return;

  var lines = siteData.hero.typedLines;
  var lineIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function step() {
    var current = lines[lineIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(step, 2000); // pause on completed line
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(step, 400); // brief pause before next line starts
        return;
      }
    }

    setTimeout(step, deleting ? 26 : 36);
  }

  step();
}

/* ============================================================
   SCROLL REVEAL ANIMATION
   Fades + slides each ".reveal" element in once it scrolls
   into view. This is what gives the page its smooth entrance
   animation as you scroll down.
   ============================================================ */
function initScrollReveal() {
  var items = document.querySelectorAll('.reveal');

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  for (var j = 0; j < items.length; j++) {
    observer.observe(items[j]);
  }
}

/* ============================================================
   CIRCUIT RAIL: highlight the link for the section in view
   ============================================================ */
function initRail() {
  var sections = document.querySelectorAll('main .section');
  var links = document.querySelectorAll('.rail a, .mobile-drawer-nav a');
  if (!sections.length || !links.length) return;

  var sectionIds = [];
  for (var i = 0; i < sections.length; i++) {
    sectionIds.push(sections[i].id);
  }

  function updateActive() {
    var currentIndex = 0;
    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) {
        currentIndex = i;
      }
    }

    for (var j = 0; j < links.length; j++) {
      links[j].classList.remove('active');
    }
    var activeLinks = document.querySelectorAll('.rail a[href="#' + sectionIds[currentIndex] + '"], .mobile-drawer-nav a[href="#' + sectionIds[currentIndex] + '"]');
    for (var k = 0; k < activeLinks.length; k++) {
      activeLinks[k].classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* ============================================================
   SECTION NAV LINKS (rail + mobile drawer)
   Intercepts clicks on the "#section" links rendered by renderNav()
   and scrolls to the target manually instead of letting the browser
   navigate to the hash, so the address bar always stays clean at
   https://mehedihasanovi.site/ instead of picking up "#projects" etc.
   ============================================================ */
function initNavLinks() {
  var links = document.querySelectorAll('.rail a[href^="#"], .mobile-drawer-nav a[href^="#"]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
      // Let ctrl/cmd/middle-click open a new tab as usual
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

/* ============================================================
   MOBILE NAV DRAWER
   Called after renderNav() so the nav links already exist and
   "close on link tap" can attach to the real elements.
   ============================================================ */
function initMobileMenu() {
  var btn = document.getElementById('mobileMenuBtn');
  var menu = document.getElementById('mobileMenu');
  var overlay = document.getElementById('mobileOverlay');
  if (!btn || !menu || !overlay) return;

  function setOpen(open) {
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('menu-open', open);
  }

  btn.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });

  // Close when a nav link inside the drawer is tapped
  var drawerLinks = menu.querySelectorAll('a');
  for (var i = 0; i < drawerLinks.length; i++) {
    drawerLinks[i].addEventListener('click', function () {
      setOpen(false);
    });
  }

  // Close when tapping the dark overlay outside the drawer
  overlay.addEventListener('click', function () {
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false);
    }
  });

  // Swipe-left to close
  var touchStartX = 0;
  var touchStartY = 0;
  menu.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  menu.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    // mostly-horizontal leftward swipe of at least 50px
    if (dx < -50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      setOpen(false);
    }
  }, { passive: true });
}

/* ============================================================
   BACK TO TOP
   Shows the floating button after scrolling 300px, scrolls
   smoothly to the top on click. rAF-throttled scroll handler to
   keep it cheap on every frame.
   ============================================================ */
function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  var ticking = false;

  function updateVisibility() {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  updateVisibility();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   INIT
   Runs once the page HTML is ready. Content-driven sections
   (projects, skills, timeline, updates) only render after
   data.json has finished loading.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // Interactions that don't depend on data.json
  initBackToTop();

  // Load all page content from data.json, then render everything
  fetch('data.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      siteData = data;

      renderNav();
      renderSectionHeaders();
      renderHero();
      renderAbout();
      renderProjects();
      renderSkills();
      renderTimeline();
      renderNews();
      renderContact();
      renderFooter();

      initTypedLine();
      initScrollReveal();
      initRail();
      initNavLinks();
      initMobileMenu();
    })
    .catch(function (error) {
      console.error('Could not load data.json:', error);
    });
});
