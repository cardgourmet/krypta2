import {createFileRoute, redirect, stripSearchParams} from '@tanstack/react-router';
import z from 'zod';
import ListsOverview from '@/parcels/lists/ListsOverview/ListsOverview.tsx';

export const paramDefaults = {
  sortBy: 'name' as 'name' | 'updatedAt' | 'size',
  sortDir: 'auto' as 'auto' | 'asc' | 'desc',
  display: 'grid' as 'grid' | 'table',
  search: '',
};

export const paramsSchema = z.object({
  sortBy: z.enum(['name', 'updatedAt', 'size']).catch(paramDefaults.sortBy),
  sortDir: z.enum(['asc', 'desc', 'auto']).catch(paramDefaults.sortDir),
  tcg: z.enum(['mtg', 'dlc', 'pcg']).catch('mtg'),
  display: z.enum(['grid', 'table']).catch(paramDefaults.display),
  search: z.string().catch(paramDefaults.search),
});

export const Route = createFileRoute('/me/lists/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.auth?.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }
  },
  validateSearch: paramsSchema,
  search: {
    middlewares: [stripSearchParams(paramDefaults)],
  },
});

function RouteComponent() {
  return <ListsOverview />;
}
