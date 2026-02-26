import {type Dispatch, type SetStateAction, useCallback} from 'react';
import type {TcgOverviewWorkData} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';

export const useAddSelection = ({
  workData,
  setWorkData,
}: {
  workData: TcgOverviewWorkData | null;
  setWorkData: Dispatch<SetStateAction<TcgOverviewWorkData | null>>;
}) => {
  return useCallback(
    (ids: string[], dataById: Record<string, TcgSearchDataCard>, anchorIndex?: number, anchorId?: string) => {
      if (!workData?.selection) return;

      const elementIds = [...(workData.selection.elementsByPage[workData.search.page] ?? [])];
      ids.forEach((id: string) => {
        if (elementIds.includes(id)) return;
        elementIds.push(id);
      });

      const newElementsByPage = { ...workData.selection.elementsByPage, [workData.search.page]: elementIds } as Record<
        number,
        string[]
      >;
      const newSelection = {
        elementsByPage: newElementsByPage,
        elementIds: Object.values(newElementsByPage).flat(),
        elementDataById: { ...workData.selection.elementDataById, ...dataById },
        anchorIndex: anchorIndex,
        anchorId: anchorId,
      };
      setWorkData({ ...workData, selection: newSelection });
    },
    [workData, setWorkData],
  );
};
