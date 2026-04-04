import {createFileRoute, redirect, stripSearchParams} from '@tanstack/react-router'
import z from "zod";
import {SavedSearchesOverview} from "@/parcels/search/saved/SavedSearchesOverview.tsx";

export const savedSearchesParamDefaults = {
  sortDir: 'desc' as 'asc' | 'desc',
  search: '',
  size: 20,
  page: 1,
};

export const savedSearchesParamsSchema = z.object({
  sortDir: z.enum(['asc', 'desc']).catch(savedSearchesParamDefaults.sortDir),
  search: z.string().catch(savedSearchesParamDefaults.search),
  size: z.int().catch(savedSearchesParamDefaults.size),
  page: z.int().catch(savedSearchesParamDefaults.page),
  tcg: z.enum(['mtg', 'dlc', 'pcg']).catch('mtg'),
});

export const Route = createFileRoute('/me/saved-searches/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.auth?.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }
  },
  validateSearch: savedSearchesParamsSchema,
  search: {
    middlewares: [stripSearchParams(savedSearchesParamDefaults)],
  },
});

function RouteComponent() {
  return <SavedSearchesOverview />;
}
