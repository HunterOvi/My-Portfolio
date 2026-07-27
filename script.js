/* ============================================================
   PORTFOLIO SCRIPT
   Plain, beginner-friendly JavaScript (no build tools needed).
   All content (projects, skills, education, updates) lives in
   data.json and is loaded here with fetch().
   ============================================================ */

var siteData = null;

/* ============================================================
   SMALL MONOCHROME ICONS
   Used next to skills and tech badges.
   Kept as plain strings so they are easy to read and edit.
   ============================================================ */
var SKILL_ICON_DEFAULT = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

var SKILL_ICONS = {
  html: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 3h12l-1.1 15L12 20l-4.9-2L6 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.4 7h7.2M8.7 10.5h6.6l-.35 5-3 1-3-1-.2-2.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  css: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 3h12l-1.1 15L12 20l-4.9-2L6 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 7H8.6l.25 3H15.6l-.3 4.3L12 15.3l-3.3-1-.2-1.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  json: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 4c-1.8 0-2.7.9-2.7 2.7v2.4c0 1.3-.6 1.9-1.8 1.9 1.2 0 1.8.6 1.8 1.9v2.4c0 1.8.9 2.7 2.7 2.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4c1.8 0 2.7.9 2.7 2.7v2.4c0 1.3.6 1.9 1.8 1.9-1.2 0-1.8.6-1.8 1.9v2.4c0 1.8-.9 2.7-2.7 2.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  javascript: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9.3 8v6.6c0 1.5-.7 2-1.8 2-1 0-1.6-.4-1.9-1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M13.6 9.5c-.3-.8-1-1.2-1.9-1.2-1.1 0-1.9.6-1.9 1.5 0 2.2 4 1 4 3.4 0 1-.9 1.6-2 1.6-1.1 0-1.9-.5-2.1-1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  java: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6.5 10h10v4a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-4Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M16.5 11.3H18a2 2 0 0 1 0 4h-1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M5 19h13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M9.2 3.4c.8 1-.8 1.8 0 2.8M12.8 3.4c.8 1-.8 1.8 0 2.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  c: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M14.6 9a4 4 0 1 0 0 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  mysql: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 16c2.5-5 6-8.5 10-9 3.2-.4 6.3.6 8 3-2-.5-4.2-.3-6 .8-3.3 2-4.3 5.6-2.2 8.4-2.3 0-4.4-1.1-5.8-2.9-1.2.9-2.6 1.4-4 1.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.4" cy="12.2" r="0.9" fill="currentColor"/></svg>',
  github: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 19c-4 1.2-4-2-6-2m12 4v-3.2c0-.8.3-1.5.8-2-2.9-.3-5.8-1.4-5.8-6.4A5 5 0 0 1 11.3 5.7 4.7 4.7 0 0 1 12 2.5a4.7 4.7 0 0 1 3 1.6 5 5 0 0 1 1.5 3.5c0 5-2.9 6.1-5.8 6.4.5.5.9 1.4.9 2.7V21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  vscode: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M17 3 7.5 11 3 7.5v9L7.5 13 17 21l4-2V5l-4-2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><path d="M17 3 7.5 13 17 21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  vercel: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><polygon points="12,4 21,19 3,19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  arduino: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7.5 8.5a3.5 3.5 0 1 0 0 7c2 0 3.2-1.3 4.5-3.5 1.3 2.2 2.5 3.5 4.5 3.5a3.5 3.5 0 1 0 0-7c-2 0-3.2 1.3-4.5 3.5-1.3-2.2-2.5-3.5-4.5-3.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
};

var SKILL_ICON_ALIASES = {
  html5: 'html', css3: 'css', javascript: 'javascript', java: 'java',
  c: 'c', json: 'json', mysql: 'mysql',
  github: 'github', vscode: 'vscode', vercel: 'vercel', arduino: 'arduino'
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
   RENDER: TECH STACK
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
  if (!el) return;

  var lines = [
    '> B.Sc. in Software Engineering • Daffodil International University',
    '> Building software that solves real-world problems.',
    '> Team Lead • PharmEx | Pharmacy Inventory & Billing System'
  ];
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
  var links = document.querySelectorAll('.rail a');
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
    var activeLink = document.querySelector('.rail a[href="#' + sectionIds[currentIndex] + '"]');
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  var btn = document.getElementById('mobileMenuBtn');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  var links = menu.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  }
}

/* ============================================================
   INIT
   Runs once the page HTML is ready. Content-driven sections
   (projects, skills, timeline, updates) only render after
   data.json has finished loading.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // Animations and interactions that don't depend on data.json
  initTypedLine();
  initScrollReveal();
  initRail();
  initMobileMenu();

  // Load content from data.json, then render the data-driven sections
  fetch('data.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      siteData = data;
      renderProjects();
      renderSkills();
      renderTimeline();
      renderNews();
      initScrollReveal(); // re-run so newly rendered cards get the reveal animation too
    })
    .catch(function (error) {
      console.error('Could not load data.json:', error);
    });
});
