import {createFileRoute, notFound} from '@tanstack/react-router';
import {AdvancedFiltersOverview} from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';

export const Route = createFileRoute('/$tcg/advanced/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound();
  },
});

function RouteComponent() {
  return <AdvancedFiltersOverview />;
}
