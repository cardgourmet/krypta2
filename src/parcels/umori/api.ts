import createClient, { type Middleware } from 'openapi-fetch';
import type { DlcCardSortBy, DlcSearchQuerySettings } from '@/parcels/tcg/dlc/types.ts';
import type { components as c, paths } from '@/schema/api.d.ts';

const client = createClient<paths>({
  baseUrl: 'http://localhost:8080',
});
const authMiddleware: Middleware = {
  onRequest({ request }) {
    request.headers.set('Authorization', `Basic ${btoa('quagga:omnivoregarden42')}`);
    return request;
  },
};
client.use(authMiddleware);

export type TcgCardQuery = {
  mode?: string;
  query?: string;
  pageSize?: number;
  page?: number;
  sortDirection?: 'asc' | 'desc';
  lang?: string;
  displayLanguage?: string;
  flags?: string;
  allowedFilters?: string;
  forbiddenFilters?: string;
  allowedValueTypes?: string;
  retries?: string;
};

// ========================================================
// DISNEY LORCANA
// ========================================================

export type DlcCardQuery = TcgCardQuery & {
  sortBy?: DlcCardSortBy;
};

export type DlcSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'];

export async function fetchDlcCards(
  settings: DlcSearchQuerySettings,
  abort: AbortController,
): Promise<{ query: DlcCardQuery; data?: DlcSearchCardsResult; error?: Error }> {
  const query: DlcCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: Number(settings.pageSize),
    sortBy: settings.sortBy,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  try {
    const res = await client.GET(`/v1/dlc/cards/search`, {
      params: {
        query: query,
      },
      signal: abort.signal,
    });

    if (!res.response.ok) {
      return { query: query, error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { query: query, error: new Error('Received invalid data') };
    }

    return { query: query, data: res.data };
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    if (error.name === 'AbortError') {
      console.log('Just aborted the call, no biggies.');
    } else {
      console.log(`Error: ${error}`);
    }
    return { query: query, error: error };
  }
}

// ========================================================
// POKÉMON CARD GAME
// ========================================================

export type PcgSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-PcgDataCard-ExplainSearchQueryResponse'];

export type PcgCardSortBy = 'name' | 'set' | 'rarity' | 'type' | 'health' | 'released';
export type PcgCardQuery = TcgCardQuery & {
  sortBy?: PcgCardSortBy;
};

export function isPcgCardSortBy(s: string): s is PcgCardSortBy {
  return s === 'name' || s === 'set' || s === 'rarity' || s === 'type' || s === 'health' || s === 'released';
}

export const pcgSortByElements: Record<PcgCardSortBy, string> = {
  name: 'Name',
  set: 'Set',
  rarity: 'Seltenheit',
  type: 'Typ',
  health: 'Leben',
  released: 'Veröffentlichkeitsdatum',
};
export const pcgSortByDefault = 'name';

export function fetchPcgCards(
  query: PcgCardQuery,
  abort: AbortController,
  onSuccess: (data: PcgSearchCardsResult) => void,
) {
  client
    .GET(`/v1/pcg/cards/search`, {
      params: {
        query: query,
      },
      signal: abort.signal,
    })
    .then((res) => {
      if (!res.data) {
        return;
      }

      onSuccess(res.data as PcgSearchCardsResult);
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('Just aborted the call, no biggies.');
      } else {
        console.log(`Error: ${error}`);
      }
    });
}
