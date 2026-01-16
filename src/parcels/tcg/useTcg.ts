import { useLocation } from '@tanstack/react-router';

export type Tcg = 'dlc' | 'pcg' | 'mtg';

export function useTcg(): Tcg | 'none' {
  const location = useLocation();
  let tcg: Tcg | 'none' = 'none';
  if (location.pathname.startsWith('/dlc/')) {
    tcg = 'dlc';
  } else if (location.pathname.startsWith('/pcg/')) {
    tcg = 'pcg';
  } else if (location.pathname.startsWith('/mtg/')) {
    tcg = 'mtg';
  }

  return tcg;
}
