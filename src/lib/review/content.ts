import type { KnowThis, KnowThisPanel } from "@/db/schema";
import {
  bridgeFlowM3PerS,
  cupVolume,
  jurinHeight,
  pathLength,
  WALK,
} from "@/lib/review/walking-water-physics";

export type ReviewItem = {
  voteId: string;
  /** Content slug in little-lab, when there is one. */
  contentId: string;
  title: string;
  challenge: string;
  simTitle: string;
  simBlurb: string;
  knowThis: KnowThis;
};

function panel(file: string, alt: string): KnowThisPanel {
  return {
    imageUrl: `/images/review/${file}.svg`,
    alt,
    width: 1200,
    height: 800,
  };
}

const candleMechanism = `Bear with me, this one is famous for the wrong explanation, so I'm going to go slowly through the three panels. For the arrows: dotted orange is heat, dashed is gas or water moving, and solid is air pushing (a force).

<!-- panel:1 -->
Panel 1, "BURNING: hot gas, some escapes". On the left is a candle on a plate with a thin layer of water. The clear glass is over it, and its rim sits in the water ("rim sealed in water"). The zoom is the inside of the glass.

A candle flame is wax vapor burning in the air trapped under the glass. The flame needs oxygen from that air, and once the rim is in the water, fresh air cannot get in. As it burns, the flame uses O₂, makes carbon dioxide and water vapor, and heats the gas. The dotted arrows coming off the flame are that heat going into the gas.

The grey dots are gas molecules. Inside the glass (tinted warm) they are more spread out than the dots outside: "hot gas: spread out". Hot gas takes more room. Pressure inside rises a little, and some of that hot gas gets pushed out under the rim. Look at both bottom corners: the dashed arrows and bubbles, "some escapes under the rim". Some of it even leaves before the glass is sealed, while you're lowering it over the flame. Those molecules are gone for good. You are left with fewer molecules than you started with, and they are hot.

The flame label says "will go out, O₂ still left". The flame goes out while oxygen is still there, often with the air still around 15–16% oxygen. The mix around the flame gets too poor in oxygen to keep it going: the hot exhaust (CO₂ and water vapor) collects under the top of the glass and spreads down around the flame, so the air feeding it is poorer in oxygen than the glass as a whole. It does not wait until the oxygen is gone.

<!-- panel:2 -->
Panel 2, "COOLING: outside air pushes water in". The flame is out, and the glass is cooling. Heating stops, and the gas cools toward room temperature. Cooled gas takes less room: "cooled gas shrinks". Compare the dots with panel 1. Inside, they are now packed about as close as outside. The little drops on the glass are "fog: water from the flame". That is water vapor the flame made, turned back to liquid on the cooler glass, which takes even more molecules out of the gas.

Now the solid arrows. The ones on the water outside the glass: "outside air pushes down". Inside, the arrows on the water are shorter: the cooled gas ends up a hair less packed than the outside air (fewer molecules left in the glass), so it pushes a little less. The dashed arrow shows the water going in under the rim and up into the glass. It climbs until the push from the gas inside plus the weight of the raised water matches the push from outside. The glass does not pull. Higher pressure outside pushes. (The caption says it: the arrows are exaggerated. The real difference is tiny, see Numbers.)

<!-- panel:3 -->
Panel 3, "The chemistry is small". Here each circle is one gas molecule, 100 of them. "air before": 78 nitrogen (N₂), 21 oxygen (O₂), 1 argon.

The box on the right, "if ALL O₂ burned", is the most the chemistry could ever do, and the flame never gets that far. The line under both boxes is the reaction: 2 CH₂ (wax link) + 3 O₂ → 2 CO₂ + 2 H₂O (liquid). CH₂ is one link of the long wax chain; wax is a long string of them. Every 3 oxygen molecules become 2 carbon dioxide molecules, because the water turns liquid and leaves the gas. So the 21 O₂ become 14 CO₂: the "7 fewer" empty circles.

No atoms vanish; the missing oxygen is in the water. At most that is about 7% of the gas, not a clean fifth. In a real run the flame quits with most of the oxygen still there, so the chemical shrink is at most about 2%, usually under 1%. A large rise that stays up needs panel 1 and panel 2: the hot gas that left, and the cooling after the flame is out.`;

function walkingNumbers(): string {
  const jurinCm = Math.round(jurinHeight() * 100);
  const rimCm = Math.round((WALK.CUP_H - WALK.H_FULL) * 100);
  const cupMl = Math.round(cupVolume(WALK.H_FULL) * 1e6);
  const pathCm = Math.round(pathLength(WALK.H_FULL, 0) * 100);
  const mlPerMin = bridgeFlowM3PerS(WALK.H_FULL, 0) * 1e6 * 60;
  const flow = mlPerMin.toFixed(1);
  return `Keep these off the kid table. They are the same constants the sim integrates.

A gap this size holds a tall column. Jurin's height is 2 × surface tension × cos(contact angle) / (density × g × radius). Water's surface tension is 0.072 N/m, the towel wets well (cos θ about ${WALK.COS_THETA}), and the effective pore radius here is ${WALK.PORE_R * 1e6} micrometers. That column is about ${jurinCm} cm. A full cup's waterline is only ${rimCm} cm under the rim, so the rim is not what stops the climb.

The cup in the sim is ${WALK.CUP_R * 100} cm in radius and ${WALK.CUP_H * 100} cm tall, filled to ${WALK.H_FULL * 100} cm: about ${cupMl} mL. The towel path from that waterline, over an ${WALK.ACROSS * 100} cm gap, and down to the bottom of an empty cup is about ${pathCm} cm.

The wet front crawls that path by Lucas–Washburn (distance grows like the square root of time), slower than a single straight tube because the fibers twist (tortuosity ${WALK.TAU}). Once the bridge is wet the whole way, flow is Darcy's law: permeability × area × (density × g × height difference) / (viscosity × path length). The effective permeability of this loose strip is ${WALK.KAPPA.toExponential(1)} m², which is more open than a sheet of dense paper. At the start that is about ${flow} mL per minute through one bridge. A cup therefore takes the better part of an hour to share, not a few seconds. The sim clock runs at one model minute per real second so you can watch it; the amounts are still that flow.

Dye is a dissolved mass. It moves only when a volume of water moves. Equal parts of red water and blue water make purple because both waters are in the cup.`;
}

const walkingMechanism = `Bear with me, because the color looks like it walks on its own, and it doesn't. I'm going to go slowly through the three panels. Dashed orange arrows are water moving. Solid orange arrows are forces: the fiber pulling, or the weight of the water.

<!-- panel:1 -->
Panel 1, "A paper towel is a bundle of tiny gaps". On the left is one cup of colored water with a towel strip standing in it. The zoom on the right is a few fibers inside that towel, drawn much bigger than they are.

The fibers are cellulose, the same stuff as the paper. They like water. Look at the solid arrows along the fiber wall: the fiber is pulling on the water molecules that touch it. That pull is adhesion. The water molecules are also pulling on each other, which is why they don't let go and leave a dry gap behind the front. That second pull is cohesion. Together they haul a column of water up a narrow gap.

The dashed arrow in the gap is the water actually moving up. The gap above the front is still dry. There is no color up there, because the dye is dissolved in the water. It cannot get ahead of the water.

<!-- panel:2 -->
Panel 2, "The gaps can lift water higher than the rim". On the left, a full cup and an empty cup, towel draped over both rims. The wet front is partway up the near side. The far side is still dry, and the empty cup is still empty.

The little diagram on the right is the same idea with two tubes, so you can see why a gap beats a cup. A wide tube holds only a short column. A hair-thin tube holds a tall one. Narrower gap, taller column. The numbers are in the note below: these towel gaps can hold a column of about half a meter. The rim of a kitchen cup is only a few centimeters above a full waterline. So getting over the rim is easy. The towel is not full of magic. It is full of thin gaps.

The front still has to travel the whole drape — up, across, and down — before a drop arrives in the empty cup. Until it does, that cup stays dry.

<!-- panel:3 -->
Panel 3, "Once the towel is wet across, the higher cup drains". Both ends of the towel are wet now. The dashed arrow runs through the towel from the higher water to the lower water.

The climb was the capillary pull in panel 1 and panel 2. It got the towel wet over the rim, which a plain siphon cannot do by itself, because a siphon has to be full of water before it flows. After the bridge is wet from cup to cup, the flow is ordinary: the higher surface pushes harder than the lower one, and water moves through the already-wet gaps toward the low side. Solid arrows on the water show that weight. Flow keeps going until the two surfaces are about level.

The dye rides in the water. Red water and blue water meet in the empty cup and the cup turns purple because it now holds both, not because red leaked through a dry towel. The towel itself stays the color of the water that first soaked it.`;

export const reviewItems: ReviewItem[] = [
  {
    voteId: "candle",
    contentId: "candle-in-glass",
    title: "Candle in a glass",
    challenge: "Cover a burning candle with a glass in a dish of water. What makes the water climb?",
    simTitle: "Try it: what lifts the water?",
    simBlurb:
      "Light the candle, lower the glass, and watch. The waterline is the gas model, drawn to the scale of a kitchen glass.",
    knowThis: {
      mechanism: candleMechanism,
      panels: [
        panel(
          "candle-panel-1",
          "Panel 1, Burning: hot gas, some escapes. A candle burns under a glass whose rim is sealed in a thin layer of water. Dotted arrows are heat. Dashed arrows and bubbles show hot gas leaving under the rim. A zoom shows the trapped gas molecules spread out, labeled will go out, oxygen still left.",
        ),
        panel(
          "candle-panel-2",
          "Panel 2, Cooling: outside air pushes water in. The flame is out, fog dots the glass, and the gas molecules inside are packed like the air outside. Solid arrows show outside air pushing down harder than the cooled gas inside. A dashed arrow shows water climbing into the glass.",
        ),
        panel(
          "candle-panel-3",
          "Panel 3, The chemistry is small. One hundred circles of air before: 78 nitrogen, 21 oxygen, 1 argon. If all the oxygen burned, those 21 become 14 carbon dioxide and 7 empty circles. The reaction shown is 2 CH2 plus 3 O2 makes 2 CO2 plus liquid water.",
        ),
      ],
      goDeeper: `Watch the clock. A lot of the rise comes after the flame is already out, while the trapped gas is cooling. That timing is the cooling story.

Look for bubbles under the rim while the flame is still going. Those are hot gas leaving. Some hot air also slips out while you're still lowering the glass, before the rim touches the water, so you can get a good rise even with few bubbles. If truly no gas leaves, the water just dips and comes back, ending only a little above where it started.

Fog on the glass is water the flame made, then cooled.

Dry plate versus water plate: the flame still dies with no water. The water is a gauge. It is not why the flame dies.`,
      numbersNote: `Keep these off the kid table.

Dry air is about 78% nitrogen, 21% oxygen, 1% argon, and a trace of CO₂, by volume.

A candle under a glass commonly goes out with oxygen still near 15–16%. A large share of the original oxygen is still there. The exact point depends on the candle and the jar. It is not zero.

For a long wax molecule (an alkane, roughly CₙH₂ₙ₊₂), wax + oxygen → carbon dioxide + water. Counted in molecules, about three O₂ become two CO₂ once the water is liquid. The missing oxygen ends up in the water. Using every oxygen molecule and condensing every drop would shrink the gas by about 7% of the air, not 21%. In a real run the flame stops near 16% O₂, so only about 5 of every 100 gas molecules (the used O₂) go, and about 3 CO₂ come back. So the real chemical shrink is at most about 2% of the gas, and usually less than 1%, because some of the flame's water stays as vapor (the fog shows the gas is holding all the water vapor it can).

Trapped gas takes up room in step with its absolute temperature. Room temperature is about 293 K (20°C). If the average air in the jar were about 30 degrees hotter, cooling back would shrink it by roughly a tenth. With the glass sealed by water, the water rises into that space, so the pressure inside only ends up a hair below outside. The flame is much hotter than that, but most of the air in the jar is only warmed. That ~10% shrink only shows up as a lasting rise if some of the hot gas actually left, either bubbling out or spilling out while you lowered the glass. If none left, the hot gas just pushes the water down, and cooling brings it back to where it started.

The height of the climb is a pressure difference, and it is a small one. About 10 meters of water balances one atmosphere, so one centimeter of rise is about a thousandth of an atmosphere. Even a climb that looks huge in a drinking glass, say 3 cm, is only about 0.3% of the air pressure. Do not read the waterline as “percent oxygen.” The height also moves with jar size, how fast you lower the glass, how warm the air got, and whether gas bubbled out. It will not land on one-fifth.

The sim uses one kitchen glass: 7.2 cm across, 12.5 cm tall, about 510 mL, over a 22 cm pie tin with 250 mL of water, and a 32 W tealight. It goes out at 15.5% oxygen in the glass. Whatever height you see is that run's missing hot air plus the cool-down, not a cartoon of a fifth.`,
      nameForThis:
        "Combustion in a closed volume, then thermal contraction. The water dish is a rough gauge of the pressure difference after hot gas leaves and the rest cools.",
    },
  },
  {
    voteId: "walking-water",
    contentId: "walking-water",
    title: "Walking-water rainbow",
    challenge: "Bridge cups of colored water with paper towels. How does the color get into the empty cup?",
    simTitle: "Try it: what walks across the towel?",
    simBlurb:
      "Pick how many cups, then start. Heights and mixes come from capillary flow. Color only moves with the water.",
    knowThis: {
      mechanism: walkingMechanism,
      panels: [
        panel(
          "walking-water-panel-1",
          "Panel 1, A paper towel is a bundle of tiny gaps. A cup of colored water has a towel strip in it. The zoom shows cellulose fibers, solid arrows for the fiber pulling on water and water holding onto itself, and a dashed arrow as water climbs a narrow gap. Above the wet front the gap is dry and colorless.",
        ),
        panel(
          "walking-water-panel-2",
          "Panel 2, The gaps can lift water higher than the rim. A full cup and an empty cup are bridged by a towel that is only wet partway up the near side. Beside them, a wide tube holds a short water column and a hair-thin tube holds a tall one.",
        ),
        panel(
          "walking-water-panel-3",
          "Panel 3, Once the towel is wet across, the higher cup drains. A dashed arrow runs through the wet towel from the higher water to the lower water. Solid arrows show the weight of the water. Dye dots ride in the moving water, and the lower cup is filling with a mix.",
        ),
      ],
      goDeeper: `A dry towel above the waterline stays pale until the wet front reaches it. If you lift the middle of the towel into a tall arch, higher than the gaps can support, the front stalls and the empty cup stays empty.

Two colors mix only in a cup that actually receives both streams. The familiar rainbow closes the cups into a circle so the first and last colors can meet. This review sim is a straight row, so the end cups do not pour into each other.

The towel keeps a stain of the water that first soaked it. That little bit of dye is in the towel, not a leak into a cup the water has not reached.`,
      numbersNote: walkingNumbers(),
      nameForThis:
        "Capillary rise in a porous strip, then gravity-driven flow through the wet bridge. The dye is just along for the ride.",
    },
  },
];
