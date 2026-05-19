import { Stack, UnstyledButton } from '@mantine/core';
import {
  IconCards,
  IconExchange,
  IconEyeOff,
  IconPhoto,
  IconPlaylistAdd,
  IconShieldShare,
  IconShoppingBagHeart,
  IconWorld,
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Button } from '@/parcels/generic/Button/Button';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Input } from '@/parcels/generic/Input/Input';
import { Select } from '@/parcels/generic/Select/Select';
import { TagSelect } from '@/parcels/generic/TagSelect/TagSelect';
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
        <Input placeholder="Test" />
        <Select
          data={['test 1', 'test 2', 'test 3']}
          optionDecorations={{
            'test 1': {
              icon: <IconShoppingBagHeart />,
            },
            'test 2': {
              description: 'Das ist ein Test.',
            },
          }}
        />
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

        <Stack gap="0.75rem" mt="1.25rem">
          <Input label="Name" placeholder="Chef's Recommendations" required />
          <Input label="Description" />
          <Select
            data={['Private', 'Unlisted', 'Public']}
            optionDecorations={{
              Private: {
                description: 'Die Liste ist nur für dich sichtbar.',
                icon: <IconEyeOff />,
              },
              Unlisted: {
                description: 'Die Liste ist über einen Link sichtbar für alle.',
                icon: <IconShieldShare />,
              },
              Public: {
                description: 'Die Liste ist sichtbar für alle.',
                icon: <IconWorld />,
              },
            }}
            label="Visibility"
          />
          <TagSelect
            data={['Disney Lorcana', 'Magic: The Gathering', 'Pokémon TCG']}
            hidePickedOptions
            hint="Du kannst beschränken, aus welchen Spielen dieser Liste Karten hinzugefügt werden dürfen."
            label="TCGs"
            optionDecorations={{
              'Disney Lorcana': {
                supportingText: 'DLC',
              },
              'Magic: The Gathering': {
                supportingText: 'MTG',
              },
              'Pokémon TCG': {
                supportingText: 'PCG',
              },
            }}
            placeholder="Suchen…"
            searchable
          />
        </Stack>
      </Modal.Content>
      <Modal.Footer>
        <Modal.SecondaryButton onClick={() => modals.request('test', { component: TestModal, nested: true })}>
          Abbrechen
        </Modal.SecondaryButton>
        <Modal.PrimaryButton>Liste erstellen</Modal.PrimaryButton>
      </Modal.Footer>
    </Modal>
  );
};
