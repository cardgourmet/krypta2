import { IconSortDescending } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/parcels/generic/Button/Button';
import { Input } from '@/parcels/generic/Input/Input';
import { AppFrame } from '@/parcels/layout/AppFrame/AppFrame';
import { PageContent } from '@/parcels/layout/PageContent/PageContent';
import { PageHeader } from '@/parcels/layout/PageHeader/PageHeader';

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppFrame>
      <PageContent headerSlot={<PageHeader />}>
        <div style={{ marginBottom: '0.5rem' }}>
          <Button leadingIcon={<IconSortDescending />} size="sm" variant="tertiary">
            Name
          </Button>
        </div>
        Hallo ich bin Content.
        <Input />
        <img
          alt="Look at this Family"
          loading="lazy"
          src="https://cards.cardgourmet.com/dlc/5/8/58c24b18-1a74-3035-ab35-3d03b5568131"
          width={400}
        ></img>
        <div style={{ height: '200dvh' }} />
        <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}></div>
      </PageContent>
    </AppFrame>
  );
}
