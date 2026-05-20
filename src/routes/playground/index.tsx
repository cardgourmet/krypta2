import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}></div>
    </div>
  );
}
