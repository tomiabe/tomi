# Tomi Abe

A personal website built with vanilla HTML, CSS and JavaScript. No package installation or build step is needed for the current site.

## Preview

Run `python3 -m http.server 4173` from this folder, then open http://127.0.0.1:4173/.

The page, fonts, icons, portrait and photographs use relative local paths. Google Analytics is the only external script.

## Content and design

- `index.html`: narrative, publications, dated notes, links, analytics and SEO metadata.
- `styles.css`: Mozilla Headline headings, Geist body text, palette, light/dark themes and responsive layouts.
- `script.js`: section navigation, theme preference, Lagos clock, nine-photo relay, native photo dialog and procedural background.
- `assets/fonts/`: self-hosted typefaces and Phosphor icons, with their licences.
- `assets/images/media/`: original gallery photographs. Add an entry to the `photos` array when adding an image, with an accurate description and caption. Keep the no-JavaScript photo links in sync.

The opening is identity-led. Background, education, faith and marriage form the personal story; the two practices are destinations within it. Susinsight belongs under Susbridge. The dates in Notes are carried over from the previous site, not presented as newly published updates. The current snapshot remains explicitly dated August 2026.

Edit notes directly in `#now`, using a `time` element with an ISO date. Update the snapshot date only when its content changes.

## Archives

- `archive/old/`: the first website and its compiled assets.
- `archive/2026-09-01/`: the previous one-page design, including its original assets, scripts and scroll implementation.
- `archive/current-site-2026-08-31/`: historical source files, not copied to the public deployment.

The Pages workflow publishes both browsable archives with the new site. The second archive is marked `noindex` so it does not compete with the current homepage in search. It is kept as a snapshot, not restyled.

## Behaviour and accessibility

Section links and wheel scrolling use Lenis for smooth motion without replacing normal browser navigation. The desktop rail tracks the current section; mobile navigation opens downward with the theme control immediately before the menu button.

The photo relay advances every four seconds while visible. Hover or focus pauses automatic playback; an explicit Play resumes it. All nine photographs are shown without cropping. The native dialog supports Escape, arrow keys, focus containment and return to the trigger.

Reduced-motion preferences disable background motion and start the gallery paused. Background animation stops while the document is hidden. The effect is a lightweight procedural canvas field, not a WebGL shader.

Google Analytics `G-6QTT45PS4S`, canonical URLs, Open Graph, Twitter metadata and structured data remain in the head. Social previews use the black-and-white portrait.

## Review notes

Browser checks covered mobile, tablet and desktop layouts, both themes, downward-opening navigation, all nine loaded photographs, explicit Play, native Escape dismissal and focus return. Static checks cover local references, anchor IDs, icon names, metadata JSON and JavaScript syntax.

Polish was run on the gallery interaction code after the full request exceeded the configured provider limit. Its actionable loading-feedback finding was addressed. Remaining claims about Escape, focus transfer and live-region semantics are false positives: the native dialog behaviours were tested in the browser, and `role="status"` supplies polite live-region semantics. This is not a full-site automated accessibility certification.

The Rams tool was unavailable. Restraint, clarity, honest content and removal of unnecessary decoration were assessed manually instead.

Design references informed the reading hierarchy and restraint, not a copied layout or a claim of full design-system compliance:

- https://designsystem.ny.gov/
- https://bradfrost.github.io/cn-style-guide/styles/the-new-yorker.html
- https://muan.co/
- https://rsms.me/about/
- https://grist.org/author/emily-jones/
- https://vanschneider.com/
