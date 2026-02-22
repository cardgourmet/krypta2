import {createContext} from 'react';
import type {MtgSearchCardsResult} from '@/parcels/tcg/mtg/api.ts';

export const MtgOverviewWorkContext = createContext<MtgOverviewWork | null>(null);

export type MtgOverviewWork = {
  search: {
    query: string;
    result: MtgSearchCardsResult;
  };
  /* TODO: add selections to it
   */
};
