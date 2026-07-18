import { createFileRoute, notFound } from '@tanstack/react-router';
import { SearchKitchenOverview } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';

export const Route = createFileRoute('/$tcg/kitchen/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
});

function RouteComponent() {
  return <SearchKitchenOverview />;
}
