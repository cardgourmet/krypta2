import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen.ts';

export const router = createRouter({
  context: {
    auth: undefined!,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultStructuralSharing: true,
  routeTree,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
