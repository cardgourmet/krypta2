import { createFileRoute } from '@tanstack/react-router';
import { FilterOverview } from '@/parcels/search/advanced/FilterOverview.tsx';
import { useDlcAdvancedFilters } from '@/parcels/tcg/dlc/advanced/useDlcAdvancedFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
});

function RouteComponent() {
  const tcg = useTcgByLocation() as Tcg;

  const { filters: dlcFiltersByCategory, constructedQueryFilters, resetFilters } = useDlcAdvancedFilters();
  return (
    <FilterOverview
      tcg={tcg}
      filtersByCategory={dlcFiltersByCategory}
      constructedQueryFilters={constructedQueryFilters}
      resetFilters={resetFilters}
    />
  );
}
