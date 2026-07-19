import { Exercise } from './workouts';

export interface DayPlan {
  day: string;
  exercises: Exercise[];
  coachTip: string;
}

export interface WeekPlan {
  week: number;
  label: string;
  days: DayPlan[];
}

export interface MonthPlan {
  month: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  coachMessage: string;
  weeks: WeekPlan[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  months: MonthPlan[];
}

const REST: Exercise = { name: 'Rest', duration: '10 sec' };

function rest(ex: Exercise): Exercise[] {
  return [ex, REST];
}

function circuit(exercises: Exercise[]): Exercise[] {
  const result: Exercise[] = [];
  exercises.forEach((ex, i) => {
    result.push(ex);
    if (i < exercises.length - 1) result.push(REST);
  });
  return result;
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'total-body-3',
    name: 'Total Body Transformation',
    description: 'A 3-month progressive program. Start building基础, then push limits.',
    months: [
      {
        month: 1,
        level: 'beginner',
        title: 'Foundation Month',
        coachMessage: 'This month is about building habits and form. Focus on controlled movements, not speed. Every rep counts.',
        weeks: [
          {
            week: 1,
            label: 'Week 1 — Learn the Moves',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Wall Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Take it slow. Focus on learning each movement correctly. Quality over quantity.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Knee Push-Ups', duration: '30 sec' },
                { name: 'Standing Side Leg Raises', duration: '30 sec' },
                { name: 'Cat-Cow Stretch', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Breathe through each exercise. If something hurts (not muscle burn), stop and check your form.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Incline Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Rest between sets if you need to. This is your journey — go at your pace.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Wall Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Standing Side Leg Raises', duration: '30 sec' },
                { name: 'Cat-Cow Stretch', duration: '30 sec' },
              ]), coachTip: 'Halfway through the week! Your body is adapting. Keep showing up.' },
              { day: 'Friday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Knee Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Last day of the week. Finish strong. You earned the weekend rest.' },
            ],
          },
          {
            week: 2,
            label: 'Week 2 — Build Consistency',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'You did these moves last week. Now do them with more confidence.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Incline Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Standing Side Leg Raises', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Your form is getting better. Feel the muscles working, not just the movement.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Knee Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Cat-Cow Stretch', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Mid-week check-in. How are you feeling? Listen to your body.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Wall Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'One more day until rest. Push through — you are stronger than you think.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Standing Side Leg Raises', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Week 2 done. You are building something real. Keep going.' },
            ],
          },
          {
            week: 3,
            label: 'Week 3 — Push a Little More',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Week 3. You have earned the right to push harder. Try to do one more rep than last week.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Incline Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Your body is getting stronger. Trust the process.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Knee Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Standing Side Leg Raises', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Breathe. Focus. You are not just exercising — you are training.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Cat-Cow Stretch', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Almost at the end of month 1. Feel the progress.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Incline Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Final day of month 1. You survived. Next month, we level up.' },
            ],
          },
          {
            week: 4,
            label: 'Week 4 — Solidify',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Last week of month 1. You know these moves now. Make them count.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Knee Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'You are about to finish month 1. Be proud of yourself.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Standing Side Leg Raises', duration: '30 sec' },
                { name: 'Kneeling Plank', duration: '30 sec' },
              ]), coachTip: 'Two days left. Keep the intensity up.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'March in Place', duration: '30 sec' },
                { name: 'Incline Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Cat-Cow Stretch', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Tomorrow is your last day. Give it everything.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Glute Bridges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Month 1 complete! You built the foundation. Month 2 — we build power.' },
            ],
          },
        ],
      },
      {
        month: 2,
        level: 'intermediate',
        title: 'Power Month',
        coachMessage: 'You have the base. Now we add intensity. Longer holds, harder variations, more rounds. Time to level up.',
        weeks: [
          {
            week: 1,
            label: 'Week 5 — Level Up',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Welcome to month 2. New exercises, same dedication. You are ready for this.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
              ]), coachTip: 'Diamond push-ups target your triceps. If too hard, go back to regular push-ups.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'You are doing more exercises per session now. That is real progress.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
              ]), coachTip: 'Focus on depth in your squats. Lower = more muscle activation.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Bodyweight Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'End of the week. You handled the increased difficulty. That is what growth looks like.' },
            ],
          },
          {
            week: 2,
            label: 'Week 6 — Build Endurance',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
              ]), coachTip: 'More exercises per session builds endurance. Embrace the burn.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Your body is adapting. What felt hard last week feels manageable now.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
              ]), coachTip: 'Keep your core tight during mountain climbers. Hips level, knees driving.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'You are halfway through month 2. The hard part is over — keep moving.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Week 6 complete. Month 3 is the final push — advanced mode.' },
            ],
          },
          {
            week: 3,
            label: 'Week 7 — Increase Volume',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'Push yourself. You are stronger than when you started.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Control your breathing. In through the nose, out through the mouth.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'You are almost at the top. The last stretch is always the hardest.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'One more day. Leave nothing in the tank tomorrow.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Month 2 done. You are now ready for the final level.' },
            ],
          },
          {
            week: 4,
            label: 'Week 8 — Peak Performance',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'Last week of intermediate. Prove to yourself how far you have come.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Every workout this month has prepared you for what comes next.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Two more days. You have earned the right to call yourself strong.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Tomorrow is your final intermediate day. Make it legendary.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Jumping Jacks', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Sumo Squats', duration: '30 sec' },
                { name: 'Tricep Dips (chair)', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'Intermediate complete. You are no longer a beginner. Month 3 — beast mode.' },
            ],
          },
        ],
      },
      {
        month: 3,
        level: 'advanced',
        title: 'Beast Mode',
        coachMessage: 'This is it. The final month. Advanced exercises, maximum effort. You have built the body — now unleash it.',
        weeks: [
          {
            week: 1,
            label: 'Week 9 — Enter the Beast',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Welcome to the advanced tier. Burpees are tough — modify if needed, but do not skip them.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Pistol Squat Progression', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
              ]), coachTip: 'Pistol squats are hard. Use a chair for support. You will get better each week.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'You have come so far. This is not the time to slow down.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
              ]), coachTip: 'Your body is a machine now. Feed it well, push it hard.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Week 9 done. The hardest week is behind you. Everything else is downhill.' },
            ],
          },
          {
            week: 2,
            label: 'Week 10 — Maximum Effort',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'Give 100% today. Not 99. Every rep matters.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Pistol Squat Progression', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
              ]), coachTip: 'You are training like an athlete now. Move with purpose.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Mid-month. You are halfway to the finish line.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'Pain is temporary. Pride is forever. Keep pushing.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
              ]), coachTip: 'Week 10 complete. Two more weeks. You are unstoppable.' },
            ],
          },
          {
            week: 3,
            label: 'Week 11 — Final Push',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'This is the week. Leave everything on the floor.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Pistol Squat Progression', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
              ]), coachTip: 'You are not the same person who started this program. Feel that power.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
              ]), coachTip: 'Three days left after today. You can see the finish line.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
              ]), coachTip: 'Tomorrow is your second-to-last day. Make it count.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Week 11 done. One week left. You are almost a legend.' },
            ],
          },
          {
            week: 4,
            label: 'Week 12 — The Finish Line',
            days: [
              { day: 'Monday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'Final week. You have one job: give everything you have.' },
              { day: 'Tuesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Pistol Squat Progression', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
              ]), coachTip: 'You started as a beginner. Look at you now.' },
              { day: 'Wednesday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Plank', duration: '30 sec' },
                { name: 'Walking Lunges', duration: '30 sec' },
              ]), coachTip: 'Two more days. This is what champions are made of.' },
              { day: 'Thursday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Diamond Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Mountain Climbers', duration: '30 sec' },
                { name: 'Plank to Shoulder Tap', duration: '30 sec' },
              ]), coachTip: 'Tomorrow is your last day. Leave nothing behind.' },
              { day: 'Friday', exercises: circuit([
                { name: 'Burpees', duration: '30 sec' },
                { name: 'Push-Ups', duration: '30 sec' },
                { name: 'Jump Squats', duration: '30 sec' },
                { name: 'Skater Jumps', duration: '30 sec' },
                { name: 'Forearm Plank', duration: '30 sec' },
                { name: 'Reverse Lunges', duration: '30 sec' },
              ]), coachTip: 'PROGRAM COMPLETE. You did it. 12 weeks. From beginner to beast. I am proud of you.' },
            ],
          },
        ],
      },
    ],
  },
];

export function getPlanDays(plan: WorkoutPlan, months: number): number {
  return months * 4 * 5;
}

export function getDayPlan(plan: WorkoutPlan, dayIndex: number): { month: MonthPlan; week: WeekPlan; day: DayPlan } | null {
  let counter = 0;
  const maxMonths = plan.months.length;
  for (const month of plan.months) {
    for (const week of month.weeks) {
      for (const day of week.days) {
        if (counter === dayIndex) return { month, week, day };
        counter++;
      }
    }
  }
  return null;
}
