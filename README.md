# KI Boost Studio – Shopify-Theme

Vollständiges, individuell entwickeltes Shopify Online Store 2.0 Theme für **KI Boost Studio** (KI-Automationen, Leadgenerierung, Social-Media-Content, Webseiten-Erstellung). Farbwelt: Schwarz, Weiß, Gold. Sprache: Deutsch.

## Installation

1. Theme als `.zip` packen (kompletten Repo-Inhalt, ohne `.git`) oder über die [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) verbinden:
   ```
   shopify theme dev --store=deine-domain.myshopify.com
   ```
2. Alternativ im Shopify-Adminbereich unter **Onlineshop → Themes → Theme hochladen** die ZIP-Datei hochladen.
3. Theme als Vorschau öffnen und im **Theme-Editor** anpassen (Logo, Farben, Schrift, Texte, Bilder).

## Seitenstruktur

Das Theme bringt für jede der 14 geforderten Seiten ein fertiges, mit Sections & Blocks editierbares Template mit:

| Seite | Template |
|---|---|
| Startseite | `templates/index.json` |
| Leistungen | `templates/page.leistungen.json` |
| KI-Automationen | `templates/page.ki-automationen.json` |
| Leadgenerierung | `templates/page.leadgenerierung.json` |
| Social-Media-Content | `templates/page.social-media-content.json` |
| Webseiten-Erstellung | `templates/page.webseiten-erstellung.json` |
| Preise | `templates/page.preise.json` |
| Über uns | `templates/page.ueber-uns.json` |
| FAQ | `templates/page.faq.json` |
| Kontakt | `templates/page.kontakt.json` |
| Impressum | `templates/page.impressum.json` |
| Datenschutz | `templates/page.datenschutz.json` |
| AGB | `templates/page.agb.json` |
| Widerrufsbelehrung | `templates/page.widerrufsbelehrung.json` |

**Wichtig:** Templates sind Theme-Code. Damit sie im Shop erreichbar sind, musst du im Adminbereich unter **Onlineshop → Seiten** für jede Seite eine neue Shopify-Seite mit passendem Titel/URL-Handle anlegen und im Bereich „Theme-Vorlage“ das entsprechende Template auswählen (z. B. Seite „Leistungen“ → Template `page.leistungen`).

## Wichtiger Hinweis zu den rechtlichen Seiten

Impressum, Datenschutzerklärung, AGB und Widerrufsbelehrung sind als vollständige, rechtlich standardkonforme Textbausteine hinterlegt. Eckige Klammern wie `[Firmenname]`, `[Straße und Hausnummer]`, `[USt-IdNr.]` markieren Stellen, die **vor Live-Schaltung des Shops zwingend durch die echten Unternehmensdaten ersetzt werden müssen**. Passe diese Texte im Theme-Editor (Abschnitt „Rich Text“) oder direkt in den JSON-Templates an. Bei Fragen zur rechtssicheren Formulierung empfiehlt sich zusätzlich eine Prüfung durch einen Rechtsanwalt oder einen Rechtstexte-Generator (z. B. IT-Recht Kanzlei, Trusted Shops).

## Struktur

```
layout/           theme.liquid, password.liquid
sections/         alle wiederverwendbaren Bausteine (Header, Hero, FAQ, Pricing, ...)
snippets/         accordion-custom.liquid, Icons, Produktkarte, Meta-Tags
templates/        alle 14 Marketing-Seiten + Standard-Shopify-Templates
config/           settings_schema.json, settings_data.json
locales/          de.default.json
assets/           theme.css, theme.js, accordion-custom.js
```

## Accordion / FAQ-Komponente

Die FAQ-Sektion (`sections/faq.liquid`) basiert auf dem mitgelieferten `AccordionCustom` Custom Element (`assets/accordion-custom.js`, registriert als `<accordion-custom>`). Jede Frage/Antwort wird über `snippets/accordion-custom.liquid` gerendert und ist vollständig über Blocks im Theme-Editor pflegbar.

## Design-System

- **Farben:** Schwarz (`#0B0B0C`), Weiß (`#FFFFFF`), Gold (`#C6A15B`) – alle über Theme-Einstellungen anpassbar.
- **Typografie:** Frei wählbar über Shopify-Schriftpicker (Standard: Playfair Display für Überschriften, Assistant für Fließtext).
- **Responsive:** Mobile-first, Breakpoints bei 600px / 750px / 990px.
- **Bilder:** Alle Bild-Platzhalter (Hero, Bild-mit-Text, Testimonials) sind über den Theme-Editor mit eigenen Bildern zu befüllen.

## Standard-Shopify-Funktionalität

Neben den 14 Marketing-Seiten enthält das Theme alle für ein installierbares Shopify-Theme benötigten Standardvorlagen (Produkt, Kollektion, Warenkorb, Suche, Blog, Artikel, 404, Passwort-Seite, Kundenkonto) in einheitlichem Design – auch wenn KI Boost Studio primär als Dienstleistungs-Website genutzt wird.
