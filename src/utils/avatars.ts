// Avatar catalog. Each avatar is a PNG image served from /avatars/.
// Drop your PNG files into public/avatars/ named av 01.png through av 16.png.
// The avatar value persisted in the store is the numeric id (as a string).

export interface Avatar {
  id: string;
  src: string;
  label: string;
}

export const AVATARS: Avatar[] = [
  { id: '1',  src: '/avatars/av 01.png', label: 'Avatar 1' },
  { id: '2',  src: '/avatars/av 02.png', label: 'Avatar 2' },
  { id: '3',  src: '/avatars/av 03.png', label: 'Avatar 3' },
  { id: '4',  src: '/avatars/av 04.png', label: 'Avatar 4' },
  { id: '5',  src: '/avatars/av 05.png', label: 'Avatar 5' },
  { id: '6',  src: '/avatars/av 06.png', label: 'Avatar 6' },
  { id: '7',  src: '/avatars/av 07.png', label: 'Avatar 7' },
  { id: '8',  src: '/avatars/av 08.png', label: 'Avatar 8' },
  { id: '9',  src: '/avatars/av 09.png', label: 'Avatar 9' },
  { id: '10', src: '/avatars/av 10.png', label: 'Avatar 10' },
  { id: '11', src: '/avatars/av 11.png', label: 'Avatar 11' },
  { id: '12', src: '/avatars/av 12.png', label: 'Avatar 12' },
  { id: '13', src: '/avatars/av 13.png', label: 'Avatar 13' },
  { id: '14', src: '/avatars/av 14.png', label: 'Avatar 14' },
  { id: '15', src: '/avatars/av 15.png', label: 'Avatar 15' },
  { id: '16', src: '/avatars/av 16.png', label: 'Avatar 16' },
  { id: '17', src: '/avatars/av 17.png', label: 'Avatar 17' },
  { id: '18', src: '/avatars/av 18.png', label: 'Avatar 18' },
];

export function avatarSrc(id: string | null | undefined): string | null {
  if (!id) return null;
  return AVATARS.find((a) => a.id === id)?.src ?? null;
}
