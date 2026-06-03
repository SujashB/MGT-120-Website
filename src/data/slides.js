/* Slide manifest — rendered straight from
   "MGT 120 - Final Presentation (1).pdf" (35 slides).
   The interactive neighborhood is inserted after GAME_AFTER. */

export const SLIDES = [
  { n: 1,  section: "Intro",        title: "Homeowners Associations — My Problem or Your Problem?" },
  { n: 2,  section: "Intro",        title: "Would you pay to lose your freedom?" },
  { n: 3,  section: "Intro",        title: "The American Nightmare" },
  { n: 4,  section: "Current State", title: "Current State" },
  { n: 5,  section: "Current State", title: "The paperwork you sign" },
  { n: 6,  section: "Current State", title: "Meet Fred" },
  { n: 7,  section: "Current State", title: "By the numbers" },
  { n: 8,  section: "Current State", title: "The trust gap" },
  { n: 9,  section: "Current State", title: "Fred turns to his CC&Rs…" },
  { n: 10, section: "Current State", title: "…then this… and then this…" },
  { n: 11, section: "Current State", title: "…and still confused" },
  { n: 12, section: "Current State", title: "A simple wish — the basketball hoop" },
  { n: 13, section: "Current State", title: "One day later…" },
  { n: 14, section: "Current State", title: "The confrontation" },
  { n: 15, section: "Current State", title: "Property Rights vs. Community Standards" },
  { n: 16, section: "Current State", title: "Whose problem is it?" },
  { n: 17, section: "Current State", title: "Escalation" },
  { n: 18, section: "Current State", title: "One day later…" },
  { n: 19, section: "Current State", title: "Satisfaction skews older (8.5 vs 6.2)" },
  { n: 20, section: "Current State", title: "A generational divide" },
  { n: 21, section: "Current State", title: "The math is broken" },
  { n: 22, section: "Current State", title: "Change is slow and costly" },
  { n: 23, section: "Current State", title: "Stuck in time" },
  { n: 24, section: "Future State", title: "Future State" },
  { n: 25, section: "Future State", title: "Three pillars of reform" },
  { n: 26, section: "Future State", title: "AI + a ticketing system" },
  { n: 27, section: "Future State", title: "Introducing HONNA — an HOA assistant" },
  { n: 28, section: "Future State", title: "Before & after HONNA" },
  { n: 29, section: "Future State", title: "A digitized HOA platform" },
  { n: 30, section: "Future State", title: "Current system — physical & slow (~10 days)" },
  { n: 31, section: "Future State", title: "The ticketing workflow" },
  { n: 32, section: "Future State", title: "Our system — centralized CRM (~4 days)" },
  { n: 33, section: "Future State", title: "Putting it together" },
  { n: 34, section: "Future State", title: "Three homeowner portals" },
  { n: 35, section: "Future State", title: "Thank you — Team 6" },
].map((s) => ({ ...s, type: "image", src: `/slides/slide-${String(s.n).padStart(2, "0")}.jpg` }));

/* Insert the interactive neighborhood right after this slide number
   (end of Current State, just before the Future State divider). */
export const GAME_AFTER = 23;
