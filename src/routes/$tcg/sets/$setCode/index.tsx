import { createFileRoute, redirect } from '@tanstack/react-router';
import type { TcgSearchParams } from '@/parcels/tcg/types.ts';

export const Route = createFileRoute('/$tcg/sets/$setCode/')({
  loader: ({ params }) => {
    throw redirect({
      to: '/$tcg/cards',
      search: {
        query: `set="${params.setCode}"`,
        sortBy: 'set',
      } as Required<TcgSearchParams>,
      params: {
        tcg: params.tcg,
      },
    });
  },
});
