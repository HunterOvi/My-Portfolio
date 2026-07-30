# Mehedi Hasan Ovi — Portfolio

A personal portfolio website built with plain **HTML, CSS, JavaScript, and JSON** — no frameworks, no build tools, no npm install. Just open it and it runs.

It has a dark "cyber-terminal" look (monospace type, a green/copper accent palette, a subtle grid background) and is used to showcase software engineering projects, skills, education, and updates for internship applications.

## Live Preview

Open `index.html` in a browser (see **Running Locally** below for why a local server is needed) or visit the deployed site once hosted (e.g. on Vercel).

## Tech Stack

- **HTML5** — page structure (`index.html`)
- **CSS3** — all styling, layout, and animations (`style.css`)
- **JavaScript** — renders content and powers interactions (`script.js`)
- **JSON** — all editable content lives in `data.json`

No frameworks, no bundler, no dependencies. Everything runs directly in the browser.

## Features

- Fully responsive layout (desktop, tablet, mobile)
- Content-driven sections — projects, tech stack, education, and updates are all loaded from `data.json`, so updating the site never requires touching the HTML or JS
- Smooth scroll-reveal animations as sections enter the viewport
- Animated typing effect in the hero section
- Sticky side navigation that highlights the section currently in view
- Mobile-friendly hamburger menu
- Accessible, semantic markup with `aria-label`s on icon-only elements

## Project Structure

```
portfolio_updated/
├── index.html                       # Page structure & content sections
├── style.css                        # All styling and animations
├── script.js                        # Renders content from data.json + handles interactions
├── data.json                        # Editable content: projects, skills, education, updates
├── photo-hero.jpg                   # Hero section portrait
├── og-image.jpg                     # 1200×630 preview image for social/link previews
├── Mehedi_Hasan_Ovi_Resume.pdf       # Résumé (linked from the "Resume" button)
└── README.md
```

## Running Locally

Because `script.js` loads `data.json` using `fetch()`, the site needs to be served over `http://` — opening `index.html` directly by double-clicking it (`file://...`) will fail to load the content due to browser security restrictions on local file access.

Pick any one of these:

**Option A — Python (already installed on most systems)**
```bash
cd portfolio_updated
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — VS Code Live Server extension**
Install the "Live Server" extension, right-click `index.html`, and choose **Open with Live Server**.

**Option C — Node.js**
```bash
npx serve portfolio_updated
```

## Editing Content

Every piece of page text — navigation labels, the hero section, About Me, projects, tech stack, education, "Latest Updates", and the contact list — lives in `data.json`. Open it, edit the values, save, and refresh the page. No HTML or JavaScript editing required.

A few notes:

- **`site`**: the page `<title>` and meta description shown in browser tabs and link previews (these stay in `index.html`'s `<head>` too, since search engines and chat apps don't run JavaScript — keep both in sync if you change them). The `<head>` also sets `rel="canonical"` and the Open Graph/Twitter tags to `https://mehedihasanovi.site/` and `og-image.jpg` — update those too if the domain or preview image ever changes.
- **`nav`**: the section links in the side rail and mobile menu. Each entry needs an `id` matching a section's `id` in `index.html`, and a `label`.
- **`hero`**: `firstName`/`lastName`, the typewriter `typedLines` (array), the `subtitle`, `resumeFile` (must match the PDF's filename), the `photo` file, plus the two button labels (`ctaLabel`, `resumeLabel`) and the `scrollCue` text under the hero.
- **`sectionHeaders`**: the small uppercase `tag` and the `<h2>` heading shown above every section (About, Projects, Skills, Education, Updates, Contact). Projects also has `subtitle` and `note` for its two lines of intro text.
- **`about`**: `paragraphs` (array — basic `<strong>` tags are allowed), `competencies` (the small skill chips), and the `status` list (each item needs an `icon` key from `SECTION_ICONS` in `script.js`, plus `key`/`value`).
- **Projects**: each project needs `title`, `subtitle`, `role`, `badge`, `stack` (array), `points` (array of 2–3 short bullets), `status` (`"active"` or `"complete"`), and a `github` link.
- **Tech Stack**: grouped under `skillGroups`. Add a skill name to any group's `items` array and it appears automatically. If you add a brand-new skill that doesn't have a matching icon yet, it falls back to a generic icon — you can add a new one in the `SKILL_ICONS` object in `script.js`.
- **Education**: listed under `education`, sorted newest-first automatically based on the `date` field.
- **Latest Updates**: listed under `news`. If you leave out the `date` field on a new entry, it's automatically filled in with today's date when the page loads.
- **`contact`**: `intro` text plus an `items` array (each needs an `icon` key from `SECTION_ICONS`, `label`, `value`, `href`, and `external: true` if it should open in a new tab).
- **`footer`**: just the copyright line.

## Deployment

This is a static site, so it can be deployed anywhere that serves static files — Vercel, Netlify, GitHub Pages, etc. Just upload the folder as-is.

## Author

**Mehedi Hasan Ovi**
B.Sc. in Software Engineering, Daffodil International University

- GitHub: [github.com/HunterOvi](https://github.com/HunterOvi)
- LinkedIn: [linkedin.com/in/mehediovi2003](https://linkedin.com/in/mehediovi2003)

## License

© 2026 Mehedi Hasan Ovi. All rights reserved.
