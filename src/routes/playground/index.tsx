import { createFileRoute } from '@tanstack/react-router';
import { AppFrame } from '@/parcels/layout/AppFrame/AppFrame';
import { PageHeader } from '@/parcels/layout/PageHeader/PageHeader';

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <PageHeader />

      <div style={{ height: '200dvh' }} />
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}></div>
    </AppFrame>
  );
}
