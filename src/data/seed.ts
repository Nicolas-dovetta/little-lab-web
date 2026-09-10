export type SayThis = {
  age12?: string[];
  age35?: string[];
  lines?: string[];
};

export type RunThis = {
  overview?: string;
  setup?: string;
};

export type KnowThis = {
  mechanism: string;
  doesNotProve: string;
  goDeeper?: string;
  numbersNote?: string;
  nameForThis?: string;
};

export type Trap = {
  wrong: string;
  why: string;
  replace: string;
};

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
  sayThis?: SayThis;
  runThis?: RunThis;
  knowThis?: KnowThis;
  traps?: Trap[];
  planUnit?: string | null;
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
      "Different liquids stack because some are denser — more mass in the same amount of space. Salt water can hold up an egg. Balsamic can fall through oil and then climb.",
    timeMinutes: 60,
    messLevel: "high",
    location: "indoor",
    materials: [
      "2–4 clear glasses or jars",
      "A tray",
      "A towel",
      "One raw egg",
      "Table salt",
      "Water",
      "Honey",
      "Vegetable oil",
      "Balsamic vinegar",
      "A spoon",
    ],
    prep: "",
    safety: "Raw egg. Oil on tile is slick. Balsamic stains. I mean, it is a kitchen..",
    experience:
      "A slow show in tall glasses: an egg that sinks in tap water and floats when the water is salty; honey under water under oil; then balsamic drops that fall through the oil and come back up. That last part was the hit.",
    kidCanDo: [
      "Drip balsamic after watching once (3–5)",
      "Say which layer is up or down (3–5)",
    ],
    adultRole: [
      "Pour first — sticky and oily liquids",
      "Handle the raw egg and glassware",
      "Keep the salt glass away from the 1–2 year old",
      "Wipe oil before anyone walks through it",
    ],
    steps: [
      {
        title: "Set the stage",
        detail:
          "Two to four glasses on the tray. Say what you will try: some liquids stack, some mix, and the egg might change its mind when the water gets salty.",
      },
      {
        title: "Egg sinks",
        detail:
          "Fill one glass with plain water. Lower the raw egg in. It sinks.",
      },
      {
        title: "Egg floats",
        detail:
          "Second glass: a lot of salt. Stir until most of it disappears. Move the egg over. It should float. If it still sits on the bottom, more salt, more stirring. You did not change the egg. You changed the water. Tip: watch for the egg to start climbing, then call it — easy to overshoot with salt when the kid is steering.",
      },
      {
        title: "Honey goes low",
        detail:
          "Pour a slow ribbon of honey into water, or start with honey in an empty glass and add water after. Honey settles at the bottom.",
      },
      {
        title: "Oil stays up",
        detail:
          "Pour vegetable oil on water. It sits on top in a shiny layer. They do not mix. That can be the whole observation.",
      },
      {
        title: "Balsamic dance",
        detail:
          "Drip balsamic onto the oil. Blobs sink. Then pieces climb. Do it more than once.",
      }],
    notice: [
      "Do not skip the plain-water egg sink — the float means nothing without it.",
      "Watch for the egg to start climbing, then call it — easy to overshoot with salt when the kid is steering.",
      "Balsamic dance was the hit — do it more than once.",
    ],
    stretch: `Sugar instead of salt in the egg glasses.
A grape, a cork, a coin — predict before you drop.`,
    notesFromHome: `My kid just wanted to steer the salt and add more — which he did, and we added way too much. The trick was to watch for the egg to start climbing and then call it.

“Look the egg !! Woaaah” — that was my two seconds of magic. Then he wanted to add more salt.

We moved to the oil after. The balsamic drops in the oil + water + honey were the real blast. Especially some drops that were half vinegar, half oil, stuck in the middle, not moving or only really slowly — so we encouraged them.

Then he added more and more balsamic until I decided: if I wanted dressing for my salad, I should stop. So we made dressing, and that was the end.`,
    heroImageUrl: "/images/experiments/density-layers-glasses.png",
    gallery: [],
    featured: true,
    planUnit: "Matter & mess",
    sayThis: {
      age12: [
        "This one sits on top.",
        "This one goes down.",
        "Look — the dark drop fell. Now something comes back.",
      ],
      age35: [
        "The egg sank. The water was not strong enough to hold it.",
        "Now the water has a lot of salt packed into the same space. It can hold the egg.",
        "The dark drop is heavier for its size, so it falls. The oil wants to stay up. When the thin coat breaks, the oil climbs.",
      ],
      lines: [
        "Do not say “density” unless they ask for the word. Point at what moved.",
        "What they said: “Look the egg !! Woaaah” — 2 seconds of magic when the egg started climbing, then he wanted to add more salt.",
      ],
    },
    runThis: {
      overview:
        "Egg sink in tap water, then float in salty water; honey under water under oil; balsamic drops through oil that fall and climb. That last part was the hit.",
      setup: "Everything on a tray.",
    },
    knowThis: {
      mechanism:
        "Density is mass per volume: how much stuff is packed into the same amount of space. A spoon of honey has more mass than a spoon of oil, so honey sits lower if the two do not mix.\n\n“Heavy” without “for its size” is the mistake this Saturday exists to kill. A cork is light for its size and floats. A small coin can sink. The same egg does both, depending on the liquid around it.\n\nA typical hen’s egg is a little denser than tap water, so it sinks. Dissolve enough salt and the water’s density rises. The egg is now less dense than the liquid around it, so it floats. You changed the water, not the egg.\n\nHoney, water, and oil also differ in whether they mix. Oil and water stay as separate layers because their molecules prefer their own company — they are immiscible. That sharp line is not oil being “afraid.” Honey and water will mix if you stir. Poured slowly, honey can sit underneath for a while because it is denser and it is viscous (it flows slowly). Viscosity is not density. Honey sinks because it is packed tighter than water. It pours slowly because it is thick. Those are different jobs.\n\nBalsamic through oil is the honest party trick. Balsamic is mostly water, sugar, and acid. It is denser than oil, so a drop falls. On the way down it often picks up a thin oily skin. That blob is two materials stuck together, not one liquid that changed its mind. When the skin ruptures lower down, freed oil rises. Sometimes it drags a speck of vinegar with it. That is the down-and-back-up. Not magic. Unsticking.",
      doesNotProve:
        "That “heavy things sink.” That the ocean stacks for the same single reason — in the sea, temperature and salt both change density. That every internet “rainbow bottle” is a clean density tower — many of those liquids will mix if you wait or stir. This Saturday is part density, part “these two refuse to mix.”",
      numbersNote:
        "Keep these off the kid table. Tap water is about 1.00 g/mL. Vegetable oil is about 0.91–0.93. A hen’s egg is often about 1.03–1.09. Balsamic is often around 1.2. Honey is around 1.4. Well-salted water can pass the egg; if you really pack it, it can approach ~1.2. You do not need the numbers to run the Saturday. They are here so you can check a claim.",
      nameForThis:
        "Buoyancy: the liquid pushes up with a force equal to the weight of the liquid displaced. If that push is bigger than the object’s weight, it floats.",
    },
    traps: [
      {
        wrong: "Oil is lighter than water.",
        why: "Lighter is total mass. A bottle of oil is not lighter than a cup of water. Oil is less dense than water.",
        replace:
          "The same amount of oil has less stuff in it than the same amount of water, so it sits on top.",
      },
      {
        wrong: "Honey sinks because it is thicker.",
        why: "Thicker is how runny it is. Oil can look thick and still float.",
        replace:
          "Honey is packed tighter than water. Thick and packed-tight are different jobs.",
      },
      {
        wrong:
          "The vinegar and oil don’t like each other, so the vinegar bounces.",
        why: "They do not mix. That is real. The climb is not a bounce. It is the oily coat breaking and oil going back up.",
        replace:
          "The drop fell because it is denser. The climb is oil going home after the skin breaks.",
      },
    ],
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
    prep: "Cover the table; shallow water in a wide bowl; cups and washable smash toys ready; Maïzena box nearby.",
    safety: "Taste ban — not a snack. Wet mix makes floors slick. No heat, no other chemicals.",
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
      { title: "Play", detail: "Pour, smash, scoop, slap; try a ball that melts when you stop squeezing. Too watery or too powdery — steer with water or Maïzena." },
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
    planUnit: "Matter & mess",
    sayThis: {
      age12: ["[I will fill this after Saturday]"],
      age35: ["[I will fill this after Saturday]"],
    },
    runThis: {
      overview:
        "Water first, then spoon Maïzena until the mix feels fun: flows on a slow pour, firms up on a smash or squeeze.",
      setup:
        "Cover the table; shallow water in a wide bowl; cups and washable smash toys ready; Maïzena box nearby.",
    },
    knowThis: {
      mechanism:
        "The bowl is packed with tiny starch grains suspended in water — not dissolved, just floating and jostling. When you pour slowly, the grains have time to slide past each other, so the mix flows like a thick liquid. When you hit, slap, or squeeze hard and fast, the grains suddenly jam into each other. For a moment the pile locks — it feels solid — then when you ease up, the jam breaks and it melts back into a puddle.\n\nThat firm feel is not a new material. Same water, same starch. What changed is how hard and how fast you pushed. A slow pour and a hard smash are two different stories about the same grain pile.\n\nFlour + water usually will not give you the same sharp switch. Cornstarch grains are the right size and shape to jam under sudden stress. That is why this kitchen mix is famous and flour goo is not the same show.",
      doesNotProve:
        "It does not prove the mix is “magic slime” or a different chemical each time you touch it. Same ingredients; the feel changes with how hard and how fast you push. It does not prove it turns into a rock forever, or that all kitchen powders do this.",
      goDeeper:
        "Under sudden stress the particles lock (jamming); under gentle shear they flow. Flour + water usually won’t give the same sharp solid/liquid switch.",
      nameForThis: "Shear-thickening / particle jamming — optional labels after the plain story. Also called a non-Newtonian fluid or oobleck.",
    },
    traps: [
      {
        wrong: "It’s a solid that turns into a liquid when you’re gentle.",
        why: "That flips the cause. Hard/fast makes it jam (solid-like); slow lets it flow (liquid-like).",
        replace: "Slow = runny. Hard smash = stiff — then it melts when you stop.",
      },
      {
        wrong: "You need an exact recipe or it won’t work.",
        why: "Feel matters more than a ratio. Too watery or too powdery just needs a splash of water or more Maïzena.",
        replace: "Add Maïzena until it feels fun — firm when you poke, still drips when you pour.",
      },
    ],
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
    prep: "Plate on a towel; thin water layer; cinnamon and soap ready.",
    safety:
      "No tasting cinnamon water or soap. Keep soap out of eyes. Cinnamon stains light surfaces.",
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
    notesFromHome: "[I will fill this after Saturday]",
    heroImageUrl: "/images/experiments/cinnamon-soap-rush-hero.png",
    gallery: [],
    featured: false,
    planUnit: "Matter & mess",
    sayThis: {
      age12: ["[I will fill this after Saturday]"],
      age35: ["[I will fill this after Saturday]"],
    },
    runThis: {
      overview:
        "Thin water, cinnamon dust, one soap touch at the center, optional redo.",
      setup: "Plate on a towel; thin water layer; cinnamon and soap ready.",
    },
    knowThis: {
      mechanism:
        "Quiet water has a stretchy skin on top — water molecules at the surface pull harder on their neighbors than molecules deeper down. Floating cinnamon just sits on that skin. Soap weakens the pull where you touch. The unbroken skin farther out still pulls hard, so the surface races away from the soap spot and the cinnamon rides that rush to the edges.\n\nA second soap drop on the same plate does less because the whole surface is already soapy — there is no big tension difference left to drive a whoosh. Rinse and start fresh if you want the show again.",
      doesNotProve:
        "It does not prove the soap “blows” the cinnamon away like wind, or that cinnamon is afraid of soap. The powder is a passenger on the water’s surface. It does not prove the powder is dissolving — it mostly rides and gets shoved aside.",
      goDeeper:
        "Soap is a surfactant: it lowers surface tension. A second drop does less once the whole plate is already soapy — the tension difference is gone.",
      nameForThis: "Surface tension (and how soap — a surfactant — lowers it).",
    },
    traps: [
      {
        wrong: "The soap pushes the cinnamon like a tiny fan.",
        why: "You’re not seeing air push powder. You’re seeing the water’s surface rearrange when tension drops at one spot.",
        replace: "Soap breaks the skin on the water — the rest of the skin pulls the cinnamon away.",
      },
      {
        wrong: "More soap always makes a bigger whoosh.",
        why: "Once the water is soapy, extra drops barely move anything.",
        replace: "One clean first touch is the show; rinse and redo for a second whoosh.",
      },
    ],
  },
  {
    id: "salt-ice-fishing",
    title: "Salt ice fishing",
    status: "planned",
    difficulty: 3,
    ageBands: ["3-5"],
    domains: ["physics", "chemistry"],
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
    prep: "Optional wire (5–10 min before): ice on a board or mugs, wire across middle, closed water bottles hanging from each end, tray under. Kid station: tray, ice cubes, yarn, salt + spoon, towels. Skip wire if fussy — salt fishing alone is enough.",
    safety:
      "No tasting salty ice. Wire can cut. Hanging bottles can fall. Ice is cold.",
    experience:
      "Planned — not run yet. Salt fishing is the show; optional hanging wire is a slow background check. Order: set wire (optional) → touch ice / watch melt → salt fishing → wire peek → optional color tunnels.",
    kidCanDo: [
      "Touch and slide an ice cube",
      "Try yarn alone, then with salt",
      "Sprinkle a tiny pinch of salt with a spoon",
      "Wait ~60 seconds; lift both ends of the yarn",
      "Peek at the wire later",
    ],
    adultRole: [
      "Wire and hanging bottles",
      "Keep salt to a tiny pinch",
    ],
    steps: [
      {
        title: "Adult-only setup (optional wire)",
        detail:
          "Ice on a board/mugs, wire across, bottles hanging from each end, tray under. Skip if fussy.",
      },
      {
        title: "Touch ice / watch melt",
        detail:
          "One ice cube on a tray. Touch, slide, watch drips.",
      },
      {
        title: "Ice fishing with salt",
        detail:
          "Tray with ice cubes (bowl of cold water optional). Yarn ~ arm length. Salt + spoon. Try yarn alone first (expect a miss). Lay yarn on a cube; sprinkle a tiny pinch of salt where they meet. Wait ~60 seconds. Lift both ends. Optional: no-salt cube for comparison.",
      },
      {
        title: "If it fails",
        detail:
          "Too much salt → puddle only — wipe, new cube, tinier pinch. Too little wait → wait longer. Yarn too slick → cotton string/yarn, not plastic ribbon.",
      },
      {
        title: "Peek at the wire",
        detail:
          "Check later for a dent or deeper cut.",
      },
      {
        title: "Optional color tunnels",
        detail:
          "Salt + one drop food coloring on a spare cube — tunnels and puddles.",
      },
    ],
    notice: [
      "The string alone doesn’t stick; after salt + wait, it can lift the ice.",
      "A no-salt string still fails.",
      "Too much salt makes a puddle instead of a hug.",
      "Later, the wire may have cut deeper into the block (or all the way through) while the block stays one piece.",
    ],
    stretch:
      "Food-coloring tunnels on a salted cube. Check the wire again after a longer break.",
    notesFromHome:
      "Planned for next Saturday; Nicolas will refine after the run.\n\nDifficulty 3 (hard) — adult setup + patience; salt trick carries the day even if the wire never finishes.",
    heroImageUrl: null,
    gallery: [],
    featured: false,
    planUnit: "Water & weather",
    sayThis: {
      age35: ["[I will fill this after Saturday]"],
    },
    runThis: {
      overview:
        "Planned: optional wire first; touch ice / watch melt; salt fishing; peek at the wire later. Not written as already-run.",
      setup:
        "Optional wire (5–10 min before): ice on board/mugs, wire across, bottles hanging, tray under. Kid station: salt, yarn, ice, second tray. Skip wire if fussy — fishing alone is enough.",
    },
    knowThis: {
      mechanism:
        "Salt melts a little ice into water. The rest of the cube is still cold enough to freeze that water again around the yarn fibers — an ice hug — so you can lift the cube by the string.\n\nSalt does that by lowering the temperature at which water stays frozen. A tiny pinch is enough. A mountain of salt usually just digs a puddle and never hugs the string.\n\nFor the optional wire: hanging bottles squeeze a thin line into the ice. That pressure melts ice for a moment under the wire. As the wire sinks, the water above can freeze again. The block can stay one piece even if the wire cuts all the way through. Room-temperature wire is not a hot knife — the squeeze does the melting.",
      doesNotProve:
        "It does not prove salt “glues” string to ice, or that the wire burns through like a hot knife. Melting and refreezing do the work. More salt is not better — a mountain often just makes a puddle.",
      goDeeper:
        "Salt lowers the freezing point of water (freezing-point depression). The wire demo is related to pressure melting / regelation — optional vocabulary after the plain story.",
      nameForThis: "Melting, refreezing, and (optional) freezing-point depression / regelation.",
    },
    traps: [
      {
        wrong: "The salt makes the string sticky.",
        why: "Salt isn’t glue. It melts a thin film; cold ice refreezes that water around the fibers.",
        replace: "Salt melts a little ice; the cold cube freezes that water around the string — an ice hug.",
      },
      {
        wrong: "The wire is hot, so it melts the ice.",
        why: "Room-temperature wire isn’t a heated knife. The squeeze from the hanging bottles does the momentary melting.",
        replace: "The bottles push on a thin line — that squeeze melts ice for a moment, then it can freeze again.",
      },
    ],
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
    question: "How messy are these?",
    answer:
      "Each card lists mess level: low, medium, or high. High-mess ideas (like Density Layers) assume a tray, towel, and a willing kitchen. We flag that up front so you can pick the right day.",
  },
  {
    sortOrder: 4,
    question: "How do you choose what to publish?",
    answer:
      "I run sessions every Saturday with my kids. I publish most of what we try — and spare you the flops.",
  },
  {
    sortOrder: 5,
    question: "Indoor or outdoor?",
    answer:
      "Both. Filters on the experiments page let you pick indoor, outdoor, or either. Weather and mess tolerance usually decide.",
  },
  {
    sortOrder: 6,
    question: "Will there be other languages?",
    answer:
      "Later. English first while we nail the content. Multilingual support is on the roadmap once the core library feels solid.",
  },
];
