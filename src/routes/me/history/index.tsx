import {createFileRoute, stripSearchParams} from '@tanstack/react-router';
import z from 'zod';
import {SearchHistoryOverview} from '@/parcels/search/history/SearchHistoryOverview.tsx';

export const historyParamDefaults = {
  sortDir: 'desc' as 'asc' | 'desc',
  search: '',
  size: 20,
  page: 1,
};

export const paramsSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch(historyParamDefaults.sortDir),
  search: z.string().catch(historyParamDefaults.search),
  size: z.int().catch(historyParamDefaults.size),
  page: z.int().catch(historyParamDefaults.page),
  tcg: z.enum(['mtg', 'dlc', 'pcg']).catch('mtg'),
});

export const Route = createFileRoute('/me/history/')({
  component: RouteComponent,
  validateSearch: paramsSchema,
  search: {
    middlewares: [stripSearchParams(historyParamDefaults)],
  },
});

function RouteComponent() {
  return <SearchHistoryOverview />;
}
