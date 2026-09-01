// Content for the "having a moment" in-app support flow. Written to be
// warm and specific, never shaming, never framed as "resist the urge" —
// the point is a brief pause and a moment of self-check, not forcing an
// outcome. Grounding exercises use touch/sound/smell instead of sight,
// since this app's primary user is blind.

export const FEELINGS = [
  {
    id: 'stressed',
    label: 'Stressed or wound up',
    response:
      'That tension has to go somewhere — food is fast, but it isn’t the only way to let it out.',
  },
  {
    id: 'bored',
    label: 'Bored',
    response:
      'Boredom eating usually isn’t about hunger — it’s about wanting something to do with your hands or your attention.',
  },
  {
    id: 'tired',
    label: 'Tired or drained',
    response:
      'Low energy can make food feel like the fastest fix. Sometimes what your body’s actually asking for is rest, not fuel.',
  },
  {
    id: 'low',
    label: 'Sad or low',
    response:
      'Food can feel like comfort when you’re down, and there’s nothing wrong with reaching for that. This is just a check for whether something else might reach the actual feeling underneath.',
  },
  {
    id: 'just-eat',
    label: 'Honestly? I just want to eat, and that’s okay',
    response: 'That’s a completely valid choice. You don’t need a reason.',
  },
];

export const BREATHING_STEPS = [
  { phase: 'Breathe in', seconds: 4 },
  { phase: 'Hold', seconds: 4 },
  { phase: 'Breathe out', seconds: 6 },
  { phase: 'Hold', seconds: 2 },
];
export const BREATHING_CYCLES = 5;

export const GROUNDING_STEPS = [
  'Notice 3 things you can hear right now — near or far, loud or quiet.',
  'Notice 2 things you can feel — the texture of your clothes, the surface under your hands, the temperature of the air.',
  'Take one slow breath, and notice how your chest and shoulders feel as it moves.',
];

export const CLOSING_MESSAGE =
  'However you decide to move from here is okay. Checking in with yourself matters more than whether you eat or not.';
