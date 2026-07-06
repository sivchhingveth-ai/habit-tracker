// Avatar sticker catalog. Each sticker is a mini profile tile: an emoji on
// its own gradient so the picker and nav avatar read as real profile
// pictures. Only the emoji is persisted; gradients are looked up here.
export interface AvatarSticker {
  emoji: string;
  gradient: [string, string];
}

export const AVATAR_STICKERS: AvatarSticker[] = [
  { emoji: '💪', gradient: ['#f7b733', '#fc4a1a'] },
  { emoji: '🔥', gradient: ['#ff512f', '#dd2476'] },
  { emoji: '🏆', gradient: ['#f2994a', '#f2c94c'] },
  { emoji: '⚡', gradient: ['#fddb3a', '#f6a623'] },
  { emoji: '🎯', gradient: ['#ee0979', '#ff6a00'] },
  { emoji: '🚀', gradient: ['#36d1dc', '#5b86e5'] },
  { emoji: '👑', gradient: ['#b06ab3', '#4568dc'] },
  { emoji: '🥇', gradient: ['#ffd200', '#f7971e'] },
  { emoji: '🦁', gradient: ['#f83600', '#f9d423'] },
  { emoji: '🐯', gradient: ['#ff8008', '#ffc837'] },
  { emoji: '🐺', gradient: ['#606c88', '#3f4c6b'] },
  { emoji: '🦅', gradient: ['#8e6e53', '#c89b7b'] },
  { emoji: '🦍', gradient: ['#485563', '#29323c'] },
  { emoji: '🐉', gradient: ['#11998e', '#38ef7d'] },
  { emoji: '🥷', gradient: ['#232526', '#414345'] },
  { emoji: '🤖', gradient: ['#00c6ff', '#0072ff'] },
];

export const DEFAULT_GRADIENT: [string, string] = ['#4e55e0', '#7856ff'];

export function avatarGradient(emoji: string): [string, string] {
  return AVATAR_STICKERS.find((s) => s.emoji === emoji)?.gradient ?? DEFAULT_GRADIENT;
}

export function avatarBackground(emoji: string): string {
  const [from, to] = avatarGradient(emoji);
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}
