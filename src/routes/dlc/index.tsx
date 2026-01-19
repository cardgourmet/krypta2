import { createFileRoute, redirect } from '@tanstack/react-router';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';

export const Route = createFileRoute('/dlc/')({
  loader: () => {
    throw redirect({
      to: '/dlc/cards',
      search: {} as Required<DlcSearchParams>,
    });
  },
});
