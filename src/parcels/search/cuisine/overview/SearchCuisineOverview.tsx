import { Button, Group, Text } from '@mantine/core';
import { type UseFormReturnType, useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { createContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { create } from 'zustand/react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import { SearchQueryExplanation } from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import styles from '@/parcels/search/cuisine/FilterOverview.module.css';
import { useStartSearch } from '@/parcels/search/startSearch.ts';
import { constructDlcQuery } from '@/parcels/tcg/dlc/cuisine/constructDlcQuery.ts';
import { DlcCuisineFilters } from '@/parcels/tcg/dlc/cuisine/DlcCuisineFilters.tsx';
import { createDefaultDlcFormData, type DlcCuisineFormData } from '@/parcels/tcg/dlc/cuisine/formData.ts';
import { constructMtgQuery } from '@/parcels/tcg/mtg/cuisine/constructMtgQuery.ts';
import { createDefaultMtgFormData, type MtgCuisineFormData } from '@/parcels/tcg/mtg/cuisine/formData.ts';
import { MtgCuisineFilters } from '@/parcels/tcg/mtg/cuisine/MtgCuisineFilters.tsx';
import { constructPcgQuery } from '@/parcels/tcg/pcg/cuisine/constructPcgQuery.ts';
import { createDefaultPcgFormData, type PcgCuisineFormData } from '@/parcels/tcg/pcg/cuisine/formData.ts';
import { PcgCuisineFilters } from '@/parcels/tcg/pcg/cuisine/PcgCuisineFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export type TcgCuisineFilterFormData = PcgCuisineFormData | DlcCuisineFormData | MtgCuisineFormData;
export const SearchCuisineContext = createContext<UseFormReturnType<TcgCuisineFilterFormData> | null>(null);

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

export function SearchCuisineOverview() {
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
        setConstructedQueryFilters(constructPcgQuery(values as unknown as PcgCuisineFormData));
      } else if (tcg === 'dlc') {
        setConstructedQueryFilters(constructDlcQuery(values as unknown as DlcCuisineFormData));
      } else if (tcg === 'mtg') {
        setConstructedQueryFilters(constructMtgQuery(values as unknown as MtgCuisineFormData));
      }
    },
  });

  return (
    <div className={styles.mainContent}>
      <Breadcrumbs subpage={t('title')} />

      <div className={styles.cuisine}>
        <div className={styles.header}>
          <QueryRenderer form={form} />
        </div>

        <div className={styles.searchOptions}>
          <SearchCuisineContext value={form}>
            {tcg === 'mtg' && <MtgCuisineFilters />}
            {tcg === 'pcg' && <PcgCuisineFilters />}
            {tcg === 'dlc' && <DlcCuisineFilters />}
          </SearchCuisineContext>
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
