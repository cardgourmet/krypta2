import {type Dispatch, type SetStateAction, useCallback} from 'react';
import type {TcgOverviewWorkData} from '@/parcels/selection/TcgOverviewWorkContext/TcgOverviewWorkContext.tsx';

export const useRemoveSelection = ({
  workData,
  setWorkData,
}: {
  workData: TcgOverviewWorkData | null;
  setWorkData: Dispatch<SetStateAction<TcgOverviewWorkData | null>>;
}) => {
  return useCallback(
    (ids: string[], page?: number, anchorIndex?: number, anchorId?: string) => {
      if (!workData?.selection) return;
      const mustPage = page ?? workData.search.page;

      const elementIds = [...(workData.selection.elementsByPage[mustPage] ?? [])];
      ids.forEach((id: string) => {
        const index = elementIds.indexOf(id);

        if (index > -1) {
          elementIds.splice(index, 1);
        }
      });

      const newElementsByPage = { ...workData.selection.elementsByPage, [mustPage]: elementIds } as Record<
        number,
        string[]
      >;
      if (elementIds.length === 0) {
        delete newElementsByPage[mustPage];
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
