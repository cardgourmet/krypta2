import {create} from 'zustand/react';
import {getIdsInRange} from '@/parcels/selection/getIdsInRange.ts';
import type {TcgOverviewWorkData} from '@/parcels/selection/TcgOverviewWorkContext/TcgOverviewWorkContext.tsx';
import type {TcgSearchCardsResult, TcgSearchDataCard} from '@/parcels/tcg/types.ts';

export type TcgOverviewWorkStore = {
  data: TcgOverviewWorkData | null;
  setData: (query: string, result: TcgSearchCardsResult) => void;

  isSelectionMode: boolean;
  setSelectionMode: (m: boolean) => void;
  isSelectionOverlayEnabled: boolean;
  isSelectionModeLoading: boolean;
  setSelectionModeLoading: (m: boolean) => void;

  // checks if there is enough space left in the selection
  checkSelection: (ids: string[], select: boolean) => { success: boolean; toggledMode: boolean; newMode?: boolean };
  setSelection: (ids: string[], select: boolean, anchorIndex?: number, anchorId?: string) => boolean;
  clearSelection: () => void;

  getIdsInRange: (to: number) => string[];
};

export const SELECTION_LIMIT = 60;
export const useTcgOverviewWorkStore = create<TcgOverviewWorkStore>((set, get) => ({
  data: null,
  setData: (query: string, result: TcgSearchCardsResult) => {
    const store = get();
    const workData = store.data;
    if (!workData?.search || workData.search.query !== query) {
      set({ ...store, data: initializeWorkData(query, result) });
      return;
    }

    const newSearch = { query: query, result: result, page: result.data.currentPage };
    set({ ...store, data: { ...workData, search: newSearch } });
  },

  isSelectionMode: false,
  setSelectionMode: (m: boolean) => {
    const store = get();
    set({ ...store, isSelectionMode: m, isSelectionModeLoading: false });
  },
  isSelectionModeLoading: false,
  setSelectionModeLoading: (m: boolean) => {
    const store = get();
    set({ ...store, isSelectionModeLoading: m });
  },
  isSelectionOverlayEnabled: false,

  checkSelection: (ids: string[], select: boolean): { success: boolean; toggledMode: boolean; newMode?: boolean } => {
    const store = get();
    const workData = store.data;

    if (!workData?.selection) return { success: false, toggledMode: false };
    if (ids.length === 0) return { success: false, toggledMode: false };

    const current = workData?.selection?.elementIds.length ?? 0;
    if (select && current + ids.length >= SELECTION_LIMIT) {
      return { success: false, toggledMode: false };
    }

    let toggledMode = false;
    let newMode: boolean | undefined;
    if (select && current === 0) {
      toggledMode = true;
      newMode = true;

      set({ ...store, isSelectionOverlayEnabled: true });
    } else if (!select) {
      const idsToDelete = ids.filter((id) => workData.selection.elementIds.includes(id));
      if (current - idsToDelete.length <= 0) {
        toggledMode = true;
        newMode = false;

        set({ ...store, isSelectionOverlayEnabled: false });
      }
    }
    return { success: true, toggledMode: toggledMode, newMode: newMode };
  },

  setSelection: (ids: string[], select: boolean, anchorIndex?: number, anchorId?: string): boolean => {
    const store = get();
    const workData = store.data;
    if (!workData?.selection) return false;
    if (ids.length === 0) return false;

    const current = workData?.selection?.elementIds.length ?? 0;
    if (select && current + ids.length > SELECTION_LIMIT) {
      return false;
    }
    const dataEntries = (workData?.search?.result?.data?.items as TcgSearchDataCard[]).filter((c) =>
      ids.includes(c.card.print.id),
    );
    const data = Object.fromEntries(dataEntries.map((c) => [c.card.print.id, c] as const));
    const currentPage = workData?.search?.page;

    if (select) {
      addSelection(
        workData,
        (d) => {
          set({ ...store, data: d });
        },
        ids,
        data,
        anchorIndex,
        anchorId,
      );
    } else {
      // find out which page the first id is on ...
      const firstId = ids[0];
      let mustPage = currentPage;
      for (const key in workData.selection.elementsByPage) {
        const keyNumber = parseInt(key, 10);
        const idsInPage = workData.selection.elementsByPage[key];

        if (idsInPage.includes(firstId)) {
          mustPage = keyNumber;
          break;
        }
      }

      removeSelection(
        workData,
        (d) => {
          set({ ...store, data: d });
        },
        ids,
        mustPage,
        anchorIndex,
        anchorId,
      );
    }
    return true;
  },
  clearSelection: () => {
    const store = get();
    const workData = store.data;
    if (!workData?.selection) return;

    const newSelection = {
      elementsByPage: {} as Record<number, string[]>,
      elementIds: [] as string[],
      elementDataById: {},
      anchorIndex: -1,
      anchorId: undefined,
    };
    set({ ...store, data: { ...workData, selection: newSelection } });
  },

  getIdsInRange: (to: number): string[] => {
    const store = get();
    const workData = store.data;
    if (!workData) return [];

    const anchorIndex = workData?.selection?.anchorIndex;
    if (anchorIndex === undefined) return [];
    return getIdsInRange(anchorIndex, to, workData);
  },
}));

const initializeWorkData = (query: string, result: TcgSearchCardsResult) => {
  return {
    search: { query: query, page: result.data.currentPage, result: result },
    selection: { elementIds: [], elementsByPage: {}, elementDataById: {} },
  } as TcgOverviewWorkData;
};

const addSelection = (
  workData: TcgOverviewWorkData | null,
  setWorkData: (d: TcgOverviewWorkData) => void,
  ids: string[],
  dataById: Record<string, TcgSearchDataCard>,
  anchorIndex?: number,
  anchorId?: string,
) => {
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
};

const removeSelection = (
  workData: TcgOverviewWorkData | null,
  setWorkData: (d: TcgOverviewWorkData) => void,
  ids: string[],
  page?: number,
  anchorIndex?: number,
  anchorId?: string,
) => {
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
};
