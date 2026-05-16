import { UnstyledButton } from '@mantine/core';
import { IconCards, IconExchange, IconPhoto, IconPlaylistAdd, IconShoppingBagHeart } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Button } from '@/parcels/generic/Button/Button';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Modal } from '@/parcels/modals/Modal';
import { modals } from '@/parcels/modals/modals.events';
import type { ExtendModalProps } from '@/parcels/modals/types';

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <Button onClick={() => modals.request('test', { component: TestModal })}>Modal anzeigen</Button>
      </div>
    </div>
  );
}

const TestModal = ({ innerProps, ...props }: ExtendModalProps) => {
  return (
    <Modal {...props}>
      <Modal.Content>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <FeaturedIcon size="lg" variant="secondary">
            <IconPlaylistAdd />
          </FeaturedIcon>

          <Modal.Title>Neue Liste erstellen</Modal.Title>

          <div style={{ textWrap: 'balance' }}>
            Nutze unsere praktischen Vorschläge oder konfiguriere eine Liste individuell nach deinen Wünschen.
          </div>

          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.25rem' }}
          >
            <Badge asChild leadingIcon={<IconPhoto style={{ color: 'limegreen' }} />}>
              <UnstyledButton>Awesome Artworks</UnstyledButton>
            </Badge>
            <Badge asChild leadingIcon={<IconExchange style={{ color: 'orange' }} />}>
              <UnstyledButton>Interesting Mechanics</UnstyledButton>
            </Badge>
            <Badge asChild leadingIcon={<IconCards style={{ color: 'dodgerblue' }} />}>
              <UnstyledButton>New Deck</UnstyledButton>
            </Badge>
            <Badge asChild leadingIcon={<IconShoppingBagHeart style={{ color: 'fuchsia' }} />}>
              <UnstyledButton>Birthday Wishlist</UnstyledButton>
            </Badge>
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Modal.SecondaryButton>Abbrechen</Modal.SecondaryButton>
        <Modal.PrimaryButton>Liste erstellen</Modal.PrimaryButton>
      </Modal.Footer>
    </Modal>
  );
};
