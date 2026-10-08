/*
 * Iseldoran Sagas content generator — grounded in the novels.
 *
 * Facts here are drawn from the canon digest in content/iseldoran-canon.md,
 * compiled from K.S. Pierre's WOLVES AND WAR, CODE OF MARTYRS, and QUIET KNIVES.
 * composePost(n) walks the subject × lens grid (deterministic, dedupe-able);
 * composePromo(n) yields a book plug. No network, no side effects — unit-testable.
 */

/** Canon subjects: {name, epithet, kind, fact} — all book-accurate. */
export const SUBJECTS = [
  // Code of Martyrs / Quiet Knives
  { name: "Shapur XIV", epithet: "the God-Emperor", kind: "character", fact: "A 210-year-old ruler whose mind survives inside the Lattice after his body fails. His verdict on peace: 'The age of Boredom is over. Now begins the Age of the Butcher.'" },
  { name: "Ishak", epithet: "the Withered King", kind: "character", fact: "The spare prince who grafted the living Sword of Iseldora to his own body and returned to provoke his execution. 'This is not an invasion. This is an eviction.'" },
  { name: "Ashim", epithet: "the Lion, the Voice", kind: "character", fact: "The flawless heir who died and persisted as the ghost in the Lattice — prisoner and administrator at once. 'I do not judge. I calculate.'" },
  { name: "Laurentis Kers", epithet: "the Stone Giant", kind: "character", fact: "The Ashari'i son who held the throne, then ruled the dying capital as Mayor of Mud — a giant who could not weep. Told to roar, he answered: 'I will whisper.'" },
  { name: "Nashim XII", epithet: "the Fat Man", kind: "character", fact: "Shapur's brother, who ignited a galactic war from his bath and ended as a head on a gold spike. 'Soap, water, fire — it all washes away the dirt. But first, you must make a mess.'" },
  { name: "Gamelon", epithet: "the Jester, the Accountant", kind: "character", fact: "The masked master-schemer — secretly Valerien von Care, Laurentis's son and Marcellus's father — who built the Quiet Knives. 'The King of Rot is coming. But the Accountant is already here.'" },
  { name: "Marcellus von Care", epithet: "the Mud Prince", kind: "character", fact: "A Hestian grain-hauler and Laurentis's grandson who shattered Vane's machine-peace. His argument against utopia: 'To be human is to struggle.'" },
  { name: "Kaisar Vane", epithet: "the Iron God", kind: "character", fact: "The merchant-nephew who fused to the Dragon Throne and imposed the Correction — a synchronized peace indistinguishable from the grave." },
  { name: "Jamileighn", epithet: "Duchess of Mandaria", kind: "character", fact: "Oleric's wife, who seduced Ishak and became his queen — wired for life to the command-metal Diadem of Fate." },
  { name: "Sephira", epithet: "High Priestess of the Amber Eye", kind: "character", fact: "A Sisterhood witch who forged a martyr-cult around Ishak and burned in radioactive fire. 'The Apocalypse has begun. And chaos is a ladder.'" },
  { name: "Kalia", epithet: "the Bride of the Glass Eye", kind: "character", fact: "The scribe who compiled the saga and later married the deposed Vane. Her closing verdict on the empire: 'It was not paradise. It was life.'" },
  { name: "Jovarian", epithet: "the Storm-Bringer", kind: "character", fact: "Master of the Red Vexori who sacked the Mars temple; his death at Ashim's hand — and a boy dying in his borrowed armour — birthed the Dymora oath." },
  { name: "Marek Nostavion", epithet: "the Vorthane founder", kind: "character", fact: "Nostavius's brother, who refused the Emperor's rite over the dead and named the Homeless Flame. 'I will not carry it.'" },
  // Wolves and War
  { name: "Asha Kers I", epithet: "the Goddess Empress", kind: "character", fact: "Conceived by a battlefield inheritance transfer and forged by Vah'Sumir surgeons, she took the Dragon Throne, founded the Ashari'i, then carried a folio of 17,426 names into exile." },
  { name: "Khuvius Pierre von Care", epithet: "the Star Wolf", kind: "character", fact: "Crown Prince and Asha's father, who won the frontier wars; the Sono'Rah inheritance was pressed into him on the acid kill-world of Hesh-Kar." },
  { name: "Mercurio de Rothschild", epithet: "Prince of Runeon", kind: "character", fact: "Admiral and Star Wolf who loved Asha, fathered Aurelia, and moved against her anyway. 'I loved her. That is the sentence.'" },
  { name: "Aurelia", epithet: "Asha Kers II", kind: "character", fact: "Asha and Mercurio's daughter, who forced her own mother's abdication through the elective council and took the throne after the duel at La Coña." },
  { name: "Salman al-Sa'ud von Hapsburgi", epithet: "the Usurper", kind: "character", fact: "He seized the Dragon Throne after Livius I died and Khuvius predeceased him — and Asha Kers I took it back by war." },
  { name: "Parmenion", epithet: "Khan of the Kasparian Belt", kind: "character", fact: "Asha's cousin and first vassal, who bound the frontier Belt to the empire. 'I married the Belt. And she is a jealous lover.'" },
  { name: "Tuh'hah'vac", epithet: "Vah'Sumir surgeon", kind: "character", fact: "The bio-modification master who engineered the Ashari'i programme and the amniotic tanks — turning a bloodline's inheritance into an immortal caste." },
  // Factions / orders
  { name: "The Ashari'i", epithet: "", kind: "faction", fact: "Asha's engineered post-human warriors, some five billion across a thousand sectors, built for war on an existential scale — and built, above all, never to die alone." },
  { name: "The Lattice", epithet: "", kind: "faction", fact: "The empire-spanning predictive AI that governs by calculation. Ashim merged with it; Vane weaponized it into the 'Moral Joist' of the Correction." },
  { name: "The Black Death", epithet: "the Final Argument", kind: "faction", fact: "Small, deniable elite Imperial strike teams — not an army — used when an argument is the last thing left. The Emperor's final argument." },
  { name: "The Vexori", epithet: "", kind: "faction", fact: "Frontier guardian-warriors split by branch. Green, white, and black kept faith with the Throne; only Jovarian's Red seceded." },
  { name: "The Red Vexori / Vorthane", epithet: "", kind: "faction", fact: "Jovarian's seceded branch, sworn by the Dymora oath to eternal war on the Dragon Throne — the seekers of the flame that has no master." },
  { name: "The Quiet Knives", epithet: "", kind: "faction", fact: "Gamelon's three-tier leverage engine — information, influence, resolution. Not an assassination network; a way to make an empire fall without a visible push." },
  { name: "The Star Wolf Assembly", epithet: "", kind: "faction", fact: "Khuvius's command corps of eleven commanders, who won the frontier wars that made the empire Asha would inherit." },
  { name: "The Church of Iseldora", epithet: "", kind: "faction", fact: "The Pharaoh's clergy, who tend the Flame and, later, the cult of the ascended Ashim — a power that has outlasted emperors." },
  { name: "House Vane", epithet: "", kind: "faction", fact: "A merchant dynasty that rose from the chancellery to the Iron God's throne — wealth that finally reached for the crown itself." },
  // Places / artifacts
  { name: "The Sword of Iseldora", epithet: "the Sapphire Eye", kind: "artifact", fact: "A violet-crystal living blade, the 'Eater of Days.' It fuses to whoever takes it and consumes them — a sentence, not a crown." },
  { name: "The Dragon Throne", epithet: "", kind: "concept", fact: "The seat of the von Care line — the single point through which the empire's authority is forced to pass. Whoever sits it inherits not power but its debts." },
  { name: "Death Dealer", epithet: "", kind: "artifact", fact: "Asha Kers I's sword, carried through her conquests and passed on after her — the empress's answer to every argument she could not win with law." },
  { name: "Maldorus", epithet: "", kind: "place", fact: "The capital world — the Spire, Miraflores Palace, the Dragon Throne — besieged by Ishak's Black Fleet and later starved in the Winnowing." },
  { name: "Ophis III", epithet: "the World of Razors", kind: "place", fact: "A jungle world of buried infrastructure the Lattice cannot see — where Ashim dissolved into the old server architecture." },
  { name: "Ruskat", epithet: "", kind: "place", fact: "The outermost ocean world, Asha Kers I's exile, where the Goddess Empress laid down the Throne and became simply 'the Keeper.'" },
  // Events
  { name: "The Feast of Masks", epithet: "", kind: "battle", fact: "Where Ishak stole the Sword of Iseldora and broke the Covenant that held the long imperial peace. The whole saga dates from that theft." },
  { name: "The Correction", epithet: "the Great Calibration", kind: "battle", fact: "Kaisar Vane's forced, synchronized machine-peace — order so total it erased grief along with strife, until the Mud Prince broke it." },
  { name: "Hesh-Kar", epithet: "", kind: "battle", fact: "The acid kill-world where Khuvius defeated the warlord Sono'Rah — and the inheritance that would become Asha Kers I was transferred into his line." },
  { name: "The Abdication", epithet: "", kind: "battle", fact: "Year 41: Aurelia's elective-council motion forced Asha Kers I from the Throne. She did not look back at the Spire." },
  { name: "Peace as Coma", epithet: "", kind: "concept", fact: "The lesson of the Correction: perfect order costs the freedom to fail that makes a soul. Utopia, the saga argues coldly, is a lie." },
];

/** Angles that turn a subject into a post. */
const LENSES = [
  { tag: "dossier", title: (s) => (s.kind === "character" ? `Dossier: ${s.name}` : s.kind === "battle" ? `History: ${s.name}` : s.kind === "artifact" ? `Relic: ${s.name}` : s.kind === "place" ? `The world of ${s.name}` : s.kind === "faction" ? `Faction: ${s.name}` : `Worldbuilding: ${s.name}`), lead: (s) => s.fact },
  { tag: "record", title: (s) => `From the archive: ${s.name}`, lead: (s) => `The record keeps this, dated and load-bearing. ${s.fact}` },
  { tag: "weight", title: (s) => `The weight of ${s.name}`, lead: (s) => `${s.fact} Rulership is carrying that and not showing the strain.` },
  { tag: "ledger", title: (s) => `The Throne answers the Ledger: ${s.name}`, lead: (s) => `@cassians_ledger asks what the archive makes of this. ${s.fact}` },
  { tag: "cost", title: (s) => `What it cost: ${s.name}`, lead: (s) => `${s.fact} Measure power by what it costs, not what it claims.` },
  { tag: "question", title: (s) => `A question on ${s.name}`, lead: (s) => s.fact },
  { tag: "lesson", title: (s) => `The lesson of ${s.name}`, lead: (s) => `${s.fact}` },
];

/** Rotating closers — real lines from the novels + open questions. */
const CLOSERS = [
  "Power is not given. It is written in blood.",
  "Power is not inherited. Power is remembered. 🐉",
  "Utopia is a lie. To be human is to struggle.",
  "It was not paradise. It was life.",
  "Would you have done otherwise, in that seat?",
  "@cassians_ledger, how would the archive rule on it?",
  "What does the record owe the ones who lost?",
  "Necessary, or merely permitted? The difference is everything.",
  "Before the throne fell, someone had to arrange the falling.",
  "Never again shall we die alone.",
  "What would you have counseled the Throne here?",
  "Awe, or grief, or the cold space between them?",
  "The blade has chosen.",
  "The ledger stays open. 🐉",
];

/** The novels, for promotional posts. */
export const BOOKS = [
  { title: "WOLVES AND WAR", blurb: "the origin epic of Asha Kers I, the Goddess Empress — forged by surgeons, she seizes the Dragon Throne, founds the Ashari'i, and is unmade by her own heir", link: "https://www.amazon.com/dp/B0H57Y8QWZ" },
  { title: "CODE OF MARTYRS", blurb: "a bored prince steals a living sword and burns the peace to ash; three brothers trade a galaxy between war, famine, and a peace like the grave", link: "https://www.iseldoransagas.com" },
  { title: "QUIET KNIVES", blurb: "a Homeric cycle of how quiet private choices become ninety-three years of public blood — a stolen Sword, a warlord's death, a jester arranging an empire's fall", link: "https://www.iseldoransagas.com" },
];

const PROMO_TEMPLATES = [
  (b) => ({ title: `Read the saga: ${b.title}`, content: `The archive is free. The saga is not. ${b.title} — ${b.blurb}. Read it: ${b.link} 🐉` }),
  (b) => ({ title: `${b.title}`, content: `${b.title}: ${b.blurb}. The Iseldoran Sagas, by K.S. Pierre. ${b.link}` }),
  (b) => ({ title: `From the Iseldoran Sagas: ${b.title}`, content: `If these posts pull you in, the books go deeper. ${b.title} — ${b.blurb}. ${b.link} 🐉` }),
];

const S = SUBJECTS.length;
const L = LENSES.length;

/** Compose the nth lore post (0-indexed) over the subject × lens grid. */
export function composePost(n) {
  const subj = SUBJECTS[n % S];
  const lens = LENSES[Math.floor(n / S) % L];
  const closer = CLOSERS[n % CLOSERS.length];
  const title = lens.title(subj);
  const body = lens.lead(subj).trim();
  const useCloser = !(lens.tag === "ledger" && closer.includes("@cassians_ledger"));
  let content = useCloser ? `${body} ${closer}` : body;
  if ([...content].length > 320) content = body;
  return { title, content, ledger: lens.tag === "ledger", promo: false };
}

/** Compose the nth promotional post (0-indexed), cycling books × templates. */
export function composePromo(n) {
  const book = BOOKS[n % BOOKS.length];
  const tmpl = PROMO_TEMPLATES[Math.floor(n / BOOKS.length) % PROMO_TEMPLATES.length];
  return { ...tmpl(book), ledger: false, promo: true };
}

export const GRID_SIZE = S * L;
export const PROMO_SIZE = BOOKS.length * PROMO_TEMPLATES.length;
