import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MousePointerClick } from "lucide-react";
import { RESIDENTS, HOUSES, portrait } from "@/data/residents.js";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* The interactive neighborhood — played as a guessing game.
   Nothing about the residents is revealed up front. The presenter asks the
   audience to pick one of the glowing roofs; we click it and a resident's card
   appears. Closing the card returns to the glowing roofs and quietly queues the
   next resident: John -> Samantha -> Kevin. After Kevin's card is closed, the
   deck advances via `onComplete`. */
export default function Neighborhood({ onComplete }) {
  const [step, setStep] = useState(0); // 0 John, 1 Samantha, 2 Kevin
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);

  const resident = RESIDENTS[step];
  const isLast = step === RESIDENTS.length - 1;

  const openResident = () => {
    if (open) return;
    setOpen(true);
    setSeen(true);
  };

  // Closing the card is what drives the game forward.
  const closeCard = () => {
    setOpen(false);
    if (isLast) {
      // let the card animate out, then advance the deck
      setTimeout(() => onComplete && onComplete(), 280);
    } else {
      // reveal the next resident on the *next* pick
      setTimeout(() => setStep((s) => s + 1), 280);
    }
  };

  // Enter closes the open card (and advances the game)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Enter") { e.preventDefault(); closeCard(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto bg-paper2 px-[4vw] py-[3vh] nice-scroll">
      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Badge variant="soft" className="mb-2">Pick a house · interactive</Badge>
        <h3 className="font-disp text-[clamp(1.4rem,3.2vw,2.5rem)] font-bold leading-tight tracking-tight text-ink">
          Pick any glowing dot — who lives there?
        </h3>
      </motion.div>

      {/* the map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative aspect-[1152/840] w-full max-w-[960px] overflow-hidden rounded-2xl border-2 border-brand-deep shadow-[0_18px_50px_rgba(22,23,15,0.28)]"
      >
        <img
          src="/neighborhood.png"
          alt="Aerial view of the neighborhood cul-de-sac"
          className="h-full w-full object-cover [filter:saturate(1.05)_contrast(1.03)]"
        />
        {HOUSES.map((h, i) => (
          <button
            key={i}
            onClick={openResident}
            aria-label="Pick this house"
            className="group absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: "5.4%", aspectRatio: "1" }}
          >
            {/* roof glow */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-[340%] w-[340%] -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full opacity-0 mix-blend-screen transition-all duration-300 [background:radial-gradient(circle,rgba(183,208,140,0.85)_0%,rgba(120,170,60,0.4)_38%,transparent_68%)] group-hover:scale-100 group-hover:opacity-100" />
            {/* pulsing ring */}
            <motion.span
              className="pointer-events-none absolute rounded-full border-2 border-gold/70"
              style={{ width: "60%", height: "60%" }}
              animate={{ scale: [0.8, 1.7], opacity: [0.9, 0] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut" }}
            />
            {/* dot */}
            <span className="relative aspect-square w-[42%] min-w-[14px] rounded-full shadow-[0_0_0_2px_rgba(42,63,18,0.55),0_2px_7px_rgba(0,0,0,0.45),0_0_14px_rgba(244,197,24,0.7)] transition-transform duration-300 [background:radial-gradient(circle_at_35%_30%,#fff6c9,#f4c518_50%,#d49f12_85%)] group-hover:scale-125" />
          </button>
        ))}
      </motion.div>

      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.05em] text-inksoft">
        <MousePointerClick className="h-3.5 w-3.5" />
        {seen ? "Pick another glowing dot" : "Pick a glowing dot to find out who lives there"}
      </p>

      {/* persona card */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) closeCard(); }}>
        <DialogContent
          hideClose
          className="overflow-hidden rounded-3xl border border-black/10 bg-paper p-0 text-ink sm:max-w-xl"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-brand to-gold" />
          <AnimatePresence mode="wait">
            <motion.div
              key={resident.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28 }}
              className="px-7 pb-7 pt-6"
            >
              <div className="mb-4 flex items-center gap-4">
                <div
                  className="h-[104px] w-[104px] flex-shrink-0 overflow-hidden rounded-2xl border-2 border-brand-deep shadow-[0_8px_20px_rgba(22,23,15,0.2)]"
                  dangerouslySetInnerHTML={{ __html: portrait(resident.portrait) }}
                />
                <div className="min-w-0">
                  <Badge variant="soft" className="mb-1.5">{resident.tag}</Badge>
                  <h4 className="font-disp text-3xl font-extrabold leading-none tracking-tight">{resident.name}</h4>
                  <p className="mt-1.5 font-mono text-xs tracking-wide text-inksoft">{resident.role}</p>
                </div>
              </div>

              <blockquote className="mb-4 border-l-[3px] border-gold pl-4 font-serif text-lg italic leading-snug text-brand-deep">
                {resident.quote}
              </blockquote>

              <ul className="space-y-2 border-t border-line pt-4">
                {resident.facts.map((f, i) => (
                  <li key={i} className="relative pl-6 text-sm text-ink">
                    <span className="absolute left-0 top-[0.45rem] h-2.5 w-2.5 rotate-45 rounded-[2px] bg-brand" />
                    <span dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-end">
                <Button variant={isLast ? "gold" : "default"} onClick={closeCard}>
                  {isLast ? "Continue to Future State" : "Back to the neighborhood"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
