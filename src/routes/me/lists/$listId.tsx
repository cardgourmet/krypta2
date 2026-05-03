import {createFileRoute, redirect} from '@tanstack/react-router';
import z from 'zod';
import {getAllResourcesFromList, getList} from '@/parcels/lists/api.ts';
import {ListDetails} from '@/parcels/lists/ListDetails/ListDetails.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export const paramsSchema = z.object({
  tcg: z.enum(['mtg', 'dlc', 'pcg']).catch('mtg').optional(),
});

export const Route = createFileRoute('/me/lists/$listId')({
  component: RouteComponent,
  validateSearch: paramsSchema,
  beforeLoad: ({ context }) => {
    if (context.auth.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }
  },
  loaderDeps: ({ search }) => ({
    tcg: search.tcg as Tcg,
  }),
  loader: async ({ params, context, deps }) => {
    const listId = params.listId;
    const userId = context.auth.user!.id;
    const tcg = deps.tcg;

    const list = await getList(userId, listId);
    if (!list.data) {
      throw redirect({
        to: '/',
      });
    }

    const listResources = await getAllResourcesFromList(userId, listId, tcg);

    return { list, listResources };
  },
});

function RouteComponent() {
  return <ListDetails />;
}
