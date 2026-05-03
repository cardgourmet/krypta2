import {Button, Group, Text} from '@mantine/core';
import {useForm, type UseFormReturnType} from '@mantine/form';
import {useDebouncedValue} from '@mantine/hooks';
import {IconSearch} from '@tabler/icons-react';
import {createContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {create} from 'zustand/react';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import styles from '@/parcels/search/advanced/FilterOverview.module.css';
import {SearchQueryExplanation} from '@/parcels/search/bar/SearchCompletion/SearchQueryExplanation.tsx';
import {useStartSearch} from '@/parcels/search/startSearch.ts';
import {constructDlcQuery} from '@/parcels/tcg/dlc/advanced/constructDlcQuery.ts';
import {DlcAdvancedFilters} from '@/parcels/tcg/dlc/advanced/DlcAdvancedFilters.tsx';
import {createDefaultDlcFormData, type DlcAdvancedFilterFormData} from '@/parcels/tcg/dlc/advanced/formData.ts';
import {constructMtgQuery} from '@/parcels/tcg/mtg/advanced/constructMtgQuery.ts';
import {createDefaultMtgFormData, type MtgAdvancedFilterFormData} from '@/parcels/tcg/mtg/advanced/formData.ts';
import {MtgAdvancedFilters} from '@/parcels/tcg/mtg/advanced/MtgAdvancedFilters.tsx';
import {constructPcgQuery} from '@/parcels/tcg/pcg/advanced/constructPcgQuery.ts';
import {createDefaultPcgFormData, type PcgAdvancedFilterFormData} from '@/parcels/tcg/pcg/advanced/formData.ts';
import {PcgAdvancedFilters} from '@/parcels/tcg/pcg/advanced/PcgAdvancedFilters.tsx';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';

export type TcgAdvancedFilterFormData =
  | PcgAdvancedFilterFormData
  | DlcAdvancedFilterFormData
  | MtgAdvancedFilterFormData;
export const AdvancedFilterContext = createContext<UseFormReturnType<TcgAdvancedFilterFormData> | null>(null);

export type AdvancedFilterStore = {
  constructedQueryFilters: string[];
  setConstructedQueryFilters: (filters: string[]) => void;
};
export const useAdvancedFilterStore = create<AdvancedFilterStore>((set) => ({
  constructedQueryFilters: [],
  setConstructedQueryFilters: (filters: string[]) => {
    set((state) => {
      return { ...state, constructedQueryFilters: filters };
    });
  },
}));

export function AdvancedFiltersOverview() {
  const { t } = useTranslation('advanced');

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

  const setConstructedQueryFilters = useAdvancedFilterStore((state) => state.setConstructedQueryFilters);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: defaultFormData,
    onValuesChange: (values) => {
      if (tcg === 'pcg') {
        setConstructedQueryFilters(constructPcgQuery(values as unknown as PcgAdvancedFilterFormData));
      } else if (tcg === 'dlc') {
        setConstructedQueryFilters(constructDlcQuery(values as unknown as DlcAdvancedFilterFormData));
      } else if (tcg === 'mtg') {
        setConstructedQueryFilters(constructMtgQuery(values as unknown as MtgAdvancedFilterFormData));
      }
    },
  });

  return (
    <div className={styles.mainContent}>
      <Breadcrumbs subpage={t('title')} />

      <div className={styles.advancedSearch}>
        <div className={styles.header}>
          <QueryRenderer form={form} />
        </div>

        <div className={styles.searchOptions}>
          <AdvancedFilterContext value={form}>
            {tcg === 'mtg' && <MtgAdvancedFilters />}
            {tcg === 'pcg' && <PcgAdvancedFilters />}
            {tcg === 'dlc' && <DlcAdvancedFilters />}
          </AdvancedFilterContext>
        </div>
      </div>
    </div>
  );
}

function QueryRenderer({ form }: { form: UseFormReturnType<TcgAdvancedFilterFormData> }) {
  const { t } = useTranslation('advanced');
  const tcg = useTcgByLocation() as Tcg;

  const constructedQueryFilters = useAdvancedFilterStore((state) => state.constructedQueryFilters);
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
