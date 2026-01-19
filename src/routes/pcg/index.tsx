import { createFileRoute, redirect } from '@tanstack/react-router';
import type { PcgSearchParams } from '@/parcels/tcg/pcg/types.ts';

export const Route = createFileRoute('/pcg/')({
  loader: () => {
    throw redirect({
      to: '/pcg/cards',
      search: {} as Required<PcgSearchParams>,
    });
  },
});
