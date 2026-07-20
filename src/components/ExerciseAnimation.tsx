import React from 'react';

type AnimationType =
  | 'pushup' | 'squat' | 'plank' | 'jumpingjacks' | 'lunge'
  | 'mountainclimber' | 'burpee' | 'armcircles' | 'highknees'
  | 'sideplank' | 'glutebridge' | 'walk' | 'stretch' | 'twist'
  | 'dip' | 'legraise' | 'skater' | 'hold' | 'calf' | 'pullup' | 'default';

const EXERCISE_ANIMATION_MAP: Record<string, AnimationType> = {
  'Regular Push-Ups': 'pushup', 'Push-Ups': 'pushup', 'Push-Ups (knee or full)': 'pushup',
  'Wide-Grip Push-Ups': 'pushup', 'Incline Push-Ups': 'pushup', 'Knee Push-Ups': 'pushup',
  'Wall Push-Ups': 'pushup', 'Diamond Push-Ups': 'pushup', 'Archer Push-Ups': 'pushup',
  'Bodyweight Squats': 'squat', 'Jump Squats': 'squat', 'Sumo Squats': 'squat',
  'Pistol Squat Progression': 'squat', 'Bulgarian Split Squats': 'lunge',
  'Plank Hold': 'plank', 'Plank': 'plank', 'Forearm Plank': 'plank',
  'Kneeling Plank': 'plank', 'Side Plank': 'sideplank',
  'Jumping Jacks': 'jumpingjacks',
  'Walking Lunges': 'lunge', 'Reverse Lunges': 'lunge',
  'Mountain Climbers': 'mountainclimber',
  'Burpees': 'burpee',
  'Arm Circles': 'armcircles', 'Shoulder Rolls': 'armcircles',
  'High Knees': 'highknees', 'Butt Kicks': 'highknees', 'March in Place': 'walk',
  'Glute Bridges': 'glutebridge', 'Butt Bridge': 'glutebridge',
  'Tricep Dips (chair)': 'dip',
  'Torso Twists': 'twist', 'Cat-Cow Stretch': 'stretch',
  'Skater Jumps': 'skater',
  'Standing Side Leg Raises': 'legraise',
  'Plank to Shoulder Tap': 'plank',
  'Pull-Ups / Inverted Rows': 'pullup',
  'Standing Bicycle Crunches': 'twist',
};

function getAnimationType(name: string): AnimationType {
  return EXERCISE_ANIMATION_MAP[name] || 'default';
}

const P = '#ffffff'; // primary color for the figure

const PushUpAnimation: React.FC = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,12;0,0" dur="2s" repeatCount="indefinite" />
      {/* Head */}
      <circle cx="160" cy="45" r="10" fill={P} opacity="0.9" />
      {/* Body */}
      <rect x="60" y="42" width="100" height="10" rx="5" fill={P} opacity="0.8" />
      {/* Arms */}
      <rect x="145" y="52" width="8" height="30" rx="4" fill={P} opacity="0.7">
        <animate attributeName="height" values="30;22;30" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y" values="52;60;52" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="75" y="52" width="8" height="30" rx="4" fill={P} opacity="0.7">
        <animate attributeName="height" values="30;22;30" dur="2s" repeatCount="indefinite" />
        <animate attributeName="y" values="52;60;52" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Legs */}
      <rect x="50" y="45" width="35" height="8" rx="4" fill={P} opacity="0.6" />
      <rect x="30" y="45" width="25" height="8" rx="4" fill={P} opacity="0.5" transform="rotate(10 42 49)" />
    </g>
  </svg>
);

const SquatAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="30" r="12" fill={P} opacity="0.9">
        <animate attributeName="cy" values="30;45;30" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Body */}
      <rect x="90" y="42" width="20" height="45" rx="6" fill={P} opacity="0.8">
        <animate attributeName="y" values="42;57;42" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="height" values="45;35;45" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Arms forward */}
      <rect x="110" y="55" width="30" height="7" rx="3.5" fill={P} opacity="0.7">
        <animate attributeName="y" values="55;65;55" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Left leg */}
      <rect x="85" y="85" width="10" height="35" rx="5" fill={P} opacity="0.6">
        <animate attributeName="y" values="85;80;85" dur="2.5s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="0 90 85;-30 90 85;0 90 85" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Right leg */}
      <rect x="105" y="85" width="10" height="35" rx="5" fill={P} opacity="0.6">
        <animate attributeName="y" values="85;80;85" dur="2.5s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="0 110 85;30 110 85;0 110 85" dur="2.5s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const PlankAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="165" cy="38" r="9" fill={P} opacity="0.9" />
      {/* Body (straight line) */}
      <rect x="65" y="38" width="100" height="9" rx="4.5" fill={P} opacity="0.8">
        <animate attributeName="y" values="38;40;38" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Forearms */}
      <rect x="155" y="47" width="7" height="25" rx="3.5" fill={P} opacity="0.7" />
      <rect x="140" y="47" width="7" height="25" rx="3.5" fill={P} opacity="0.7" />
      {/* Legs */}
      <rect x="55" y="42" width="30" height="7" rx="3.5" fill={P} opacity="0.6" />
      <rect x="35" y="42" width="25" height="7" rx="3.5" fill={P} opacity="0.5" />
    </g>
  </svg>
);

const JumpingJacksAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="22" r="11" fill={P} opacity="0.9" />
      {/* Body */}
      <rect x="92" y="33" width="16" height="40" rx="5" fill={P} opacity="0.8" />
      {/* Arms - animate open/close */}
      <rect x="60" y="38" width="32" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="-60 92 42;0 92 42;-60 92 42" dur="1.2s" repeatCount="indefinite" />
      </rect>
      <rect x="108" y="38" width="32" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="60 108 42;0 108 42;60 108 42" dur="1.2s" repeatCount="indefinite" />
      </rect>
      {/* Legs - animate open/close */}
      <rect x="88" y="73" width="8" height="40" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="-20 92 73;0 92 73;-20 92 73" dur="1.2s" repeatCount="indefinite" />
      </rect>
      <rect x="104" y="73" width="8" height="40" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="20 108 73;0 108 73;20 108 73" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const LungeAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="25" r="11" fill={P} opacity="0.9">
        <animate attributeName="cy" values="25;32;25" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Body */}
      <rect x="92" y="36" width="16" height="40" rx="5" fill={P} opacity="0.8">
        <animate attributeName="y" values="36;43;36" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Front leg bent */}
      <rect x="85" y="74" width="9" height="30" rx="4.5" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 89 74;-40 89 74;0 89 74" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Back leg extended */}
      <rect x="106" y="74" width="9" height="35" rx="4.5" fill={P} opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="0 110 74;30 110 74;0 110 74" dur="2.5s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const MountainClimberAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="155" cy="30" r="9" fill={P} opacity="0.9" />
      {/* Body */}
      <rect x="60" y="32" width="95" height="9" rx="4.5" fill={P} opacity="0.8" />
      {/* Arms */}
      <rect x="148" y="41" width="7" height="22" rx="3.5" fill={P} opacity="0.7" />
      {/* Left leg - alternates */}
      <rect x="55" y="36" width="8" height="30" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 59 36;-50 59 36;0 59 36" dur="1s" repeatCount="indefinite" />
      </rect>
      {/* Right leg */}
      <rect x="75" y="36" width="8" height="30" rx="4" fill={P} opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="0 79 36;-50 79 36;0 79 36" dur="1s" repeatCount="indefinite" begin="0.5s" />
      </rect>
    </g>
  </svg>
);

const ArmCirclesAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="28" r="11" fill={P} opacity="0.9" />
      {/* Body */}
      <rect x="92" y="39" width="16" height="42" rx="5" fill={P} opacity="0.8" />
      {/* Left arm - circles */}
      <rect x="55" y="42" width="37" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 92 45;360 92 45" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Right arm - circles */}
      <rect x="108" y="42" width="37" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="0 108 45;-360 108 45" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Legs */}
      <rect x="90" y="81" width="8" height="38" rx="4" fill={P} opacity="0.6" />
      <rect x="102" y="81" width="8" height="38" rx="4" fill={P} opacity="0.6" />
    </g>
  </svg>
);

const HighKneesAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="22" r="11" fill={P} opacity="0.9" />
      {/* Body */}
      <rect x="92" y="33" width="16" height="40" rx="5" fill={P} opacity="0.8" />
      {/* Arms swinging */}
      <rect x="78" y="40" width="7" height="25" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="20 82 40;-20 82 40;20 82 40" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <rect x="115" y="40" width="7" height="25" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="-20 118 40;20 118 40;-20 118 40" dur="0.8s" repeatCount="indefinite" />
      </rect>
      {/* Left knee up */}
      <rect x="88" y="73" width="8" height="28" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 92 73;-80 92 73;0 92 73" dur="0.8s" repeatCount="indefinite" />
      </rect>
      {/* Right knee up */}
      <rect x="104" y="73" width="8" height="28" rx="4" fill={P} opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="0 108 73;-80 108 73;0 108 73" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
      </rect>
    </g>
  </svg>
);

const WalkAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      {/* Head */}
      <circle cx="100" cy="25" r="11" fill={P} opacity="0.9" />
      {/* Body */}
      <rect x="92" y="36" width="16" height="40" rx="5" fill={P} opacity="0.8" />
      {/* Arms swing */}
      <rect x="78" y="40" width="7" height="24" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="15 82 40;-15 82 40;15 82 40" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x="115" y="40" width="7" height="24" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="-15 118 40;15 118 40;-15 118 40" dur="1.5s" repeatCount="indefinite" />
      </rect>
      {/* Legs */}
      <rect x="88" y="76" width="8" height="38" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="15 92 76;-15 92 76;15 92 76" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x="104" y="76" width="8" height="38" rx="4" fill={P} opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="-15 108 76;15 108 76;-15 108 76" dur="1.5s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const StretchAnimation: React.FC = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    <g>
      {/* On all fours - cat cow */}
      <circle cx="155" cy="40" r="9" fill={P} opacity="0.9">
        <animate attributeName="cy" values="40;35;40" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Body */}
      <rect x="70" y="42" width="85" height="9" rx="4.5" fill={P} opacity="0.8">
        <animate attributeName="y" values="42;38;42;46;42" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Arms */}
      <rect x="148" y="51" width="7" height="28" rx="3.5" fill={P} opacity="0.7" />
      <rect x="80" y="51" width="7" height="28" rx="3.5" fill={P} opacity="0.7" />
      {/* Legs */}
      <rect x="65" y="51" width="7" height="28" rx="3.5" fill={P} opacity="0.6" />
    </g>
  </svg>
);

const TwistAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="28" r="11" fill={P} opacity="0.9" />
      <rect x="92" y="39" width="16" height="42" rx="5" fill={P} opacity="0.8" />
      <rect x="92" y="39" width="16" height="42" rx="5" fill={P} opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" values="-15 100 60;15 100 60;-15 100 60" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Arms to sides */}
      <rect x="60" y="44" width="32" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="-10 92 47;10 92 47;-10 92 47" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="108" y="44" width="32" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="10 108 47;-10 108 47;10 108 47" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="90" y="81" width="8" height="38" rx="4" fill={P} opacity="0.6" />
      <rect x="102" y="81" width="8" height="38" rx="4" fill={P} opacity="0.6" />
    </g>
  </svg>
);

const DipAnimation: React.FC = () => (
  <svg viewBox="0 0 200 140" className="w-full h-full">
    <g>
      <circle cx="100" cy="20" r="10" fill={P} opacity="0.9">
        <animate attributeName="cy" values="20;32;20" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x="92" y="30" width="16" height="35" rx="5" fill={P} opacity="0.8">
        <animate attributeName="y" values="30;42;30" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Arms on chair */}
      <rect x="75" y="38" width="7" height="28" rx="3.5" fill={P} opacity="0.7">
        <animate attributeName="height" values="28;18;28" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="118" y="38" width="7" height="28" rx="3.5" fill={P} opacity="0.7">
        <animate attributeName="height" values="28;18;28" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="88" y="65" width="24" height="7" rx="3.5" fill={P} opacity="0.5" />
    </g>
  </svg>
);

const GluteBridgeAnimation: React.FC = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    <g>
      <circle cx="150" cy="42" r="9" fill={P} opacity="0.9" />
      <rect x="70" y="44" width="80" height="9" rx="4.5" fill={P} opacity="0.8">
        <animate attributeName="y" values="44;34;44" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="85" y="53" width="8" height="25" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 89 53;-15 89 53;0 89 53" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="107" y="53" width="8" height="25" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 111 53;-15 111 53;0 111 53" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="60" y="50" width="15" height="7" rx="3.5" fill={P} opacity="0.5" />
    </g>
  </svg>
);

const SidePlankAnimation: React.FC = () => (
  <svg viewBox="0 0 200 120" className="w-full h-full">
    <g>
      <circle cx="155" cy="30" r="9" fill={P} opacity="0.9" />
      <rect x="60" y="35" width="95" height="9" rx="4.5" fill={P} opacity="0.8" transform="rotate(10 107 39)" />
      <rect x="150" y="44" width="7" height="30" rx="3.5" fill={P} opacity="0.7" />
      <rect x="55" y="40" width="25" height="7" rx="3.5" fill={P} opacity="0.5" transform="rotate(10 67 43)" />
    </g>
  </svg>
);

const SkaterAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="25" r="11" fill={P} opacity="0.9">
        <animate attributeName="cx" values="100;80;120;100" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <rect x="92" y="36" width="16" height="40" rx="5" fill={P} opacity="0.8">
        <animate attributeName="x" values="92;72;112;92" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x="88" y="76" width="8" height="38" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="-30 92 76;30 92 76;-30 92 76" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x="104" y="76" width="8" height="38" rx="4" fill={P} opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="30 108 76;-30 108 76;30 108 76" dur="1.5s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const LegRaiseAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="22" r="11" fill={P} opacity="0.9" />
      <rect x="92" y="33" width="16" height="42" rx="5" fill={P} opacity="0.8" />
      <rect x="88" y="75" width="8" height="38" rx="4" fill={P} opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" values="0 92 75;-60 92 75;0 92 75" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="104" y="75" width="8" height="38" rx="4" fill={P} opacity="0.5" />
    </g>
  </svg>
);

const HoldAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="22" r="11" fill={P} opacity="0.9">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x="92" y="33" width="16" height="42" rx="5" fill={P} opacity="0.8" />
      <rect x="72" y="40" width="20" height="7" rx="3.5" fill={P} opacity="0.7" transform="rotate(-45 82 43)" />
      <rect x="108" y="40" width="20" height="7" rx="3.5" fill={P} opacity="0.7" transform="rotate(45 118 43)" />
      <rect x="90" y="75" width="8" height="38" rx="4" fill={P} opacity="0.6" />
      <rect x="102" y="75" width="8" height="38" rx="4" fill={P} opacity="0.6" />
    </g>
  </svg>
);

const PullUpAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    {/* Bar */}
    <rect x="50" y="15" width="100" height="5" rx="2.5" fill={P} opacity="0.3" />
    <g>
      {/* Head */}
      <circle cx="100" cy="30" r="11" fill={P} opacity="0.9">
        <animate attributeName="cy" values="45;25;45" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Body */}
      <rect x="92" y="41" width="16" height="40" rx="5" fill={P} opacity="0.8">
        <animate attributeName="y" values="56;36;56" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Arms up to bar */}
      <rect x="82" y="20" width="7" height="28" rx="3.5" fill={P} opacity="0.7">
        <animate attributeName="y" values="35;18;35" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="height" values="28;22;28" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="111" y="20" width="7" height="28" rx="3.5" fill={P} opacity="0.7">
        <animate attributeName="y" values="35;18;35" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="height" values="28;22;28" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Legs */}
      <rect x="90" y="81" width="8" height="35" rx="4" fill={P} opacity="0.6">
        <animate attributeName="y" values="96;76;96" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <rect x="102" y="81" width="8" height="35" rx="4" fill={P} opacity="0.5">
        <animate attributeName="y" values="96;76;96" dur="2.5s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const CalfAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="22" r="11" fill={P} opacity="0.9" />
      <rect x="92" y="33" width="16" height="42" rx="5" fill={P} opacity="0.8" />
      <rect x="72" y="40" width="20" height="7" rx="3.5" fill={P} opacity="0.7" />
      <rect x="88" y="75" width="8" height="38" rx="4" fill={P} opacity="0.6" />
      <rect x="104" y="75" width="8" height="38" rx="4" fill={P} opacity="0.5" />
      {/* Heels rise */}
      <rect x="83" y="115" width="14" height="5" rx="2.5" fill={P} opacity="0.4">
        <animate attributeName="y" values="115;108;115" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="103" y="115" width="14" height="5" rx="2.5" fill={P} opacity="0.4">
        <animate attributeName="y" values="115;108;115" dur="2s" repeatCount="indefinite" />
      </rect>
    </g>
  </svg>
);

const DefaultAnimation: React.FC = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <g>
      <circle cx="100" cy="22" r="11" fill={P} opacity="0.9">
        <animate attributeName="cy" values="22;20;22" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <rect x="92" y="33" width="16" height="42" rx="5" fill={P} opacity="0.8" />
      <rect x="72" y="40" width="20" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="-15 92 43;15 92 43;-15 92 43" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="108" y="40" width="20" height="7" rx="3.5" fill={P} opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="15 108 43;-15 108 43;15 108 43" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="90" y="75" width="8" height="38" rx="4" fill={P} opacity="0.6" />
      <rect x="102" y="75" width="8" height="38" rx="4" fill={P} opacity="0.6" />
    </g>
  </svg>
);

const ANIMATION_COMPONENTS: Record<AnimationType, React.FC> = {
  pushup: PushUpAnimation,
  squat: SquatAnimation,
  plank: PlankAnimation,
  jumpingjacks: JumpingJacksAnimation,
  lunge: LungeAnimation,
  mountainclimber: MountainClimberAnimation,
  burpee: DefaultAnimation,
  armcircles: ArmCirclesAnimation,
  highknees: HighKneesAnimation,
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
