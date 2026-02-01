import { createFileRoute } from '@tanstack/react-router';
import { FilterOverview } from '@/parcels/search/advanced/FilterOverview.tsx';
import { usePcgAdvancedFilters } from '@/parcels/tcg/pcg/advanced/usePcgAdvancedFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export const Route = createFileRoute('/pcg/advanced/')({
  component: RouteComponent,
});

function RouteComponent() {
  const tcg = useTcgByLocation() as Tcg;

  const { filters: pcgFiltersByCategory, constructedQueryFilters, resetFilters } = usePcgAdvancedFilters();
  return (
    <FilterOverview
      tcg={tcg}
      filtersByCategory={pcgFiltersByCategory}
      constructedQueryFilters={constructedQueryFilters}
      resetFilters={resetFilters}
    />
  );
}
