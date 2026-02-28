import {createFileRoute, redirect} from '@tanstack/react-router';
import {fetchLists} from '@/parcels/lists/api.ts';
import ListsOverview from '@/parcels/lists/ListsOverview/ListsOverview.tsx';

export const Route = createFileRoute('/me/lists/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.auth?.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }

    return await fetchLists(context.auth.user.id, context.auth.token);
  },
});

function RouteComponent() {
  const res = Route.useLoaderData();

  return <ListsOverview res={res} />;
}
