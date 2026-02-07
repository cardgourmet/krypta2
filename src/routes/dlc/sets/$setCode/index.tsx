import { createFileRoute, redirect } from '@tanstack/react-router';
import type {DlcSearchParams} from "@/parcels/tcg/dlc/types.ts";

export const Route = createFileRoute('/dlc/sets/$setCode/')({
  loader: ({ params }) => {
    throw redirect({
      to: '/dlc/cards',
      search: {
        query: `set="${params.setCode}"`,
        sortBy: 'set',
      } as Required<DlcSearchParams>,
    });
  },
});
