/* Slide manifest — rendered straight from
   "MGT 120 - Final Presentation (2).pdf" (37 slides).
   The interactive neighborhood is inserted after GAME_AFTER. */

export const SLIDES = [
  { n: 1,  section: "Intro",        title: "Homeowners Associations — My Problem or Your Problem?" },
  { n: 2,  section: "Intro",        title: "Would you pay to lose your freedom?" },
  { n: 3,  section: "Intro",        title: "The American Nightmare" },
  { n: 4,  section: "Current State", title: "Current State" },
  { n: 5,  section: "Current State", title: "The paperwork you sign" },
  { n: 6,  section: "Current State", title: "Meet Fred" },
  { n: 7,  section: "Current State", title: "By the numbers" },
  { n: 8,  section: "Current State", title: "A simple wish — the basketball hoop" },
  { n: 9,  section: "Current State", title: "Fred turns to his CC&Rs…" },
  { n: 10, section: "Current State", title: "…then this… and then this…" },
  { n: 11, section: "Current State", title: "…and still confused" },
  { n: 12, section: "Current State", title: "Worth it — the kids love it" },
  { n: 13, section: "Current State", title: "One day later…" },
  { n: 14, section: "Current State", title: "The confrontation" },
  { n: 15, section: "Current State", title: "Property Rights vs. Community Standards" },
  { n: 16, section: "Current State", title: "Whose problem is it?" },
  { n: 17, section: "Current State", title: "Looks perfect — we love our lawn" },
  { n: 18, section: "Current State", title: "One day later…" },
  { n: 19, section: "Current State", title: "You really want to start a war?" },
  { n: 20, section: "Current State", title: "Whose problem is it, really?" },
  { n: 21, section: "Current State", title: "The math is broken" },
  { n: 22, section: "Current State", title: "Change is slow and costly" },
  { n: 23, section: "Current State", title: "Recruitment driven by desperation" },
  { n: 24, section: "Future State", title: "Future State" },
  { n: 25, section: "Future State", title: "Three pillars of reform" },
  { n: 26, section: "Future State", title: "Pillar 1 — A digitized HOA platform" },
  { n: 27, section: "Future State", title: "An AI summarizer, accessible anytime" },
  { n: 28, section: "Future State", title: "Before & after — our system" },
  { n: 29, section: "Future State", title: "Pillar 2 — AI for CC&R & bylaw understanding" },
  { n: 30, section: "Future State", title: "Introducing HONNA — an AI HOA assistant" },
  { n: 31, section: "Future State", title: "Before & after HONNA" },
  { n: 32, section: "Future State", title: "The whole neighborhood benefits" },
  { n: 33, section: "Future State", title: "Pillar 3 — A ticketing system in the CRM" },
  { n: 34, section: "Future State", title: "Current system — physical & slow (~10 days)" },
  { n: 35, section: "Future State", title: "The ticketing workflow" },
  { n: 36, section: "Future State", title: "Our system — centralized CRM (~4 days)" },
  { n: 37, section: "Future State", title: "Thank you — Team 6" },
].map((s) => ({ ...s, type: "image", src: `/slides/slide-${String(s.n).padStart(2, "0")}.jpg` }));

/* Insert the interactive neighborhood right after this slide number
   (end of Current State, just before the Future State divider). */
export const GAME_AFTER = 23;
