import { IconShoppingBagHeart } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/parcels/generic/Button/Button';
import { Input } from '@/parcels/generic/Input/Input';
import { Select } from '@/parcels/generic/Select/Select';
import { modals } from '@/parcels/modals/modals.events';

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <Button onClick={() => modals.request('createList')}>Modal anzeigen</Button>
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
