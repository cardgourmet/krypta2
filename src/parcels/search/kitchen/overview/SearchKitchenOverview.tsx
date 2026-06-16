import { Flex, Group, Stack } from '@mantine/core';
import { createContext, useEffect, useMemo } from 'react';
import { type UseFormReturn, useForm as useForm2 } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { QueryRenderer } from '@/parcels/search/kitchen/overview/QueryRenderer.tsx';
import { useKitchenFilterStore } from '@/parcels/search/kitchen/useKitchenFilterStore.ts';
import { constructDlcQuery } from '@/parcels/tcg/dlc/kitchen/constructDlcQuery.ts';
import { DlcKitchenFilters } from '@/parcels/tcg/dlc/kitchen/DlcKitchenFilters.tsx';
import { createDefaultDlcFormData, type DlcKitchenFormData } from '@/parcels/tcg/dlc/kitchen/formData.ts';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { constructMtgQuery } from '@/parcels/tcg/mtg/kitchen/constructMtgQuery.ts';
import { createDefaultMtgFormData, type MtgKitchenFormData } from '@/parcels/tcg/mtg/kitchen/formData.ts';
import { MtgKitchenFilters } from '@/parcels/tcg/mtg/kitchen/MtgKitchenFilters.tsx';
import { constructPcgQuery } from '@/parcels/tcg/pcg/kitchen/constructPcgQuery.ts';
import { createDefaultPcgFormData, type PcgKitchenFormData } from '@/parcels/tcg/pcg/kitchen/formData.ts';
import { PcgKitchenFilters } from '@/parcels/tcg/pcg/kitchen/PcgKitchenFilters.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import styles from './SearchKitchenOverview.module.css';

export type TcgKitchenFormData = PcgKitchenFormData | DlcKitchenFormData | MtgKitchenFormData;

export const SearchKitchenContext2 = createContext<UseFormReturn<TcgKitchenFormData> | null>(null);

export function SearchKitchenOverview() {
  const { t } = useTranslation('kitchen');

  const tcg = useTcgByLocation() as Tcg;
  const previousTcg = usePrevious(tcg);

  const defaultFormData = useMemo(() => {
    if (tcg === 'pcg') {
      return createDefaultPcgFormData();
    } else if (tcg === 'dlc') {
      return createDefaultDlcFormData();
    } else if (tcg === 'mtg') {
      return createDefaultMtgFormData();
    }
  }, [tcg]);

  const setConstructedQueryFilters = useKitchenFilterStore((state) => state.setConstructedQueryFilters);

  const form2 = useForm2<TcgKitchenFormData>({
    defaultValues: defaultFormData,
  });
  useEffect(() => {
    const callback = form2.subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        if (tcg === 'pcg') {
          setConstructedQueryFilters(constructPcgQuery(values as unknown as PcgKitchenFormData));
        } else if (tcg === 'dlc') {
          setConstructedQueryFilters(constructDlcQuery(values as unknown as DlcKitchenFormData));
        } else if (tcg === 'mtg') {
          setConstructedQueryFilters(constructMtgQuery(values as unknown as MtgKitchenFormData));
        }
      },
    });

    return () => callback();
  }, [form2.subscribe, setConstructedQueryFilters, tcg]);
  useEffect(() => {
    if (previousTcg !== tcg) {
      form2?.reset();
    }
  }, [tcg, form2?.reset, previousTcg]);

  const { component, title } = useBreadcrumbs({
    subpage: t('title'),
  });

  return (
    <div>
      <title>{`Search Kitchen – ${getNameByTcg(tcg)} – Cardgourmet`}</title>

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

      <div className={styles.kitchen}>
        <div className={styles.header}>
          <QueryRenderer form2={form2} />
        </div>

        <Stack>
          <SearchKitchenContext2 value={form2}>
            {form2.control && (
              <>
                {tcg === 'mtg' && <MtgKitchenFilters />}
                {tcg === 'pcg' && <PcgKitchenFilters />}
                {tcg === 'dlc' && <DlcKitchenFilters />}
              </>
            )}
          </SearchKitchenContext2>
        </Stack>
      </div>
    </div>
  );
}
