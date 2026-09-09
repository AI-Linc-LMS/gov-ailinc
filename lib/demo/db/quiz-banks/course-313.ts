import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 313, Tailoring, Garment Making & Boutique Skills.
 *
 * Every `skill` below is one word lifted from a topic title in course 313, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts builds a topic's concepts from at most
 * four words of its title, and `bankForTopic` matches this skill against that list case
 * insensitively. A skill that is not among a topic's first four concepts matches nothing and
 * sinks to the bottom of every pile, so each one here was checked against the derived list.
 *
 * Skills used, module by module:
 *   1 Machines, tools, workspace   Tension, Stitching, Cutting
 *   2 Fabric and measurement       Grain, Shrinkage, Measurements, Block
 *   3 Basic stitching skills       Seams, Darts, Sleeve
 *   4 Making garments              Uniform, Kameez, Shirt
 *   5 Finishing, quality, costing  Costing, Pressing, Alteration
 *   6 Boutique or job-work unit    Job, Photographing
 *
 * The five topics that actually carry a quiz card (31301, 31302, 31304, 31315, 31319) each
 * have at least one skill pointing at them, so the fallback lands on topic where it is served
 * most often.
 *
 * The correct option is spread across all four positions (A x5, B x4, C x5, D x4). A bank
 * keyed mostly to one letter is answerable off the screen by a candidate who knows no
 * tailoring at all.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 313001: machines, tools and the workspace ---- */
  mcq(
    313,
    1,
    "A straight seam on medium cotton shows loose loops of the needle thread lying on the underside, while the top of the seam looks flat. What do you correct first?",
    [
      "Re-thread the upper path with the presser foot raised, so the thread seats between the tension discs",
      "Tighten the bobbin case screw by a quarter turn",
      "Shorten the stitch length",
      "Change to a finer needle",
    ],
    0,
    "Medium",
    "Tension",
    "In a lockstitch the two threads should knot inside the fabric. Loops of needle thread lying loose underneath mean the needle thread is running with too little tension, and the commonest cause is not the dial setting but the thread never entering the tension discs at all, because those discs stay closed while the presser foot is down. Raise the foot, re-thread, drop the foot and try again. The tempting answer is the bobbin screw, but tightening it pulls the knot further towards the underside and makes the loops worse. Bobbin tension is set once, checked by the drop test, and then left alone; the upper tension is the one you touch from job to job.",
  ),
  mcq(
    313,
    2,
    "Your machine drops a stitch at irregular intervals on plain cotton. Which explanation fits a skipped stitch?",
    [
      "The bobbin has run low on thread",
      "The presser foot pressure has been set too high",
      "The hook is missing the loop of needle thread, most often because the needle is bent, blunt or fitted the wrong way round",
      "The stitch length dial has been set too short",
    ],
    2,
    "Easy",
    "Stitching",
    "A stitch forms when the hook catches the small loop thrown by the needle as it begins to rise. Anything that puts that loop in the wrong place or the wrong shape, a bent needle, a blunt point, a needle pushed less than fully home, or a needle turned so its long groove faces the wrong way, means the hook passes through empty air and no stitch is made. A low bobbin is the tempting answer because it also breaks the line of stitching, but it stops the underside thread completely from one point onward rather than dropping the odd stitch and then recovering. Change the needle before you change anything else: it is the cheapest part on the machine and the cause of most stitch faults.",
  ),
  mcq(
    313,
    3,
    "When cutting out, the fabric is kept flat on the table and the lower blade of the shears slides along the surface, instead of the layers being lifted up to the blades. Why?",
    [
      "Lifting the layers blunts the shears more quickly",
      "Lifted layers slide against one another, so the top piece and the bottom piece do not come out the same shape",
      "A lifted edge frays more once it has been cut",
      "Shears cannot cut more than one layer unless they rest on the table",
    ],
    1,
    "Easy",
    "Cutting",
    "The cut edge is the only record of the pattern line that reaches the machine, and in a folded or doubled lay every layer has to carry the same line. Fabric held in the air travels at a different speed from the layer under it, so by the end of a long edge the two pieces differ by several millimetres and the seam will not match. Blunting is the tempting answer because it is true that shears go blunt from the wrong work, but they blunt on paper and pins, not on air. Keep one pair for fabric only, cut with long strokes, and never close the tips, since the tips leave a nick that shows on the seam line.",
  ),

  /* ---- Module 313002: fabric and measurement ---- */
  mcq(
    313,
    4,
    "A binding strip for a curved neckline is cut at 45 degrees to the selvedge. Which property of the bias makes it the right choice?",
    [
      "It is the strongest direction in a woven fabric",
      "It does not fray, so the edge needs no further finish",
      "It shrinks less than the lengthwise grain when washed",
      "It stretches and moulds, so it follows a curve without ripples or puckers",
    ],
    3,
    "Medium",
    "Grain",
    "In a woven cloth the yarns are locked along the warp and the weft, so a pull in either of those directions barely gives. A pull at 45 degrees distorts the squares of the weave itself, which is why a bias strip lengthens and narrows under a light stretch and will sit smoothly round a concave neckline. Strength is the tempting answer, and strength does matter in cutting, but the strongest direction is the lengthwise grain along the selvedge, which is why it runs down the length of a garment and why a bias-cut skirt drops over time. A bias edge frays less raggedly than a cross-cut one, yet it still frays and still needs finishing.",
  ),
  mcq(
    313,
    5,
    "A cotton shirting is washed and dried before it is cut. What problem does that prevent?",
    [
      "The finished garment tightening after the customer's first wash",
      "The dye running on to a lining",
      "The cut edges fraying while the garment is stitched",
      "The seams puckering under the needle",
    ],
    0,
    "Easy",
    "Shrinkage",
    "Cotton relaxes when it is first wetted and dried, mostly along its length, and even a small percentage is enough to move a fitted waist or shorten a sleeve past the point where the customer accepts it. Doing that shrinking on the roll, before cutting, means the pieces you cut are the size the garment will stay. Colour running is the tempting answer, because a pre-wash does show up a bleeding dye and that is a useful thing to learn early, but a dye that runs will run at every wash, so washing once does not cure it. Shrinkage is different: it happens mostly the first time, which is exactly why doing it first works.",
  ),
  mcq(
    313,
    6,
    "While taking a customer's bust measurement you keep the tape snug against the body rather than leaving a little slack. Why?",
    [
      "Because a snug tape gives a smaller figure and so saves fabric",
      "Because a blouse is stitched to the exact body measurement, with no allowance anywhere",
      "Because the allowance for movement is added in the draft, and slack in the tape would add it a second time",
      "Because a tape stretches with age and has to be pulled firm to read true",
    ],
    2,
    "Medium",
    "Measurements",
    "A measurement sheet records the body, not the garment. The draft then adds the ease the style needs, a little for a fitted blouse and a good deal more for a kurta, and those allowances are already built into the drafting method you follow. If you also leave the tape slack, the two additions stack and the garment is loose everywhere at once, which is the commonest reason a first blouse does not sit. Option two is the tempting one, since a fitted blouse really is close to the body, but even that carries a small allowance and gets its shape from darts. A tape that has stretched is replaced, never compensated for by pulling harder.",
  ),
  mcq(
    313,
    7,
    "A basic block is drafted to net body lines, and seam allowance is added only when the pieces are marked out on the fabric. What is the reason?",
    [
      "Because the customer's measurements already include the seam allowance",
      "Because the same block is reused for many styles, and any new seam or dart line drawn from it would otherwise sit on a line that already carries an allowance",
      "Because a paper pattern cannot be cut accurately enough to include the allowance",
      "Because seam allowance is needed only on thick fabrics",
    ],
    1,
    "Hard",
    "Block",
    "A block is a measuring tool rather than a pattern for one garment. You slash it, pivot a dart into a new position, add a yoke line or swing a flare, and every one of those operations creates a fresh edge. If the block carried allowance, the new edge would fall inside cloth already set aside for stitching and each derived style would be wrong by a different amount. Net lines keep the block honest and the allowance is drawn last, around the final outline, at whatever width each seam needs. The tempting answer is the first one, because candidates treat ease and seam allowance as the same thing. Ease is room to move inside the finished garment; seam allowance is fabric consumed by the stitching and hidden inside it.",
  ),

  /* ---- Module 313003: basic stitching skills ---- */
  mcq(
    313,
    8,
    "Which seam shuts the raw edges inside the seam itself, so that a fine fraying fabric needs no separate overlocking or binding?",
    [
      "A plain seam pressed open",
      "A lapped seam",
      "A plain seam with the edges pinked",
      "A French seam",
    ],
    3,
    "Easy",
    "Seams",
    "A French seam is stitched twice. The first line joins the pieces wrong sides together, the allowance is trimmed narrow, the work is turned and the second line encloses that trimmed edge inside a clean tube. Nothing raw survives, which is what a sheer dupatta or a fine voile kurta needs, since on those fabrics an overlocked edge reads through from the face as a dark line. The plain seam pressed open is the tempting answer because it is what most garments use, and rightly so, but its raw edges are exposed and have to be finished by some other operation. Pinking slows fraying on a firm cotton and does not stop it on a loose weave.",
  ),
  mcq(
    313,
    9,
    "A bust dart is stitched so that its point stops a little short of the fullest point of the bust rather than reaching it. Why?",
    [
      "The fullness released at the tip would otherwise gather into a sharp cone instead of spreading over the curve",
      "The dart would otherwise be too long to press downwards",
      "The tip would otherwise be likely to come undone in the wash",
      "The bust point shifts when the customer sits, so the dart is kept clear of it",
    ],
    0,
    "Medium",
    "Darts",
    "A dart takes up width at the seam and lets it out again at the point, turning flat cloth into a shaped surface. The release has to be spread across the curve it is shaping, so a dart that finishes short of the apex fades out over the fullest part, while one that runs right on to it concentrates all that fullness at a single spot and stands up as a visible peak on the finished blouse. Pressing direction is the tempting answer because there is a real rule there, bust darts pressed down and waist darts towards the centre front, but that governs which way the fold lies, not where the stitching stops. Run the last few stitches along the fold and tie the ends rather than back-stitching, or the tip will pucker.",
  ),
  mcq(
    313,
    10,
    "The sleeve cap you have cut measures a little longer than the armhole it must be set into. What do you do?",
    [
      "Trim the cap until the two measurements are equal",
      "Cut the armhole deeper so that it matches the cap",
      "Ease the surplus into the upper part of the cap between the notches, so the sleeve can turn over the shoulder",
      "Take the surplus up in small pleats at the underarm",
    ],
    2,
    "Hard",
    "Sleeve",
    "The shoulder is a rounded solid, and a sleeve has to travel over it. That is why a drafted cap is deliberately longer than the armhole: the surplus, usually a couple of centimetres, is eased in over the top of the cap between the front and back notches, with the sleeve uppermost so the feed dogs gather it slightly for you. Trimming to match is the tempting answer, and it is what a beginner does when the two edges refuse to pin together, but the result is a sleeve that pulls flat across the top and drags at the armhole every time the arm lifts. The underarm section carries no ease at all and is stitched edge to edge, so pleating it there puts bulk exactly where the seam already has most.",
  ),

  /* ---- Module 313004: making garments ---- */
  mcq(
    313,
    11,
    "Two bolts of the same uniform shade, but from different dye lots, are on the table for one batch of school shirts. How do you use them?",
    [
      "Alternate the two bolts piece by piece so the difference averages out over the batch",
      "Cut every piece of any one shirt from a single bolt, so no garment carries both lots",
      "Use one bolt for all the fronts and the other for all the backs and sleeves",
      "Mix them freely, since the shade code printed on both is the same",
    ],
    1,
    "Medium",
    "Uniform",
    "Two lots of the same shade code are dyed in separate baths and are rarely an exact match. The eye cannot judge a small difference across a room, but it catches it instantly where two pieces meet at a seam or lie side by side in daylight. Keeping each garment inside one lot turns the variation into a difference between shirts, which nobody in a school assembly notices, instead of a difference between the sleeve and the front of one shirt, which the parent notices at once. The third option is tempting because it sounds like an organised way to use both bolts, and it is the worst of the three: the armhole is precisely the join where the eye compares.",
  ),
  mcq(
    313,
    12,
    "A customer brings a printed fabric in which every motif stands upright the same way. What does this change when you cut a kameez from it?",
    [
      "Nothing changes, because a print does not alter the grain of the cloth",
      "The pieces have to be cut on the bias instead",
      "The fabric has to be pre-washed twice before cutting",
      "Every piece has to be laid the same way up, which needs more fabric than a lay where pieces can be turned head to foot",
    ],
    3,
    "Hard",
    "Kameez",
    "On a plain cloth or a two-way print you shorten the lay by turning the back piece head to foot and nesting it inside the curve of the front. A one-way print, and equally a pile fabric like velvet or corduroy that shades differently when reversed, forbids that: every piece must point the same way, so the lay is longer and the fabric requirement rises. The first option is the tempting one and it is half right, since the weave and therefore the grain are unchanged, but the design imposes a direction of its own, and a kameez with the motif upside down across the back is a garment the customer will not accept. Work the requirement out before the customer buys the cloth, not after you have cut it.",
  ),
  mcq(
    313,
    13,
    "In a men's shirt collar, the top collar is cut a shade larger than the under collar. What does that small extra do?",
    [
      "It lets the joining seam roll under to the back of the collar, so the seam does not show as a ridge along the finished edge",
      "It leaves room for the interfacing inside the collar",
      "It allows for the collar shrinking in the first wash",
      "It provides the extra fabric taken up by the collar buttonhole",
    ],
    0,
    "Hard",
    "Shirt",
    "A collar is two layers stitched round an edge and then turned, and when it turns, the outer layer travels round the longer path. Cut the two pieces identical and that shortfall drags the joining seam up on to the top edge, where it sits as a hard visible line and the collar points curl. The extra, known in the trade as turn of cloth, lets the seam settle just under the edge on the underside. A thick oxford needs more of it than a fine voile, which is why you test it on a scrap of the actual fabric. Interfacing is the tempting answer, since it does add thickness, but interfacing is cut to the net line or trimmed inside the seam allowance so that it never adds width of its own.",
  ),

  /* ---- Module 313005: finishing, quality and costing ---- */
  mcq(
    313,
    14,
    "A blouse takes 1.5 metres of fabric at ₹200 a metre, ₹90 of lining, hooks and thread, and three hours of your time costed at ₹70 an hour. You work on a mark-up of 25 per cent on total cost. What do you quote?",
    ["₹600", "₹697.50", "₹750", "₹800"],
    2,
    "Hard",
    "Costing",
    "Fabric is 1.5 multiplied by 200, which is ₹300. Add ₹90 of trims and ₹210 of labour, three hours at ₹70, and the total cost is ₹600. A mark-up of 25 per cent on cost adds ₹150, so you quote ₹750. The tempting figure is ₹800, which is what you get by treating 25 per cent as a share of the selling price, since 600 divided by 0.75 is 800. That is a margin, not a mark-up, and the two are different numbers: a mark-up of 25 per cent on cost is a margin of 20 per cent on price. ₹697.50 comes from applying the mark-up to materials alone and then adding labour untouched, and ₹600 is the trap that keeps a busy order book unprofitable, quoting your costs and forgetting that your own hours are one of them.",
  ),
  mcq(
    313,
    15,
    "Why is each seam pressed as soon as it is stitched, before another seam crosses it?",
    [
      "Because the stitching thread sets only while it is still warm from the needle",
      "Because once a second seam crosses the first, the first can no longer be opened flat under the iron and its bulk is locked in",
      "Because a seam left unpressed needs a hotter iron later and risks scorching",
      "Because every pressing shrinks the fabric slightly, so it is better done early",
    ],
    1,
    "Medium",
    "Pressing",
    "Pressing is part of construction, not a step at the end. A shoulder seam pressed open lies flat and the armhole can then be set into a clean edge; leave it, stitch the sleeve across it, and the allowance is trapped in a lump you can never reach again. That lump is the reason a home-stitched garment reads as home-stitched even when the stitching itself is good. The fourth option is the tempting one, because steam does relax some cloth and that is exactly why you use a pressing cloth and test on a scrap first, but shrinkage is a reason to press carefully, not a reason to press early. Press, meaning lift the iron and set it down, rather than sliding it, which stretches a seam that is off the straight grain.",
  ),
  mcq(
    313,
    16,
    "A customer brings back a stitched blouse and asks for it to be let out at the sides. What decides whether you can do it?",
    [
      "Whether the fabric is a cotton or a synthetic",
      "Whether the blouse opens at the front or at the back",
      "Whether the darts can be re-stitched",
      "How much seam allowance was left inside the side seams, and whether the old stitch line will show once it is opened",
    ],
    3,
    "Easy",
    "Alteration",
    "An alteration can only give back fabric that is already inside the garment, so the first thing you do is open a few centimetres of the side seam and look at what is folded in there. The second thing you check is the mark: a firmly pressed seam on a poplin or a synthetic leaves a crease line and a row of needle holes that will sit outside the new stitching in full view, which decides whether you promise the customer a clean job or a compromise. Re-stitching the darts is the tempting answer, and a dart does hold fabric, but releasing a bust dart changes the shaping over the bust rather than the width at the side, so it moves the fit problem instead of solving it. This is why you leave a generous side allowance on the first garment you stitch for a new customer.",
  ),

  /* ---- Module 313006: running a boutique or job-work unit ---- */
  mcq(
    313,
    17,
    "You are weighing stitching job work for a garment unit against taking orders from your own customers. Which difference matters most to your working capital?",
    [
      "Job work usually arrives as cut pieces with the material supplied, so you fund only your time and thread, while your own orders may need you to buy fabric before the customer pays",
      "Job work needs a costlier machine than boutique orders do",
      "Job work is always settled in cash on the day the pieces are delivered",
      "Boutique customers cannot be asked for an advance",
    ],
    0,
    "Medium",
    "Job",
    "The piece rate on job work looks poor beside what a blouse fetches from a walk-in customer, but the two are not comparable until you count what each one ties up. Job work comes cut and bundled, so the unit's money is in the cloth and yours is only in your hours. Boutique work can mean buying fabric, holding trims and carrying an unsold sample, all of it your money and none of it earning until the garment is delivered. The third option is tempting because job work does settle reliably against a delivery challan, but a unit normally pays on a weekly or monthly cycle, so what waits is your labour rather than your capital. The fourth is simply wrong in practice: an advance that covers the fabric is the standard way a boutique protects itself.",
  ),
  mcq(
    313,
    18,
    "You are photographing a finished kurta to send to a local orders group. Which practice does most to make the picture win the order?",
    [
      "Using the camera flash, so the shade comes out bright",
      "Photographing the garment folded, so that the whole piece fits inside the frame",
      "Shooting in indirect daylight against a plain wall, with the garment pressed and hung so the shoulder line and the fall are visible",
      "Applying a strong filter so the colour looks richer than it is",
    ],
    2,
    "Easy",
    "Photographing",
    "A buyer looking at a photograph is judging two things she cannot touch, the shade and the fit, so the picture has to answer both. Indirect daylight renders the colour close to true and rakes across the fabric enough to show the stitching and the drape, and hanging the garment shows where the shoulder sits and how the length falls. A direct flash is the tempting choice because the photograph does come out brighter, but it flattens the texture, throws a hard shadow on the wall behind and shifts the shade, and a customer whose delivered kurta looks different from the photograph does not order twice. A filter has the same effect deliberately, which is worse.",
  ),
];

export default BANK;
