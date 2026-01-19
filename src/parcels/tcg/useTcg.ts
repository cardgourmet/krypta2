import { useLocation } from '@tanstack/react-router';

export type Tcg = 'dlc' | 'pcg' | 'mtg';

export function useTcg(): Tcg | undefined {
  const location = useLocation();
  let tcg: Tcg | undefined;
  if (location.pathname.startsWith('/dlc/')) {
    tcg = 'dlc';
  } else if (location.pathname.startsWith('/pcg/')) {
    tcg = 'pcg';
  } else if (location.pathname.startsWith('/mtg/')) {
    tcg = 'mtg';
  }

  return tcg;
}
