export type ExperimentSeed = {
  id: string;
  title: string;
  status: "tested" | "winner" | "draft" | "idea" | "planned";
  difficulty: number;
  ageBands: string[];
  domains: string[];
  learningGoal: string;
  timeMinutes: number;
  messLevel: "low" | "medium" | "high";
  location: "indoor" | "outdoor" | "either";
  materials: string[];
  prep: string;
  safety: string;
  experience: string;
  kidCanDo: string[];
  adultRole: string[];
  steps: { title: string; detail: string }[];
  notice: string[];
  stretch: string;
  notesFromHome: string;
  heroImageUrl: string | null;
  gallery: string[];
  featured: boolean;
};

export type FaqSeed = {
  question: string;
  answer: string;
  sortOrder: number;
};

export const experimentSeeds: ExperimentSeed[] = [
  {
    id: "density-layers",
    title: "Density Layers",
    status: "winner",
    difficulty: 1,
    ageBands: ["3-5"],
    domains: ["physics"],
    learningGoal:
      "Different liquids stack because some are denser (heavier for their size). Salt water can lift an egg; balsamic drops through oil can sink, then rise again when an oily coat breaks.",
    timeMinutes: 60,
    messLevel: "high",
    location: "indoor",
    materials: [
      "Clear tall glasses or jars (2–4)",
      "Water",
      "Table salt",
      "Honey or corn syrup",
      "Vegetable or olive oil",
      "Balsamic vinegar (the star!)",
      "1 raw egg",
      "Spoons for stirring",
      "Tray or towel for spills",
      "Optional: food coloring, small objects to test",
    ],
    prep: "Clear a kitchen counter or table. Set glasses on a tray. Pre-measure salt in a small bowl. Have paper towels ready — oil and vinegar will splash. Warm the honey slightly if it is very thick so it pours more easily.",
    safety:
      "No tasting — raw egg and kitchen liquids are not snacks. Supervise glassware. Wipe oil spills immediately (slippery floors). Wash hands after handling the egg. Keep vinegar away from eyes.",
    experience:
      "A slow density show in tall glasses: an egg that sinks in plain water and rises when you add salt; a honey–water–oil stack; then balsamic drops that sink through oil and climb back up — the crowd-pleaser.",
    kidCanDo: [
      "Help pour (with a steady adult hand nearby)",
      "Stir salt into water",
      "Watch and narrate what sinks or floats",
      "Point to layers and name colors",
      "Gently drop the egg into water (adult spots the glass)",
    ],
    adultRole: [
      "Handle raw egg and glassware",
      "Pour sticky or slippery liquids",
      "Wipe spills before anyone slips",
      "Narrate sink / float / layer; save the denser parent story for after the wow (or a quiet aside)",
      "Let the balsamic drops be the payoff; don't rush",
      "Decide when to stop — one solid hour is enough for a 3-year-old",
    ],
    steps: [
      {
        title: "Set the stage",
        detail:
          "Place 2–4 clear glasses on a tray. Talk about what you will try: some liquids stack, some mix, and an egg might change its mind when water gets salty.",
      },
      {
        title: "Egg sink, then float",
        detail:
          "Fill one glass with plain water and gently lower in a raw egg — it sinks. In a second glass, stir in plenty of salt until dissolved. Move the egg over — it floats. Talk about denser salty water holding the egg up.",
      },
      {
        title: "Honey sinks",
        detail:
          "Pour a slow ribbon of honey into a glass of water (or start with honey at the bottom of an empty glass). Honey is dense — it settles at the bottom.",
      },
      {
        title: "Oil floats",
        detail:
          "Add vegetable oil on top of water. Oil sits on top in a shiny layer. Notice they do not mix.",
      },
      {
        title: "Balsamic bubble dance",
        detail:
          "Drip balsamic vinegar onto the oil layer. The vinegar is denser than oil, so blobs sink — often wrapped in a thin oily coat. When that coat breaks, oil rises again (sometimes ferrying a little vinegar back up). Do it more than once; this was the hit with our 3-year-old.",
      },
      {
        title: "Optional full stack",
        detail:
          "In a tall glass, carefully layer honey → salty water → oil (and dab balsamic for the show). Go slow. Celebrate whatever layers you get — imperfect stacks still teach density.",
      },
      {
        title: "Clean-up ritual",
        detail:
          "Pour liquids into a discard jar (not down the drain if oily). Wipe the counter. Wash hands. High-five.",
      },
    ],
    notice: [
      "Expect ~1 hour with a curious 3-year-old including set-up and clean-up.",
      "Balsamic-on-oil is the wow moment — save it for when attention dips.",
      "Watch blobs sink, then climb — sometimes more than once.",
      "Salt amounts matter: keep adding until the egg floats.",
      "Mess level is high — tray + towels make it manageable.",
    ],
    stretch:
      "Try warm vs cold water, sugar instead of salt, or small toys (grape, cork, coin). Draw the layers afterward. Older kids can predict before pouring.",
    notesFromHome:
      "Real home run with a 3-year-old (~1 hour). Egg sinks in plain water, floats after heavy salt. Honey sinks; oil floats.\n\nWhat's happening with the balsamic dance: balsamic vinegar is sweet and relatively heavy (denser than the oil). As a drop falls through the oil, it often picks up a thin oily coat and can drag some oil down with it. When that coat breaks farther down, the freed oil wants to float again — and sometimes it carries a tiny bit of vinegar back up. That give-and-take is the cute back-and-forth.\n\nShort line for after a wow: \"The vinegar is heavier, so it sinks; the oil wants to float, so when the coat breaks, it climbs back up.\"",
    heroImageUrl: "/images/experiments/density-layers-glasses.png",
    gallery: [],
    featured: true,
  },
  {
    id: "cornstarch-thickening-fluid",
    title: "Cornstarch thickening fluid (Maïzena)",
    status: "tested",
    difficulty: 1,
    ageBands: ["1-2", "3-5"],
    domains: ["physics", "sensory"],
    learningGoal:
      "Some mixes feel liquid when you pour slowly and solid when you poke or squeeze hard.",
    timeMinutes: 15,
    messLevel: "high",
    location: "indoor",
    materials: [
      "Water (start with a shallow pool in the bowl)",
      "Maïzena (cornstarch) — add until it feels fun",
      "Wide bowl or tray",
      "Cups for pouring",
      "Toys to smash / pound the mixture (safe, washable)",
      "Spoon or hands",
      "Towels / wipeable surface",
      "Optional: food coloring (drop or two)",
    ],
    prep: "Cover the table; put a shallow pool of water in the bowl. Set out cups for pouring and a few washable toys ready to smash the mix. Keep the Maïzena box nearby to spoon in.",
    safety:
      "Taste ban — not a snack (dry powder + paste). Watch mouthing for the 1yo. Wipe floor so it doesn’t get slippery when wet. Hands wash after. Choose smash toys without sharp edges or tiny detachable bits. No heat, no other chemicals.",
    experience:
      "Start with water, then spoon in Maïzena until the mix feels fun: pours like a liquid, but goes firm when you slap, smash, or squeeze it. Pour with cups, pound with toys, poke and drip — then rinse everything and wipe down.",
    kidCanDo: [
      "Touch, poke, scoop",
      "Spoon Maïzena into the water",
      "Pour with cups",
      "Smash the mix with a toy",
      "Squeeze a ball and watch it melt",
    ],
    adultRole: [
      "Start the water; control how fast Maïzena goes in",
      "Hand cups and smash toys one at a time",
      "Narrate soft vs hard",
      "Manage mess boundaries",
    ],
    steps: [
      { title: "Water + tools", detail: "Pour a shallow pool of water into a wide bowl on a wipeable tray. Set cups and smash toys nearby." },
      { title: "Maïzena until fun", detail: "Spoon in Maïzena a little at a time until it feels fun — firm when you poke or smash, still drips when you pour. No exact ratio." },
      { title: "Pour vs smash", detail: "Slow pour with cups flows; fast smash with a toy feels firm." },
      { title: "Play", detail: "Pour, smash, scoop, slap; try a ball that melts when you stop squeezing." },
      { title: "Clean-up", detail: "Rinse toys and cups; scrape leftovers into trash (avoid pouring lots down the drain); rinse bowl and hands." },
    ],
    notice: [
      "Slow pour = runny; hard smash = stiff.",
      "Squeezed handful can feel like dough then melt.",
      "Too little Maïzena stays watery; too much gets crumbly — steer with water or powder.",
    ],
    stretch:
      "Walk fingertips across a tray of the mix (quick steps stay up; slow ones sink). Compare with flour + water.",
    notesFromHome:
      "Ran at home (Nicolas): water first, then Maïzena until it feels fun; prep cups to pour and toys to smash the mixture — logged as tested.",
    heroImageUrl: "/images/experiments/cornstarch-thickening-fluid-hero.png",
    gallery: [],
    featured: false,
  },
  {
    id: "cinnamon-soap-rush",
    title: "Cinnamon soap rush",
    status: "tested",
    difficulty: 1,
    ageBands: ["1-2", "3-5"],
    domains: ["physics", "sensory"],
    learningGoal: "Soap can break the “skin” on water so floating powder suddenly rushes away.",
    timeMinutes: 10,
    messLevel: "medium",
    location: "indoor",
    materials: [
      "white plate or shallow dish",
      "water",
      "ground cinnamon",
      "dish soap (one drop)",
      "cotton swab or tip of a finger",
      "towel",
    ],
    prep: "Fill the plate with a thin layer of water on a towel; have cinnamon and soap ready.",
    safety:
      "No tasting cinnamon water or soap. Keep soap away from eyes. Wipe spills — cinnamon stains light surfaces.",
    experience:
      "Sprinkle cinnamon on a plate of water so it floats like a dusty film. Touch a tiny drop of dish soap to the center — the cinnamon races to the edges. Fast payoff, easy redo.",
    kidCanDo: [
      "Help sprinkle cinnamon",
      "Watch the run-away moment",
      "Guess what the soap will do",
      "Deliver the soap drop with help",
    ],
    adultRole: [
      "Control water depth and soap amount",
      "Narrate still… whoosh!",
      "Ask for a guess before the soap",
      "Prefer a redo over a long lecture",
    ],
    steps: [
      { title: "Thin water layer", detail: "Pour a thin layer of water on the white plate." },
      { title: "Dust the surface", detail: "Sprinkle cinnamon evenly so it floats on top." },
      {
        title: "Soap touch",
        detail: "Dip a swab in dish soap; touch the center once — cinnamon rushes outward.",
      },
      { title: "Optional redo", detail: "Dump, rinse, and try again for a second whoosh." },
    ],
    notice: [
      "Cinnamon sits on top until soap touches.",
      "Everything races away from the soap spot.",
      "A second drop does less if water is already soapy.",
    ],
    stretch: "Try pepper instead of cinnamon. Pair with a longer follow-up if you need more than ~10 minutes.",
    notesFromHome:
      "Cinnamon on a white plate + a drop of soap — worked well. A little short, but he liked it. Good quick wow; plan a second activity for a longer block.",
    heroImageUrl: "/images/experiments/cinnamon-soap-rush-hero.png",
    gallery: [],
    featured: false,
  },
  {
    id: "salt-ice-fishing",
    title: "Salt ice fishing",
    status: "planned",
    difficulty: 3,
    ageBands: [
      "3-5",
    ],
    domains: [
      "physics",
      "chemistry",
    ],
    learningGoal:
      "Salt can melt a little ice into water; that water can freeze again around a string. Pressure from a thin wire can also melt ice for a moment, then it freezes again.",
    timeMinutes: 20,
    messLevel: "high",
    location: "indoor",
    materials: [
      "Table salt",
      "Yarn, baker’s twine, or a shoelace (easier than thread)",
      "Thin metal wire (copper craft wire, guitar high-E string, or thin uninsulated wire — skip fishing line for toddlers)",
      "Ice cubes or a mini ice block (freeze overnight; big cubes work better)",
      "2 ice-cube trays or a small plastic container",
      "2 water bottles with lids (weights)",
      "Tray or baking sheet with sides",
      "Towels",
      "Small bowl for salt + spoon",
      "Optional: food coloring",
      "Optional: second string for a no-salt comparison",
    ],
    prep: "Adult-only, 5–10 min before they walk in: set the slow wire experiment in the background if you’re doing it. Put a large ice cube or mini-block on a board or two mugs so the sides are free. Lay thin metal wire across the middle. Hang a closed water bottle from each end so they pull down freely. Tray underneath. Have salt, yarn, ice, and a second tray ready for the fishing game. If the wire setup feels fussy, skip it — salt fishing alone is a complete morning.",
    safety:
      "No tasting salty ice. Adult handles the wire (can cut fingers). Keep hanging bottles where they cannot fall on toes. Watch for numb fingers — ice play is short. Warm hands and towels at the end.",
    experience:
      "A 3-year-old will not sit through a 20-minute wire demo. Treat the salt fishing as the show, and the hanging wire as a slow surprise you set up first and check later. Active time with the child: ~15–20 minutes. Adult setup: ~10 minutes before they walk in. Order of the morning so they get a win fast: adult sets the wire (optional) → warm hands with ice → salt fishing (main event) → quick peek at the wire → optional color tunnels → stop.",
    kidCanDo: [
      "Touch and slide an ice cube (short contact)",
      "Try to “catch” ice with yarn — fail first, then try with salt",
      "Sprinkle a tiny pinch of salt with a spoon",
      "Count / sing / roar while waiting ~60 seconds",
      "Lift both ends of the yarn",
      "Peek at the wire with you later (snack or book in between)",
    ],
    adultRole: [
      "All sharp / heavy parts (wire, hanging bottles)",
      "Control salt amount (tiny pinch, not a mountain)",
      "Spot dripping cubes; keep play short",
      "Narrate one idea at a time — no melting-point lecture",
      "Don’t make them wait at the wire; peek later",
    ],
    steps: [
      {
        title: "Adult-only setup (optional wire)",
        detail:
          "Ice on a board/mugs, wire across, bottles hanging from each end, tray under. Say later: “This one is working slowly. We’ll peek when the timer sings.” Skip if fussy.",
      },
      {
        title: "Warm hands (~2 min)",
        detail:
          "One ice cube on a tray. Kid touches, slides, watches drips. You say: “Ice is water that got so cold it turned solid.”",
      },
      {
        title: "Ice fishing with salt — main event (8–10 min)",
        detail:
          "Tray with ice cubes (bowl of cold water optional). Yarn ~ arm length. Salt + spoon. “Can you catch the ice with the string? No hands.” Let them fail. Lay yarn on a cube; sprinkle a tiny pinch of salt where they meet. Wait ~60 seconds (song, count, ten lion roars). Lift both ends. If it works: whoa — do it again. Optional: no-salt cube for comparison.",
      },
      {
        title: "If it fails",
        detail:
          "Too much salt → melts only — wipe, new cube, tinier pinch. Too little wait → one more song. Yarn too slick → cotton string/yarn, not plastic ribbon.",
      },
      {
        title: "Peek at the wire (~2 min)",
        detail:
          "Walk over together. “Is the line going into the ice?” A dent counts. Check again after snack/book. When it drops through: “The ice opened a little door and then closed it again.”",
      },
      {
        title: "Optional extra (~5 min)",
        detail:
          "Salt + one drop food coloring on a spare cube — tunnels and puddles. Then warm water, towels, done.",
      },
    ],
    notice: [
      "The string alone doesn’t stick; after salt + wait, it can lift the ice.",
      "A no-salt string still fails.",
      "Too much salt makes a puddle instead of a “hug.”",
      "Later, the wire may have cut deeper into the block (or all the way through) while the block stays one piece.",
      "Salt + string: Salt melts a little ice into water. The rest of the ice is still cold enough to freeze that water around the string — an “ice hug.”",
      "Wire + bottles: The bottles push on a thin line. That squeeze melts ice for a moment under the wire; when the squeeze moves on, it freezes again. That’s why the block can stay one piece.",
      "If that’s still too much for the moment: “Ice can melt. Ice can freeze again. Salt melts it. Squeezing melts it too.”",
    ],
    stretch:
      "Food-coloring tunnels on a salted cube (sensory encore). Check the wire again after a longer break — still don’t wait standing there.",
    notesFromHome:
      "Planned for next Saturday; Nicolas will refine after the run.\n\nDifficulty 3 (hard) — adult setup + patience; salt trick carries the day even if the wire never finishes.\n\nSuccess at age 3: saw string fail then work; felt cold/wet; said whoa or wanted a redo; later noticed the wire moved.",
    heroImageUrl: null,
    gallery: [],
    featured: false,
  },

];

export const faqSeeds: FaqSeed[] = [
  {
    sortOrder: 1,
    question: "What ages is Weekend Experiments for?",
    answer:
      "Ideas are curated for ages 1–5, with clear age bands on each card (like 1–2 or 3–5). Many activities flex younger or older with small tweaks — we note that when we know it.",
  },
  {
    sortOrder: 2,
    question: "How do you think about safety?",
    answer:
      "Every tested idea includes a safety note (tasting, glass, slips, choking hazards, supervision). Adults run the session; kids explore within those boundaries. When in doubt, skip or adapt.",
  },
  {
    sortOrder: 3,
    question: "Will there be kits?",
    answer:
      "Maybe later. Physical kits would be optional materials boxes for favorite experiments — handy if you want less hunting for supplies. The experiment guides themselves stay on the site either way. Join the mailing list for news.",
  },
  {
    sortOrder: 4,
    question: "How messy are these?",
    answer:
      "Each card lists mess level: low, medium, or high. High-mess ideas (like Density Layers) assume a tray, towel, and a willing kitchen. We flag that up front so you can pick the right day.",
  },
  {
    sortOrder: 5,
    question: "How do you choose what to publish?",
    answer:
      "I run sessions every Saturday with my kids. I publish most of what we try — and spare you the flops.",
  },
  {
    sortOrder: 6,
    question: "Indoor or outdoor?",
    answer:
      "Both. Filters on the experiments page let you pick indoor, outdoor, or either. Weather and mess tolerance usually decide.",
  },
  {
    sortOrder: 7,
    question: "Will there be other languages?",
    answer:
      "Later. English first while we nail the content. Multilingual support is on the roadmap once the core library feels solid.",
  },
];
