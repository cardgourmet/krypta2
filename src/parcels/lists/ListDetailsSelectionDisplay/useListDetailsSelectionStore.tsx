import type { TcgSearchCardsResult, TcgSearchDataCard } from '@/parcels/tcg/types.ts';

export type TcgListDetailsWorkData = {
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
