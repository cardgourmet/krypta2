import { Button, Group, Text } from '@mantine/core';
import { type UseFormReturnType, useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { createContext, useMemo } from 'react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import styles from '@/parcels/search/advanced/FilterOverview.module.css';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import type { DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/useDlcAdvancedFilters.tsx';
import { createDefaultFormData, type PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/formData.ts';
import { PcgAdvancedFilters } from '@/parcels/tcg/pcg/advanced/PcgAdvancedFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export const AdvancedFilterContext = createContext<
  UseFormReturnType<PcgAdvancedFilterFormData> | UseFormReturnType<DlcAdvancedFilterFormData> | null
>(null);

export function AdvancedFiltersOverview() {
  const tcg = useTcgByLocation() as Tcg;
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: createDefaultFormData(),
    onValuesChange: (values) => {
      // TODO: update and reconstruct query. maybe debounce though.
      console.log(values);
    },
  });

  const constructedQueryFilters: string[] = [];
  const constructedQuery = useMemo<string>(() => {
    if (constructedQueryFilters.length === 1) {
      return constructedQueryFilters[0];
    }
    return constructedQueryFilters.map((f) => `(${f})`).join(' ');
  }, []);
  const [debouncedQuery] = useDebouncedValue(constructedQuery, 500);

  const startSearch = useStartSearch(tcg, constructedQuery);

  return (
    <div className={styles.mainContent}>
      <Breadcrumbs subpage={'Erweiterte Suche'} />

      <div className={styles.advancedSearch}>
        <div className={styles.header}>
          <Group justify={'space-between'}>
            <div style={{ width: '50%' }}>
              {constructedQueryFilters.length === 0 && (
                <Text fs={'italic'}>Benutze die Filter unten, um dir die Suche zusammenzubauen.</Text>
              )}
              {constructedQueryFilters.length > 0 && <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />}
            </div>
            <Group>
              {constructedQueryFilters.length > 0 && (
                <Button color={'var(--gourmet-neutral-3)'} onClick={() => {}}>
                  {constructedQueryFilters.length} Filter zurücksetzen
                </Button>
              )}
              <Button
                color={'var(--gourmet-blue-2)'}
                disabled={constructedQueryFilters.length === 0}
                leftSection={<IconSearch size={18} />}
                onClick={startSearch}
              >
                Suche starten
              </Button>
            </Group>
          </Group>
        </div>

        <div className={styles.searchOptions}>
          <AdvancedFilterContext value={form}>
            {tcg === 'pcg' && <PcgAdvancedFilters />}
            {tcg === 'dlc' && <div></div>}
          </AdvancedFilterContext>
        </div>
      </div>
    </div>
  );
}
