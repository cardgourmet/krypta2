import {createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState} from 'react';
import type {TcgSearchCardsResult} from "@/parcels/tcg/types.ts";

export const TcgOverviewWorkContext = createContext<TcgOverviewWorkAmbient | null>(null);

export type TcgOverviewWorkData = {
  search: {
    query: string;
    page: number;
    result: TcgSearchCardsResult;
  };
  selection: {
    elementIds: string[];
    elementsByPage: Record<number, string[]>;
    anchorIndex?: number;
    anchorId?: string;
  };
};
export type TcgOverviewWorkAmbient = {
  data: TcgOverviewWorkData;
  setSearchResult: (query: string, result: TcgSearchCardsResult) => void;
  addSelection: (ids: string[], anchorIndex?: number, anchorId?: string) => void;
  removeSelection: (ids: string[], anchorIndex?: number, anchorId?: string) => void;
  clearSelection: () => void;
};
export const SELECTION_LIMIT = 60;

export const useTcgOverviewWorkContext = () => useContext(TcgOverviewWorkContext);

export function TcgOverviewWorkContextProvider({ children }: PropsWithChildren) {
  const [workData, setWorkData] = useState<TcgOverviewWorkData | null>(null);

  const setSearchResult = useCallback(
    (query: string, result: TcgSearchCardsResult) => {
      if (!workData?.search || workData.search.query !== query) {
        setWorkData(initializeWorkData(query, result));
        return;
      }

      const newSearch = { query: query, result: result, page: result.data.currentPage };
      setWorkData({ ...workData, search: newSearch });
    },
    [workData],
  );
  const addSelection = useCallback(
    (ids: string[], anchorIndex?: number, anchorId?: string) => {
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
        anchorIndex: anchorIndex,
        anchorId: anchorId,
      };
      setWorkData({ ...workData, selection: newSelection });
    },
    [workData],
  );
  const removeSelection = useCallback(
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

      const newSelection = {
        elementsByPage: newElementsByPage,
        elementIds: Object.values(newElementsByPage).flat(),
        anchorIndex: anchorIndex ?? workData.selection.anchorIndex,
        anchorId: anchorId ?? workData.selection.anchorId,
      };
      setWorkData({ ...workData, selection: newSelection });
    },
    [workData],
  );
  const clearSelection = useCallback(() => {
    if (!workData?.selection) return;

    const newSelection = {
      elementsByPage: {} as Record<number, string[]>,
      elementIds: [] as string[],
      anchorIndex: -1,
      anchorId: undefined,
    };
    setWorkData({ ...workData, selection: newSelection });
  }, [workData]);

  const ambient = useMemo(() => {
    return {
      data: workData,
      setSearchResult,
      addSelection,
      removeSelection,
      clearSelection,
    } as TcgOverviewWorkAmbient;
  }, [workData, setSearchResult, addSelection, removeSelection, clearSelection]);

  return <TcgOverviewWorkContext.Provider value={ambient}>{children}</TcgOverviewWorkContext.Provider>;
}

const initializeWorkData = (query: string, result: TcgSearchCardsResult) => {
  return {
    search: { query: query, page: result.data.currentPage, result: result },
    selection: { elementIds: [], elementsByPage: {} },
  } as TcgOverviewWorkData;
};
