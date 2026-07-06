export type Gender = 'men' | 'women';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  name: string;
  duration: string;
  reps?: string;
}

export interface Workout {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  level: Level;
  gender: Gender;
  exercises: Exercise[];
  tip: string;
}

export const WORKOUT_QUOTES: string[] = [
  'Show up. Even on the days you do not feel like it.',
  'The work you do today builds the person you become tomorrow.',
  'Strength starts in the mind before it shows in the body.',
  'Small steps. Every day. That is the secret.',
  'You are one workout away from a good mood.',
];

export const WORKOUTS: Workout[] = [
  {
    id: 'men-pushup-10',
    title: 'Push-Up 10',
    tagline: 'Ten minutes. Nothing but push-ups and willpower.',
    duration: '10 min',
    level: 'beginner',
    gender: 'men',
    exercises: [
      { name: 'Regular Push-Ups', duration: '60 sec', reps: 'as many as you can' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Wide-Grip Push-Ups', duration: '45 sec', reps: 'chest wide' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Incline Push-Ups', duration: '45 sec', reps: 'hands on a chair or wall' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Knee Push-Ups', duration: '45 sec', reps: 'controlled tempo' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Plank Hold', duration: '60 sec' },
      { name: 'Repeat round one more time', duration: '~5 min' },
    ],
    tip: 'Keep your core tight and your elbows at about 45 degrees from your body. Stop if your lower back sags.',
  },
  {
    id: 'men-foundation-15',
    title: 'Iron Foundation',
    tagline: 'Build the base. Every muscle, every minute.',
    duration: '15 min',
    level: 'intermediate',
    gender: 'men',
    exercises: [
      { name: 'Jumping Jacks', duration: '60 sec' },
      { name: 'Push-Ups', duration: '60 sec', reps: 'standard form' },
      { name: 'Bodyweight Squats', duration: '60 sec' },
      { name: 'Walking Lunges', duration: '60 sec' },
      { name: 'Mountain Climbers', duration: '60 sec' },
      { name: 'Plank', duration: '45 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat 2 more rounds', duration: '~10 min' },
    ],
    tip: 'Drive through your heels on squats. Keep your chest up on lunges — no leaning forward.',
  },
  {
    id: 'men-beast-20',
    title: 'Beast Mode',
    tagline: 'Twenty minutes that separate the committed from the curious.',
    duration: '20 min',
    level: 'advanced',
    gender: 'men',
    exercises: [
      { name: 'Burpees', duration: '60 sec' },
      { name: 'Diamond Push-Ups', duration: '60 sec' },
      { name: 'Pistol Squat Progression', duration: '60 sec', reps: 'assisted if needed' },
      { name: 'Pull-Ups / Inverted Rows', duration: '60 sec' },
      { name: 'Plank to Shoulder Tap', duration: '60 sec' },
      { name: 'Jump Squats', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat 3 more rounds', duration: '~15 min' },
    ],
    tip: 'Quality over speed. Slow eccentric on the push-ups turns this from cardio into real strength work.',
  },
  {
    id: 'women-grace-10',
    title: 'Grace Start',
    tagline: 'A gentle ten minutes. Move. Breathe. Begin.',
    duration: '10 min',
    level: 'beginner',
    gender: 'women',
    exercises: [
      { name: 'March in Place', duration: '60 sec' },
      { name: 'Wall Push-Ups', duration: '60 sec' },
      { name: 'Glute Bridges', duration: '60 sec', reps: 'squeeze at the top' },
      { name: 'Standing Side Leg Raises', duration: '45 sec each side' },
      { name: 'Cat-Cow Stretch', duration: '60 sec' },
      { name: 'Kneeling Plank', duration: '30 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat one more round', duration: '~5 min' },
    ],
    tip: 'Glute bridges are magic. Slow the tempo down to three seconds up, three seconds down.',
  },
  {
    id: 'women-power-15',
    title: 'Power Within',
    tagline: 'Fifteen minutes to feel strong, not just tired.',
    duration: '15 min',
    level: 'intermediate',
    gender: 'women',
    exercises: [
      { name: 'Jumping Jacks', duration: '60 sec' },
      { name: 'Push-Ups (knee or full)', duration: '60 sec' },
      { name: 'Sumo Squats', duration: '60 sec', reps: 'wide stance' },
      { name: 'Tricep Dips (chair)', duration: '60 sec' },
      { name: 'Reverse Lunges', duration: '60 sec' },
      { name: 'Forearm Plank', duration: '45 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat 2 more rounds', duration: '~10 min' },
    ],
    tip: 'Sumo squats light up the inner thigh and glutes. Drive the knees out over the toes.',
  },
  {
    id: 'women-warrior-20',
    title: 'Warrior Within',
    tagline: 'Twenty minutes of total-body intensity.',
    duration: '20 min',
    level: 'advanced',
    gender: 'women',
    exercises: [
      { name: 'Burpees', duration: '60 sec' },
      { name: 'Archer Push-Ups', duration: '60 sec' },
      { name: 'Jump Squats', duration: '60 sec' },
      { name: 'Bulgarian Split Squats', duration: '60 sec each side' },
      { name: 'Side Plank', duration: '45 sec each side' },
      { name: 'Skater Jumps', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat 3 more rounds', duration: '~15 min' },
    ],
    tip: 'Archer push-ups build unilateral pressing strength. The bent arm does almost all the work.',
  },
];

export const getWorkouts = (gender: Gender, level: Level): Workout[] =>
  WORKOUTS.filter((w) => w.gender === gender && w.level === level);
