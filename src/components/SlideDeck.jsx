import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Maximize, Minimize, LayoutGrid, Sparkles, X,
} from "lucide-react";
import Neighborhood from "./Neighborhood.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SlideDeck({ items }) {
  const total = items.length;
  const hashIndex = () => {
    const n = parseInt((window.location.hash || "").replace("#", ""), 10);
    return Number.isFinite(n) ? Math.max(0, Math.min(n - 1, total - 1)) : 0;
  };
  const [[i, dir], setState] = useState([hashIndex(), 0]);
  const [overview, setOverview] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const current = items[i];

  const go = useCallback(
    (n, d) => setState(([prev]) => {
      const clamped = Math.max(0, Math.min(n, total - 1));
      return [clamped, d ?? (clamped > prev ? 1 : -1)];
    }),
    [total]
  );
  const next = useCallback(() => go(i + 1, 1), [go, i]);
  const prev = useCallback(() => go(i - 1, -1), [go, i]);

  // keep hash in sync
  useEffect(() => {
    if (`#${i + 1}` !== window.location.hash) window.history.replaceState(null, "", `#${i + 1}`);
  }, [i]);

  // fullscreen
  const toggleFull = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);
  useEffect(() => {
    const h = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest && e.target.closest("[role=dialog]")) return;
      switch (e.key) {
        case "ArrowRight": case "PageDown": e.preventDefault(); next(); break;
        case "ArrowLeft": case "PageUp": e.preventDefault(); prev(); break;
        case " ": if (!overview) { e.preventDefault(); next(); } break;
        case "Home": e.preventDefault(); go(0); break;
        case "End": e.preventDefault(); go(total - 1); break;
        case "f": case "F": toggleFull(); break;
        case "g": case "G": setOverview((o) => !o); break;
        case "Escape": setOverview(false); break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total, overview, toggleFull]);

  // preload neighbours
  useEffect(() => {
    [items[i + 1], items[i - 1]].forEach((it) => {
      if (it?.type === "image") { const im = new Image(); im.src = it.src; }
    });
  }, [i, items]);

  const sections = items.reduce((a, it) => (a.includes(it.section) ? a : [...a, it.section]), []);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.985 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.985 }),
  };

  return (
    <div className="grid h-screen w-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#faf7ee,#ece7d8_70%)] text-ink">
      {/* top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-2.5">
        <div className="flex items-baseline gap-2.5 font-disp text-[1.05rem] font-extrabold tracking-tight">
          HOA<span className="text-brand">/</span>120
          <em className="hidden font-serif text-[0.8rem] font-normal not-italic text-inksoft sm:inline">
            My Problem or Your Problem?
          </em>
        </div>
        <nav className="hidden gap-5 md:flex">
          {sections.map((s) => (
            <span key={s} className={`relative font-mono text-[0.7rem] uppercase tracking-[0.16em] transition-colors ${current.section === s ? "text-brand" : "text-inksoft/60"}`}>
              {s}
              {current.section === s && (
                <motion.span layoutId="sec" className="absolute -bottom-2 left-0 right-0 h-0.5 rounded bg-gold" />
              )}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="pill" onClick={() => setOverview((o) => !o)}>
            <LayoutGrid /> Overview
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFull} title="Fullscreen (F)">
            {isFull ? <Minimize /> : <Maximize />}
          </Button>
          <span className="font-mono text-sm tracking-wide text-inksoft">{i + 1} / {total}</span>
        </div>
      </header>

      {/* stage */}
      <main className="relative flex min-h-0 items-center justify-center px-[clamp(1rem,5vw,4rem)] py-5">
        <Button variant="ghost" size="icon" onClick={prev} disabled={i === 0}
          className="absolute left-[clamp(0.4rem,2vw,1.4rem)] top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full border border-line bg-[rgba(255,255,255,0.7)] text-ink hover:bg-white">
          <ChevronLeft className="!h-6 !w-6" />
        </Button>

        <div className="flex aspect-video h-full w-full max-w-[calc((100vh-200px)*1.7778)] items-center justify-center overflow-hidden rounded-xl bg-paper shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(183,208,140,0.12)]">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={i}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
              className="h-full w-full"
            >
              {current.type === "game" ? (
                <Neighborhood onComplete={next} />
              ) : (
                <img src={current.src} alt={current.title} draggable="false"
                  className="h-full w-full select-none object-contain" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button variant="ghost" size="icon" onClick={next} disabled={i === total - 1}
          className="absolute right-[clamp(0.4rem,2vw,1.4rem)] top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full border border-line bg-[rgba(255,255,255,0.7)] text-ink hover:bg-white">
          <ChevronRight className="!h-6 !w-6" />
        </Button>
      </main>

      {/* footer caption + progress */}
      <footer className="flex flex-col items-center gap-2.5 px-5 pb-4 pt-1.5">
        <p className="min-h-[1.3em] text-center font-serif text-[0.95rem] italic text-inksoft">
          {current.title}
        </p>
        <div className="flex max-w-[920px] flex-wrap justify-center gap-1">
          {items.map((it, idx) => (
            <button key={idx} onClick={() => go(idx)} title={`${idx + 1}. ${it.title}`}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all hover:scale-y-150 ${
                it.type === "game"
                  ? idx === i ? "w-7 bg-gold" : "w-7 bg-gold/40"
                  : idx === i ? "w-6 bg-brand" : "w-[22px] bg-brand/25 hover:bg-brand/55"
              }`} />
          ))}
        </div>
      </footer>

      {/* overview grid */}
      <AnimatePresence>
        {overview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-start overflow-auto bg-[rgba(8,11,6,0.94)] p-[4vh_4vw] nice-scroll"
            onClick={() => setOverview(false)}
          >
            <div className="mx-auto w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <Badge variant="gold">Overview · {total} slides</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOverview(false)}><X /></Button>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                {items.map((it, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.012, 0.4) }}
                    onClick={() => { go(idx); setOverview(false); }}
                    className={`group relative aspect-video overflow-hidden rounded-lg border-2 bg-[#11160f] transition-transform hover:-translate-y-1 ${idx === i ? "border-gold" : "border-transparent hover:border-brand-soft"}`}
                  >
                    {it.type === "game" ? (
                      <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-soft to-gold text-center font-mono text-[0.7rem] leading-relaxed text-brand-deep">
                        <span><Sparkles className="mx-auto mb-1 h-4 w-4" />Interactive<br/>Neighborhood</span>
                      </span>
                    ) : (
                      <img src={it.src} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
                    )}
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[0.62rem] text-paper">{idx + 1}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
