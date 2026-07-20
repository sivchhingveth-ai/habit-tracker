import React from 'react';

type AnimType =
  | 'pushup' | 'squat' | 'plank' | 'jumpingjacks' | 'lunge'
  | 'mountainclimber' | 'armcircles' | 'highknees' | 'buttkicks'
  | 'sideplank' | 'glutebridge' | 'walk' | 'stretch' | 'twist'
  | 'dip' | 'legraise' | 'skater' | 'hold' | 'calf' | 'pullup' | 'default';

const MAP: Record<string, AnimType> = {
  'Regular Push-Ups': 'pushup', 'Push-Ups': 'pushup', 'Push-Ups (knee or full)': 'pushup',
  'Wide-Grip Push-Ups': 'pushup', 'Incline Push-Ups': 'pushup', 'Knee Push-Ups': 'pushup',
  'Wall Push-Ups': 'pushup', 'Diamond Push-Ups': 'pushup', 'Archer Push-Ups': 'pushup',
  'Bodyweight Squats': 'squat', 'Sumo Squats': 'squat',
  'Jump Squats': 'squat', 'Pistol Squat Progression': 'squat',
  'Bulgarian Split Squats': 'lunge',
  'Plank Hold': 'plank', 'Plank': 'plank', 'Forearm Plank': 'plank',
  'Kneeling Plank': 'plank', 'Side Plank': 'sideplank',
  'Jumping Jacks': 'jumpingjacks',
  'Walking Lunges': 'lunge', 'Reverse Lunges': 'lunge',
  'Mountain Climbers': 'mountainclimber',
  'Arm Circles': 'armcircles', 'Shoulder Rolls': 'armcircles',
  'High Knees': 'highknees', 'Butt Kicks': 'buttkicks', 'March in Place': 'walk',
  'Glute Bridges': 'glutebridge', 'Butt Bridge': 'glutebridge',
  'Tricep Dips (chair)': 'dip',
  'Torso Twists': 'twist', 'Cat-Cow Stretch': 'stretch',
  'Skater Jumps': 'skater',
  'Standing Side Leg Raises': 'legraise',
  'Plank to Shoulder Tap': 'plank',
  'Pull-Ups / Inverted Rows': 'pullup',
};

// Stick figure helper - draws a complete person with connected limbs
// cx, cy = center of torso top (shoulder level)
function StickFigure({ cx, cy, headR = 7, torsoLen = 28, upperArm = 16, lowerArm = 14, upperLeg = 18, lowerLeg = 18, opacity = 0.9 }: {
  cx: number; cy: number; headR?: number; torsoLen?: number;
  upperArm?: number; lowerArm?: number; upperLeg?: number; lowerLeg?: number; opacity?: number;
}) {
  const headCY = cy - headR - 2;
  const hipY = cy + torsoLen;
  return { cx, cy, headCY, hipY, headR, torsoLen, upperArm, lowerArm, upperLeg, lowerLeg, opacity };
}

const C = '#ffffff';

// ── PUSH-UP ──
const PushUp: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    {/* Floor line */}
    <line x1="30" y1="72" x2="170" y2="72" stroke={C} strokeWidth="1" opacity="0.1" />
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,8;0,0" dur="2s" repeatCount="indefinite" />
      {/* Head */}
      <circle cx="155" cy="42" r="7" fill={C} opacity="0.9" />
      {/* Torso - straight line from shoulders to hips */}
      <line x1="155" y1="49" x2="65" y2="50" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Upper arms - from shoulders down to elbows */}
      <line x1="148" y1="50" x2="148" y2="62" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="62;56;62" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Forearms - elbows to ground */}
      <line x1="148" y1="62" x2="155" y2="72" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      {/* Upper legs - hips back */}
      <line x1="65" y1="50" x2="42" y2="52" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      {/* Lower legs */}
      <line x1="42" y1="52" x2="35" y2="72" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

// ── SQUAT ──
const Squat: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="22" r="8" fill={C} opacity="0.9">
        <animate attributeName="cy" values="22;42;22" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Neck to shoulders */}
      <line x1="100" y1="30" x2="100" y2="36" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* Torso */}
      <line x1="100" y1="36" x2="100" y2="70" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="36;50;36" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="70;84;70" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Left upper arm - forward */}
      <line x1="100" y1="40" x2="125" y2="44" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y1" values="40;54;40" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="44;58;44" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Left forearm */}
      <line x1="125" y1="44" x2="140" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="44;58;44" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="42;56;42" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Right upper arm - forward */}
      <line x1="100" y1="40" x2="75" y2="44" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y1" values="40;54;40" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="44;58;44" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Right forearm */}
      <line x1="75" y1="44" x2="60" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="44;58;44" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="42;56;42" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Left upper leg */}
      <line x1="96" y1="70" x2="82" y2="100" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="70;84;70" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="82;75;82" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="100;108;100" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Left lower leg */}
      <line x1="82" y1="100" x2="85" y2="130" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="82;75;82" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y1" values="100;108;100" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Right upper leg */}
      <line x1="104" y1="70" x2="118" y2="100" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="70;84;70" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="118;125;118" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="100;108;100" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Right lower leg */}
      <line x1="118" y1="100" x2="115" y2="130" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="118;125;118" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y1" values="100;108;100" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Feet */}
      <line x1="85" y1="130" x2="75" y2="132" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="115" y1="130" x2="125" y2="132" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    </g>
  </svg>
);

// ── PLANK ──
const Plank: React.FC = () => (
  <svg viewBox="0 0 200 80" className="w-full h-full">
    <line x1="25" y1="65" x2="175" y2="65" stroke={C} strokeWidth="1" opacity="0.1" />
    <g>
      {/* Head */}
      <circle cx="160" cy="32" r="6" fill={C} opacity="0.9" />
      {/* Neck */}
      <line x1="155" y1="35" x2="153" y2="38" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* Torso - straight line */}
      <line x1="153" y1="38" x2="60" y2="40" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="38;39.5;38" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="40;41.5;40" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Upper arms */}
      <line x1="148" y1="40" x2="148" y2="52" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
      {/* Forearms */}
      <line x1="148" y1="52" x2="145" y2="65" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="138" y1="52" x2="135" y2="65" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Upper legs */}
      <line x1="60" y1="40" x2="45" y2="42" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      {/* Lower legs */}
      <line x1="45" y1="42" x2="32" y2="60" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

// ── JUMPING JACKS ──
const JumpingJacks: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9" />
      {/* Neck */}
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* Torso */}
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Left arm - swings up */}
      <line x1="100" y1="32" x2="70" y2="20" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="x2" values="70;72;70" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;48;20" dur="1s" repeatCount="indefinite" />
      </line>
      {/* Left forearm */}
      <line x1="70" y1="20" x2="55" y2="10" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x1" values="70;72;70" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y1" values="20;48;20" dur="1s" repeatCount="indefinite" />
        <animate attributeName="x2" values="55;62;55" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="10;55;10" dur="1s" repeatCount="indefinite" />
      </line>
      {/* Right arm - swings up */}
      <line x1="100" y1="32" x2="130" y2="20" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="x2" values="130;128;130" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;48;20" dur="1s" repeatCount="indefinite" />
      </line>
      {/* Right forearm */}
      <line x1="130" y1="20" x2="145" y2="10" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x1" values="130;128;130" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y1" values="20;48;20" dur="1s" repeatCount="indefinite" />
        <animate attributeName="x2" values="145;138;145" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y2" values="10;55;10" dur="1s" repeatCount="indefinite" />
      </line>
      {/* Left leg - spreads */}
      <line x1="97" y1="62" x2="72" y2="100" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x2" values="72;88;72" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="72" y1="100" x2="65" y2="130" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="72;88;72" dur="1s" repeatCount="indefinite" />
        <animate attributeName="x2" values="65;85;65" dur="1s" repeatCount="indefinite" />
      </line>
      {/* Right leg - spreads */}
      <line x1="103" y1="62" x2="128" y2="100" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x2" values="128;112;128" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="128" y1="100" x2="135" y2="130" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="128;112;128" dur="1s" repeatCount="indefinite" />
        <animate attributeName="x2" values="135;115;135" dur="1s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── LUNGE ──
const Lunge: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="18" r="8" fill={C} opacity="0.9">
        <animate attributeName="cy" values="18;30;18" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="26" x2="100" y2="30" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* Torso */}
      <line x1="100" y1="30" x2="100" y2="64" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="30;42;30" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="64;76;64" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Front upper leg */}
      <line x1="96" y1="64" x2="78" y2="90" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="64;76;64" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="90;100;90" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Front lower leg */}
      <line x1="78" y1="90" x2="82" y2="125" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="90;100;90" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Back upper leg */}
      <line x1="104" y1="64" x2="125" y2="88" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="64;76;64" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="88;98;88" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Back lower leg */}
      <line x1="125" y1="88" x2="132" y2="120" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.4">
        <animate attributeName="y1" values="88;98;88" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="120;130;120" dur="2.5s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── MOUNTAIN CLIMBERS ──
const MountainClimber: React.FC = () => (
  <svg viewBox="0 0 200 80" className="w-full h-full">
    <line x1="25" y1="62" x2="175" y2="62" stroke={C} strokeWidth="1" opacity="0.1" />
    <g>
      <circle cx="160" cy="24" r="6" fill={C} opacity="0.9" />
      <line x1="155" y1="28" x2="152" y2="32" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="152" y1="32" x2="58" y2="35" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Arms */}
      <line x1="148" y1="35" x2="150" y2="52" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <line x1="140" y1="36" x2="142" y2="52" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* Left knee drives forward */}
      <line x1="70" y1="35" x2="90" y2="50" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x2" values="90;75;90" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="y2" values="50;42;50" dur="0.8s" repeatCount="indefinite" />
      </line>
      <line x1="90" y1="50" x2="85" y2="62" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="90;75;90" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="y1" values="50;42;50" dur="0.8s" repeatCount="indefinite" />
      </line>
      {/* Right knee drives forward */}
      <line x1="82" y1="35" x2="100" y2="48" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x2" values="100;82;100" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="y2" values="48;40;48" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
      </line>
      <line x1="100" y1="48" x2="95" y2="62" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.4">
        <animate attributeName="x1" values="100;82;100" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="y1" values="48;40;48" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
      </line>
    </g>
  </svg>
);

// ── ARM CIRCLES ──
const ArmCircles: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="18" r="8" fill={C} opacity="0.9" />
      <line x1="100" y1="26" x2="100" y2="30" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="30" x2="100" y2="64" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Left arm - full circle */}
      <line x1="100" y1="34" x2="65" y2="34" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 100 34;360 100 34" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Right arm - full circle opposite */}
      <line x1="100" y1="34" x2="135" y2="34" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 100 34;-360 100 34" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Legs */}
      <line x1="97" y1="64" x2="90" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      <line x1="103" y1="64" x2="110" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// ── HIGH KNEES ──
const HighKnees: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="14" r="8" fill={C} opacity="0.9" />
      <line x1="100" y1="22" x2="100" y2="26" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="26" x2="100" y2="60" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Left arm swings */}
      <line x1="96" y1="30" x2="82" y2="50" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="50;30;50" dur="0.6s" repeatCount="indefinite" />
      </line>
      {/* Right arm swings */}
      <line x1="104" y1="30" x2="118" y2="50" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="50;30;50" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      </line>
      {/* Left knee drives up high */}
      <line x1="96" y1="60" x2="88" y2="45" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y2" values="45;38;45" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1="88" y1="45" x2="82" y2="60" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="45;38;45" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y2" values="60;52;60" dur="0.6s" repeatCount="indefinite" />
      </line>
      {/* Right knee drives up */}
      <line x1="104" y1="60" x2="112" y2="45" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y2" values="45;38;45" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      </line>
      <line x1="112" y1="45" x2="118" y2="60" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.4">
        <animate attributeName="y1" values="45;38;45" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y2" values="60;52;60" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      </line>
    </g>
  </svg>
);

// ── BUTT KICKS ──
const ButtKicks: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9" />
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Arms swing */}
      <line x1="96" y1="32" x2="84" y2="48" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="48;36;48" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1="104" y1="32" x2="116" y2="48" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="48;36;48" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      </line>
      {/* Left leg - heel kicks back to glute */}
      <line x1="96" y1="62" x2="88" y2="80" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x2" values="88;80;88" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y2" values="80;65;80" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1="88" y1="80" x2="82" y2="100" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="88;80;88" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y1" values="80;65;80" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="x2" values="82;78;82" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y2" values="100;82;100" dur="0.6s" repeatCount="indefinite" />
      </line>
      {/* Right leg */}
      <line x1="104" y1="62" x2="112" y2="80" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x2" values="112;120;112" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y2" values="80;65;80" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      </line>
      <line x1="112" y1="80" x2="118" y2="100" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.4">
        <animate attributeName="x1" values="112;120;112" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y1" values="80;65;80" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="x2" values="118;122;118" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y2" values="100;82;100" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
      </line>
    </g>
  </svg>
);

// ── WALK / MARCH ──
const Walk: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9" />
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Arms swing */}
      <line x1="96" y1="32" x2="82" y2="48" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="48;36;48" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="104" y1="32" x2="118" y2="48" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="48;36;48" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
      </line>
      {/* Left leg stride forward */}
      <line x1="96" y1="62" x2="82" y2="90" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x2" values="82;105;82" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="82" y1="90" x2="78" y2="125" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="82;105;82" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="78;108;78" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Right leg stride back */}
      <line x1="104" y1="62" x2="118" y2="90" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x2" values="118;95;118" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="118" y1="90" x2="122" y2="125" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.4">
        <animate attributeName="x1" values="118;95;118" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="122;92;122" dur="1.5s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── CAT-COW STRETCH ──
const Stretch: React.FC = () => (
  <svg viewBox="0 0 200 90" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="162" cy="28" r="6" fill={C} opacity="0.9">
        <animate attributeName="cy" values="28;36;28" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Spine - curves up and down */}
      <path d="M 70,38 C 100,28 130,28 158,32" stroke={C} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8">
        <animate attributeName="d" values="M 70,38 C 100,28 130,28 158,32;M 70,38 C 100,48 130,48 158,36;M 70,38 C 100,28 130,28 158,32" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Front arms */}
      <line x1="152" y1="34" x2="152" y2="58" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <line x1="145" y1="35" x2="145" y2="58" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* Back legs */}
      <line x1="72" y1="38" x2="72" y2="58" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// ── TORSO TWISTS ──
const Twist: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="18" r="8" fill={C} opacity="0.9">
        <animate attributeName="cx" values="100;88;112;100" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="26" x2="100" y2="30" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* Torso */}
      <line x1="100" y1="30" x2="100" y2="64" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="x1" values="100;88;112;100" dur="2s" repeatCount="indefinite" />
        <animate attributeName="x2" values="100;88;112;100" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Arms out to sides */}
      <line x1="100" y1="34" x2="65" y2="38" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="x1" values="100;88;112;100" dur="2s" repeatCount="indefinite" />
        <animate attributeName="x2" values="65;55;75;65" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="34" x2="135" y2="38" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="x1" values="100;88;112;100" dur="2s" repeatCount="indefinite" />
        <animate attributeName="x2" values="135;125;145;135" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Legs */}
      <line x1="96" y1="64" x2="90" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      <line x1="104" y1="64" x2="110" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// ── TRICEP DIPS ──
const Dip: React.FC = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    {/* Chair */}
    <rect x="55" y="20" width="6" height="60" rx="3" fill={C} opacity="0.15" />
    <rect x="55" y="20" width="40" height="5" rx="2.5" fill={C} opacity="0.15" />
    <g>
      {/* Head */}
      <circle cx="105" cy="24" r="7" fill={C} opacity="0.9">
        <animate attributeName="cy" values="24;40;24" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Torso */}
      <line x1="105" y1="31" x2="105" y2="58" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="31;47;31" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="58;74;58" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Upper arms - bend at elbow */}
      <line x1="98" y1="34" x2="78" y2="40" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y1" values="34;50;34" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="40;52;40" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Forearms on chair */}
      <line x1="78" y1="40" x2="62" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Legs extended */}
      <line x1="102" y1="58" x2="115" y2="82" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="58;74;58" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="82;98;82" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="115" y1="82" x2="120" y2="100" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="82;98;82" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="100;116;100" dur="2s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── GLUTE BRIDGE ──
const GluteBridge: React.FC = () => (
  <svg viewBox="0 0 200 90" className="w-full h-full">
    <line x1="25" y1="72" x2="175" y2="72" stroke={C} strokeWidth="1" opacity="0.1" />
    <g>
      {/* Head on ground */}
      <circle cx="155" cy="58" r="6" fill={C} opacity="0.9" />
      {/* Torso + hips - lifts up */}
      <line x1="148" y1="62" x2="80" y2="60" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y2" values="60;40;60" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Arms on ground */}
      <line x1="140" y1="64" x2="130" y2="72" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Upper legs */}
      <line x1="80" y1="60" x2="72" y2="52" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="60;40;60" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Lower legs */}
      <line x1="72" y1="52" x2="68" y2="72" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
      <line x1="90" y1="60" x2="82" y2="52" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="60;40;60" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="82" y1="52" x2="78" y2="72" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

// ── SIDE PLANK ──
const SidePlank: React.FC = () => (
  <svg viewBox="0 0 200 90" className="w-full h-full">
    <line x1="25" y1="72" x2="175" y2="72" stroke={C} strokeWidth="1" opacity="0.1" />
    <g>
      <circle cx="160" cy="22" r="6" fill={C} opacity="0.9" />
      <line x1="155" y1="26" x2="152" y2="30" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* Torso - angled */}
      <line x1="152" y1="30" x2="60" y2="45" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Supporting forearm */}
      <line x1="148" y1="32" x2="148" y2="55" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <line x1="148" y1="55" x2="155" y2="72" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      {/* Top arm on hip */}
      <line x1="120" y1="35" x2="100" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {/* Feet */}
      <line x1="60" y1="45" x2="50" y2="72" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

// ── SKATER JUMPS ──
const Skater: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9">
        <animate attributeName="cx" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <animate attributeName="x1" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="x1" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Arms for balance */}
      <line x1="100" y1="32" x2="75" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="x1" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="75;45;105;75" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="32" x2="125" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="x1" values="100;68;132;100" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="125;95;165;125" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Landing leg */}
      <line x1="96" y1="62" x2="88" y2="95" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="x1" values="96;64;128;96" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="88;60;120;88" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="88" y1="95" x2="82" y2="128" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x1" values="88;60;120;88" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="82;55;115;82" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Trail leg */}
      <line x1="104" y1="62" x2="120" y2="90" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.4">
        <animate attributeName="x1" values="104;72;136;104" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="x2" values="120;85;155;120" dur="1.5s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── LEG RAISE ──
const LegRaise: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9" />
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {/* Arms at sides */}
      <line x1="94" y1="32" x2="88" y2="52" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="106" y1="32" x2="112" y2="52" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Standing leg */}
      <line x1="104" y1="62" x2="108" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      {/* Raising leg - lifts to side */}
      <line x1="96" y1="62" x2="72" y2="85" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="x2" values="72;68;72" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="85;55;85" dur="2s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── PULL-UP ──
const PullUp: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Bar */}
    <line x1="50" y1="12" x2="150" y2="12" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    <g>
      {/* Head */}
      <circle cx="100" cy="28" r="7" fill={C} opacity="0.9">
        <animate attributeName="cy" values="48;22;48" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Torso */}
      <line x1="100" y1="35" x2="100" y2="68" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="55;29;55" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="88;62;88" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Arms to bar */}
      <line x1="94" y1="12" x2="94" y2="35" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y1" values="32;12;32" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="55;35;55" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="106" y1="12" x2="106" y2="35" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y1" values="32;12;32" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="55;35;55" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Legs */}
      <line x1="97" y1="68" x2="94" y2="110" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="88;62;88" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="130;104;130" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="103" y1="68" x2="106" y2="110" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="88;62;88" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="130;104;130" dur="2.5s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── CALF RAISE ──
const Calf: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="14" r="8" fill={C} opacity="0.9">
        <animate attributeName="cy" values="14;8;14" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="22" x2="100" y2="26" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="26" x2="100" y2="60" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="26;20;26" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="60;54;60" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Arms on wall */}
      <line x1="94" y1="30" x2="75" y2="34" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="106" y1="30" x2="125" y2="34" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Upper legs */}
      <line x1="96" y1="60" x2="92" y2="90" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="60;54;60" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="90;84;90" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="104" y1="60" x2="108" y2="90" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="y1" values="60;54;60" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="90;84;90" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Lower legs */}
      <line x1="92" y1="90" x2="90" y2="118" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="90;84;90" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="118;112;118" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="108" y1="90" x2="110" y2="118" stroke={C} strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animate attributeName="y1" values="90;84;90" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="118;112;118" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Feet - rise onto toes */}
      <line x1="85" y1="118" x2="78" y2="120" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.4">
        <animate attributeName="y1" values="118;112;118" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="120;114;120" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="115" y1="118" x2="122" y2="120" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.4">
        <animate attributeName="y1" values="118;112;118" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="120;114;120" dur="2s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

// ── HOLD ──
const Hold: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9">
        <animate attributeName="r" values="8;8.5;8" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <line x1="94" y1="32" x2="78" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="106" y1="32" x2="122" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="96" y1="62" x2="90" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      <line x1="104" y1="62" x2="110" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// ── DEFAULT ──
const Default: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="16" r="8" fill={C} opacity="0.9">
        <animate attributeName="cy" values="16;14;16" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <line x1="100" y1="24" x2="100" y2="28" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="100" y1="28" x2="100" y2="62" stroke={C} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <line x1="94" y1="32" x2="78" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="42;32;42" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="106" y1="32" x2="122" y2="42" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <animate attributeName="y2" values="42;32;42" dur="2s" repeatCount="indefinite" begin="1s" />
      </line>
      <line x1="96" y1="62" x2="90" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
      <line x1="104" y1="62" x2="110" y2="110" stroke={C} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

const ANIMS: Record<AnimType, React.FC> = {
  pushup: PushUp, squat: Squat, plank: Plank, jumpingjacks: JumpingJacks,
  lunge: Lunge, mountainclimber: MountainClimber, armcircles: ArmCircles,
  highknees: HighKnees, buttkicks: ButtKicks, sideplank: SidePlank,
  glutebridge: GluteBridge, walk: Walk, stretch: Stretch, twist: Twist,
  dip: Dip, legraise: LegRaise, skater: Skater, hold: Hold, calf: Calf,
  pullup: PullUp, default: Default,
};

interface ExerciseAnimationProps {
  exerciseName: string;
  className?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ exerciseName, className = '' }) => {
  const animType = MAP[exerciseName] || 'default';
  const Anim = ANIMS[animType];
  return (
    <div className={`w-full aspect-[4/3] rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10 overflow-hidden ${className}`}>
      <div className="w-full h-full p-4">
        <Anim />
      </div>
    </div>
  );
};
