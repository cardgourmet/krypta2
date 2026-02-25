import {useCallback, useEffect, useMemo, useState} from "react";
import {SELECTION_LIMIT, useMtgOverviewWorkContext} from "@/parcels/selection/MtgOverviewWorkContext.tsx";

export function useSelectionIntegration({ id, index }: { id: string; index: number }) {
  const workContext = useMtgOverviewWorkContext();
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

      setChecked(select);

      if (select) workContext?.addSelection([id], index, id);
      else workContext?.removeSelection([id], index, id);
    },
    [
      index,
      id,
      workContext?.addSelection,
      workContext?.removeSelection,
      workContext?.data?.selection?.elementIds.length,
    ],
  );
  const setMultiSelection = useCallback(
    (ids: string[], select: boolean) => {
      const current = workContext?.data?.selection?.elementIds.length ?? 0;
      if (select && current + ids.length >= SELECTION_LIMIT) {
        return;
      }

      setChecked(select);

      if (select) {
        workContext?.addSelection([...ids], index, id);
      } else {
        workContext?.removeSelection([...ids], index, id);
      }
    },
    [
      index,
      id,
      workContext?.addSelection,
      workContext?.removeSelection,
      workContext?.data?.selection?.elementIds.length,
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
