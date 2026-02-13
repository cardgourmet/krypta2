import {createFileRoute, redirect} from '@tanstack/react-router';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';

export const Route = createFileRoute('/$tcg/')({
  loader: ({ params }) => {
    throw redirect({
      to: '/$tcg/cards',
      search: {} as Required<TcgSearchParams>,
      params: {
        tcg: params.tcg,
      },
    });
  },
});
