import { createFileRoute, redirect } from '@tanstack/react-router';
import type { MtgSearchParams } from '@/parcels/tcg/mtg/types.ts';

export const Route = createFileRoute('/mtg/sets/$setCode/')({
  loader: ({ params }) => {
    throw redirect({
      to: '/mtg/cards',
      search: {
        query: `set="${params.setCode}"`,
        sortBy: 'set',
      } as Required<MtgSearchParams>,
    });
  },
});
