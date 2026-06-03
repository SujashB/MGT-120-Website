# HOAs — My Problem or Your Problem? (Team 6 · MGT 120)

An interactive **React + Vite** presentation styled with **Tailwind CSS** and
**shadcn/ui**, animated with **Framer Motion**. It plays the full slide deck
straight from the team's Canva export (all 35 slides, rendered as images) and
embeds a clickable **interactive neighborhood** where every household has the
same HOA grievance.

## Run it

```bash
npm install      # first time only
npm run dev      # starts Vite at http://localhost:5173 (opens automatically)
```

Other scripts:

```bash
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Controls

| Action | Keys / clicks |
|--------|---------------|
| Next / previous slide | → / ← (or PageDn/PageUp, Space, on-screen ‹ ›) |
| Jump to first / last | Home / End |
| Fullscreen | **F** (or the ⛶ button) |
| Overview grid | **G** (or the Overview button) |
| Jump to any slide | click a tick on the bottom progress bar, or a thumbnail in the grid |
| Deep-link a slide | URL hash, e.g. `…/#24` opens the interactive neighborhood |

## The interactive neighborhood (slide 24)

Inserted at the end of **Current State**, right before **Future State**:

- **Every house** on the aerial photo has a glowing marker; hover to light the
  roof, click to meet a resident.
- Clicking a house opens a **background card — no dialogue**, just who they are.
- It runs as a **three-step sequence** and then advances the deck automatically:
  1. **John** — 10-year resident, lawn request ignored for 9 months.
  2. **Samantha** — single mother facing an HOA lien after medical bills.
  3. **Kevin** — HOA board member buried in paperwork; wants better technology.
- The card's button walks the order (*Meet Samantha → Meet Kevin → Continue to
  Future State*). After Kevin, the deck moves to the next slide — Kevin's wish
  for better tech sets up the Future-State HONNA / CRM solution.

## Project structure

```
index.html              Vite entry
public/
  slides/slide-01..30.jpg  rendered from the PDF
  neighborhood.png         aerial map for the game
src/
  App.jsx                  builds the slide order + inserts the game
  components/
    SlideDeck.jsx/.css     slide viewer, navigation, overview grid
    Neighborhood.jsx/.css  the interactive neighborhood game
  data/
    slides.js              slide manifest (titles, sections)
    residents.js           John / Samantha / Kevin + SVG portraits
legacy/                   the earlier hand-coded static deck (kept for reference)
```

> The three residents are illustrative personas (no real identities); their
> stories come from the team's persona notes. Slide imagery is exported directly
> from the team's Canva deck.
