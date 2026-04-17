import {createContext, type PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {useAddSelection} from '@/parcels/selection/useAddSelection.ts';
import {useRemoveSelection} from '@/parcels/selection/useRemoveSelection.ts';
import type {TcgSearchCardsResult, TcgSearchDataCard} from '@/parcels/tcg/types.ts';

export const TcgOverviewWorkContext = createContext<TcgOverviewWorkSpace | null>(null);

export type TcgOverviewWorkData = {
  search: {
    query: string;
    page: number;
    result: TcgSearchCardsResult;
  };
  selection: {
    elementIds: string[];
    elementDataById: Record<string, TcgSearchDataCard>;
    elementsByPage: Record<number, string[]>;
    anchorIndex?: number;
    anchorId?: string;
  };
};

export type TcgOverviewWorkSpace = {
  data: TcgOverviewWorkData;
  setSearchResult: (query: string, result: TcgSearchCardsResult) => void;
  addSelection: ReturnType<typeof useAddSelection>;
  removeSelection: ReturnType<typeof useRemoveSelection>;
  clearSelection: () => void;
};
export const SELECTION_LIMIT = 60;

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
  const addSelection = useAddSelection({ workData, setWorkData });
  const removeSelection = useRemoveSelection({ workData, setWorkData });
  const clearSelection = useCallback(() => {
    if (!workData?.selection) return;

    const newSelection = {
      elementsByPage: {} as Record<number, string[]>,
      elementIds: [] as string[],
      elementDataById: {},
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
    } as TcgOverviewWorkSpace;
  }, [workData, setSearchResult, addSelection, removeSelection, clearSelection]);

  return <TcgOverviewWorkContext.Provider value={ambient}>{children}</TcgOverviewWorkContext.Provider>;
}

const initializeWorkData = (query: string, result: TcgSearchCardsResult) => {
  return {
    search: { query: query, page: result.data.currentPage, result: result },
    selection: { elementIds: [], elementsByPage: {}, elementDataById: {} },
  } as TcgOverviewWorkData;
};
