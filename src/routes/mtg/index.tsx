import { createFileRoute, redirect } from '@tanstack/react-router';
import type { MtgSearchParams } from '@/parcels/tcg/mtg/types.ts';

export const Route = createFileRoute('/mtg/')({
  loader: () => {
    throw redirect({
      to: '/mtg/cards',
      search: {} as Required<MtgSearchParams>,
    });
  },
});
