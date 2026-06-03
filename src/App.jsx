import SlideDeck from "./components/SlideDeck.jsx";
import { SLIDES, GAME_AFTER } from "./data/slides.js";

// Build the running order: every PDF slide in sequence, with the interactive
// neighborhood inserted right after the end of "Current State".
const items = [];
SLIDES.forEach((s) => {
  items.push(s);
  if (s.n === GAME_AFTER) {
    items.push({
      type: "game",
      section: "Current State",
      title: "Interactive — Walk the cul-de-sac (every door, the same story)",
    });
  }
});

export default function App() {
  return <SlideDeck items={items} />;
}
