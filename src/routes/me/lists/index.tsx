import {createFileRoute, redirect} from '@tanstack/react-router';
import {fetchLists} from '@/parcels/lists/api.ts';

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
  const userLists = Route.useLoaderData();

  return <div>{JSON.stringify(userLists)}</div>;
}
