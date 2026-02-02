import { createFileRoute } from '@tanstack/react-router';
import { AdvancedFiltersOverview } from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';

export const Route = createFileRoute('/pcg/advanced/')({
  component: RouteComponent,
});

function RouteComponent() {
  /*const tcg = useTcgByLocation() as Tcg;

  const { filters: pcgFiltersByCategory, constructedQueryFilters, resetFilters } = usePcgAdvancedFilters();*/
  return (
    <AdvancedFiltersOverview />
    /*<FilterOverview
      tcg={tcg}
      filtersByCategory={pcgFiltersByCategory}
      constructedQueryFilters={constructedQueryFilters}
      resetFilters={resetFilters}
    />*/
  );
}
