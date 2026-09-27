export type SayThis = {
  age12?: string[];
  age35?: string[];
  lines?: string[];
};

export type RunTrack = {
  label: string;
  title: string;
  imageUrl: string;
  blurb: string;
  /** Shown on the step when this track is that step's photo. */
  imageAlt?: string;
};

export type RunThis = {
  overview?: string;
  setup?: string;
  tracks?: RunTrack[];
};

export type KnowThisImage = {
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
};

/** Mechanism diagram; `smallScreen` images stack in its place below `sm`. */
export type KnowThisDiagram = KnowThisImage & {
  smallScreen?: KnowThisImage[];
};

/**
 * One physics-sketch panel. `<!-- panel:N -->` in `mechanism` places
 * `panels[N - 1]` full width directly above the paragraphs that follow it.
 */
export type KnowThisPanel = KnowThisImage & {
  /** Preferred WebP; `imageUrl` (PNG) is the fallback. */
  webpUrl?: string;
};

export type KnowThis = {
  /** Plain paragraphs; may contain `<!-- panel:N -->` markers (see `panels`). */
  mechanism: string;
  goDeeper?: string;
  numbersNote?: string;
  nameForThis?: string;
  /** Legacy single diagram at the top of Mechanism. Ignored when `panels` is set. */
  diagram?: KnowThisDiagram;
  /** Per-panel sketch walk-through, interleaved via markers in `mechanism`. */
  panels?: KnowThisPanel[];
};

export type Trap = {
  wrong: string;
  why: string;
  replace: string;
};

export type ExperimentProduct = {
  name: string;
  asin?: string;
  amazonUrl?: string;
  note?: string;
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
  products?: ExperimentProduct[];
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
  /** Saturday the experiment was actually run, YYYY-MM-DD (America/Los_Angeles). Omit or null if unknown. */
  ranOn?: string | null;
  /** Upcoming Saturday YYYY-MM-DD (America/Los_Angeles). Omit or null if not scheduled. */
  plannedFor?: string | null;
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
      "Different liquids stack because some are denser — more mass in the same amount of space. Salt water can hold up an egg. A balsamic drop falls through oil — then the oil it dragged down floats back up.",
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
      "The balsamic drops were the real blast. Two seconds of magic when the egg started climbing, then he wanted more salt.",
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
        detail: "Two to four glasses on the tray.",
      },
      {
        title: "Egg sinks",
        detail: "Plain water. Lower the egg. It sinks. Don’t skip this — the float means nothing without it.",
      },
      {
        title: "Egg floats",
        detail:
          "Second glass: lots of salt, stir, move the egg. Watch for the climb, then call it — easy to overshoot.",
      },
      {
        title: "Honey goes low",
        detail: "Slow ribbon of honey into water, or honey first then water. Honey settles at the bottom.",
      },
      {
        title: "Oil stays up",
        detail: "Vegetable oil on water. It sits on top. They do not mix.",
      },
      {
        title: "Balsamic dance",
        detail: "Drip balsamic onto the oil. Blobs sink. Then pieces climb. Do it more than once.",
      },
    ],
    notice: [],
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
    ranOn: "2026-09-05",
    sayThis: {},
    runThis: {
      overview:
        "Egg sink then float; honey under water under oil; balsamic drops that fall and climb.",
    },
    knowThis: {
      mechanism:
        "Density is mass per volume: how much stuff is packed into the same amount of space. A spoon of honey has more mass than a spoon of oil, so honey sits lower if the two do not mix.\n\n“Heavy” without “for its size” is the mistake this Saturday exists to kill. A cork is light for its size and floats. A small coin can sink. The same egg does both, depending on the liquid around it. Bear with me while I walk through the sketch, because it shows exactly that. A note on the arrows first: solid orange arrows are forces (pushes and pulls). Dashed ones show which way something moves.\n\n<!-- panel:1 -->\nPanel 1, \"Egg: sink, then float\". On the left is the glass of water with the egg on the bottom, and a spoon tipping salt in (\"add salt, stir\"; the dashed curve is the stirring). The window on the right is split in two: \"tap water\" on the left, \"salty water\" on the right. Same egg in both.\n\nIn tap water the egg sits on the bottom. In salty water it floats at the top, with only a small cap poking out above the surface. Most of it stays under.\n\nThe dashed boxes, \"forces on the egg\", show why. Two forces act on the egg. Weight pulls it down. The water pushes it up: that push is buoyancy, and it equals the weight of the water the egg pushes aside.\n\nIn the tap water box, look at the arrow lengths. The push up is almost as long as the weight, but not quite. A typical hen’s egg is a little denser than tap water. The water holds up most of the egg (something like 92–97% of its weight), and the glass bottom carries the little bit left over. That is the tiny \"+ bottom\" arrow, starting where the egg touches the glass. It is also why a little salt is enough to tip it.\n\nSalt adds a lot of mass but only a little extra volume. The dissolved salt tucks in among the water molecules. So each spoonful of the water gets heavier: denser. In the salty water box, the two arrows are the same length (\"equal\"). Push up = weight, and the egg floats. You changed the water, not the egg.\n\n<!-- panel:2 -->\nPanel 2, \"Denser sits lower\". On the left is the layered glass: \"honey\" at the bottom, \"water\" in the middle, \"oil\" on top, with sharp lines between them. On the right is a density ladder in g/mL, with denser going down (\"denser\"), so it lines up with the glass.\n\nRead it top to bottom: oil ~0.91–0.93, water 1.00, egg ~1.03–1.09, salt water up to ~1.2, balsamic 1.1–1.3 (it depends on the bottle), honey ~1.4. Whatever is lower on the ladder sits lower in the glass.\n\nThe ladder also shows panel 1 again. The egg bar sits just below water, so the egg sinks in tap water. The salt water bar reaches past the egg, so enough salt floats it.\n\nHoney, water, and oil also differ in whether they mix. Oil and water stay as separate layers; they are immiscible. That sharp line is not oil being “afraid,” and it is not the oil molecules snubbing the water. Water molecules cling tightly to each other. Oil molecules can't join in, so the water keeps squeezing them out into their own layer.\n\nHoney and water will mix if you stir. Poured slowly, honey can sit underneath for a while because it is denser and it is viscous (it flows slowly). The panel 2 caption says it: thick (viscous) is a different thing, and honey is both. Honey sinks because it is packed tighter than water. It pours slowly because it is thick. Those are different jobs.\n\n<!-- panel:3 -->\nPanel 3, \"Balsamic falls; oil climbs back\". This is the honest party trick. On the left, a spoon drips \"balsamic drops\" into the oil. The magnifier sits on the line where oil meets water. The window on the right is that line, in three steps, numbered 1 to 3. The boundary is at the same height in all three.\n\nStep 1, \"balsamic drop\": the dark drop sinks through the yellow oil (dashed arrow down). Balsamic is mostly water, sugar, and acid, and it is denser than oil, so it falls. The dashed arrow shows which way it moves, not a force. It falls at a steady speed, with the oil's drag holding it back.\n\nStep 2, \"thin oil film\": the drop reaches the water and presses into it, making a dent. It doesn't join the water right away. A thin film of oil is trapped between the drop and the water, and that film has to drain or break first. Some drops wait right there at the boundary while it drains. (That's most likely what the half-vinegar, half-oil drops stuck at the middle line were doing at our table.)\n\nStep 3, \"freed oil rises\": the film has broken. The vinegar mixes down into the water; those are the dark wisps. The bit of oil that got dragged down with the drop (the oil lining the dent it pushed into the water) is cut loose. It's less dense than water, so it floats back up to the oil layer (dashed arrow up). That is the down-and-back-up. The drop that fell was balsamic. What climbs back is oil. Not magic. Unsticking.",
      panels: [
        {
          imageUrl: "/images/experiments/density-layers-physics-panel-1-egg.png",
          webpUrl: "/images/experiments/density-layers-physics-panel-1-egg.webp",
          alt: "Sketch panel 1, Egg: sink, then float. Salt is stirred into a glass of water; side by side, the egg sits on the bottom in tap water, where the push up is a little shorter than its weight and the glass bottom carries the rest, and floats in salty water, where push up and weight are equal.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/density-layers-physics-panel-2-layers.png",
          webpUrl: "/images/experiments/density-layers-physics-panel-2-layers.webp",
          alt: "Sketch panel 2, Denser sits lower. A glass layered honey, water, oil next to a density ladder in g/mL: oil about 0.91 to 0.93, water 1.00, egg about 1.03 to 1.09, salt water up to about 1.2, balsamic 1.1 to 1.3, honey about 1.4, denser lower.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/density-layers-physics-panel-3-balsamic.png",
          webpUrl: "/images/experiments/density-layers-physics-panel-3-balsamic.webp",
          alt: "Sketch panel 3, Balsamic falls; oil climbs back. Three steps at the oil and water line: a balsamic drop sinks through oil, sits on a thin oil film at the water, then the film breaks, the vinegar mixes into the water and the freed oil rises back up.",
          width: 1200,
          height: 800,
        },
      ],
      numbersNote:
        "Keep these off the kid table. Tap water is about 1.00 g/mL. Vegetable oil is about 0.91–0.93. A hen’s egg is often about 1.03–1.09. Balsamic is about 1.1–1.3, depending on the bottle. Honey is around 1.4. Well-salted water can pass the egg; if you really pack it, it can approach ~1.2. To float a fresh egg, figure roughly 2–3 tablespoons of table salt per cup of water (about 11–13% salt by weight), stirred until it dissolves. If you don't stir, the salt settles at the bottom, and the egg can hover in the middle. You do not need the numbers to run the Saturday. They are here so you can check a claim.",
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
        why: "They do not mix. That is real. The climb is not a bounce. It is oil the drop dragged down, cut loose when the thin film breaks, going back up.",
        replace:
          "The drop fell because it is denser. The climb is oil going home after the film breaks.",
      },
    ],
  },

  {
    id: "cornstarch-thickening-fluid",
    title: "Cornstarch thickening fluid (Maïzena)",
    status: "winner",
    difficulty: 1,
    ageBands: ["1-2", "3-5"],
    domains: ["physics", "sensory"],
    learningGoal:
      "Some mixes feel liquid when you pour slowly and solid when you poke or squeeze hard.",
    timeMinutes: 15,
    messLevel: "high",
    location: "indoor",
    materials: [
      "Water (shallow pool)",
      "Maïzena (cornstarch)",
      "Wide bowl or tray (stainless works)",
      "Cups; wooden sticks or washable smash toys",
      "Spoon or hands",
      "Towels",
      "Optional: food coloring",
      "Optional: learning tower / high chair so both kids can reach",
    ],
    prep: "",
    safety: "",
    experience:
      "Pours like a liquid, then goes firm when you slap, smash, or squeeze it. Very messy; very easy to clean. Fun to play with the kids — both at the counter (learning tower + high chair), shirtless, sticks in stainless bowls.",
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
      {
        title: "Water + tools",
        detail:
          "Shallow water in a wide bowl (stainless is fine). Cups and wooden sticks or smash toys nearby. Learning tower for the bigger kid; high chair keeps the little one in on it.",
      },
      {
        title: "Maïzena until fun",
        detail:
          "Spoon in until it feels fun — firm when you poke, still drips when you pour. No exact ratio. Err toward more cornstarch if you want that solid-ish feel.",
      },
      {
        title: "Pour vs smash",
        detail:
          "Slow pour flows; fast smash feels firm. Mix pools flat in the bowl; splatters on the counter hold as thick blobs.",
      },
      {
        title: "Play",
        detail:
          "Pour, smash, scoop, slap; squeeze a ball and watch it melt. Steer with water or Maïzena. Shirtless helps — it gets everywhere.",
      },
    ],
    notice: [],
    stretch:
      "Walk fingertips across a tray of the mix (quick steps stay up; slow ones sink). Compare with flour + water.",
    notesFromHome:
      "The maïzena was great; very messy very easy to clean. Proportions can be approx — don’t be scared to put too much corn so it becomes a real solid-ish liquid. Play with your kids it is fun.\n\nFrom the clip: 3yo on the learning tower at the counter with a wooden stick; 1yo in the high chair with a small cup and stick — both shirtless. Stainless bowls; white mix pools flat in the bowl, splatters hold as thick blobs on the granite. Counter and the 3yo’s arms and tummy thoroughly coated.\n\n1yo loved playing with it with a spoon in a cup. Would scream a lot.\n\n3yo did the mix, had a small bowl, made balls with the mix, made a giant mess and was happy.",
    heroImageUrl: "/images/experiments/cornstarch-thickening-fluid-hero.png",
    gallery: [],
    featured: false,
    planUnit: "Matter & mess",
    ranOn: "2026-09-26",
    sayThis: {},
    runThis: {
      overview:
        "Water first, then spoon Maïzena until it feels fun. Proportions can be approximate — don’t be scared to put too much cornstarch so it becomes a real solid-ish liquid.",
      tracks: [
        {
          label: "POUR",
          title: "Pour vs smash",
          imageUrl: "/images/experiments/cornstarch-hand-runny.webp",
          imageAlt: "A hand with runny cornstarch mix dripping back into a stainless bowl",
          blurb:
            "Slow pour flows; fast smash feels firm. Mix pools flat in the bowl; splatters on the counter hold as thick blobs.",
        },
        {
          label: "PLAY",
          title: "Play",
          imageUrl: "/images/experiments/cornstarch-mess-counter.webp",
          imageAlt:
            "Cornstarch mess on a granite counter: stainless bowls, wooden sticks, thick blobs dripping off the edge",
          blurb:
            "Pour, smash, scoop, slap; squeeze a ball and watch it melt. Steer with water or Maïzena. Shirtless helps — it gets everywhere.",
        },
      ],
    },
    knowThis: {
      mechanism:
        "Bear with me as I over explain this one, using the sketch.\n\nThis is not a gel, not melted plastic, and not a chemical reaction. You mixed water and billions of tiny hard cornstarch grains. Starch actually likes water: water wets each grain and it swells a little, but each grain stays a tiny hard particle. The grains do not dissolve. They sit in the water as a crowded suspension, a particle slurry.\n\nA note on the arrows: solid orange arrows are pushes (forces), and dashed ones show which way something moves.\n\n<!-- panel:1 -->\nPanel 1, \"Slow spoon → it flows\". On the left is the bowl, with a spoon moving through the mix slowly (the dashed orange \"slow\" arrow). The circle is a magnifier. The big window is what a tiny patch of the mix looks like zoomed way in. Check the scale bar: 20 µm. A human hair is a few of those bars wide.\n\nEach cream blob is one starch grain: a few to tens of micrometers across, irregular, and stiff. The pale blue is water. Look between the grains. There is a thin water film between neighbours (\"water film\"). The films are drawn much thicker than they really are, so you can see them. At rest or under a gentle, slow push, that film acts like a lubricant between the grains. There is also a tiny push-apart force between the grain surfaces, and it helps keep them from touching, as long as you don't push harder than it.\n\nThe small dashed arrows on the grains show them moving along with the spoon. Grains near the top move the most and lower ones less, so layers of grains slide, roll, and rearrange past each other. Zoom back out and that is the mix pouring and dripping like a thick liquid.\n\n<!-- panel:2 -->\nPanel 2, \"Fast smash → it jams\". Same bowl, same mix. This time a fist comes down fast and hard (the big solid \"fast, hard\" arrow is the push). Look at the shaded cone under the fist in the bowl. That is the jammed region. It grows from where you hit, down until it reaches the bottom (\"jam reaches bottom\").\n\nNow the zoom. The push is so hard and sudden that, right where two grains are closest, it pushes through the last whisper-thin film and the tiny push-apart force. The grains touch and rub with friction (\"grains touch\"). Those are the grains shaded orange.\n\nThe rest of the water can't move fast enough to help. To slide past each other, the grains would have to spread apart a little, and water can't flow into the pile that quickly (\"water can't escape in time\"). So the grains stay pressed together.\n\nThe orange lines running through them are force chains: lines of touching grains passing the push along, from the arrows at the top down \"to bowl bottom\". Once chains reach something firm, like the bottom of the bowl, the pile locks. It feels solid. For that moment it can even crack.\n\nNotice what is the same in both zooms: how crowded the grains are and how much water is there. Same water, same starch. No new material appeared, and the water did not leave. What changed is how hard and how fast you pushed: the rate and strength of the push. (Hydroclusters, grains the flowing water drags into clumps, only explain mild thickening, not this sudden jam. The sketch doesn't draw them.)\n\nStop pushing and the second line of the panel 2 caption happens: \"Stop pushing → they let go → it flows again.\" The chains fall apart, water films come back between the grains, and it melts back into a puddle. Slow shear → flow. Fast, high shear → jam.\n\nFluids whose resistance rises when you shear them harder are called dilatant or shear-thickening. Cornstarch + water is a classic kitchen case. (Ketchup and paint do the opposite: they get runnier when you shear them. That is shear-thinning, and it comes from different particle and polymer physics.) At high enough grain loading and sudden stress, the thickening can jump almost discontinuously. A punch is closely related to that jump: a jammed front shoots down from where you hit, and a soft pour becomes a crack. That is why smash toys and slap games feel so dramatic.\n\nHow crowded the bowl is matters. If the volume fraction of grains is too low, there is always space to rearrange and you only get a thin sludge. If it is dense enough, a hard hit can jam the whole pile. That is roughly the crowded regime parents hit by feel: firm when poked, still drips when poured. That is why “don’t be scared to put too much cornstarch” works: more grains → easier jamming → a real solid-ish liquid under stress. Too dry and crumbly just needs a splash of water; the target is dense but still wet.\n\nFlour + water usually won't give the same sharp switch. Flour isn't pure starch. Its proteins (gluten) get sticky and stretchy in water and glue the particles together into a paste, so they can't slide freely one moment and lock the next. Pure starch powders (corn, potato) do the trick; flour mostly doesn't.\n\nWalking quickly across a deep tray of the mix (or the backyard-pool demos online) uses the same physics. Each footfall is a fast, high-stress punch that briefly jams a pad under the foot, like the cone in panel 2. Stand still and you sink, because slow loading lets grains rearrange again, like panel 1.",
      panels: [
        {
          imageUrl: "/images/experiments/cornstarch-physics-panel-1-slow.png",
          webpUrl: "/images/experiments/cornstarch-physics-panel-1-slow.webp",
          alt: "Sketch panel 1, Slow spoon, it flows. A spoon moves slowly through the bowl; the zoom (20 µm scale bar) shows starch grains in water with thin water films between them, and dashed arrows showing the grains sliding past each other, so the mix pours.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/cornstarch-physics-panel-2-smash.png",
          webpUrl: "/images/experiments/cornstarch-physics-panel-2-smash.webp",
          alt: "Sketch panel 2, Fast smash, it jams. A fist hits fast and hard; a jammed cone grows down to the bowl bottom. The zoom shows grains pushed into touching contact, water that can't escape in time, and orange force chains carrying the push to the bowl bottom, so it acts like a solid until you stop pushing.",
          width: 1200,
          height: 800,
        },
      ],
      numbersNote:
        "No exact kitchen ratio needed. A good starting point is about 2 cups of cornstarch to 1 cup of water (roughly 2:1 by volume; the grains are then about 40% of the volume). Then adjust by feel: firm on a poke, still drips on a slow pour. Dense suspensions that shear-thicken hard are typically packed with a large volume fraction of grains (crowded, not watery). Feel beats measuring cups.",
      nameForThis:
        "Optional names (after the plain story): shear-thickening suspension, dilatant fluid, frictional jamming / force chains, non-Newtonian fluid, oobleck. The useful idea for a parent is the jam: hard/fast locks the grain pile; slow lets it flow.",
      goDeeper:
        "• Squeeze a ball in your fist (firm), then open your hand and watch it melt — jam on, jam off.\n• Fingertips walking across a tray: quick steps stay up; slow ones sink.\n• Compare with flour + water (different feel) or plain water (no jam).\n• Ask: did we make a new substance, or did we change how the same pile of grains rearranges?",
    },
    traps: [
      {
        wrong: "It’s a solid that turns into a liquid when you’re gentle.",
        why: "That flips the cause. Hard/fast makes it jam (solid-like); slow lets it flow (liquid-like).",
        replace: "Slow = runny. Hard smash = stiff — then it melts when you stop.",
      },
      {
        wrong: "You need an exact recipe or it won’t work.",
        why: "Feel matters more than a ratio. Proportions can be approximate. Don’t be scared to put too much cornstarch so it becomes a real solid-ish liquid; too watery just needs more Maïzena.",
        replace: "Add Maïzena until it feels fun — firm when you poke, still drips when you pour.",
      },
      {
        wrong: "We made glue / slime you can keep.",
        why: "This is a water + cornstarch suspension for play, not a craft to store. It dries out; a big blob can clog a drain.",
        replace: "Play now — scrape the bulk into the trash; a big blob can clog a sink drain.",
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
    learningGoal: "Soap can weaken the “skin” on water so floating powder suddenly rushes away.",
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
    prep: "",
    safety:
      "No tasting cinnamon water or soap. Keep soap out of eyes. Cinnamon stains light surfaces.",
    experience: "Fast payoff, easy redo — cinnamon races to the edges.",
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
    notice: [],
    stretch: "Try pepper instead of cinnamon. Pair with a longer follow-up if you need more than ~10 minutes.",
    notesFromHome: "[I will fill this after Saturday]",
    heroImageUrl: "/images/experiments/cinnamon-soap-rush-hero.png",
    gallery: [],
    featured: false,
    planUnit: "Matter & mess",
    sayThis: {},
    runThis: {
      overview: "Thin water, cinnamon dust, one soap touch at the center, optional redo.",
    },
    knowThis: {
      mechanism:
        "Bear with me. This one happens in half a second, so the sketch slows it down. For the arrows: solid orange arrows are pulls (forces), and dashed ones show which way something moves.\n\n<!-- panel:1 -->\nPanel 1, \"BEFORE: stretched skin\". On the left is the plate: a thin layer of water with cinnamon floating on top. The circle is a magnifier, and it zooms way, way in, all the way to the water molecules (\"zoom: water molecules\"). A cinnamon speck would be enormous at that scale, so it is left out of the zoom.\n\nEach blue ball is a water molecule. Water molecules pull on the neighbours right next to them. Notice the top row is just as jumbled as the rest. There is no special tidy layer at the surface.\n\nLook at the one marked \"inside: balanced\". It has neighbours all around it, so its pull arrows go every way and cancel out.\n\nNow look at the one right at the top, \"surface: none above, net pull in\". It has neighbours beside it and below it, but none above (that's air). So its pulls don't cancel. The sideways ones balance each other, and what is left over is a pull inward, into the water: the bigger arrow down.\n\nEvery molecule along the top is like that: tugged inward, with fewer friends than the ones below. (The molecules underneath push back, so nothing sinks.) So water tries to keep as few molecules at the surface as it can. It pulls its surface as small and tight as possible, like a stretched skin (\"acts like a stretched skin\"). That tightness is surface tension. Floating cinnamon just sits on that skin.\n\n<!-- panel:2 -->\nPanel 2, \"SOAP: the skin pulls away\". On the left is the plate seen from above, a second after the soap touch. The green dot in the middle is the soap. The dashed arrows point outward from it: the surface is moving out, and the cinnamon has already been carried out toward the rim.\n\nThe window on the right is a side view cut straight through the soap spot: soap molecules in the middle, clean water on both sides. The green balls with tails sitting on the surface are \"soap molecules\". Soap is a surfactant: it sits at the surface and weakens the pull there.\n\nNow look at the two black squares, one at each edge of the soap patch, right at the soap front. Each one is a little bit of surface caught in a tug of war. The short solid arrow pointing back over the soap is the pull from the soapy side: \"weak\". The long solid arrow pointing out is the pull from the clean water: \"strong\". Strong wins, so the surface slides away from the soap spot, on both sides.\n\nThe dashed arrows under the surface are the moving surface dragging the water just under it along: \"surface slides out, dragging water\". The cinnamon rides on top of that moving surface, all the way to the edges. Nothing pushes the cinnamon: not air, not the soap. The water's surface moves and carries it. (Where does that water come from? It wells up from underneath the soap spot, and a slow return flow creeps back along the bottom.)",
      panels: [
        {
          imageUrl: "/images/experiments/cinnamon-soap-rush-physics-panel-1-skin.png",
          webpUrl: "/images/experiments/cinnamon-soap-rush-physics-panel-1-skin.webp",
          alt: "Sketch panel 1, BEFORE: stretched skin. A plate of water with floating cinnamon; the zoom into water molecules shows an inside molecule with balanced pulls and a surface molecule with none above and a net pull inward, so the surface acts like a stretched skin.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/cinnamon-soap-rush-physics-panel-2-soap.png",
          webpUrl: "/images/experiments/cinnamon-soap-rush-physics-panel-2-soap.webp",
          alt: "Sketch panel 2, SOAP: the skin pulls away. Top view a second after the soap touch, with cinnamon carried out toward the rim (dashed arrows); the side view through the soap spot shows soap molecules on the surface, a weak pull on the soapy side and a strong pull from clean water, and the surface sliding out, dragging water.",
          width: 1200,
          height: 800,
        },
      ],
      numbersNote: "One tiny drop is enough. Once soap coats the whole surface, the skin is weak everywhere, so extra soap has nothing stronger to pull against. Clean water's skin pulls with about 72 millinewtons per metre; soapy water only about 25–35. That's roughly half to a third as strong: a big lopsided tug.",
    },
    traps: [
      {
        wrong: "The soap pushes the cinnamon like a tiny fan.",
        why: "You’re not seeing air push powder. You’re seeing the water’s surface rearrange when tension drops at one spot.",
        replace: "Soap weakens the skin at one spot — the stronger skin farther out pulls the surface, and the cinnamon, away.",
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
    status: "tested",
    difficulty: 3,
    ageBands: ["3-5"],
    domains: ["physics", "chemistry"],
    learningGoal:
      "Salt can melt a little ice into water; that water can freeze again around a string. A thin wire squeezed onto ice melts a path, and the copper carries the refreezing heat down to keep it going; the ice closes up behind.",
    timeMinutes: 30,
    messLevel: "high",
    location: "indoor",
    materials: [
      "FAST: salt, twine, bowl, lots of ice, spoon",
      "LONG: mini ice block, 2 closed water bottles, tray",
      "Towels",
      "Optional: food coloring; second string for no-salt comparison",
    ],
    products: [
      {
        name: "Bare copper craft wire",
        asin: "B000H5OL30",
        note: "Thin bare copper for the pressure-melt track.",
      },
    ],
    prep: "",
    safety:
      "No tasting salty ice. Wire can cut. Hanging bottles can fall. Ice is cold. Floor gets wet.",
    experience:
      "Fun. Not as entertaining as balsamic. Kid was excited explaining the wire to mom.",
    kidCanDo: [
      "Drape twine over several ice cubes in the watery bowl",
      "Sprinkle a tiny pinch of salt where string meets ice",
      "Wait ~60 seconds; pull both ends slowly",
      "Help reset after a salt dump and try again",
      "Watch the wire sink later; help remove bottles for the lift",
    ],
    adultRole: [
      "Start LONG wire with hanging bottles if running both",
      "Steer toward tiny pinch + watery bowl + slow pull",
      "Manage wet floor and towels",
      "Remove bottle weights for the wire payoff",
    ],
    steps: [
      {
        title: "LONG — Pressure melting setup",
        detail:
          "Ice block on an inverted container inside a tray. Bare copper wire across the TOP of the ice. Hang a closed water bottle from EACH end. Leave 1–2 hours. Kid fishes while waiting.",
      },
      {
        title: "FAST — Salt ice fishing",
        detail:
          "Bowl with water + lots of fresh ice. Drape twine over several cubes. Tiny pinch of salt where string touches ice. Wait ~60 seconds. Pull both ends slowly — cluster catch is the win.",
      },
      {
        title: "FAST — If fishing fails",
        detail:
          "Too much salt = puddle. No water or a fast pull usually fails. Reset and try again.",
      },
      {
        title: "LONG — Wire payoff",
        detail:
          "Wire sinks; ice can refreeze above. Remove bottles. Lift the ice by both wire ends.",
      },
    ],
    notice: [],
    stretch:
      "Food-coloring tunnels on a salted cube. Leave the wire longer and compare groove depth. Side-by-side: dry tray fishing vs watery bowl fishing.",
    notesFromHome:
      "Needs water. Trial and error. The kid can dump salt everywhere — that was fine.\n\nAbout 1/4 of the attempts worked until we got it. Best recipe: a ton of fresh ice in a ton of water, string over many cubes, catch ~5 pulling slowly. Got smoked. Kid was excited.\n\nCopper wire is the long game (~2 hours). Give the kid a fishing mission while it runs. Fun beat: remove the weights, pick up the ice holding both ends of the wire. Kid was excited explaining the wire to mom.\n\nFun. Not as entertaining as balsamic.",
    ranOn: "2026-09-12",
    heroImageUrl: "/images/experiments/salt-ice-fishing-catch.png",
    gallery: [],
    featured: false,
    planUnit: "Water & weather",
    sayThis: {},
    runThis: {
      overview:
        "Two tracks on one morning. Start the LONG wire first if you want both.",
      tracks: [
        {
          label: "FAST",
          title: "Salt ice fishing",
          imageUrl: "/images/experiments/salt-ice-howto-fishing.png",
          blurb:
            "String + tiny salt + wait ~60s + pull slow. Needs water and lots of ice.",
        },
        {
          label: "LONG",
          title: "Pressure melting",
          imageUrl: "/images/experiments/salt-ice-wire-groove.png",
          blurb:
            "Copper wire + bottle weights. Squeeze + copper melt a path; ice freezes again behind. ~1–2 hours.",
        },
      ],
    },
    knowThis: {
      mechanism:
        "Two different mechanisms on one morning. The sketch has one panel for each. Bear with me, I'm going to over explain both.\n\nThe little key in the top-left corner of each panel tells you the colours. Ice is white with light hatching, water is blue, salty water is teal, and new ice (ice that just froze) is white with an orange outline. For the arrows: dotted orange is heat, dashed is something moving, and solid is a push (a force).\n\n<!-- panel:1 -->\nPanel 1, \"FAST: salt ice hug\". On the left is the bowl: water with lots of ice cubes floating in it, the string draped over them, and a \"tiny pinch of salt\" where the string touches a cube. The cubes float mostly under water, with just their tops out. The circle is a magnifier on that spot.\n\nThe window on the right is a slice through the string lying on top of a cube. Above is air. The string is the bundle of tan circles, its fibres cut across. Under it is a thin wet film on the ice, drawn much thicker than it really is so you can see its colour.\n\nFrame ①. Salt sits in the film, next to the string. Salt melts a thin bit of ice: see the teal dip under the string, \"salty water melts ice\". Melting takes heat. The salty spot pulls that heat from whatever it touches, the ice under it and around it. That is what the dotted arrows show, \"heat soaks in\". So that little spot ends up colder than ordinary freezing, below 0 °C. (If you want the name: freezing-point depression. Salty water stays liquid below 0 °C.)\n\nFrame ②. The dashed arrows run sideways inside the film, away from the string: \"salt spreads away\". The salt spreads out into the water around it. Now the water right at the string is much less salty, so its freezing point climbs back up toward 0 °C. But the spot is still colder than that, so it freezes.\n\nThat is the white ice with the orange outline, \"new ice grips string\". It fills the dip where the meltwater was and wraps around the bottom of the fibres, locking them in. That is the ice hug, and why you can lift a cube by the string.\n\nThat is also why the steps matter. A tiny pinch is enough. A mountain of salt keeps everything salty, so it just digs a puddle and nothing refreezes. Water in the bowl helps, because cubes stay wetter at the contact line. Draping over many cubes raises the odds. Pulling slowly keeps fresh ice bridges from snapping.\n\n<!-- panel:2 -->\nPanel 2, \"LONG: wire squeeze\". On the left, the ice block sits on an upside-down container, with the copper wire across it and a bottle hanging from each end (\"bottles hang\"). The wire has already sunk partway in, and the orange line above it is the path it left. The magnifier is on the wire. The window on the right is a slice across the wire, deep in the ice.\n\nThe big solid arrow is the \"bottles pull\": the bottles squeeze the wire down onto the ice under it. That squeeze lowers ice's melting point, just a tiny bit. It works only because ice in a kitchen is already sitting right at 0 °C, so even a tiny nudge tips it over. Two water bottles on a thin wire press with a few atmospheres, which lowers the melting point by only a few hundredths of a degree. That is enough for the ice right under the wire to turn to water: the thin blue film, \"squeeze: melts\".\n\nThe dashed arrows show that water slipping around both sides of the wire to the top (\"water slips around\"). Up there it isn't squeezed anymore, so it freezes again: the white strip with orange edges, \"refreezes above\". The wire sinks, and the block closes up behind it. The block can stay one piece even after the wire is all the way through.\n\nHere is the part that is easy to miss. Melting ice takes heat, so where does the heat come from? Water gives off heat when it freezes. The dotted arrow inside the wire shows that heat, from the refreezing on top, traveling down through the copper to melt the next bit underneath (\"heat flows down the copper\"). Copper is great at carrying heat, and that is why it works. Warm room air leaking in along the wire helps a little too. A string would barely cut, because it doesn't carry heat.\n\nRoom-temperature copper is not a hot knife. It is a heat bridge from the top of the wire to the bottom. (If you want the name: regelation.)",
      panels: [
        {
          imageUrl: "/images/experiments/salt-ice-fishing-physics-panel-1-salt-hug.png",
          webpUrl: "/images/experiments/salt-ice-fishing-physics-panel-1-salt-hug.webp",
          alt: "Sketch panel 1, FAST: salt ice hug. A string over ice cubes in a bowl with a tiny pinch of salt; the zoom shows salty water melting a dip in the ice under the string while heat soaks in (dotted arrows), then the salt spreading away and new ice gripping the string. Colour key: ice, water, salty water, new ice.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/salt-ice-fishing-physics-panel-2-wire.png",
          webpUrl: "/images/experiments/salt-ice-fishing-physics-panel-2-wire.webp",
          alt: "Sketch panel 2, LONG: wire squeeze. A copper wire across an ice block with a bottle hanging from each end; the cross-section shows the bottles pulling the wire down, the squeezed ice under it melting, water slipping around to refreeze above, and heat flowing down through the copper.",
          width: 1200,
          height: 800,
        },
      ],
      goDeeper:
        "No-salt vs salt string side by side in the same watery bowl. Try nylon fishing line vs cotton twine. Our guess: smooth nylon gives the new ice less to grip (no fuzzy fibres), so it slips out more often. Test it!",
      numbersNote:
        "Wait ~60 seconds after a tiny pinch of salt. Exact grams don’t matter; “tiny pinch” does. Wire can take on the order of 1–2 hours with bottle weights at kitchen temperature. The squeeze only lowers ice's melting point by about 0.0074 °C per atmosphere of pressure; a couple of bottles on a thin wire make a few atmospheres, so a few hundredths of a degree. That's tiny, which is why the heat carried by the copper matters. For scale on the salt side: sea water (about 3.5% salt) freezes at about −1.9 °C, and the saltiest salt water stays liquid down to about −21 °C.",
    },
    traps: [
      {
        wrong: "Salt makes the string sticky so it grabs the ice.",
        why: "Salt isn’t glue. It melts a thin bit of ice, and melting chills that spot below ordinary freezing. Once the salt spreads away, the chilled water refreezes around the string.",
        replace:
          "Salt melts a little ice into water. That melting chills the spot, and when the salt spreads away the water freezes around the string — an ice hug.",
      },
      {
        wrong:
          "The wire is hot, so it melts through like a knife, and of course the ice falls apart.",
        why: "Room-temperature wire isn’t a heated knife. The squeeze lowers the melting point a tiny bit so ice under the wire melts; the water refreezes above, and the heat from that refreezing flows down the copper to melt more. So the block may stay one piece.",
        replace:
          "The bottles squeeze a thin line. The ice under the wire melts, slips around, and freezes again on top — and the copper carries that freezing heat down to melt the next bit.",
      },
    ],
  },
  {
    id: "baking-soda-volcano",
    title: "Baking-soda volcano",
    status: "winner",
    difficulty: 1,
    ageBands: ["1-2", "3-5"],
    domains: ["chemistry"],
    learningGoal:
      "Vinegar and baking soda make a gas (bubbles) that can push liquid up and out of a glass.",
    timeMinutes: 30,
    messLevel: "high",
    location: "indoor",
    materials: [
      "Dish soap (small squeeze)",
      "Spoon",
      "Towels",
    ],
    products: [
      {
        name: "Arm & Hammer Baking Soda, 1 lb",
        asin: "B000PYF8VM",
        note: "~3 Tbsp per round (eyeball).",
      },
      {
        name: "Heinz Distilled White Vinegar, 1 gallon",
        asin: "B000RO08L0",
        note: "Plain white is easiest to clean (no sugar/dye). Any white vinegar works.",
      },
      {
        name: "365 Plant-Based Food Coloring (4 bottles)",
        asin: "B07G2Z6CLG",
        note: "Optional color for the foam.",
      },
      {
        name: "Stainless steel kitchen funnel set",
        asin: "B0DDKL857F",
        note: "To pour into a bottle opening — not as the volcano itself.",
      },
      {
        name: "Libbey City Tumbler glasses (14.3 oz, set of 8)",
        asin: "B07BMFJ4KB",
        note: "Tall clear vessel. You only need one.",
      },
      {
        name: "Nordic Ware Baker's Half Sheet",
        asin: "B00SRSP9VM",
        note: "Rimmed sheet under the volcano. Any tray with sides works.",
      },
    ],
    prep: "",
    safety:
      "Taste ban. Vinegar sting in eyes — wipe spills. Keep soap out of eyes. Food coloring stains. Floor gets wet and slippery.",
    experience:
      "Tonight the 3yo asked to do more volcanos — we did. The 1yo happy-screamed every eruption.",
    kidCanDo: [
      "Pour a small squeeze of dish soap and food coloring",
      "Do the last pour/scoop",
      "Watch the fizz climb and overflow",
    ],
    adultRole: [
      "Set the tray and tall glass (or baby bottle)",
      "Keep amounts in range (~3 Tbsp soda, small squeeze of dish soap, ~1 cup vinegar)",
      "Manage towels and wet floor",
      "Save the last round for the kid",
    ],
    steps: [
      {
        title: "Glass + baking soda",
        detail: "Glass on tray; ~3 Tbsp baking soda (eyeball).",
      },
      {
        title: "Dish soap + color",
        detail: "Small squeeze of dish soap, then food coloring. He pours both.",
      },
      {
        title: "Vinegar pour",
        detail: "~1 cup vinegar (eyeball). Watch the fizz climb and overflow.",
      },
      {
        title: "Reset and save the last for the kid",
        detail: "Reset and repeat. Save the last “everything” pour for the kid.",
      },
    ],
    notice: [],
    stretch:
      "Catch overflow on the tray and ask whether the foam is “new stuff” or the same vinegar/soda mix with gas holes in it.",
    notesFromHome:
      "Tonight the 3yo asked to do more volcanos — we did; he liked it. The 1yo was screaming (happily) at every eruption.\n\nBest was a tall transparent glass on a glass tray. He pours dish soap and coloring after the baking soda. He loved it — especially the last run with everything: all the color, all the vinegar, all the baking soda. Trying the funnel as the volcano didn’t work well; funnel is helpful to pour. Recipe each time: ~3 tablespoons baking soda, a small squeeze of dish soap, ~1 cup vinegar (a little eyeball). Let the kid do it at the end. Went through a bottle of white vinegar and baking soda. Any vinegar would probably work, but pure white vinegar doesn’t have sugar or color — easier to clean. Tried a baby bottle — works well with the opening a little smaller than the base.",
    heroImageUrl: "/images/experiments/baking-soda-volcano-overflow.png",
    // Step photos live only on runThis.tracks. Main listed the same three
    // paths in gallery too, which doubled them under Notes / Experience.
    gallery: [],
    featured: false,
    planUnit: "Matter & mess",
    ranOn: "2026-09-19",
    sayThis: {},
    runThis: {
      overview: "Repeat on a tray; save the last “everything” pour for the kid.",
      tracks: [
        {
          label: "SODA",
          title: "Baking soda in the glass",
          imageUrl: "/images/experiments/baking-soda-volcano-soda.png",
          blurb: "Tall glass on the tray. About 3 tablespoons baking soda (eyeball).",
        },
        {
          label: "SOAP",
          title: "Dish soap + color",
          imageUrl: "/images/experiments/baking-soda-volcano-soap-color.png",
          blurb: "Small squeeze of dish soap, then food coloring. He pours both.",
        },
        {
          label: "VINEGAR",
          title: "Pour and watch",
          imageUrl: "/images/experiments/baking-soda-volcano-vinegar.png",
          blurb: "About 1 cup vinegar. Watch the fizz climb and overflow.",
        },
      ],
    },
    knowThis: {
      mechanism:
        "Bear with me as I over explain this one, with the sketch. The orange arrows in both panels are dashed. Dashed means something is moving (here, bubbles and foam going up), not a push.\n\n<!-- panel:1 -->\nPanel 1, \"Acid + baking soda → CO₂ gas\". On the left is the glass on the tray. The baking soda is in the bottom, vinegar is pouring in from the cup, and the first bubbles are already showing at the powder. The circle is a magnifier. The big window on the right is that spot, zoomed way in. It is not to scale; the grains and bubbles are drawn big enough to see.\n\nThe cream chunks sitting on the bottom are baking soda grains. Baking soda is sodium bicarbonate. The pale blue all around them is the vinegar: mostly water, with a weak acid dissolved in it, acetic acid. That is why the label says \"vinegar (water + acid)\".\n\nWhen the acid touches a grain, it hands the bicarbonate a hydrogen ion (a proton, H⁺). The piece that makes is carbonic acid, and it is unstable. It falls apart right away into water and carbon dioxide. That is the panel 1 caption: \"The result (carbonic acid) splits into water + CO₂.\"\n\nAt first that CO₂ is dissolved in the liquid, like the fizz in a closed soda bottle. Very quickly there is more than the liquid can hold, so it comes out as bubbles. Bubbles start most easily on rough surfaces. Look where the white bubbles are in the zoom: sitting on the grains (\"new CO₂ bubble\"). Bubbles pop out all over the powder, on the grains' rough surfaces, within a few seconds.\n\nWhen a bubble gets big enough, it lets go and rises. That is what the short dashed arrows pointing up show. The gas is carbon dioxide: the same molecule as the bubbles in soda pop, and part of what we breathe out.\n\n<!-- panel:2 -->\nPanel 2, \"Foam = liquid stretched around gas\". On the left, the glass has filled with foam. It domes over the rim and runs down onto the tray (the dashed arrow: \"foam climbs\"). At the very bottom of the glass, under the foam, there is a thin layer of clear liquid. That is liquid that has already drained back down out of the foam. The zoom on the right is a piece of that foam at the rim.\n\nLook at what the foam is made of. Big white bubbles of CO₂ gas crowd together in the liquid. Where two bubbles nearly touch, the liquid between them is only a thin wall (\"thin liquid wall\"). That liquid is the same liquid that was in the glass: vinegar water, with the leftovers of the reaction dissolved in it. Nothing new and gooey was made. The same liquid got stretched around a lot of gas.\n\nGas takes a lot of room. With this recipe the reaction makes about ten times the glass's volume in gas, so the foam has to climb the glass and spill onto the tray. Nothing “turns into lava.”\n\nThe circle at the top right of that zoom zooms in once more, onto one wall: \"water\" in the middle, \"gas\" on both sides. The little green dots with tails, lined up on both faces, are the \"soap molecules\". Each one has its head in the water and its tail sticking out into the gas. That is all the dish soap does. It makes no extra gas. It sits on the walls and helps them last before they pop, so the foam gets thicker and climbs higher.\n\nSo, in one line: an acid–base reaction (bicarbonate + acetic acid) makes carbon dioxide gas inside the liquid, and the liquid gets stretched into foam around it.",
      panels: [
        {
          imageUrl: "/images/experiments/baking-soda-volcano-physics-panel-1-fizz.png",
          webpUrl: "/images/experiments/baking-soda-volcano-physics-panel-1-fizz.webp",
          alt: "Sketch panel 1, Acid plus baking soda makes CO2 gas. Vinegar pours onto baking soda in a glass on a tray; the zoom shows baking soda grains in vinegar (water plus acid) with new CO2 bubbles forming on the grains and dashed arrows as bubbles rise.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/baking-soda-volcano-physics-panel-2-foam.png",
          webpUrl: "/images/experiments/baking-soda-volcano-physics-panel-2-foam.webp",
          alt: "Sketch panel 2, Foam is liquid stretched around gas. Foam climbs out of the glass (dashed arrow); the zoom shows CO2 gas bubbles crowded in the liquid with thin liquid walls, and a close-up of one wall with soap molecules lined up on both faces, water in the middle and gas on each side.",
          width: 1200,
          height: 800,
        },
      ],
      goDeeper:
        "Touch the glass: it gets a few degrees cooler, because this reaction soaks up heat. The gas itself is invisible and has no smell; the sharp smell is the vinegar. The spill is leftover liquid + bubbles. Dish soap does not make more CO₂ — it helps bubbles last longer so the foam looks thicker (surfactant). Grocery white vinegar is usually about 5% acetic acid (roughly 5 g per 100 mL); the rest is water. That is plenty for this demo. (Cleaning vinegar can be 8–14%: stronger fizz, more sting in eyes.)",
      numbersNote:
        "Reaction: NaHCO₃(s) + CH₃COOH(aq) → CH₃COONa(aq) + H₂O(l) + CO₂(g). In words: bicarbonate + acetic acid → acetate salt + water + carbon dioxide gas. The gas is what you see as fizz and foam. With this recipe (3 Tbsp baking soda, 1 cup vinegar) the vinegar runs out first and makes about 5 litres of CO₂, around ten times the volume of the glass. That's why it has to come over the top. Keep formulas off the kid table unless they ask — the plain story is enough for ages 1–5.",
    },
    traps: [
      {
        wrong: "The vinegar turns into lava.",
        why: "Nothing melts. You’re making gas bubbles in liquid; the “eruption” is foam overflowing.",
        replace:
          "You’re making gas bubbles in liquid. The overflow is foam, not lava.",
      },
      {
        wrong: "Food coloring makes it explode harder.",
        why: "Color rides in the foam. More gas only comes from more vinegar. With this recipe the baking soda is already left over. (Extra powder can make it fizz a bit faster, but it can't make more gas.)",
        replace:
          "More gas only comes from more vinegar. With this recipe the baking soda is already left over. (Extra powder can make it fizz a bit faster, but it can't make more gas.)",
      },
      {
        wrong: "A funnel is the volcano.",
        why: "Using the funnel as the vessel didn’t work well — tall glass or baby bottle on a tray was better. A funnel is handy to pour soda/vinegar into a narrow opening.",
        replace:
          "Use a tall glass or baby bottle on a tray. The funnel is for pouring, not the volcano.",
      },
    ],
  },
  {
    id: "water-bottle-rocket",
    title: "Water-bottle rocket",
    status: "planned",
    difficulty: 2,
    ageBands: ["1-2", "3-5"],
    domains: ["physics"],
    learningGoal:
      "Pressurized air pushes water out the nozzle; the bottle goes the other way (reaction force).",
    timeMinutes: 25,
    messLevel: "medium",
    location: "outdoor",
    materials: [
      "Empty 1–2 L plastic soda bottle",
      "Bike pump (or dedicated bottle-rocket pump)",
      "Cork / launcher that seals the bottle neck under pressure",
      "Water (~⅓ bottle)",
      "Optional cardboard fins + simple launch stand",
      "Eye protection for the person pumping",
    ],
    prep: "Open outdoor space clear of cars, windows, and overhead people. Fill bottle to about one-third with water. Fit seal/launcher before kids gather.",
    safety:
      "Carbonated-soda (PET) bottles only, no dents or deep scratches. Not still-water bottles, not glass. Stop pumping at about 40–60 psi on the gauge: a cork usually pops before that; a latch won't, so release it by then. Pump from the end of the hose, not over the bottle. If it doesn't launch, stop pumping and wait a minute (a cork often works loose on its own). Then let the air out at a valve if you have one. If not, reach in from the side, head clear of the top, and pull the cork or trip the latch. It will launch. Adult pumps and releases. Point launch away from faces and windows. Stop if the seal leaks hard or the bottle creaks oddly. Wet ground gets slippery.",
    experience:
      "Kid-requested outdoor rocket: bottle, water, pump — count down, launch, chase the splash, refill and go again.",
    kidCanDo: [
      "Count aloud while the adult pumps (3–5)",
      "Watch from the side, then chase the splash after it launches",
      "Help pick less water or more water for the next run",
    ],
    adultRole: [
      "Fill, seal, pump, and release — kids do not hold a pressurized bottle",
      "Point the launch away from faces, windows, and cars",
      "Wear eye protection while pumping",
      "Refill between runs",
    ],
    steps: [
      {
        title: "Fill",
        detail: "Fill the bottle about one-third with water; leave the rest as air.",
      },
      {
        title: "Seal",
        detail:
          "Seat the cork or launcher seal in the neck; set the bottle on the pad neck-down, nose pointing up (or slightly tipped away from people).",
      },
      {
        title: "Pump",
        detail: "Adult pumps air into the headspace, standing back at the end of the hose. Kids count aloud. Watch the gauge: stop around 40–60 psi.",
      },
      {
        title: "Launch",
        detail:
          "The cork usually pops before 60 psi; with a latch, release it by then. Water shoots down and out; the bottle goes up. If nothing happens, stop pumping and wait a minute. Then let the air out at a valve if you have one; if not, reach in from the side, head clear of the top, and pull the cork or trip the latch. It will launch.",
      },
      {
        title: "Compare",
        detail:
          "Fetch, rinse if needed, refill, repeat. Try one run with less water and one with more — compare height.",
      },
    ],
    notice: [],
    stretch:
      "Same pressure, different water fractions — which goes highest? Add cardboard fins — does it fly straighter?",
    notesFromHome: "[I will fill this after Saturday]",
    heroImageUrl: null,
    gallery: [],
    featured: false,
    planUnit: "Forces & motion",
    plannedFor: "2026-10-03",
    sayThis: {},
    runThis: {
      overview:
        "Fill, seal, pump until it pops free (or you reach ~60 psi and release), watch the water jet and the bottle climb, then reset.",
      setup:
        "Outside on open ground. Bottle on launcher / cork seated firmly. Audience off to the side, not under the path.",
    },
    knowThis: {
      mechanism:
        "Bear with me. The rocket gets three panels, because it has three moments: pump, go, fly. For the arrows: solid orange arrows are pushes (forces), and the dashed one shows which way the bottle moves.\n\n<!-- panel:1 -->\nPanel 1, \"PUMP: squeeze the air\". On the left, the bottle stands on the launcher \"neck down, nose up\", about a third full of water. The bike pump sits on the ground beside it, connected by a hose. The zoom is the bottle itself. At the bottom, the cork sits in the neck (\"cork seals it\"), with the pump tube coming up through it. When you pump, the new air comes in at the bottom and bubbles up through the water (\"pump air bubbles up\") into the space above.\n\nThat space is the \"packed air: high pressure\". Look at the dots, one for a bit of air. Inside the bottle they are packed much closer together than in the outside air around it. More air squeezed into the same space means higher pressure.\n\nThe short solid arrows show that squeezed air pushing on every wall: up on the top, out on the sides, down on the water. The water passes the push on to every wall it touches, and down onto the cork: see the arrow in the neck, pressing on the cork. The only way out is the neck, and the cork holds it shut. For now.\n\n<!-- panel:2 -->\nPanel 2, \"GO: a push pair\". This is \"just after release\". The cork has let go, and a fast jet of water is shooting down out of the neck. On the left, the dashed arrow beside the bottle shows it starting to move up.\n\nIn the zoom, look at the two big solid arrows. One points down in the neck: \"bottle pushes water down\". The other points up beside the bottle: \"water pushes bottle up\". By \"bottle\" here I mean the bottle together with the squeezed air inside it. Together they're the rocket. (It is really that squeezed air doing the shoving: it pushes the water out of the neck, and it pushes up on the inside of the dome, with nothing to push back at the open neck.)\n\nForces come in pairs (Newton’s third law). Those two are the same size and point opposite ways, and they act on different things: one on the water, one on the rocket. That is why they don't cancel. The water gets shoved down, and the rocket gets shoved up.\n\nNow look at the air at the top: \"air expands: pressure drops\". Its dots are more spread out than in panel 1, but still packed tighter than outside: it's the same air, with more room. As water leaves, the air gets more room, so it spreads out and its push gets weaker. The squeezed air is what drives the whole thing, and it fades as it goes.\n\nWhy bother with water at all? The squeezed air holds a fixed amount of energy. Spend it throwing a light puff of air, and most of it goes into making that puff very fast, which gives little push. Spend it throwing heavy water at a more moderate speed, and the energy gives a much bigger total push. That's why a water-filled rocket climbs higher than an air-only blast from the same bottle. That holds even though the air-only bottle, pumped to the same pressure, holds more squeezed air (about half as much energy again). It still gives several times less push.\n\n<!-- panel:3 -->\nPanel 3, \"FLIGHT: forces on the bottle\". Three dashed boxes, in order (the small arrows between them). Each box shows only the forces on the bottle (and whatever water is still inside it). Not to scale.\n\nWeight always pulls down. Drag is the air resisting the motion. The bottle is going up, so drag points down too.\n\n\"water burst\": the big thrust arrow up. That is the water being thrown out of the neck, from panel 2.\n\n\"air puff\": the water is gone. The leftover squeezed air rushes out, one last short puff, so there's a small thrust arrow.\n\n\"coasting up\": \"no thrust\". It keeps rising only because it is already moving. Once the water is gone, the bottle is far lighter, and drag becomes the big brake. Weight and drag slow it down, then it falls.",
      panels: [
        {
          imageUrl: "/images/experiments/water-bottle-rocket-physics-panel-1-pump.png",
          webpUrl: "/images/experiments/water-bottle-rocket-physics-panel-1-pump.webp",
          alt: "Sketch panel 1, PUMP: squeeze the air. The bottle stands neck down, nose up on the launcher, about a third full of water, with a bike pump beside it. The zoom shows pump air bubbling up through the water into packed, high-pressure air, with short arrows pushing on every wall and down on the cork that seals the neck.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/water-bottle-rocket-physics-panel-2-push-pair.png",
          webpUrl: "/images/experiments/water-bottle-rocket-physics-panel-2-push-pair.webp",
          alt: "Sketch panel 2, GO: a push pair. Just after release a water jet shoots down out of the neck and a dashed arrow shows the bottle starting up. The zoom shows two equal, opposite arrows: the bottle pushes water down, the water pushes the bottle up; the air at the top expands and its pressure drops.",
          width: 1200,
          height: 800,
        },
        {
          imageUrl: "/images/experiments/water-bottle-rocket-physics-panel-3-flight.png",
          webpUrl: "/images/experiments/water-bottle-rocket-physics-panel-3-flight.webp",
          alt: "Sketch panel 3, FLIGHT: forces on the bottle. Three boxes in order: water burst, with a big thrust arrow up and weight and drag down; air puff, with a small thrust arrow; coasting up, with no thrust, only weight and drag. Not to scale.",
          width: 1200,
          height: 800,
        },
      ],
      goDeeper:
        "Momentum: thrust lasts only while mass is leaving the nozzle — and it fades as the air expands and its pressure drops, which is why how much water you put in matters. Nozzle size and seal quality change how fast pressure dumps. Real water rockets often use a launch tube so the bottle stays aimed until it clears the pad.",
      nameForThis:
        "Reaction force / Newton’s third law; momentum conservation; pressurized gas doing work on a fluid.",
    },
    traps: [
      {
        wrong: "The air blows the bottle up like a balloon floating.",
        why: "The bottle is not buoyant flight. Thrust comes from shoving water (mass) downward.",
        replace: "",
      },
      {
        wrong: "Air-only launches are the same.",
        why: "The squeezed air holds a fixed amount of energy. Spent throwing a light puff of air, most of it goes into making the puff very fast, which gives little push. Spent throwing heavy water, the same energy gives a much bigger total push.",
        replace: "",
      },
      {
        wrong: "Kids can hold it while you pump.",
        why: "When the seal pops, the bottle and cork move fast. Adult owns the pressurized hardware.",
        replace: "",
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
