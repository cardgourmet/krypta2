import {createFileRoute, redirect, stripSearchParams} from '@tanstack/react-router';
import z from 'zod';
import {fetchLists} from '@/parcels/lists/api.ts';
import ListsOverview from '@/parcels/lists/ListsOverview/ListsOverview.tsx';

export const paramDefaults = {
  sortBy: 'name' as 'name' | 'updatedAt' | 'size',
  sortDir: 'auto' as 'auto' | 'asc' | 'desc',
  display: 'grid' as 'grid' | 'table',
};

export const paramsSchema = z.object({
  sortBy: z.enum(['name', 'updatedAt', 'size']).catch(paramDefaults.sortBy),
  sortDir: z.enum(['asc', 'desc', 'auto']).catch(paramDefaults.sortDir),
  display: z.enum(['grid', 'table']).catch(paramDefaults.display),
  tcg: z.enum(['mtg', 'dlc', 'pcg']).catch('mtg'),
});

export const Route = createFileRoute('/me/lists/')({
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    if (context.auth?.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }

    // TODO: get default tcg based on last tcg if not set

    return await fetchLists(
      context.auth.user.id,
      deps.sortBy,
      deps.sortDir === 'auto' ? undefined : deps.sortDir,
      deps.tcg,
      undefined,
      undefined,
    );
  },
  validateSearch: paramsSchema,
  search: {
    middlewares: [stripSearchParams(paramDefaults)],
  },
});

function RouteComponent() {
  const res = Route.useLoaderData();
  const search = Route.useSearch();

  return <ListsOverview tcg={search.tcg} res={res} />;
}
