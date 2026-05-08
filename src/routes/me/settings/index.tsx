import { createFileRoute, redirect } from '@tanstack/react-router';
import { SettingsOverview } from '@/parcels/settings/SettingsOverview.tsx';

export const Route = createFileRoute('/me/settings/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.auth?.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  return <SettingsOverview />;
}
