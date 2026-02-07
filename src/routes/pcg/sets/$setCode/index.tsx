import {createFileRoute, redirect} from '@tanstack/react-router';
import type {PcgSearchParams} from '@/parcels/tcg/pcg/types.ts';

export const Route = createFileRoute('/pcg/sets/$setCode/')({
  loader: ({ params }) => {
    throw redirect({
      to: '/pcg/cards',
      search: {
        query: `set="${params.setCode}"`,
        sortBy: 'set',
      } as Required<PcgSearchParams>,
    });
  },
});
