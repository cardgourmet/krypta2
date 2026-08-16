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
          width={240}
        />
        <img
          alt="Look at this Family"
          loading="lazy"
          src="https://cards.cardgourmet.com/dlc/7/f/7f65adb0-b0a2-37ed-86ff-ceda2b099d8a"
          width={240}
        />
        <img
          alt="Look at this Family"
          loading="lazy"
          src="https://cards.cardgourmet.com/dlc/d/3/d30997b8-5519-3b1e-92c8-0c8bcc23b689"
          width={240}
        />
        <img
          alt="Look at this Family"
          loading="lazy"
          src="https://cards.cardgourmet.com/dlc/e/2/e2de501b-e80c-3c1e-b11d-56c67ac80e96"
          width={240}
        />
        <div style={{ height: '200dvh' }} />
        <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}></div>
      </PageContent>
    </AppFrame>
  );
}
