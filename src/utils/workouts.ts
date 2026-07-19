export type Gender = 'men' | 'women';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  name: string;
  duration: string;
  reps?: string;
}

export interface ExerciseDetail {
  description: string;
  commonMistakes: string[];
  musclesWorked: string;
}

export const EXERCISE_DETAILS: Record<string, ExerciseDetail> = {
  'Regular Push-Ups': {
    description: 'Start in a high plank with hands slightly wider than shoulder-width. Lower your chest to the floor, then push back up to full arm extension.',
    commonMistakes: ['Flaring elbows out to 90 degrees', 'Letting hips sag or pike up', 'Not going through full range of motion'],
    musclesWorked: 'Chest, shoulders, triceps, core',
  },
  'Wide-Grip Push-Ups': {
    description: 'Same as regular push-ups but with hands placed wider than shoulder-width. This shifts more emphasis to the chest.',
    commonMistakes: ['Hands too wide causing shoulder strain', 'Reducing range of motion', 'Losing core tension'],
    musclesWorked: 'Chest, front delts, triceps',
  },
  'Incline Push-Ups': {
    description: 'Place your hands on a raised surface like a chair or wall. The higher the surface, the easier the exercise. Lower your chest and push back up.',
    commonMistakes: ['Standing too upright', 'Not maintaining a straight body line', 'Rushing through reps'],
    musclesWorked: 'Lower chest, triceps, core',
  },
  'Knee Push-Ups': {
    description: 'Perform push-ups from your knees instead of toes. Keep a straight line from head to knees. Lower and push with controlled tempo.',
    commonMistakes: ['Raising hips too high', 'Dropping head forward', 'Going too fast'],
    musclesWorked: 'Chest, shoulders, triceps',
  },
  'Plank Hold': {
    description: 'Hold a push-up position on your forearms. Keep your body in a straight line from head to heels. Engage your core and glutes.',
    commonMistakes: ['Hips sagging toward the floor', 'Hiking hips too high', 'Holding breath'],
    musclesWorked: 'Core, shoulders, glutes',
  },
  'Jumping Jacks': {
    description: 'Start with feet together and arms at your sides. Jump while spreading your feet and raising your arms overhead, then return to start.',
    commonMistakes: ['Landing stiff-legged', 'Not raising arms fully', 'Moving too slowly to get heart rate up'],
    musclesWorked: 'Full body, cardio',
  },
  'Push-Ups': {
    description: 'Standard push-up from toes. Lower your chest to the floor with elbows at 45 degrees, then push back up explosively.',
    commonMistakes: ['Elbows flaring too wide', 'Sagging hips', 'Half reps'],
    musclesWorked: 'Chest, shoulders, triceps, core',
  },
  'Bodyweight Squats': {
    description: 'Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair, then drive through your heels to stand.',
    commonMistakes: ['Knees caving inward', 'Rising onto toes', 'Rounding the lower back'],
    musclesWorked: 'Quads, glutes, hamstrings',
  },
  'Walking Lunges': {
    description: 'Step forward into a lunge with your front knee over your ankle, back knee hovering above the ground. Push off and step into the next lunge.',
    commonMistakes: ['Front knee going past toes', 'Torso leaning forward', 'Taking too short a step'],
    musclesWorked: 'Quads, glutes, hamstrings, core',
  },
  'Mountain Climbers': {
    description: 'Start in a high plank. Alternate driving your knees toward your chest in a running motion while keeping your hips level.',
    commonMistakes: ['Bouncing hips up and down', 'Hands too far forward', 'Going too slow'],
    musclesWorked: 'Core, hip flexors, shoulders, cardio',
  },
  'Plank': {
    description: 'Hold a straight body position on your forearms and toes. Keep your core braced and breathe steadily throughout.',
    commonMistakes: ['Hips sagging', 'Butt in the air', 'Looking up straining the neck'],
    musclesWorked: 'Core, shoulders, glutes',
  },
  'Burpees': {
    description: 'Drop into a squat, kick feet back to plank, do a push-up, jump feet forward, then explode upward with arms overhead.',
    commonMistakes: ['Skipping the push-up', 'Not jumping at the top', 'Rounding the back when picking up feet'],
    musclesWorked: 'Full body, cardio',
  },
  'Diamond Push-Ups': {
    description: 'Place your hands together under your chest forming a diamond shape with thumbs and index fingers. Lower and push up.',
    commonMistakes: ['Hands too far from chest', 'Elbows flaring out', 'Not going low enough'],
    musclesWorked: 'Triceps, inner chest, shoulders',
  },
  'Pistol Squat Progression': {
    description: 'Single-leg squat with one leg extended forward. Use a chair or wall for assistance if needed. Lower until thigh is parallel, then stand.',
    commonMistakes: ['Leaning too far forward', 'Letting the extended leg touch the ground', 'Knee caving inward'],
    musclesWorked: 'Quads, glutes, balance, core',
  },
  'Pull-Ups / Inverted Rows': {
    description: 'Pull your body up to a bar with palms facing away, or row your chest to a low bar from underneath. Control the descent.',
    commonMistakes: ['Using momentum/kipping', 'Not going to full extension', 'Shrugging shoulders up'],
    musclesWorked: 'Back, biceps, grip, core',
  },
  'Plank to Shoulder Tap': {
    description: 'Hold a high plank. Alternate lifting one hand to tap the opposite shoulder while keeping your hips as still as possible.',
    commonMistakes: ['Rocking hips side to side', 'Rushing through taps', 'Hands too far forward'],
    musclesWorked: 'Core, shoulders, anti-rotation',
  },
  'Jump Squats': {
    description: 'Perform a bodyweight squat, then explode upward into a jump. Land softly with bent knees and immediately go into the next rep.',
    commonMistakes: ['Landing with straight legs', 'Not squatting deep enough', 'Landing loudly'],
    musclesWorked: 'Quads, glutes, calves, cardio',
  },
  'March in Place': {
    description: 'Stand tall and march, lifting knees to hip height. Swing your arms naturally. Keep a steady pace to warm up.',
    commonMistakes: ['Looking down', 'Not lifting knees high enough', 'Stiff arms'],
    musclesWorked: 'Hip flexors, legs, cardio warm-up',
  },
  'Wall Push-Ups': {
    description: 'Stand arm\'s length from a wall. Place hands on the wall and perform push-ups. The more upright you are, the easier it gets.',
    commonMistakes: ['Standing too close to the wall', 'Not going through full range', 'Flaring elbows'],
    musclesWorked: 'Chest, shoulders, triceps',
  },
  'Glute Bridges': {
    description: 'Lie on your back with knees bent, feet flat on the floor. Drive through your heels to lift your hips until your body forms a straight line. Squeeze at the top.',
    commonMistakes: ['Pushing through toes instead of heels', 'Over-arching the lower back', 'Rushing the movement'],
    musclesWorked: 'Glutes, hamstrings, core',
  },
  'Standing Side Leg Raises': {
    description: 'Stand tall and slowly lift one leg out to the side, keeping it straight. Lower with control. Switch sides after the set.',
    commonMistakes: ['Leaning the torso to compensate', 'Lifting too high too fast', 'Not controlling the descent'],
    musclesWorked: 'Outer thighs, hip abductors, glutes',
  },
  'Cat-Cow Stretch': {
    description: 'On all fours, alternate between arching your back (cow) and rounding it (cat). Move slowly with your breath.',
    commonMistakes: ['Rushing through the movement', 'Not engaging the core', 'Moving only the lower back'],
    musclesWorked: 'Spine mobility, core, back',
  },
  'Kneeling Plank': {
    description: 'Hold a plank position from your knees instead of toes. Keep your body in a straight line from head to knees. Brace your core.',
    commonMistakes: ['Hips too high or too low', 'Looking up straining neck', 'Not breathing'],
    musclesWorked: 'Core, shoulders',
  },
  'Sumo Squats': {
    description: 'Take a wide stance with toes pointed out. Lower your hips straight down, pushing knees out over toes. Drive back up squeezing your glutes.',
    commonMistakes: ['Knees caving inward', 'Leaning too far forward', 'Not going deep enough'],
    musclesWorked: 'Inner thighs, quads, glutes',
  },
  'Tricep Dips (chair)': {
    description: 'Place hands on the edge of a chair behind you. Lower your body by bending your elbows to 90 degrees, then push back up.',
    commonMistakes: ['Elbows flaring outward', 'Going too deep straining shoulders', 'Feet too far away making it too hard'],
    musclesWorked: 'Triceps, shoulders, chest',
  },
  'Reverse Lunges': {
    description: 'Step backward into a lunge, lowering your back knee toward the floor. Push through your front heel to return to standing.',
    commonMistakes: ['Front knee going past toes', 'Torso collapsing forward', 'Stepping back too short'],
    musclesWorked: 'Quads, glutes, hamstrings',
  },
  'Forearm Plank': {
    description: 'Hold a plank on your forearms. Keep elbows under shoulders and body in a straight line. Breathe steadily.',
    commonMistakes: ['Hips sagging', 'Butt piking up', 'Holding breath'],
    musclesWorked: 'Core, shoulders, glutes',
  },
  'Archer Push-Ups': {
    description: 'Wide hand placement. Lower toward one hand while the other arm straightens. Push back up and alternate sides.',
    commonMistakes: ['Not going low enough', 'Twisting the torso', 'Bending the straight arm'],
    musclesWorked: 'Chest, triceps, shoulders, core',
  },
  'Bulgarian Split Squats': {
    description: 'Place your rear foot on a raised surface. Lower into a lunge with the front leg, then drive back up. Keep your torso upright.',
    commonMistakes: ['Leaning too far forward', 'Front knee caving in', 'Rear foot too close to the bench'],
    musclesWorked: 'Quads, glutes, balance',
  },
  'Side Plank': {
    description: 'Stack your feet and hold yourself up on one forearm, body in a straight line. Hold, then switch sides.',
    commonMistakes: ['Hips dropping', 'Rolling forward', 'Not keeping shoulders stacked'],
    musclesWorked: 'Obliques, core, shoulders',
  },
  'Skater Jumps': {
    description: 'Leap laterally from one foot to the other, landing softly on the outside foot. Swing your arms for momentum. Mimic a speed skater.',
    commonMistakes: ['Landing stiff-legged', 'Not jumping laterally enough', 'Rounding the back'],
    musclesWorked: 'Glutes, quads, calves, cardio',
  },
};

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
      { name: 'Rest', duration: '30 sec' },
      { name: 'Push-Ups', duration: '60 sec', reps: 'standard form' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Bodyweight Squats', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Walking Lunges', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Mountain Climbers', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
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
      { name: 'Rest', duration: '30 sec' },
      { name: 'Diamond Push-Ups', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Pistol Squat Progression', duration: '60 sec', reps: 'assisted if needed' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Pull-Ups / Inverted Rows', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Plank to Shoulder Tap', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
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
      { name: 'Rest', duration: '30 sec' },
      { name: 'Wall Push-Ups', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Glute Bridges', duration: '60 sec', reps: 'squeeze at the top' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Standing Side Leg Raises', duration: '45 sec each side' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Cat-Cow Stretch', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
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
      { name: 'Rest', duration: '30 sec' },
      { name: 'Push-Ups (knee or full)', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Sumo Squats', duration: '60 sec', reps: 'wide stance' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Tricep Dips (chair)', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Reverse Lunges', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
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
      { name: 'Rest', duration: '30 sec' },
      { name: 'Archer Push-Ups', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Jump Squats', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Bulgarian Split Squats', duration: '60 sec each side' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Side Plank', duration: '45 sec each side' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Skater Jumps', duration: '60 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat 3 more rounds', duration: '~15 min' },
    ],
    tip: 'Archer push-ups build unilateral pressing strength. The bent arm does almost all the work.',
  },
];

export const getWorkouts = (gender: Gender, level: Level): Workout[] =>
  WORKOUTS.filter((w) => w.gender === gender && w.level === level);
