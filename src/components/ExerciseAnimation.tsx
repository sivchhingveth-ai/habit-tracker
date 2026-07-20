import React from 'react';

type AnimationType =
  | 'pushup' | 'squat' | 'plank' | 'jumpingjacks' | 'lunge'
  | 'mountainclimber' | 'armcircles' | 'highknees' | 'buttkicks'
  | 'sideplank' | 'glutebridge' | 'walk' | 'stretch' | 'twist'
  | 'dip' | 'legraise' | 'skater' | 'hold' | 'calf' | 'pullup' | 'default';

const EXERCISE_ANIMATION_MAP: Record<string, AnimationType> = {
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

function getAnimationType(name: string): AnimationType {
  return EXERCISE_ANIMATION_MAP[name] || 'default';
}

const C = '#ffffff';

/* ── PUSH-UP: plank position, body lowers and rises ── */
const PushUpAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    {/* Head */}
    <circle cx="155" cy="32" r="8" fill={C} opacity="0.9">
      <animate attributeName="cy" values="32;42;32" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Torso + hips - straight line */}
    <rect x="60" y="34" width="95" height="8" rx="4" fill={C} opacity="0.8">
      <animate attributeName="y" values="34;44;34" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Upper arms (bend at elbow) */}
    <rect x="148" y="42" width="6" height="14" rx="3" fill={C} opacity="0.7">
      <animate attributeName="height" values="14;8;14" dur="2s" repeatCount="indefinite" />
      <animate attributeName="y" values="42;48;42" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Forearms (stay on ground) */}
    <rect x="148" y="56" width="6" height="16" rx="3" fill={C} opacity="0.6" />
    {/* Legs - straight back */}
    <rect x="50" y="36" width="15" height="6" rx="3" fill={C} opacity="0.6" />
    <rect x="35" y="37" width="18" height="5" rx="2.5" fill={C} opacity="0.5" />
  </svg>
);

/* ── SQUAT: standing, hips drop down and back, knees bend ── */
const SquatAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="25" r="10" fill={C} opacity="0.9">
      <animate attributeName="cy" values="25;42;25" dur="2.5s" repeatCount="indefinite" />
    </circle>
    {/* Torso - leans slightly forward */}
    <rect x="93" y="35" width="14" height="35" rx="5" fill={C} opacity="0.8">
      <animate attributeName="y" values="35;52;35" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Arms forward for balance */}
    <rect x="107" y="48" width="28" height="6" rx="3" fill={C} opacity="0.7">
      <animate attributeName="y" values="48;62;48" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Upper legs (thighs) - bend at hip */}
    <rect x="87" y="70" width="8" height="24" rx="4" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 91 70;60 91 70;0 91 70" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="105" y="70" width="8" height="24" rx="4" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 109 70;-60 109 70;0 109 70" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Lower legs (shins) - stay mostly vertical */}
    <rect x="85" y="94" width="7" height="28" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 88 94;-25 88 94;0 88 94" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="108" y="94" width="7" height="28" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 111 94;25 111 94;0 111 94" dur="2.5s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── PLANK: static forearm plank, very subtle breathing ── */
const PlankAnimation: React.FC = () => (
  <svg viewBox="0 0 200 90" className="w-full h-full">
    {/* Head */}
    <circle cx="160" cy="28" r="7" fill={C} opacity="0.9" />
    {/* Torso - straight line, slight breathing movement */}
    <rect x="60" y="30" width="100" height="7" rx="3.5" fill={C} opacity="0.8">
      <animate attributeName="y" values="30;31.5;30" dur="3s" repeatCount="indefinite" />
    </rect>
    {/* Forearms on ground */}
    <rect x="152" y="37" width="5" height="20" rx="2.5" fill={C} opacity="0.7" />
    <rect x="138" y="37" width="5" height="20" rx="2.5" fill={C} opacity="0.7" />
    {/* Toes */}
    <rect x="52" y="33" width="15" height="5" rx="2.5" fill={C} opacity="0.5" />
    <rect x="38" y="34" width="15" height="4" rx="2" fill={C} opacity="0.4" />
  </svg>
);

/* ── JUMPING JACKS: arms and legs spread and close ── */
const JumpingJacksAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9" />
    {/* Torso */}
    <rect x="93" y="30" width="14" height="36" rx="5" fill={C} opacity="0.8" />
    {/* Left arm - swings up and down */}
    <rect x="60" y="34" width="33" height="6" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 93 37;-140 93 37;0 93 37" dur="1s" repeatCount="indefinite" />
    </rect>
    {/* Right arm - swings up and down */}
    <rect x="107" y="34" width="33" height="6" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 107 37;140 107 37;0 107 37" dur="1s" repeatCount="indefinite" />
    </rect>
    {/* Left leg - spreads out */}
    <rect x="89" y="66" width="7" height="38" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 93 66;-35 93 66;0 93 66" dur="1s" repeatCount="indefinite" />
    </rect>
    {/* Right leg - spreads out */}
    <rect x="104" y="66" width="7" height="38" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 107 66;35 107 66;0 107 66" dur="1s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── LUNGE: step forward, lower back knee, push back ── */
const LungeAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9">
      <animate attributeName="cy" values="20;30;20" dur="2.5s" repeatCount="indefinite" />
    </circle>
    {/* Torso - upright */}
    <rect x="93" y="30" width="14" height="38" rx="5" fill={C} opacity="0.8">
      <animate attributeName="y" values="30;40;30" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Front thigh - bends forward */}
    <rect x="85" y="66" width="8" height="22" rx="4" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 89 66;70 89 66;0 89 66" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Front shin - mostly vertical */}
    <rect x="83" y="88" width="7" height="26" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 86 88;-10 86 88;0 86 88" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Back thigh - extends back */}
    <rect x="107" y="66" width="8" height="24" rx="4" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 111 66;-50 111 66;0 111 66" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Back shin */}
    <rect x="118" y="88" width="7" height="22" rx="3.5" fill={C} opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" values="0 121 88;20 121 88;0 121 88" dur="2.5s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── MOUNTAIN CLIMBERS: plank, alternating knees to chest ── */
const MountainClimberAnimation: React.FC = () => (
  <svg viewBox="0 0 200 90" className="w-full h-full">
    {/* Head */}
    <circle cx="158" cy="22" r="7" fill={C} opacity="0.9" />
    {/* Torso */}
    <rect x="65" y="24" width="93" height="7" rx="3.5" fill={C} opacity="0.8" />
    {/* Arms - supporting */}
    <rect x="152" y="31" width="5" height="18" rx="2.5" fill={C} opacity="0.7" />
    {/* Left knee drives forward */}
    <rect x="75" y="31" width="6" height="20" rx="3" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 78 31;-60 78 31;0 78 31" dur="0.8s" repeatCount="indefinite" />
    </rect>
    {/* Right knee drives forward */}
    <rect x="95" y="31" width="6" height="20" rx="3" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 98 31;-60 98 31;0 98 31" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
    </rect>
    {/* Back foot */}
    <rect x="55" y="34" width="14" height="4" rx="2" fill={C} opacity="0.4" />
  </svg>
);

/* ── ARM CIRCLES: standing, arms extended, making circles ── */
const ArmCirclesAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="22" r="10" fill={C} opacity="0.9" />
    {/* Torso */}
    <rect x="93" y="32" width="14" height="40" rx="5" fill={C} opacity="0.8" />
    {/* Left arm - circles */}
    <rect x="55" y="38" width="38" height="5" rx="2.5" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 93 40;360 93 40" dur="3s" repeatCount="indefinite" />
    </rect>
    {/* Right arm - circles opposite */}
    <rect x="107" y="38" width="38" height="5" rx="2.5" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 107 40;-360 107 40" dur="3s" repeatCount="indefinite" />
    </rect>
    {/* Legs - standing */}
    <rect x="90" y="72" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
    <rect x="103" y="72" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
  </svg>
);

/* ── HIGH KNEES: running in place, knees drive up high ── */
const HighKneesAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="18" r="10" fill={C} opacity="0.9" />
    {/* Torso - slight forward lean */}
    <rect x="93" y="28" width="14" height="38" rx="5" fill={C} opacity="0.8" />
    {/* Left arm - swings forward */}
    <rect x="78" y="34" width="6" height="22" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="25 81 34;-25 81 34;25 81 34" dur="0.6s" repeatCount="indefinite" />
    </rect>
    {/* Right arm - swings back */}
    <rect x="116" y="34" width="6" height="22" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="-25 119 34;25 119 34;-25 119 34" dur="0.6s" repeatCount="indefinite" />
    </rect>
    {/* Left knee drives up high */}
    <rect x="88" y="66" width="7" height="22" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 91 66;-100 91 66;0 91 66" dur="0.6s" repeatCount="indefinite" />
    </rect>
    {/* Left shin */}
    <rect x="85" y="88" width="6" height="18" rx="3" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 88 88;60 88 88;0 88 88" dur="0.6s" repeatCount="indefinite" />
    </rect>
    {/* Right knee drives up */}
    <rect x="105" y="66" width="7" height="22" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 108 66;-100 108 66;0 108 66" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
    </rect>
    {/* Right shin */}
    <rect x="108" y="88" width="6" height="18" rx="3" fill={C} opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" values="0 111 88;60 111 88;0 111 88" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
    </rect>
  </svg>
);

/* ── BUTT KICKS: heels kick back toward glutes ── */
const ButtKicksAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9" />
    {/* Torso */}
    <rect x="93" y="30" width="14" height="38" rx="5" fill={C} opacity="0.8" />
    {/* Arms swing */}
    <rect x="80" y="36" width="6" height="20" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="-20 83 36;20 83 36;-20 83 36" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="114" y="36" width="6" height="20" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="20 117 36;-20 117 36;20 117 36" dur="0.6s" repeatCount="indefinite" />
    </rect>
    {/* Left leg - heel kicks back to glute */}
    <rect x="88" y="68" width="7" height="20" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 91 68;80 91 68;0 91 68" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="85" y="88" width="6" height="16" rx="3" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 88 88;-80 88 88;0 88 88" dur="0.6s" repeatCount="indefinite" />
    </rect>
    {/* Right leg */}
    <rect x="105" y="68" width="7" height="20" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 108 68;80 108 68;0 108 68" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
    </rect>
    <rect x="108" y="88" width="6" height="16" rx="3" fill={C} opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" values="0 111 88;-80 111 88;0 111 88" dur="0.6s" repeatCount="indefinite" begin="0.3s" />
    </rect>
  </svg>
);

/* ── WALK / MARCH: steady walking motion ── */
const WalkAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9" />
    <rect x="93" y="30" width="14" height="38" rx="5" fill={C} opacity="0.8" />
    {/* Arms swing naturally */}
    <rect x="80" y="36" width="6" height="20" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="15 83 36;-15 83 36;15 83 36" dur="1.5s" repeatCount="indefinite" />
    </rect>
    <rect x="114" y="36" width="6" height="20" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="-15 117 36;15 117 36;-15 117 36" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Left leg strides forward */}
    <rect x="88" y="68" width="7" height="30" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="20 91 68;-20 91 68;20 91 68" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Right leg strides back */}
    <rect x="105" y="68" width="7" height="30" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="-20 108 68;20 108 68;-20 108 68" dur="1.5s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── CAT-COW STRETCH: on all fours, arch and round back ── */
const StretchAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    {/* Head */}
    <circle cx="160" cy="32" r="7" fill={C} opacity="0.9">
      <animate attributeName="cy" values="32;40;32" dur="3s" repeatCount="indefinite" />
    </circle>
    {/* Spine - arches up (cat) and dips down (cow) */}
    <path d="M 70,40 Q 110,30 155,35" stroke={C} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8">
      <animate attributeName="d" values="M 70,40 Q 110,30 155,35;M 70,40 Q 110,50 155,38;M 70,40 Q 110,30 155,35" dur="3s" repeatCount="indefinite" />
    </path>
    {/* Front arms */}
    <rect x="148" y="40" width="5" height="24" rx="2.5" fill={C} opacity="0.7" />
    {/* Back legs */}
    <rect x="65" y="40" width="5" height="24" rx="2.5" fill={C} opacity="0.6" />
  </svg>
);

/* ── TORSO TWISTS: standing, upper body rotates side to side ── */
const TwistAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="22" r="10" fill={C} opacity="0.9">
      <animate attributeName="cx" values="100;90;110;100" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Torso - rotates */}
    <rect x="93" y="32" width="14" height="40" rx="5" fill={C} opacity="0.8">
      <animate attributeName="x" values="93;83;103;93" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Arms out to sides - swing with twist */}
    <rect x="62" y="40" width="31" height="6" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 93 43;-30 93 43;0 93 43" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="107" y="40" width="31" height="6" rx="3" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 107 43;30 107 43;0 107 43" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Legs - stable */}
    <rect x="90" y="72" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
    <rect x="103" y="72" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
  </svg>
);

/* ── TRICEP DIPS: hands on chair, lower and raise body ── */
const DipAnimation: React.FC = () => (
  <svg viewBox="0 0 200 130" className="w-full h-full">
    {/* Chair back */}
    <rect x="55" y="25" width="8" height="70" rx="4" fill={C} opacity="0.2" />
    <rect x="55" y="25" width="50" height="6" rx="3" fill={C} opacity="0.2" />
    {/* Head */}
    <circle cx="100" cy="28" r="9" fill={C} opacity="0.9">
      <animate attributeName="cy" values="28;42;28" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Torso */}
    <rect x="93" y="37" width="14" height="32" rx="5" fill={C} opacity="0.8">
      <animate attributeName="y" values="37;51;37" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Upper arms - bend at elbow */}
    <rect x="82" y="42" width="6" height="18" rx="3" fill={C} opacity="0.7">
      <animate attributeName="height" values="18;10;18" dur="2s" repeatCount="indefinite" />
      <animate attributeName="y" values="42;50;42" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Hands on chair */}
    <rect x="80" y="60" width="8" height="5" rx="2.5" fill={C} opacity="0.5" />
    {/* Legs extended */}
    <rect x="90" y="69" width="7" height="28" rx="3.5" fill={C} opacity="0.6">
      <animate attributeName="y" values="69;83;69" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="103" y="69" width="7" height="28" rx="3.5" fill={C} opacity="0.5">
      <animate attributeName="y" values="69;83;69" dur="2s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── GLUTE BRIDGE: lying on back, hips lift up ── */
const GluteBridgeAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    {/* Head on ground */}
    <circle cx="155" cy="65" r="7" fill={C} opacity="0.9" />
    {/* Torso + hips - lifts up */}
    <rect x="70" y="58" width="85" height="8" rx="4" fill={C} opacity="0.8">
      <animate attributeName="y" values="58;42;58" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Upper arms on ground */}
    <rect x="140" y="66" width="12" height="5" rx="2.5" fill={C} opacity="0.6" />
    {/* Upper legs - bend at knee */}
    <rect x="72" y="62" width="7" height="20" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 75 62;-30 75 62;0 75 62" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="88" y="62" width="7" height="20" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="0 91 62;-30 91 62;0 91 62" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Lower legs - feet flat */}
    <rect x="62" y="82" width="18" height="5" rx="2.5" fill={C} opacity="0.5" />
    <rect x="80" y="82" width="18" height="5" rx="2.5" fill={C} opacity="0.5" />
  </svg>
);

/* ── SIDE PLANK: side-lying, propped on forearm, body straight ── */
const SidePlankAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    {/* Head */}
    <circle cx="158" cy="25" r="7" fill={C} opacity="0.9" />
    {/* Torso - angled line */}
    <rect x="65" y="38" width="93" height="7" rx="3.5" fill={C} opacity="0.8" transform="rotate(-8 111 41)" />
    {/* Supporting forearm */}
    <rect x="152" y="32" width="5" height="22" rx="2.5" fill={C} opacity="0.7" />
    {/* Top arm on hip */}
    <rect x="110" y="32" width="25" height="5" rx="2.5" fill={C} opacity="0.6" transform="rotate(10 122 34)" />
    {/* Feet stacked */}
    <rect x="55" y="42" width="15" height="5" rx="2.5" fill={C} opacity="0.5" />
  </svg>
);

/* ── SKATER JUMPS: lateral leap, landing on one foot ── */
const SkaterAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9">
      <animate attributeName="cx" values="100;70;130;100" dur="1.5s" repeatCount="indefinite" />
    </circle>
    {/* Torso */}
    <rect x="93" y="30" width="14" height="38" rx="5" fill={C} opacity="0.8">
      <animate attributeName="x" values="93;63;123;93" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Arms swing for balance */}
    <rect x="75" y="38" width="18" height="5" rx="2.5" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="0 93 40;-30 93 40;0 93 40" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Landing leg */}
    <rect x="88" y="68" width="7" height="35" rx="3.5" fill={C} opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" values="10 91 68;-10 91 68;10 91 68" dur="1.5s" repeatCount="indefinite" />
    </rect>
    {/* Trail leg swings behind */}
    <rect x="105" y="68" width="7" height="30" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="-30 108 68;30 108 68;-30 108 68" dur="1.5s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── LEG RAISE: standing, one leg lifts to the side ── */
const LegRaiseAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9" />
    {/* Torso */}
    <rect x="93" y="30" width="14" height="40" rx="5" fill={C} opacity="0.8" />
    {/* Arms at sides */}
    <rect x="78" y="36" width="6" height="22" rx="3" fill={C} opacity="0.6" />
    <rect x="116" y="36" width="6" height="22" rx="3" fill={C} opacity="0.6" />
    {/* Standing leg */}
    <rect x="103" y="70" width="7" height="42" rx="3.5" fill={C} opacity="0.6" />
    {/* Raising leg - lifts to the side */}
    <rect x="88" y="70" width="7" height="38" rx="3.5" fill={C} opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" values="0 91 70;-50 91 70;0 91 70" dur="2s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── PULL-UP: hanging from bar, pull body up ── */
const PullUpAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Bar */}
    <rect x="50" y="10" width="100" height="4" rx="2" fill={C} opacity="0.3" />
    {/* Head */}
    <circle cx="100" cy="25" r="9" fill={C} opacity="0.9">
      <animate attributeName="cy" values="45;20;45" dur="2.5s" repeatCount="indefinite" />
    </circle>
    {/* Torso */}
    <rect x="93" y="34" width="14" height="35" rx="5" fill={C} opacity="0.8">
      <animate attributeName="y" values="54;29;54" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Arms reaching up to bar */}
    <rect x="84" y="14" width="5" height="24" rx="2.5" fill={C} opacity="0.7">
      <animate attributeName="y" values="34;14;34" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="height" values="24;18;24" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="111" y="14" width="5" height="24" rx="2.5" fill={C} opacity="0.7">
      <animate attributeName="y" values="34;14;34" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="height" values="24;18;24" dur="2.5s" repeatCount="indefinite" />
    </rect>
    {/* Legs - hang straight */}
    <rect x="90" y="69" width="7" height="35" rx="3.5" fill={C} opacity="0.6">
      <animate attributeName="y" values="89;64;89" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="103" y="69" width="7" height="35" rx="3.5" fill={C} opacity="0.5">
      <animate attributeName="y" values="89;64;89" dur="2.5s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── CALF RAISE: standing, rise onto toes ── */
const CalfAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Head */}
    <circle cx="100" cy="18" r="10" fill={C} opacity="0.9">
      <animate attributeName="cy" values="18;12;18" dur="2s" repeatCount="indefinite" />
    </circle>
    {/* Torso */}
    <rect x="93" y="28" width="14" height="40" rx="5" fill={C} opacity="0.8">
      <animate attributeName="y" values="28;22;28" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Arms on wall for balance */}
    <rect x="78" y="34" width="15" height="5" rx="2.5" fill={C} opacity="0.6" />
    <rect x="107" y="34" width="15" height="5" rx="2.5" fill={C} opacity="0.6" />
    {/* Upper legs */}
    <rect x="90" y="68" width="7" height="28" rx="3.5" fill={C} opacity="0.6">
      <animate attributeName="y" values="68;62;68" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="103" y="68" width="7" height="28" rx="3.5" fill={C} opacity="0.6">
      <animate attributeName="y" values="68;62;68" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Lower legs */}
    <rect x="90" y="96" width="7" height="24" rx="3.5" fill={C} opacity="0.5">
      <animate attributeName="y" values="96;90;96" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="103" y="96" width="7" height="24" rx="3.5" fill={C} opacity="0.5">
      <animate attributeName="y" values="96;90;96" dur="2s" repeatCount="indefinite" />
    </rect>
    {/* Feet - rise onto toes */}
    <rect x="84" y="120" width="16" height="5" rx="2.5" fill={C} opacity="0.4">
      <animate attributeName="y" values="120;114;120" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="100" y="120" width="16" height="5" rx="2.5" fill={C} opacity="0.4">
      <animate attributeName="y" values="120;114;120" dur="2s" repeatCount="indefinite" />
    </rect>
  </svg>
);

/* ── HOLD: static standing pose with breathing ── */
const HoldAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9">
      <animate attributeName="r" values="10;10.5;10" dur="2s" repeatCount="indefinite" />
    </circle>
    <rect x="93" y="30" width="14" height="40" rx="5" fill={C} opacity="0.8" />
    <rect x="78" y="36" width="15" height="5" rx="2.5" fill={C} opacity="0.6" transform="rotate(-20 85 38)" />
    <rect x="107" y="36" width="15" height="5" rx="2.5" fill={C} opacity="0.6" transform="rotate(20 114 38)" />
    <rect x="90" y="70" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
    <rect x="103" y="70" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
  </svg>
);

/* ── DEFAULT: standing with arm swing ── */
const DefaultAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <circle cx="100" cy="20" r="10" fill={C} opacity="0.9">
      <animate attributeName="cy" values="20;18;20" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <rect x="93" y="30" width="14" height="40" rx="5" fill={C} opacity="0.8" />
    <rect x="78" y="36" width="15" height="5" rx="2.5" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="-15 93 38;15 93 38;-15 93 38" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="107" y="36" width="15" height="5" rx="2.5" fill={C} opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" values="15 107 38;-15 107 38;15 107 38" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="90" y="70" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
    <rect x="103" y="70" width="7" height="40" rx="3.5" fill={C} opacity="0.6" />
  </svg>
);

const ANIMATION_COMPONENTS: Record<AnimationType, React.FC> = {
  pushup: PushUpAnimation,
  squat: SquatAnimation,
  plank: PlankAnimation,
  jumpingjacks: JumpingJacksAnimation,
  lunge: LungeAnimation,
  mountainclimber: MountainClimberAnimation,
  armcircles: ArmCirclesAnimation,
  highknees: HighKneesAnimation,
  buttkicks: ButtKicksAnimation,
  sideplank: SidePlankAnimation,
  glutebridge: GluteBridgeAnimation,
  walk: WalkAnimation,
  stretch: StretchAnimation,
  twist: TwistAnimation,
  dip: DipAnimation,
  legraise: LegRaiseAnimation,
  skater: SkaterAnimation,
  hold: HoldAnimation,
  calf: CalfAnimation,
  pullup: PullUpAnimation,
  default: DefaultAnimation,
};

interface ExerciseAnimationProps {
  exerciseName: string;
  className?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ exerciseName, className = '' }) => {
  const animType = getAnimationType(exerciseName);
  const AnimComponent = ANIMATION_COMPONENTS[animType];
  return (
    <div className={`w-full aspect-[4/3] rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10 overflow-hidden ${className}`}>
      <div className="w-full h-full p-6">
        <AnimComponent />
      </div>
    </div>
  );
};
