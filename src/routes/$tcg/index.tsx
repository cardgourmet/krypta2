import {createFileRoute, notFound, redirect} from '@tanstack/react-router';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';

export const Route = createFileRoute('/$tcg/')({
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
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
