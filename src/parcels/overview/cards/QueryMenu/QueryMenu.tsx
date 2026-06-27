import { Group } from '@mantine/core';
import { QueryListButtons } from '@/parcels/overview/cards/QueryMenu/QueryListButtons/QueryListButtons.tsx';
import type { UserSearchCardsDetails } from '@/parcels/tcg/types.ts';

export function QueryMenu({ details }: { details: UserSearchCardsDetails }) {
  return (
    <Group ml={'1rem'}>
      <QueryListButtons details={details} size={18} />
    </Group>
  );
}
