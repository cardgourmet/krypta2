import { create } from 'zustand/react';

export type TcgWorkMeta<Element, OtherMeta> = {
  page: number;
  rawElements: { id: string; element: Element }[];
  other: OtherMeta;
};
export type TcgWorkData<Element, OtherMeta> = {
  meta: TcgWorkMeta<Element, OtherMeta>;
  selection: {
    elementIds: string[];
    elementDataById: Record<string, Element>;
    elementsByPage: Record<number, string[]>;
    anchorIndex?: number;
    anchorId?: string;
  };
};

export type TcgWorkStore<Element, OtherMeta> = {
  data: TcgWorkData<Element, OtherMeta> | null;
  setData: (meta: TcgWorkMeta<Element, OtherMeta>) => void;

  isSelectionMode: boolean;
  setSelectionMode: (m: boolean) => void;
  isSelectionOverlayEnabled: boolean;
  isSelectionModeLoading: boolean;
  setSelectionModeLoading: (m: boolean) => void;

  // checks if there is enough space left in the selection
  checkSelection: (ids: string[], select: boolean) => { success: boolean; toggledMode: boolean; newMode?: boolean };
  setSelection: (ids: string[], select: boolean, anchorIndex?: number, anchorId?: string) => boolean;
  setSelectionWithCheck: (ids: string[], select: boolean, shift?: boolean, thisId?: string, index?: number) => void;
  clearSelection: () => void;

  getIdsInRange: (to: number) => string[];
};

export type CreateTcgWorkStoreOptions<Element, OtherMeta> = {
  shouldResetData: (prevMeta: TcgWorkMeta<Element, OtherMeta>, newMeta: TcgWorkMeta<Element, OtherMeta>) => boolean;
  selectionLimit?: number;
};

export function createTcgWorkStore<Element, OtherMeta>(options: CreateTcgWorkStoreOptions<Element, OtherMeta>) {
  return create<TcgWorkStore<Element, OtherMeta>>((set, get) => ({
    data: null,
    setData: (meta: TcgWorkMeta<Element, OtherMeta>) => {
      const store = get();
      const workData = store.data;

      // depending on usage the "reset" condition might be different
      if (!workData?.meta || options.shouldResetData(workData.meta, meta)) {
        const data: TcgWorkData<Element, OtherMeta> = {
          meta: meta,
          selection: {
            elementIds: [],
            elementsByPage: {},
            elementDataById: {},
          },
        };

        set({ ...store, data: data });
        return;
      }

      set({ ...store, data: { ...workData, meta: meta } });
    },

    isSelectionMode: false,
    setSelectionMode: (m: boolean) => {
      const store = get();
      set({ ...store, isSelectionMode: m, isSelectionModeLoading: false });
    },
    isSelectionOverlayEnabled: false,
    isSelectionModeLoading: false,
    setSelectionModeLoading: (m: boolean) => {
      const store = get();
      set({ ...store, isSelectionModeLoading: m });
    },

    checkSelection: (ids: string[], select: boolean) => {
      const store = get();
      const workData = store.data;

      if (!workData?.selection) return { success: false, toggledMode: false };
      if (ids.length === 0) return { success: false, toggledMode: false };

      const currentSelected = new Set(workData?.selection?.elementIds ?? []);
      const toSelectIds = ids.filter((id) => !currentSelected.has(id));

      const current = currentSelected.size;
      if (select && current + toSelectIds.length > (options.selectionLimit ?? 9999)) {
        return { success: false, toggledMode: false };
      }

      let toggledMode = false;
      let newMode: boolean | undefined;
      if (select && current === 0) {
        toggledMode = true;
        newMode = true;

        set({ ...store, isSelectionOverlayEnabled: true });
      } else if (!select) {
        const idsToDelete = ids.filter((id) => currentSelected.has(id));
        if (current - idsToDelete.length <= 0) {
          toggledMode = true;
          newMode = false;

          set({ ...store, isSelectionOverlayEnabled: false });
        }
      }
      return { success: true, toggledMode: toggledMode, newMode: newMode };
    },
    setSelection: (ids: string[], select: boolean, anchorIndex?: number, anchorId?: string) => {
      const store = get();
      const workData = store.data;
      if (!workData?.selection) return false;
      if (ids.length === 0) return false;

      const currentSelected = new Set(workData?.selection?.elementIds ?? []);
      const toSelectIds = ids.filter((id) => !currentSelected.has(id));
      const current = currentSelected.size;
      if (select && current + toSelectIds.length > (options.selectionLimit ?? 9999)) {
        return false;
      }

      const dataEntries = workData.meta.rawElements.filter((c) => {
        return ids.includes(c.id);
      });
      const data = Object.fromEntries(dataEntries.map((c) => [c.id, c.element] as const)) as Record<string, Element>;
      const currentPage = workData?.meta?.page;

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
    setSelectionWithCheck: (ids: string[], select: boolean, shift?: boolean, thisId?: string, index?: number) => {
      const store = get();

      let mustIds = ids;
      if (shift === true && index !== undefined) {
        // if shift key, calculate range of cards to add or remove
        mustIds = store.getIdsInRange(index);
      }
      mustIds = [...new Set(mustIds)];

      if (mustIds.length === 0) return;

      const { success: allowed, toggledMode, newMode } = store.checkSelection(mustIds, select);
      if (!allowed) return;

      store.setSelection(mustIds, select, index, thisId);
      if (toggledMode) {
        store.setSelectionModeLoading(true);

        setTimeout(() => {
          store.setSelectionMode(newMode ?? false);
        }, 0);
      }
    },
    clearSelection: () => {
      const newSelection = {
        elementsByPage: {},
        elementIds: [],
        elementDataById: {},
        anchorIndex: undefined,
        anchorId: undefined,
      };

      const currentData = get().data;
      if (!currentData) return;

      set({
        data: {
          ...currentData,
          selection: newSelection,
        },
        isSelectionOverlayEnabled: false,
      });

      get().setSelectionModeLoading(true);

      setTimeout(() => {
        get().setSelectionMode(false);
      }, 0);
    },

    getIdsInRange: (to: number) => {
      const store = get();
      const workData = store.data;
      if (!workData) return [];

      const anchorIndex = workData?.selection?.anchorIndex;
      if (anchorIndex === undefined) return [];
      return getIdsInRangeFromElements(anchorIndex, to, workData);
    },
  }));
}

function getIdsInRangeFromElements<Element, OtherMeta>(
  anchorIndex: number,
  currentIndex: number,
  data: TcgWorkData<Element, OtherMeta>,
): string[] {
  const fromIndex = anchorIndex < currentIndex ? anchorIndex : currentIndex;
  const toIndex = anchorIndex < currentIndex ? currentIndex : anchorIndex;

  const ids = [] as string[];

  data.meta.rawElements.forEach(({ id }, index) => {
    if (index >= fromIndex && index <= toIndex) {
      ids.push(id);
    }
  });

  return ids;
}

const addSelection = <Element, OtherMeta>(
  workData: TcgWorkData<Element, OtherMeta> | null,
  setWorkData: (d: TcgWorkData<Element, OtherMeta>) => void,
  ids: string[],
  dataById: Record<string, Element>,
  anchorIndex?: number,
  anchorId?: string,
) => {
  if (!workData?.selection) return;

  const elementIds = [...(workData.selection.elementsByPage[workData.meta.page] ?? [])];
  ids.forEach((id: string) => {
    if (elementIds.includes(id)) return;
    elementIds.push(id);
  });

  const newElementsByPage = { ...workData.selection.elementsByPage, [workData.meta.page]: elementIds } as Record<
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

const removeSelection = <Element, OtherMeta>(
  workData: TcgWorkData<Element, OtherMeta> | null,
  setWorkData: (d: TcgWorkData<Element, OtherMeta>) => void,
  ids: string[],
  page?: number,
  anchorIndex?: number,
  anchorId?: string,
) => {
  if (!workData?.selection) return;
  const mustPage = page ?? workData.meta.page;

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
