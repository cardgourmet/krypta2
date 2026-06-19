import { create } from 'zustand/react';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { fetchSavedSearches } from '@/parcels/search/api.ts';
import type { UserResolvedSavedSearch } from '@/parcels/search/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export const useUserRecentSavedSearches = create<{
  savedSearches: Record<Tcg, UserResolvedSavedSearch[] | undefined>;
  refetchSavedSearches: (userId: string, tcg: Tcg) => void;
  removeSavedSearch: (tcg: Tcg, id: string) => void;
  addSavedSearch: (tcg: Tcg, search: UserResolvedSavedSearch) => void;
}>((set, get) => ({
  savedSearches: {
    mtg: undefined,
    dlc: undefined,
    pcg: undefined,
  },
  refetchSavedSearches: async (userId, tcg) => {
    const currentSaved = get().savedSearches[tcg];
    if (currentSaved !== undefined) return;

    const res = await fetchSavedSearches(userId, tcg, undefined, 'desc', 10);
    if (res.error) {
      sendErrorNotification(res.error);
      return;
    }
    if (!res.data) return;

    set({
      savedSearches: {
        ...get().savedSearches,
        [tcg]: res.data.items,
      },
    });
  },
  removeSavedSearch: (tcg: Tcg, id: string) => {
    const currentSaved = get().savedSearches[tcg];
    if (currentSaved === undefined) return;

    const index = currentSaved.findIndex((s) => s.savedSearch.id === id);
    if (index < 0) return;
    currentSaved.splice(index, 1);

    set({
      savedSearches: {
        ...get().savedSearches,
        [tcg]: currentSaved,
      },
    });
  },
  addSavedSearch: (tcg: Tcg, search: UserResolvedSavedSearch) => {
    const currentSaved = get().savedSearches[tcg];
    if (currentSaved === undefined) return;

    currentSaved.push(search);
    const newSaved = currentSaved.sort((s1, s2) => {
      const dateA = new Date(s1.savedSearch.savedAt);
      const dateB = new Date(s2.savedSearch.savedAt);

      return (dateA.getTime() - dateB.getTime()) * -1;
    });
    set({
      savedSearches: {
        ...get().savedSearches,
        [tcg]: newSaved,
      },
    });
  },
}));
