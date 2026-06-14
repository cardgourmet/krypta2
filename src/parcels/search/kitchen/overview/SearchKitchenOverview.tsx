import { Button, Flex, Group, Stack, Text } from '@mantine/core';
import { type UseFormReturnType, useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { createContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { create } from 'zustand/react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import styles from '@/parcels/search/kitchen/FilterOverview.module.css';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import { constructDlcQuery } from '@/parcels/tcg/dlc/kitchen/constructDlcQuery.ts';
import { DlcKitchenFilters } from '@/parcels/tcg/dlc/kitchen/DlcKitchenFilters.tsx';
import { createDefaultDlcFormData, type DlcKitchenFormData } from '@/parcels/tcg/dlc/kitchen/formData.ts';
import { constructMtgQuery } from '@/parcels/tcg/mtg/kitchen/constructMtgQuery.ts';
import { createDefaultMtgFormData, type MtgKitchenFormData } from '@/parcels/tcg/mtg/kitchen/formData.ts';
import { MtgKitchenFilters } from '@/parcels/tcg/mtg/kitchen/MtgKitchenFilters.tsx';
import { constructPcgQuery } from '@/parcels/tcg/pcg/kitchen/constructPcgQuery.ts';
import { createDefaultPcgFormData, type PcgKitchenFormData } from '@/parcels/tcg/pcg/kitchen/formData.ts';
import { PcgKitchenFilters } from '@/parcels/tcg/pcg/kitchen/PcgKitchenFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export type TcgCuisineFilterFormData = PcgKitchenFormData | DlcKitchenFormData | MtgKitchenFormData;
export const SearchKitchenContext = createContext<UseFormReturnType<TcgCuisineFilterFormData> | null>(null);

export type CuisineFilterStore = {
  constructedQueryFilters: string[];
  setConstructedQueryFilters: (filters: string[]) => void;
};
export const useCuisineFilterStore = create<CuisineFilterStore>((set) => ({
  constructedQueryFilters: [],
  setConstructedQueryFilters: (filters: string[]) => {
    set((state) => {
      return { ...state, constructedQueryFilters: filters };
    });
  },
}));

export function SearchKitchenOverview() {
  const { t } = useTranslation('cuisine');

  const tcg = useTcgByLocation() as Tcg;
  const defaultFormData = useMemo(() => {
    if (tcg === 'pcg') {
      return createDefaultPcgFormData();
    } else if (tcg === 'dlc') {
      return createDefaultDlcFormData();
    } else if (tcg === 'mtg') {
      return createDefaultMtgFormData();
    }
  }, [tcg]);

  const setConstructedQueryFilters = useCuisineFilterStore((state) => state.setConstructedQueryFilters);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: defaultFormData,
    onValuesChange: (values) => {
      if (tcg === 'pcg') {
        setConstructedQueryFilters(constructPcgQuery(values as unknown as PcgKitchenFormData));
      } else if (tcg === 'dlc') {
        setConstructedQueryFilters(constructDlcQuery(values as unknown as DlcKitchenFormData));
      } else if (tcg === 'mtg') {
        setConstructedQueryFilters(constructMtgQuery(values as unknown as MtgKitchenFormData));
      }
    },
  });

  const { component, title } = useBreadcrumbs({
    subpage: t('title'),
  });

  return (
    <div className={styles.mainContent}>
      {component}
      <Stack
        gap={'0'}
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 'var(--sticky-layer)',
          backgroundColor: 'var(--gourmet-neutral-0)',
        }}
        mb={'1rem'}
      >
        <Flex justify={'space-between'} p={'0.5rem 0'} direction={'row'}>
          <Group gap={'0.1rem'}>
            <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
              {title?.label}
            </GourmetText>
          </Group>
        </Flex>
      </Stack>

      <div className={styles.cuisine}>
        <div className={styles.header}>
          <QueryRenderer form={form} />
        </div>

        <div className={styles.searchOptions}>
          <SearchKitchenContext value={form}>
            {tcg === 'mtg' && <MtgKitchenFilters />}
            {tcg === 'pcg' && <PcgKitchenFilters />}
            {tcg === 'dlc' && <DlcKitchenFilters />}
          </SearchKitchenContext>
        </div>
      </div>
    </div>
  );
}

function QueryRenderer({ form }: { form: UseFormReturnType<TcgCuisineFilterFormData> }) {
  const { t } = useTranslation('cuisine');
  const tcg = useTcgByLocation() as Tcg;

  const constructedQueryFilters = useCuisineFilterStore((state) => state.constructedQueryFilters);
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
              form.reset();
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
