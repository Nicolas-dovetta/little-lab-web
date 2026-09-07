export type ExperimentSeed = {
  id: string;
  title: string;
  status: "tested" | "winner" | "draft" | "idea";
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
    status: "tested",
    ageBands: ["3-5"],
    domains: ["physics"],
    learningGoal:
      "Liquids and objects settle based on density — heavier (denser) things sink, lighter ones float. Salt water can change whether an egg sinks or floats.",
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
      "Pour honey, water, oil, and balsamic into clear glasses and watch them stack or dance. Then try an egg in plain water vs salty water — it sinks, then floats. The balsamic-on-oil bubbles that sink and climb back up are the crowd favorite.",
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
      "Ask curiosity questions: Why did that sink? What if we add more salt?",
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
          "Drip balsamic vinegar onto the oil layer. Watch blobs form, sink through the oil, then climb back up in little bubbles. This was the hit with our 3-year-old — do it more than once.",
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
      "Salt amounts matter: keep adding until the egg floats.",
      "Mess level is high — tray + towels make it manageable.",
    ],
    stretch:
      "Try warm vs cold water, sugar instead of salt, or small toys (grape, cork, coin). Draw the layers afterward. Older kids can predict before pouring.",
    notesFromHome:
      "Real home run with a 3-year-old: egg sinks in plain water, floats after heavy salt. Honey sinks, oil floats. Balsamic on oil makes bubbles that sink then climb — that was the hit. Whole session ~1 hour. Worth the mess.",
    heroImageUrl: null,
    gallery: [
      "/images/experiments/density-layers-glasses.png",
      "/images/experiments/density-layers-poster.png",
    ],
    featured: true,
  },
  {
    id: "sink-or-float",
    title: "Sink or Float",
    status: "winner",
    ageBands: ["1-2", "3-5"],
    domains: ["physics"],
    learningGoal: "Some objects sink and some float — mass and shape both matter, and guessing is part of the fun.",
    timeMinutes: 25,
    messLevel: "medium",
    location: "indoor",
    materials: [
      "Large clear bin or sink of water",
      "Assorted household objects (cork, spoon, leaf, toy, coin, sponge)",
      "Towel",
      "Optional: sorting mat with Sink / Float labels",
    ],
    prep: "Fill a bin halfway. Gather 8–12 safe objects. Lay a towel under the bin.",
    safety: "Water play needs eyes-on supervision. No small choking hazards for under-3s. Wipe floors.",
    experience: "Guess, drop, watch, sort. Repeat with new objects until interest fades.",
    kidCanDo: ["Pick an object", "Guess sink or float", "Drop it in", "Help sort into piles"],
    adultRole: ["Supervise water", "Ask for predictions", "Name what happened without lecturing"],
    steps: [
      { title: "Gather & guess", detail: "Line up objects. Kid guesses sink or float for each." },
      { title: "Test one by one", detail: "Drop, watch, place on Sink or Float mat." },
      { title: "Talk for 10 seconds", detail: "Heavy? Hollow? Flat? Then move on — keep it playful." },
    ],
    notice: ["Works from toddler age up.", "Short sessions beat long lectures."],
    stretch: "Try salt water or soapy water. Freeze a toy in ice and watch it float while melting.",
    notesFromHome: "Reliable winner. Low prep, high engagement, easy to repeat in the bath.",
    heroImageUrl: null,
    gallery: [],
    featured: false,
  },
  {
    id: "cornstarch-thickening-fluid",
    title: "Cornstarch thickening fluid (Maïzena)",
    status: "tested",
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
    status: "winner",
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
    id: "shadow-puppets",
    title: "Shadow Puppets",
    status: "draft",
    ageBands: ["3-5"],
    domains: ["light", "art"],
    learningGoal: "Light travels in straight lines; blocking it makes shadows you can shape and move.",
    timeMinutes: 20,
    messLevel: "low",
    location: "indoor",
    materials: ["Flashlight or phone light", "Blank wall", "Hands or cut paper shapes", "Optional: cardboard and tape"],
    prep: "Dim the room. Clear a wall. Charge the flashlight.",
    safety: "Do not shine lights into eyes. Supervise scissors if cutting shapes.",
    experience: "Make animals with hands, grow and shrink shadows by moving closer or farther.",
    kidCanDo: ["Make hand shapes", "Move closer/farther", "Invent a tiny story"],
    adultRole: ["Hold the light steady", "Model a few classic shapes", "Keep the story silly"],
    steps: [
      { title: "Darken & aim", detail: "Point light at a blank wall." },
      { title: "Hand animals", detail: "Try dog, bird, crab. Kid copies." },
      { title: "Size play", detail: "Move hands toward the light to make huge shadows." },
    ],
    notice: ["Still being polished — works great at bedtime."],
    stretch: "Trace shadows on big paper. Compare morning vs afternoon outdoor shadows.",
    notesFromHome: "Draft favorite for rainy evenings. Needs a better cut-out kit someday.",
    heroImageUrl: null,
    gallery: [],
    featured: false,
  },
  {
    id: "ice-paint",
    title: "Ice Paint",
    status: "idea",
    ageBands: ["1-2", "3-5"],
    domains: ["art", "chemistry"],
    learningGoal: "Ice melts into color — temperature and time change the art as you go.",
    timeMinutes: 30,
    messLevel: "high",
    location: "outdoor",
    materials: ["Ice cubes", "Food coloring or liquid watercolors", "Paper", "Tray", "Optional: salt"],
    prep: "Freeze colored water in ice trays with craft sticks, or drip color onto plain ice at play time.",
    safety: "Food-safe colors if tasting is likely. Outdoor or covered surfaces preferred.",
    experience: "Paint with melting colored ice on paper or sidewalk.",
    kidCanDo: ["Hold ice sticks", "Swipe across paper", "Sprinkle salt and watch melt paths"],
    adultRole: ["Set up tray", "Manage drips", "Photograph the melt art"],
    steps: [
      { title: "Set paper on tray", detail: "Give each kid a sheet." },
      { title: "Paint with ice", detail: "Swipe, stamp, and watch puddles form." },
    ],
    notice: ["Idea stage — great summer outdoor activity."],
    stretch: "Compare melt speed with and without salt.",
    notesFromHome: "",
    heroImageUrl: null,
    gallery: [],
    featured: false,
  },
  {
    id: "sound-shakers",
    title: "Sound Shakers",
    status: "idea",
    ageBands: ["1-2", "3-5"],
    domains: ["sound", "music"],
    learningGoal: "Different fillings make different sounds — ears can sort loud, soft, scratchy, and thumpy.",
    timeMinutes: 20,
    messLevel: "low",
    location: "indoor",
    materials: ["Empty spice jars or bottles with lids", "Rice, beans, pasta, beads", "Tape to seal"],
    prep: "Pre-fill a few jars if toddlers will struggle with pouring.",
    safety: "Seal lids tightly (tape). No loose small parts for under-3 unsupervised.",
    experience: "Shake, compare, dance, match sounds with eyes closed.",
    kidCanDo: ["Pour fillings (older)", "Shake and listen", "Guess what is inside"],
    adultRole: ["Seal jars", "Lead listening games"],
    steps: [
      { title: "Fill & seal", detail: "Different materials in each jar." },
      { title: "Sound hunt", detail: "Find the quietest / loudest / scratchiest." },
    ],
    notice: ["Idea — pairs well with a dance break."],
    stretch: "Record sounds on a phone and play matching games later.",
    notesFromHome: "",
    heroImageUrl: null,
    gallery: [],
    featured: false,
  },
  {
    id: "magnet-hunt",
    title: "Magnet Hunt",
    status: "idea",
    ageBands: ["3-5"],
    domains: ["physics"],
    learningGoal: "Some materials are magnetic and some are not — testing is how scientists find out.",
    timeMinutes: 25,
    messLevel: "low",
    location: "indoor",
    materials: ["Strong fridge magnet or wand", "Assorted metal and non-metal objects", "Two bowls: Yes / No"],
    prep: "Hide a few magnetic objects around a safe room, or set a tabletop sorting tray.",
    safety: "Keep small magnets away from mouths. Not for under-3 unsupervised. Never swallow magnets.",
    experience: "Hunt and sort: sticks or does not stick.",
    kidCanDo: ["Test objects", "Sort into bowls", "Hunt for hidden magnetic items"],
    adultRole: ["Screen for unsafe magnets", "Celebrate surprises (foil vs steel)"],
    steps: [
      { title: "Demo stick / no-stick", detail: "Show spoon vs wooden block." },
      { title: "Hunt or sort", detail: "Kid tests a pile or finds hidden items." },
    ],
    notice: ["Idea — keep magnets large and supervised."],
    stretch: "Try through paper, water, or a thin cloth.",
    notesFromHome: "",
    heroImageUrl: null,
    gallery: [],
    featured: false,
  },
  {
    id: "pour-station",
    title: "Pour Station",
    status: "idea",
    ageBands: ["1-2", "3-5"],
    domains: ["motor", "math"],
    learningGoal: "Pouring builds control, patience, and early volume sense — full, empty, more, less.",
    timeMinutes: 20,
    messLevel: "high",
    location: "either",
    materials: ["Bin of water or dry rice", "Cups, funnels, spoons", "Towel / outdoor spot"],
    prep: "Set up over a towel or outside. Limit water depth for toddlers.",
    safety: "Constant supervision with water. No deep bins for young toddlers.",
    experience: "Pour, spill, refill, repeat — the work is the point.",
    kidCanDo: ["Pour cup to cup", "Use funnel", "Feel full vs empty"],
    adultRole: ["Contain the mess zone", "Offer new tools slowly"],
    steps: [
      { title: "Invite", detail: "Show one pour, then hand over the cup." },
      { title: "Add a funnel", detail: "Challenge: fill the skinny bottle." },
    ],
    notice: ["Idea — classic Montessori-style practical life meets science play."],
    stretch: "Compare how many little cups fill the big pitcher.",
    notesFromHome: "",
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
    question: "When are kits coming?",
    answer:
      "Soon-ish. We are still proving weekly winners at home first. Join the kit waitlist if you want a heads-up when preorders open.",
  },
  {
    sortOrder: 5,
    question: "How messy are these?",
    answer:
      "Each card lists mess level: low, medium, or high. High-mess ideas (like Density Layers) assume a tray, towel, and a willing kitchen. We flag that up front so you can pick the right day.",
  },
  {
    sortOrder: 6,
    question: "How do you choose what to publish?",
    answer:
      "A dad runs sessions weekly with a ~1-year-old and a ~3-year-old. We keep winners, demote duds, and label status honestly: idea, draft, tested, or winner.",
  },
  {
    sortOrder: 7,
    question: "Indoor or outdoor?",
    answer:
      "Both. Filters on the experiments page let you pick indoor, outdoor, or either. Weather and mess tolerance usually decide.",
  },
  {
    sortOrder: 8,
    question: "Will there be other languages?",
    answer:
      "Later. English first while we nail the content. Multilingual support is on the roadmap once the core library feels solid.",
  },
];
