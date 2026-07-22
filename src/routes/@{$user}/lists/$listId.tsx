import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router';
import z from 'zod';
import { getList } from '@/parcels/lists/api.ts';
import { ListDetails } from '@/parcels/lists/ListDetails/ListDetails.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { type DataUser, findUser } from '@/parcels/user/api.ts';

export const listDetailsParamsDefaults = {
  tcgs: '',
  sort: 'addedAt' as 'name' | 'addedAt',
  order: 'auto' as 'asc' | 'desc' | 'auto',
};

export const paramsSchema = z.object({
  tcgs: z
    .preprocess((value) => {
      // weird way of allowing `x,y,z` and `["x","y","z"]` types
      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === 'string') {
        if (value.trim() === '') {
          return [];
        }

        return value.split(',').filter(Boolean);
      }

      return [];
    }, z.enum(['mtg', 'dlc', 'pcg']).array())
    .optional(),
  sort: z.enum(['name', 'addedAt']).catch(listDetailsParamsDefaults.sort).optional(),
  order: z.enum(['asc', 'desc', 'auto']).catch(listDetailsParamsDefaults.order).optional(),
});

export type ListDetailsData = {
  owner: DataUser;
  list: UserList;
  publicView: boolean;
};

export const Route = createFileRoute('/@{$user}/lists/$listId')({
  component: RouteComponent,
  validateSearch: paramsSchema,
  loader: async ({ params, context }) => {
    const loggedIn = context.auth.user;
    if (loggedIn?.username === params.user) {
      const list = await getList(loggedIn.id, params.listId);
      if (!list.data) {
        throw notFound();
      }

      return { owner: loggedIn as DataUser, list: list.data, publicView: false } as ListDetailsData;
    }

    const res = await findUser(params.user);
    if (res.error) {
      sendErrorNotification(res.error);
      throw notFound();
    }
    if (res.data?.username !== params.user) {
      throw notFound();
    }

    const list = await getList(res.data.id, params.listId);
    if (!list.data) {
      throw notFound();
    }

    return { owner: res.data, list: list.data, publicView: true } as ListDetailsData;
  },
  loaderDeps: ({ search }) => ({
    tcgs: search.tcgs,
  }),
  search: {
    middlewares: [stripSearchParams(listDetailsParamsDefaults)],
  },
});

function RouteComponent() {
  const data = Route.useLoaderData() as ListDetailsData;

  return <ListDetails owner={data.owner} list={data.list} publicView={data.publicView} />;
}
