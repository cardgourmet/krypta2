import {createFileRoute} from '@tanstack/react-router';
import {loadPrintById} from '@/parcels/details/loadPrintById.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export const Route = createFileRoute('/$tcg/cards/$printId')({
  loader: ({ params }) => {
    return loadPrintById(params.tcg as Tcg, params.printId);
  },
});
