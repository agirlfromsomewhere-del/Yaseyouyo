// Exercise descriptions written for someone who cannot see a demonstration
// and has never exercised before: every cue is spatial/tactile/
// proprioceptive (what you feel, what you touch, how far something moves),
// never "like this" or anything that assumes sight. No equipment beyond a
// wall, a mat/carpet, a sturdy chair, or household items.
//
// The strength-training entries were originally written for a related
// accessible-fitness project and are reused here as-is; the Pilates
// entries are new, written to match the same level of detail.

export const EXERCISE_CATEGORIES = ['strength', 'pilates'];

export const EXERCISES = [
  // --- Strength training ---
  {
    id: 'wall-push-up',
    name: 'Wall Push-Up',
    category: 'strength',
    musclesWorked: 'Chest, shoulders, and triceps',
    equipment: 'A clear, sturdy wall',
    steps: [
      "Find a stretch of wall with no outlets, switches, or decorations at chest height. Stand facing it, arm's length away — reach one arm straight out and touch the wall with your fingertips to check the distance.",
      'Place both palms flat on the wall at shoulder height and shoulder-width apart. Your fingers should point up.',
      "Walk your feet back about one small step, so your body forms a slight diagonal line from head to heels, leaning into the wall. Keep your heels on the floor.",
      "Keeping your body in one straight line, bend your elbows to slowly lower your chest toward the wall, like the wall is a countertop you're leaning down to smell. Stop when your nose is a few inches from the wall or when your elbows reach about a right angle.",
      'Push through your palms to straighten your arms and return to the start. That’s one repetition.',
      'Do 8 to 12 repetitions, rest for a minute, and repeat for 2 to 3 sets total.',
    ],
    safetyNotes: [
      'If your wrists ache, try making loose fists and pushing from your knuckles instead of flat palms.',
      "Keep your body rigid like a plank the whole time — don't let your hips sag or pike up.",
      'Stop if you feel sharp pain in your shoulders or wrists; mild muscle fatigue is normal.',
    ],
  },
  {
    id: 'bodyweight-squat',
    name: 'Chair-Assisted Squat',
    category: 'strength',
    musclesWorked: 'Thighs (quadriceps and hamstrings) and glutes',
    equipment: "A sturdy, armless chair placed against a wall so it won't slide",
    steps: [
      "Stand with the back of your knees lightly touching the front edge of the chair seat, feet about hip-width apart — you can check this by placing your own fist between your ankles.",
      'Cross your arms over your chest, or reach them straight out in front of you for balance.',
      "Keeping your chest lifted and weight in your heels, bend your knees and push your hips back, as if you're about to sit down, until your bottom lightly taps the chair seat. Don't collapse your full weight into the chair — just a light touch.",
      'Press through your heels to stand back up to a fully upright position. That’s one repetition.',
      'Do 10 to 15 repetitions, rest for a minute, and repeat for 2 to 3 sets total.',
    ],
    safetyNotes: [
      "The chair is a safety marker and depth guide, not something to fully sit and rest on between reps unless you need a break.",
      'Your knees should track over your feet, not cave inward — imagine you’re keeping a wide stance the whole way down.',
      'If you feel unsteady, do this next to a wall or sturdy counter you can touch for balance.',
    ],
  },
  {
    id: 'standing-towel-row',
    name: 'Standing Towel Row',
    category: 'strength',
    musclesWorked: 'Upper and middle back, biceps',
    equipment: 'A long, sturdy towel, resistance band, or belt looped around a secure anchor (a closed door handle or heavy railing at chest height)',
    steps: [
      'Loop your towel or band around the anchor point and hold one end in each hand, palms facing each other.',
      'Step backward until there’s firm tension in the towel when your arms are fully extended toward the anchor. Feet hip-width apart, knees slightly soft, not locked.',
      'Keeping your elbows close to your sides, pull both hands back toward your ribs, squeezing your shoulder blades together like you’re trying to hold a pencil between them.',
      'Pause for a second when your hands reach your ribs, then slowly extend your arms back out to the start. That’s one repetition.',
      'Do 10 to 15 repetitions, rest for a minute, and repeat for 2 to 3 sets total.',
    ],
    safetyNotes: [
      'Test the anchor point’s strength with a firm tug before you begin — it must not be able to swing open or slide.',
      'Keep your torso still; the motion should come from your shoulder blades and elbows, not from leaning your whole body backward.',
    ],
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'strength',
    musclesWorked: 'Glutes and hamstrings, with core support',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Lie on your back with your knees bent and feet flat on the floor, heels about a hand’s width from your bottom.',
      'Rest your arms at your sides, palms down, for stability.',
      'Push through your heels to lift your hips off the floor until your body forms a straight line from your shoulders to your knees. Squeeze your glutes at the top.',
      'Hold for one to two seconds, then lower your hips back down under control until they lightly touch the floor. That’s one repetition.',
      'Do 12 to 15 repetitions, rest for a minute, and repeat for 2 to 3 sets total.',
    ],
    safetyNotes: [
      'Avoid arching your lower back at the top — the lift should come from your glutes, not from over-extending your spine.',
      'Keep your feet flat and stable; if your heels slide outward, walk them back closer to your body.',
    ],
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'strength',
    musclesWorked: 'Core, lower back, and glutes, with balance training',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Get on your hands and knees. Hands should be directly under your shoulders, and knees directly under your hips — check this by feeling that your palms are in line with the outside of your shoulders.',
      'Keep your back flat, like a tabletop, and your gaze toward the floor to keep your neck neutral.',
      'Slowly extend your right arm straight forward and your left leg straight backward at the same time, keeping both roughly level with your torso. Move slowly enough that you don’t wobble.',
      'Hold for two to three seconds, feeling your core tighten to keep your hips level and facing the floor.',
      'Return your hand and knee to the floor under control, then repeat with the left arm and right leg. That’s one full repetition.',
      'Do 8 to 10 repetitions per side, rest for a minute, and repeat for 2 to 3 sets total.',
    ],
    safetyNotes: [
      'Move slowly and stop if you feel your hips twisting to one side — that means you’re reaching too far.',
      'If balance is a concern, practice against a wall with your hand or foot lightly grazing it for reference.',
    ],
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'strength',
    musclesWorked: 'Thighs (quadriceps) and glutes, as a held-position exercise',
    equipment: 'A clear, sturdy wall',
    steps: [
      'Stand with your back flat against the wall, feet about two feet out in front of you, shoulder-width apart.',
      'Slide your back down the wall by bending your knees, as if sitting into an invisible chair, until your thighs are roughly parallel to the floor — knees over ankles, not past your toes.',
      'Keep your back pressed flat against the wall the whole time and hold this position, breathing steadily.',
      'Hold for 20 to 30 seconds to start, then slide back up to stand. That’s one repetition.',
      'Rest for 30 to 60 seconds and repeat for 3 sets total.',
    ],
    safetyNotes: [
      'If your knees ache, slide slightly higher up the wall so your thighs aren’t as close to parallel.',
      'This is a held, static exercise — stop immediately if you feel your legs shaking uncontrollably or your form breaking down.',
    ],
  },
  {
    id: 'seated-overhead-press',
    name: 'Seated Overhead Press',
    category: 'strength',
    musclesWorked: 'Shoulders and triceps',
    equipment: 'A sturdy chair with no arms, and two light household weights such as filled water bottles or canned goods',
    steps: [
      'Sit toward the front edge of the chair with your feet flat on the floor, back straight.',
      'Hold one weight in each hand and bring them up to shoulder height, palms facing forward, elbows bent so your upper arms are roughly level with your shoulders.',
      'Press both weights straight upward until your arms are fully extended overhead, without leaning back.',
      'Pause briefly, then lower the weights back down to shoulder height under control. That’s one repetition.',
      'Do 10 to 12 repetitions, rest for a minute, and repeat for 2 to 3 sets total.',
    ],
    safetyNotes: [
      'Start with very light weights — a full water bottle is plenty to begin with.',
      'Keep your core engaged so your lower back doesn’t arch as you press overhead.',
    ],
  },

  // --- Pilates (mat-based, true-beginner) ---
  {
    id: 'pilates-pelvic-tilt',
    name: 'Pelvic Tilt (Imprinting)',
    category: 'pilates',
    musclesWorked: 'Deep core (transverse abdominis) and awareness of your lower back',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Lie on your back with your knees bent, feet flat on the floor about hip-width apart, and arms resting at your sides, palms down.',
      "Notice the small hollow space between your lower back and the floor — slide one hand under your lower back if it helps you feel that gap.",
      'Breathe in through your nose to prepare. As you breathe out through your mouth, gently tilt your pelvis so your lower back presses flat into the floor, like you’re flattening that hollow space by tucking your hips slightly toward your face. Your hips don’t lift; only your lower back flattens.',
      'Hold that flat-back feeling for two to three seconds, then breathe in and let your lower back return to its natural slight curve.',
      'This is the foundation for every other Pilates move below — the goal is to learn what a "flat back" versus "arched back" feels like against the floor.',
      'Do 8 to 10 slow repetitions, moving only with your breath, no rush.',
    ],
    safetyNotes: [
      'The movement is small and subtle — you’re not rocking your whole body, just gently tilting the pelvis.',
      'If you feel this in your neck or shoulders, you’re tensing muscles you don’t need — let your upper body stay heavy and relaxed on the floor.',
    ],
  },
  {
    id: 'pilates-hundred',
    name: 'The Hundred (Beginner Version)',
    category: 'pilates',
    musclesWorked: 'Core (abdominals), with a breathing challenge',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Lie on your back with your knees bent and feet flat on the floor, same starting position as the Pelvic Tilt above.',
      'Lift both feet off the floor and bring your knees to a tabletop position — knees stacked over your hips, shins parallel to the floor, like resting your lower legs on a table.',
      'Reach both arms straight up toward the ceiling, then lower them so they hover a few inches above the floor at your sides, palms facing down.',
      'Lift your head and shoulder blades slightly off the floor, tucking your chin gently toward your chest as though holding a small apple under it — keep your gaze toward your knees, not the ceiling.',
      'Pump both arms up and down in small, quick movements a few inches, as if lightly slapping the air above the floor, while breathing in for five pumps and out for five pumps.',
      'Continue for a count of 10 breath cycles (about 100 pumps total, which is where the name comes from), then lower your head and feet back down to rest.',
    ],
    safetyNotes: [
      'If your neck gets tired, lower your head back down to the floor and continue the arm pumps and breathing with knees in tabletop — the head lift is optional at first.',
      'If your lower back arches off the floor, bring your feet back down flat on the floor instead of tabletop, keeping the rest of the exercise the same, until your core is stronger.',
      'Never hold your breath — the quick in-and-out breathing is part of the exercise, not incidental.',
    ],
  },
  {
    id: 'pilates-toe-taps',
    name: 'Toe Taps',
    category: 'pilates',
    musclesWorked: 'Deep core, with control of the lower back',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Lie on your back, bring both knees to tabletop position (stacked over your hips, shins parallel to the floor), arms resting at your sides.',
      'Do a gentle pelvic tilt (as in the first exercise) and hold that flat-back feeling for the whole exercise.',
      'Keeping that flat back, slowly lower one foot down until just your toes lightly tap the floor, without letting your lower back arch up away from the floor.',
      'Bring that foot back up to tabletop, then repeat with the other foot. That’s one repetition.',
      'Do 8 to 10 repetitions per side, moving slowly enough that you can feel whether your back stays flat.',
    ],
    safetyNotes: [
      'The moment your lower back starts to arch off the floor is the moment to stop lowering that leg — tap higher up instead, closer to tabletop, until your core gets stronger.',
      'Move slowly; this is about control, not speed.',
    ],
  },
  {
    id: 'pilates-bridge-roll',
    name: 'Pilates Bridge with Spine Roll',
    category: 'pilates',
    musclesWorked: 'Glutes, hamstrings, and spine mobility',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Lie on your back, knees bent, feet flat on the floor hip-width apart, heels about a hand’s width from your bottom, arms at your sides.',
      'Start with a pelvic tilt, flattening your lower back into the floor.',
      'Keeping that tucked feeling, peel your hips up off the floor slowly, one small part of your spine at a time — imagine your spine is a string of beads lifting off the floor bead by bead, starting from your tailbone, then lower back, then mid-back, until your body forms a straight diagonal line from shoulders to knees.',
      'Pause at the top for a breath, then reverse the motion just as slowly, laying your spine back down bead by bead from the top of your back down to your tailbone.',
      'That’s one repetition. Do 8 to 10 repetitions, moving slowly enough to feel each part of your back touch down in sequence rather than dropping all at once.',
    ],
    safetyNotes: [
      'This is deliberately slower than a standard glute bridge — the point is spine control, so resist the urge to rush up and down.',
      'If you feel a pinch in your lower back at the top, don’t lift as high — stop where your body forms a straight line and go no further.',
    ],
  },
  {
    id: 'pilates-side-leg-lift',
    name: 'Side-Lying Leg Lift',
    category: 'pilates',
    musclesWorked: 'Outer hip and thigh (hip abductors), with core stability',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Lie on your side with your legs stacked one on top of the other, knees straight, body in one long line from head to feet. Rest your head on your bottom arm (bend that elbow like a pillow) or on a folded towel.',
      'Place your top hand flat on the floor in front of your chest for balance.',
      'Keeping your top leg straight and your hips stacked one directly above the other (don’t let your top hip roll backward), lift your top leg upward until it’s about hip height — roughly a foot off the floor, no higher than where your hip would let your leg swing without tilting your body.',
      'Lower it back down under control until it lightly touches your bottom leg. That’s one repetition.',
      'Do 10 to 15 repetitions, then roll over and repeat on the other side.',
    ],
    safetyNotes: [
      'Keep your toes pointing forward, not up toward the ceiling — rolling your hip backward to lift higher is a common habit but takes the work out of the hip and into momentum instead.',
      'If balance is hard, bend your bottom leg for a wider, more stable base.',
    ],
  },
  {
    id: 'pilates-spine-stretch',
    name: 'Seated Spine Stretch Forward',
    category: 'pilates',
    musclesWorked: 'Spine mobility and hamstring flexibility, gentle core engagement',
    equipment: 'A mat or carpeted floor (a folded towel under your hips is optional if your hips feel tight)',
    steps: [
      'Sit up tall on the floor with your legs extended straight in front of you, slightly wider than hip-width, feet flexed so your toes point toward the ceiling.',
      'Reach both arms straight out in front of you at shoulder height, palms facing down, like you’re reaching toward a shelf in front of you.',
      'Breathe in to sit up as tall as possible, imagining the crown of your head reaching toward the ceiling.',
      'Breathe out and round your spine forward from the top down — chin toward chest first, then upper back, then lower back — reaching your fingertips forward and down as if trying to touch a wall a few feet in front of your feet, without forcing your chest to your knees.',
      'Breathe in and slowly stack your spine back up to sitting tall, one section at a time, finishing with your head last.',
      'Do 6 to 8 slow repetitions, moving with your breath.',
    ],
    safetyNotes: [
      'This is a rounding, reaching stretch, not a bounce — keep the movement slow and controlled, never bouncing to reach further.',
      'If your hamstrings are tight, bend your knees slightly — the point is the spine movement, not touching your toes.',
    ],
  },
  {
    id: 'pilates-cat-cow',
    name: 'Cat-Cow Spine Warm-Up',
    category: 'pilates',
    musclesWorked: 'Spine mobility and gentle core activation — a good warm-up before the other exercises above',
    equipment: 'A mat or carpeted floor',
    steps: [
      'Get on your hands and knees, hands directly under your shoulders and knees directly under your hips (same setup as Bird Dog above), back in a neutral tabletop position.',
      'Breathe in, and let your belly drop gently toward the floor while your tailbone and chest lift slightly upward, like a shallow letter U from tail to head — this is "Cow." Your gaze follows gently upward, not straining your neck.',
      'Breathe out, and round your entire spine upward toward the ceiling, tucking your chin toward your chest and your tailbone underneath you, like an angry cat arching its back — this is "Cat."',
      'Continue flowing slowly between these two shapes, one breath per movement, for 8 to 10 full cycles.',
    ],
    safetyNotes: [
      'Keep the movement slow and tied to your breathing — this is a warm-up and mobility exercise, not a strength challenge, so there’s no need to force a bigger range than feels comfortable.',
      'If your wrists ache, try making loose fists and resting on your knuckles instead of flat palms.',
    ],
  },
];

export function getExerciseById(id) {
  return EXERCISES.find((e) => e.id === id);
}

export function exercisesByCategory(category) {
  if (!category || category === 'all') return EXERCISES;
  return EXERCISES.filter((e) => e.category === category);
}
