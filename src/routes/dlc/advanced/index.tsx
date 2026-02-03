import { createFileRoute } from '@tanstack/react-router';
import { AdvancedFiltersOverview } from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdvancedFiltersOverview />;
}
