import {useLocation} from '@tanstack/react-router';
import {useMemo} from 'react';

export type Tcg = 'dlc' | 'pcg' | 'mtg';

export function useTcgByLocation(): Tcg | undefined {
  const location = useLocation();
  return useMemo(() => {
    let t: Tcg | undefined;
    if (location.pathname.startsWith('/dlc/')) {
      t = 'dlc';
    } else if (location.pathname.startsWith('/pcg/')) {
      t = 'pcg';
    } else if (location.pathname.startsWith('/mtg/')) {
      t = 'mtg';
    }
    return t;
  }, [location]);
}
