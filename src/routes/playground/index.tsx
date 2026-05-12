import { createFileRoute } from '@tanstack/react-router';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <Typeset weight={700}>Hello World!</Typeset>
      </div>
    </div>
  );
}
