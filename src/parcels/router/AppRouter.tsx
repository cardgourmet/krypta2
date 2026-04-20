import {createRouter, RouterProvider} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {NotFound} from '@/parcels/homepage/NotFound.tsx';
import {routeTree} from '@/routeTree.gen.ts';

const router = createRouter({
  context: {
    auth: undefined!,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultStructuralSharing: true,
  routeTree,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth: auth }} defaultNotFoundComponent={({data}) => <NotFound data={data} />} />;
}
