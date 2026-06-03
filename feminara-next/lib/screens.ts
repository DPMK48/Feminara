export type Screen = 'home' | 'journal' | 'community' | 'flourish' | 'spark' | 'glow' | 'bloom' | 'profile';

export const SCREEN_STORAGE_KEY = 'feminara_current_screen';

export const SCREENS: Screen[] = ['home', 'journal', 'community', 'flourish', 'spark', 'glow', 'bloom', 'profile'];

export const SCREEN_PATHS: Record<Screen, string> = {
  home: '/',
  journal: '/journal',
  community: '/community',
  flourish: '/flourish',
  spark: '/spark',
  glow: '/glow',
  bloom: '/bloom',
  profile: '/profile',
};

export function screenFromPath(pathname: string): Screen {
  const match = SCREENS.find((screen) => SCREEN_PATHS[screen] === pathname);
  return match ?? 'home';
}
