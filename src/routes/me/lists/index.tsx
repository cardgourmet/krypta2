import {createFileRoute, redirect} from '@tanstack/react-router';
import {fetchLists} from '@/parcels/lists/api.ts';
import type {UserListWithSize} from "@/parcels/lists/types.ts";
import {GourmetText} from "@/parcels/mantine/GourmetText.tsx";

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
  const { data } = Route.useLoaderData();
  const userLists = data?.items as UserListWithSize[];

  return (
    <div>
      {userLists.map((list) => {
        return <GourmetText key={list.list.id}>{JSON.stringify(list)}</GourmetText>;
      })}
    </div>
  );
}
