import type { ResolvedUserListResource } from '@/parcels/lists/types.ts';
import { createTcgWorkStore } from '@/parcels/selection/createTcgWorkStore.tsx';

export const useListDetailsWorkStore = createTcgWorkStore<ResolvedUserListResource, unknown>({
  shouldResetData: () => {
    return false;
  },
});
