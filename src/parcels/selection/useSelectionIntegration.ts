import {useCallback, useEffect, useMemo, useState} from 'react';
import {SELECTION_LIMIT} from '@/parcels/selection/TcgOverviewWorkContext/TcgOverviewWorkContext.tsx';
import {useTcgOverviewWorkContext} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkContext.ts';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';

export function useSelectionIntegration({ id, index }: { id: string; index: number }) {
  const workContext = useTcgOverviewWorkContext();
  const isSelectionMode = (workContext?.data?.selection?.elementIds?.length ?? 0) > 0;

  const isSelected = useMemo(() => {
    if (!workContext?.data?.selection) return;
    const selectedElements = workContext.data.selection.elementIds;
    if (selectedElements.length === 0) {
      return false;
    }

    return selectedElements.includes(id);
  }, [workContext?.data?.selection, id]);
  const [checked, setChecked] = useState<boolean>(isSelected ?? false);
  const setSelection = useCallback(
    (select: boolean) => {
      const current = workContext?.data?.selection?.elementIds.length ?? 0;
      if (select && current === SELECTION_LIMIT) {
        return;
      }
      const data = workContext?.data?.search?.result?.data?.items?.[index] as TcgSearchDataCard;
      const currentPage = workContext?.data?.search?.page;

      setChecked(select);
      if (select) workContext?.addSelection([id], { [id]: data }, index, id);
      else workContext?.removeSelection([id], currentPage, index, id);
    },
    [
      index,
      id,
      workContext?.addSelection,
      workContext?.removeSelection,
      workContext?.data?.selection?.elementIds.length,
      workContext?.data?.search?.result?.data,
      workContext?.data?.search?.page,
    ],
  );
  const setMultiSelection = useCallback(
    (ids: string[], select: boolean) => {
      const current = workContext?.data?.selection?.elementIds.length ?? 0;
      if (select && current + ids.length > SELECTION_LIMIT) {
        return;
      }
      const dataEntries = (workContext?.data?.search?.result?.data?.items as TcgSearchDataCard[]).filter((c) =>
        ids.includes(c.card.print.id),
      );
      const data = Object.fromEntries(dataEntries.map((c) => [c.card.print.id, c] as const));
      const currentPage = workContext?.data?.search?.page;

      setChecked(select);
      if (select) {
        workContext?.addSelection([...ids], data, index, id);
      } else {
        workContext?.removeSelection([...ids], currentPage, index, id);
      }
    },
    [
      index,
      id,
      workContext?.addSelection,
      workContext?.removeSelection,
      workContext?.data?.selection?.elementIds.length,
      workContext?.data?.search?.result?.data,
      workContext?.data?.search?.page,
    ],
  );

  useEffect(() => {
    if (!workContext?.data?.selection?.elementIds) {
      setChecked(false);
      return;
    }
    if (!checked && workContext.data.selection.elementIds.includes(id)) {
      setChecked(true);
      return;
    }
    if (checked && !workContext.data.selection.elementIds.includes(id)) {
      setChecked(false);
      return;
    }
  }, [workContext?.data?.selection?.elementIds, checked, id]);

  return useMemo(() => {
    return {
      checked,
      isSelected,
      isSelectionMode,
      setSelection,
      setMultiSelection,
    };
  }, [checked, isSelected, isSelectionMode, setSelection, setMultiSelection]);
}
