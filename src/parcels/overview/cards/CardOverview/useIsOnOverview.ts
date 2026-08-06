import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

export function useIsOnOverview() {
  const location = useLocation();
  return useMemo(() => {
    // when something like /$tcg/cards?search=`
    if (location.href.endsWith('/cards')) return true;

    const depth = location.href.split('/');
    // `/$tcg/sets/xxx` has 4 components when split
    return depth.includes('sets') && depth.length === 4;
  }, [location.href]);
}
