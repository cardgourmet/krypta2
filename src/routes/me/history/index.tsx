import {createFileRoute, stripSearchParams} from '@tanstack/react-router';
import z from "zod";

export const paramDefaults = {
  sortDir: 'auto' as 'auto' | 'asc' | 'desc',
  search: '',
  size: 20,
  page: 1,
};

export const paramsSchema = z.object({
  sortDir: z.enum(['asc', 'desc', 'auto']).catch(paramDefaults.sortDir),
  search: z.string().catch(paramDefaults.search),
  size: z.int().catch(paramDefaults.size),
  page: z.int().catch(paramDefaults.page),
  tcg: z.enum(['mtg', 'dlc', 'pcg']).catch('mtg'),
});

export const Route = createFileRoute('/me/history/')({
  component: RouteComponent,
  validateSearch: paramsSchema,
  search: {
    middlewares: [stripSearchParams(paramDefaults)],
  },
});

function RouteComponent() {
  // TODO: add tcg as parameter
  // TODO: if not logged in: only show what is in local storage
  // (with warning that not all are shown because not logged in)
  // TODO: if logged in: fetch new paginated

  return <div>Hello "/me/history/"!</div>;
}
