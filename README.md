# Schütz Mode – Website

Neue, mobiloptimierte Website für das **Modehaus Schütz** (Mode & Bettenfachgeschäft) in Hof/Westerwald.

Reine HTML/CSS/JS-Seite: kein Build-Schritt, keine Frameworks, keine Cookies, keine externen Schriften oder Skripte.
Diese Variante hat **keine Unterordner**, alle Dateien liegen auf einer Ebene und lassen sich auf GitHub einzeln hochladen.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Startseite (Hero, Mode, Betten, Kontakt) |
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten |
| `404.html` | Fehlerseite, leitet zugleich die alten WordPress-Adressen (/mode/, /betten-fachgeschaft/, /kontakt/, /impressum/ …) um |
| `style.css` | Gesamtes Design (Farben und Schriften oben unter `:root`) |
| `main.js` | Mobiles Menü, „Jetzt geöffnet“-Anzeige, Galerie-Fallback |
| `favicon.svg`, `apple-touch-icon.png`, `og-image.png` | Icons und Vorschaubild beim Teilen eines Links |
| `robots.txt`, `sitemap.xml` | Suchmaschinen |
| `.nojekyll` | Sagt GitHub Pages: Dateien unverändert ausliefern |
| `bilder-holen.sh` | Optional: Fotos von der alten Seite herunterladen |

## Auf GitHub veröffentlichen (GitHub Pages)

1. Auf GitHub ein neues Repository anlegen, z. B. `schuetz-mode`.
2. **Add file → Upload files**, alle Dateien auswählen und hochladen, dann „Commit changes“. Die Dateien `.nojekyll` und `.gitignore` beginnen mit einem Punkt und sind auf manchen Geräten versteckt; `.nojekyll` ist wichtig, `.gitignore` entbehrlich.
3. **Settings → Pages → Build and deployment:** Source „Deploy from a branch“, Branch `main`, Ordner `/ (root)`. Nach etwa einer Minute ist die Seite unter `https://<benutzername>.github.io/<repository>/` erreichbar.
4. **Eigene Domain** (www.schuetz-mode.de):
   - Eine Datei `CNAME` anlegen (**Add file → Create new file**), Inhalt: `www.schuetz-mode.de`
   - Beim Domain-Anbieter einen DNS-Eintrag setzen: `www` als CNAME auf `<benutzername>.github.io`
   - In den Pages-Einstellungen „Enforce HTTPS“ aktivieren.

Unter `…github.io/schuetz-mode/` (Unterpfad) funktioniert die Seite ebenfalls; nur die Umleitung alter Adressen in `404.html` greift dort nicht.

## Bilder

Die Seite ist ohne Fotos nutzbar: Fehlen sie, blendet sie die Galerien automatisch aus. Zum Befüllen die Fotos zu den übrigen Dateien legen (Querformat, ca. 1200 px breit, möglichst unter 200 KB):

| Datei | Verwendet für |
| --- | --- |
| `mode-1.jpg` … `mode-6.jpg` | Galerie im Bereich Mode |
| `betten-derby-1.jpg`, `betten-derby-2.jpg` | Galerie Betten (Derby) |
| `betten-oxford-1.jpg`, `betten-oxford-2.jpg` | Galerie Betten (Oxford) |
| `betten-basic-lindgruen.jpg`, `betten-basic-milieu.jpg` | Galerie Betten (Basic) |
| `betten-step5-paris.jpg`, `betten-step5-luzern.jpg` | Galerie Betten (Step 5) |

Am PC versucht `bash bilder-holen.sh`, diese Fotos von der alten Seite zu laden (solange sie online ist). Alt-Texte stehen in `index.html`.

## Texte und Daten ändern

- **Texte, Marken, Kontaktdaten:** direkt in `index.html`.
- **Öffnungszeiten:** an zwei Stellen in `index.html` – in der Tabelle (`data-hours="09:30-12:00,14:00-18:00"`; daraus berechnet das Skript „Jetzt geöffnet“) und im JSON-LD-Block im `<head>` (für Google).
- **Farben, Schriften, Abstände:** `style.css`, Abschnitt `:root`.

## Vor dem Livegang prüfen

- [ ] **Impressum** mit dem alten Impressum abgleichen (Rechtsform, Pflichtangaben, ggf. Hinweis zur Verbraucherstreitbeilegung).
- [ ] **Datenschutzerklärung** ist ein Entwurf für diese statische Seite (kein Tracking, keine Cookies, Hosting bei GitHub Pages). Rechtlich prüfen lassen und bei anderem Hosting anpassen.
- [ ] **Schreibweise der Marken** kontrollieren (z. B. „KjBrand“, „S’questo“, „questo“).
- [ ] **PDF-Broschüre:** Der Link „Broschüre (PDF)“ zeigt noch auf die alte Seite. Datei hochladen und den Link in `index.html` anpassen, bevor die alte Seite abgeschaltet wird.
- [ ] **Kontaktformular:** entfällt bewusst, stattdessen Anrufen, E-Mail und Route. Soll es ein Formular geben, braucht es einen Dienst wie Formspree oder Web3Forms – dann Datenschutzerklärung ergänzen.
- [ ] Domain umstellen, danach `sitemap.xml` in der Google Search Console einreichen.

## Technik

- Mobile-first, getestet bei 320, 390, 820 und 1440 px ohne horizontales Scrollen.
- Feste Aktionsleiste auf dem Handy (Anrufen, Route, E-Mail), Vollbild-Menü, Galerien als Wisch-Leiste.
- Barrierefreiheit: Skip-Link, Tastaturbedienung, sichtbarer Fokus, ausreichende Kontraste, `prefers-reduced-motion`.
- SEO: Titel und Beschreibung, strukturierte Daten (LocalBusiness mit Öffnungszeiten), Open-Graph-Vorschaubild, Sitemap.

## Rechte

Texte, Marken, Logos und Fotos gehören dem Modehaus Schütz bzw. den jeweiligen Markeninhabern. Der Code ist für diese Website erstellt.
