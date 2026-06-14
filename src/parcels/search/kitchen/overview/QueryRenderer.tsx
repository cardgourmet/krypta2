import { Button, Group, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import type { TcgKitchenFormData } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { useKitchenFilterStore } from '@/parcels/search/kitchen/useKitchenFilterStore.ts';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export function QueryRenderer({ form2 }: { form2: UseFormReturn<TcgKitchenFormData> }) {
  const { t } = useTranslation('kitchen');
  const tcg = useTcgByLocation() as Tcg;

  const constructedQueryFilters = useKitchenFilterStore((state) => state.constructedQueryFilters);
  const constructedQuery = useMemo<string>(() => {
    if (constructedQueryFilters.length === 1) {
      return constructedQueryFilters[0];
    }
    return constructedQueryFilters.map((f) => `(${f})`).join(' ');
  }, [constructedQueryFilters]);
  const [debouncedQuery] = useDebouncedValue(constructedQuery, 300);

  const startSearch = useStartSearch(tcg, constructedQuery);

  return (
    <Group justify={'space-between'}>
      <div style={{ width: '50%' }}>
        {constructedQueryFilters.length === 0 && <Text fs={'italic'}>{t('subtitle')}</Text>}
        {constructedQueryFilters.length > 0 && <SearchQueryExplanation tcg={tcg} query={debouncedQuery} />}
      </div>
      <Group>
        {constructedQueryFilters.length > 0 && (
          <Button
            color={'var(--gourmet-neutral-3)'}
            onClick={() => {
              form2.reset();
            }}
          >
            {t('resetButton', { count: constructedQueryFilters.length })}
          </Button>
        )}
        <Button
          color={'var(--gourmet-blue-2)'}
          disabled={constructedQueryFilters.length === 0}
          leftSection={<IconSearch size={18} />}
          onClick={startSearch}
        >
          {t('startSearch')}
        </Button>
      </Group>
    </Group>
  );
}
