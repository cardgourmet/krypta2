import {type Dispatch, type SetStateAction, useCallback} from 'react';
import type {TcgOverviewWorkData} from '@/parcels/selection/TcgOverviewWorkContext.tsx';

export const useRemoveSelection = ({
  workData,
  setWorkData,
}: {
  workData: TcgOverviewWorkData | null;
  setWorkData: Dispatch<SetStateAction<TcgOverviewWorkData | null>>;
}) => {
  return useCallback(
    (ids: string[], anchorIndex?: number, anchorId?: string) => {
      if (!workData?.selection) return;

      const elementIds = [...(workData.selection.elementsByPage[workData.search.page] ?? [])];
      ids.forEach((id: string) => {
        const index = elementIds.indexOf(id);

        if (index > -1) {
          elementIds.splice(index, 1);
        }
      });

      const newElementsByPage = { ...workData.selection.elementsByPage, [workData.search.page]: elementIds } as Record<
        number,
        string[]
      >;
      if (elementIds.length === 0) {
        delete newElementsByPage[workData.search.page];
      }

      const newElementDataById = { ...workData.selection.elementDataById };
      ids.forEach((id: string) => {
        delete newElementDataById[id];
      });

      const newSelection = {
        elementsByPage: newElementsByPage,
        elementIds: Object.values(newElementsByPage).flat(),
        elementDataById: newElementDataById,
        anchorIndex: anchorIndex ?? workData.selection.anchorIndex,
        anchorId: anchorId ?? workData.selection.anchorId,
      };
      setWorkData({ ...workData, selection: newSelection });
    },
    [workData, setWorkData],
  );
};
