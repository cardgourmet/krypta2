import { Button, Group, Text } from '@mantine/core';
import { type UseFormReturnType, useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { createContext, useMemo, useState } from 'react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import styles from '@/parcels/search/advanced/FilterOverview.module.css';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import { constructDlcQuery } from '@/parcels/tcg/dlc/advanced/constructDlcQuery.ts';
import { DlcAdvancedFilters } from '@/parcels/tcg/dlc/advanced/DlcAdvancedFilters.tsx';
import { createDefaultDlcFormData, type DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/formData.ts';
import { constructPcgQuery } from '@/parcels/tcg/pcg/advanced/constructPcgQuery.ts';
import { createDefaultPcgFormData, type PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/formData.ts';
import { PcgAdvancedFilters } from '@/parcels/tcg/pcg/advanced/PcgAdvancedFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export const AdvancedFilterContext = createContext<UseFormReturnType<
  PcgAdvancedFilterFormData | DlcAdvancedFilterFormData
> | null>(null);

export function AdvancedFiltersOverview() {
  const [constructedQueryFilters, setConstructedQueryFilters] = useState<string[]>([]);

  const tcg = useTcgByLocation() as Tcg;
  const defaultFormData = useMemo(() => {
    if (tcg === 'pcg') {
      return createDefaultPcgFormData();
    } else if (tcg === 'dlc') {
      return createDefaultDlcFormData();
    }
  }, [tcg]);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: defaultFormData,
    onValuesChange: (values) => {
      if (tcg === 'pcg') {
        setConstructedQueryFilters(constructPcgQuery(values as unknown as PcgAdvancedFilterFormData));
      } else if (tcg === 'dlc') {
        setConstructedQueryFilters(constructDlcQuery(values as unknown as DlcAdvancedFilterFormData));
      }
    },
  });

  const constructedQuery = useMemo<string>(() => {
    if (constructedQueryFilters.length === 1) {
      return constructedQueryFilters[0];
    }
    return constructedQueryFilters.map((f) => `(${f})`).join(' ');
  }, [constructedQueryFilters]);
  const [debouncedQuery] = useDebouncedValue(constructedQuery, 300);

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
            {tcg === 'dlc' && <DlcAdvancedFilters />}
          </AdvancedFilterContext>
        </div>
      </div>
    </div>
  );
}
