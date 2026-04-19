import {useCallback} from 'react';
import {useTcgOverviewWorkStore} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';

export function useSetSelectionWithCheck({ thisId, index }: { thisId: string; index: number }) {
  const getIdsInRange = useTcgOverviewWorkStore((state) => state.getIdsInRange);
  const checkSelection = useTcgOverviewWorkStore((state) => state.checkSelection);
  const setSelection = useTcgOverviewWorkStore((state) => state.setSelection);
  const setSelectionMode = useTcgOverviewWorkStore((state) => state.setSelectionMode);
  const setSelectionModeLoading = useTcgOverviewWorkStore((state) => state.setSelectionModeLoading);

  return useCallback(
    (ids: string[], select: boolean, shift: boolean) => {
      let mustIds = ids;
      if (shift) {
        // if shift key, calculate range of cards to add or remove
        mustIds = getIdsInRange(index);
      }
      if (mustIds.length === 0) return;

      const { success: allowed, toggledMode, newMode } = checkSelection(mustIds, select);
      if (!allowed) return;

      setSelection(mustIds, select, index, thisId);

      if (toggledMode) {
        setSelectionModeLoading(true);

        setTimeout(() => {
          setSelectionMode(newMode ?? false);
        }, 0);
      }
    },
    [thisId, checkSelection, getIdsInRange, index, setSelection, setSelectionMode, setSelectionModeLoading],
  );
}
