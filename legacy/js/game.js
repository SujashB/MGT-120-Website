/* =========================================================
   game.js — "Walk the cul-de-sac" interactive map
   · Every house gets a glowing marker.
   · All houses share ONE resident per playthrough.
   · Clicking a house shows the resident's BACKGROUND only
     (no dialogue / no typewriter).
   · The resident cycles each time the game is opened:
       1st open -> John   2nd -> Samantha   3rd -> Kevin
     and then stays on Kevin (no loop).
   ========================================================= */
(() => {
  "use strict";
  const map = document.getElementById("hoodMap");
  if (!map) return; // section not on page

  /* ---------- color helper ---------- */
  const shade = (hex, pct) => {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = pct / 100;
    r = Math.round(r + (f < 0 ? r : 255 - r) * f);
    g = Math.round(g + (f < 0 ? g : 255 - g) * f);
    b = Math.round(b + (f < 0 ? b : 255 - b) * f);
    const c = v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0");
    return "#" + c(r) + c(g) + c(b);
  };

  /* ---------- parametric SVG portrait ---------- */
  function portrait(o) {
    const skin = o.skin, skinSh = shade(skin, -18), hair = o.hair, hairD = shade(hair, -14);
    const cloth = o.cloth, clothSh = shade(cloth, -22);
    const styles = {
      short: `<path d="M46 92 C40 44 60 36 100 36 C140 36 160 44 154 92 C150 66 150 56 100 54 C50 56 50 66 46 92Z" fill="${hair}"/>`,
      ponytail: `<path d="M46 90 C42 46 62 38 100 38 C138 38 158 46 154 90 C150 64 150 56 100 56 C50 56 50 64 46 90Z" fill="${hair}"/>
                 <path d="M150 70 C178 84 178 130 158 152 C174 120 168 92 146 86Z" fill="${hair}"/>`,
      receding: `<path d="M52 84 C52 52 70 44 100 46 C128 48 146 54 148 84 C146 64 130 58 100 60 C74 62 58 66 52 84Z" fill="${hair}"/>`
    };
    const mouths = {
      frown: `<path d="M84 138 C92 132 108 132 116 138" stroke="${skinSh}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      worried: `<path d="M85 137 C93 133 107 133 115 137" stroke="${skinSh}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
      flat: `<path d="M86 137 L114 137" stroke="${skinSh}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    };
    const glasses = o.glasses
      ? `<g stroke="${o.glassColor || "#2b2b2b"}" stroke-width="3" fill="none">
           <rect x="69" y="100" width="26" height="18" rx="5"/><rect x="105" y="100" width="26" height="18" rx="5"/>
           <path d="M95 108 L105 108"/><path d="M69 104 L60 100"/><path d="M131 104 L140 100"/></g>` : "";
    const facial = o.facial === "stubble"
      ? `<path d="M62 110 C62 140 80 158 100 158 C120 158 138 140 138 110 C138 134 122 146 100 146 C78 146 62 134 62 110Z" fill="${hairD}" opacity=".22"/>` : "";
    const earrings = o.earrings
      ? `<circle cx="50" cy="118" r="4" fill="#d9a93a"/><circle cx="150" cy="118" r="4" fill="#d9a93a"/>` : "";
    const tie = o.tie
      ? `<path d="M100 168 L94 178 L100 200 L106 178Z" fill="${o.tieColor || "#3E5C1C"}"/>
         <path d="M94 168 L106 168 L100 175Z" fill="${shade(o.tieColor || "#3E5C1C", -20)}"/>` : "";

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="portrait of ${o.id}">
      <defs><radialGradient id="pg-${o.id}" cx="50%" cy="36%" r="78%">
        <stop offset="0%" stop-color="${o.bgA}"/><stop offset="100%" stop-color="${o.bgB}"/></radialGradient></defs>
      <rect width="200" height="200" fill="url(#pg-${o.id})"/>
      <path d="M30 200 C34 158 60 144 100 144 C140 144 166 158 170 200Z" fill="${cloth}"/>
      <path d="M30 200 C34 168 52 156 70 152 L70 200Z" fill="${clothSh}" opacity=".55"/>
      <path d="M170 200 C166 168 148 156 130 152 L130 200Z" fill="${clothSh}" opacity=".55"/>
      ${tie}
      <path d="M86 132 L114 132 L114 150 C108 156 92 156 86 150Z" fill="${skinSh}"/>
      <ellipse cx="52" cy="112" rx="9" ry="12" fill="${skin}"/><ellipse cx="148" cy="112" rx="9" ry="12" fill="${skin}"/>
      ${earrings}
      <path d="M58 102 C58 60 142 60 142 102 C142 138 122 156 100 156 C78 156 58 138 58 102Z" fill="${skin}"/>
      <path d="M58 102 C58 120 66 142 84 152 C72 140 68 120 68 102Z" fill="${skinSh}" opacity=".3"/>
      ${styles[o.hairStyle || "short"]}
      <path d="M70 96 ${o.brow ? "L94 100" : "C78 92 88 92 94 96"}" stroke="${hairD}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M106 96 ${o.brow ? "L130 96" : "C112 92 122 92 130 96"}" stroke="${hairD}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="83" cy="108" rx="6" ry="5" fill="#fff"/><circle cx="84" cy="109" r="3" fill="#2a2018"/>
      <ellipse cx="117" cy="108" rx="6" ry="5" fill="#fff"/><circle cx="116" cy="109" r="3" fill="#2a2018"/>
      ${glasses}
      <path d="M100 110 L96 124 C98 127 102 127 104 124Z" fill="${skinSh}" opacity=".7"/>
      ${mouths[o.mouth || "flat"]}
      ${facial}
    </svg>`;
  }

  /* ---------- the three residents (background only) ---------- */
  const RESIDENTS = [
    {
      id: "john",
      name: "John",
      tag: "Homeowner",
      role: "Resident · 10 years on the street",
      quote: "“I’ve been living in this neighborhood ten years. Nine months ago I wanted to redo my lawn — the HOA still hasn’t gotten back to me. This board is so trash.”",
      bio: "John has owned his home here for a decade and never thought twice about the HOA — until he tried to do something simple. A routine request to re-landscape his own front lawn has sat unanswered for nine months. No approval, no denial, no reply at all. The silence has worn his patience down to nothing and turned a loyal neighbor into the board’s loudest critic.",
      facts: [
        "<strong>10-year</strong> homeowner on the cul-de-sac",
        "Submitted a lawn / landscaping request <strong>9 months ago</strong>",
        "Still waiting — no response from the board",
        "Lost all confidence in HOA leadership"
      ],
      portrait: { id:"john", skin:"#c9905f", hair:"#6b6359", hairStyle:"receding", facial:"stubble",
                  cloth:"#3E5C1C", mouth:"frown", brow:true, bgA:"#cfe0ad", bgB:"#7b9a4e" }
    },
    {
      id: "samantha",
      name: "Samantha",
      tag: "Single mother",
      role: "Homeowner · raising her kids alone",
      quote: "“I’m a single mom just trying to support my kids. My son got hurt, the hospital bills are through the roof — and now the HOA is putting a lien on my house. I wish I didn’t have to pay so much.”",
      bio: "Samantha is raising her children on a single income. When her son fell and landed in the emergency room, the medical bills swallowed the budget she’d carefully stretched. Falling behind on HOA dues was never a choice — but the board responded not with grace, but with a lien on her home. For her, the HOA isn’t a community; it’s one more bill threatening the roof over her family’s head.",
      facts: [
        "<strong>Single mother</strong> supporting her children alone",
        "Hit with sudden <strong>medical / hospital bills</strong>",
        "Fell behind on dues — board placed a <strong>lien</strong> on her home",
        "Feels HOA costs are simply unaffordable"
      ],
      portrait: { id:"samantha", skin:"#e0b083", hair:"#3a2a1c", hairStyle:"ponytail", earrings:true,
                  cloth:"#7a3c5a", mouth:"worried", bgA:"#e7c0d0", bgB:"#a85f7e" }
    },
    {
      id: "kevin",
      name: "Kevin",
      tag: "HOA board member",
      role: "Works in the HOA office",
      quote: "“I work at the HOA office. I’m really tired of sifting through endless papers every single day. Better technology would make my job so much easier.”",
      bio: "Kevin sees the other side of every complaint. From inside the HOA office, his days disappear into stacks of paper — requests, violations, approvals, all tracked by hand. He isn’t the villain residents imagine; he’s buried. The same broken, manual process that leaves John’s request unanswered is the process drowning Kevin. He’s convinced the right tools could fix both ends at once.",
      facts: [
        "<strong>Board member</strong> working in the HOA office",
        "Buried in <strong>manual paperwork</strong> every single day",
        "Requests get lost in the shuffle — nothing is standardized",
        "Believes <strong>better technology</strong> would transform the job"
      ],
      portrait: { id:"kevin", skin:"#cf9a6e", hair:"#241a12", hairStyle:"short", glasses:true,
                  glassColor:"#2a2a2a", tie:true, tieColor:"#1F23D6", cloth:"#cfd2c3",
                  mouth:"flat", bgA:"#cdd8e8", bgB:"#5b6b86" }
    }
  ];

  /* ---------- house marker positions (% of the photo) — every house ---------- */
  const HOUSES = [
    {x:8,y:19},{x:26,y:24},{x:48,y:20},{x:63,y:23},{x:73,y:40},{x:17,y:45},
    {x:42,y:49},{x:45,y:65},{x:64,y:60},{x:32,y:90},{x:58,y:88},{x:5,y:81}
  ];

  /* ---------- build markers ---------- */
  const markerLayer = document.getElementById("hoodMarkers");
  HOUSES.forEach((h, i) => {
    const btn = document.createElement("button");
    btn.className = "hood-house";
    btn.style.left = h.x + "%";
    btn.style.top = h.y + "%";
    btn.setAttribute("aria-label", "Meet the resident");
    btn.innerHTML = `<span class="hood-pin"></span>`;
    btn.addEventListener("click", openPersona);
    markerLayer.appendChild(btn);
  });

  /* ---------- resident cycling (no loop) ---------- */
  const KEY = "hoodPlays";
  let idx;
  try {
    const plays = parseInt(localStorage.getItem(KEY) || "0", 10);
    idx = Math.min(plays, RESIDENTS.length - 1);          // 0=John,1=Samantha,2=Kevin
    localStorage.setItem(KEY, String(Math.min(plays + 1, RESIDENTS.length - 1))); // advance, capped
  } catch (e) {
    idx = 0; // localStorage blocked -> start at John
  }

  const nameEl = document.getElementById("hoodName");
  function setResident(n) {
    idx = Math.max(0, Math.min(n, RESIDENTS.length - 1));
    if (nameEl) nameEl.textContent = RESIDENTS[idx].name;
  }
  setResident(idx);

  /* ---------- persona card (background only, no dialogue) ---------- */
  const persona     = document.getElementById("persona");
  const pPortrait   = document.getElementById("personaPortrait");
  const pName       = document.getElementById("personaName");
  const pTag        = document.getElementById("personaTag");
  const pRole       = document.getElementById("personaRole");
  const pQuote      = document.getElementById("personaQuote");
  const pBio        = document.getElementById("personaBio");
  const pFacts      = document.getElementById("personaFacts");

  function openPersona() {
    const r = RESIDENTS[idx];
    pPortrait.innerHTML = portrait(r.portrait);
    pName.textContent = r.name;
    pTag.textContent = r.tag;
    pRole.textContent = r.role;
    pQuote.textContent = r.quote;
    pBio.textContent = r.bio;
    pFacts.innerHTML = r.facts.map(f => `<li>${f}</li>`).join("");
    persona.classList.add("show");
    persona.setAttribute("aria-hidden", "false");
  }
  function closePersona() {
    persona.classList.remove("show");
    persona.setAttribute("aria-hidden", "true");
  }

  document.getElementById("personaClose").addEventListener("click", closePersona);
  document.getElementById("personaBackdrop").addEventListener("click", closePersona);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePersona(); });

  /* ---------- presenter controls ---------- */
  // deep-link helper: #hood-card opens the current resident's card (handy for demos)
  if (location.hash.indexOf("hood-card") >= 0) setTimeout(openPersona, 300);

  document.getElementById("hoodNext").addEventListener("click", () => setResident(idx + 1));
  document.getElementById("hoodPrev").addEventListener("click", () => setResident(idx - 1));
  const resetBtn = document.getElementById("hoodReset");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    setResident(0); // back to John; next open restarts the John -> Samantha -> Kevin order
    try { localStorage.setItem(KEY, "0"); } catch (e) {}
  });
})();
