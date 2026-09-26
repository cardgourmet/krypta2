import { RouterProvider } from '@tanstack/react-router';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { NotFound } from '@/parcels/homepage/NotFound.tsx';
import { router } from '@/parcels/router/router.ts';

export function AppRouter() {
  const auth = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ auth: auth }}
      defaultNotFoundComponent={({ data }) => <NotFound data={data as Record<string, string>} />}
    />
  );
}
