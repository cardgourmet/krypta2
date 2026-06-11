import { Center, Group, Loader, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { type GourmetApiResponse, sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { SetCard } from '@/parcels/overview/sets/SetCard/SetCard.tsx';
import { useUserLanguage } from '@/parcels/state/useUserLanguage.tsx';
import { getDlcStatistics } from '@/parcels/tcg/dlc/api.ts';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { getMtgStatistics } from '@/parcels/tcg/mtg/api.ts';
import { getPcgStatistics } from '@/parcels/tcg/pcg/api.ts';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { TcgDataSet, TcgStatistics } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgStatisticsSlide({ tcg }: { tcg: Tcg }) {
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statistics, setStatistics] = useState<TcgStatistics | undefined>(undefined);
  useEffect(() => {
    const loadStatistics = async () => {
      setStatisticsLoading(true);
      try {
        let res: GourmetApiResponse<TcgStatistics> | undefined;

        if (tcg === 'mtg') {
          res = await getMtgStatistics();
        } else if (tcg === 'pcg') {
          res = await getPcgStatistics();
        } else if (tcg === 'dlc') {
          res = await getDlcStatistics();
        }

        if (!res) return;
        if (res.error) {
          sendErrorNotification(res.error);
          return;
        }

        setStatistics(res.data);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setStatisticsLoading(false);
      }
    };

    // noinspection JSIgnoredPromiseFromCall
    loadStatistics();
  }, [tcg]);

  const [lang] = useUserLanguage();
  const locale = lang === 'de' ? 'de-DE' : 'en-US';

  return (
    <Stack p={'0.5rem'}>
      <Group mb={'0.5rem'}>
        <TcgIcon tcg={tcg} color={'var(--gourmet-blue-1)'} />
        <GourmetText cgmff={'title'} fz={'1.1rem'} fw={500} c={'var(--gourmet-blue-1)'}>
          {getNameByTcg(tcg)}
        </GourmetText>
      </Group>

      {statisticsLoading && (
        <Center>
          <Loader />
        </Center>
      )}

      {!statisticsLoading && statistics && (
        <Stack>
          <Group>
            <Stack gap={'0'}>
              <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
                PRINTS
              </GourmetText>
              <GourmetText cgmff={'monospace'} fz={'1.75rem'} fw={'bold'}>
                {Intl.NumberFormat(locale).format(statistics.printCounts)}
              </GourmetText>
            </Stack>

            <Stack gap={'0'}>
              <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
                CARDS
              </GourmetText>
              <GourmetText cgmff={'monospace'} fz={'1.75rem'} fw={'bold'}>
                {Intl.NumberFormat(locale).format(statistics.cardCounts)}
              </GourmetText>
            </Stack>

            <Stack gap={'0'}>
              <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
                SETS
              </GourmetText>
              <GourmetText cgmff={'monospace'} fz={'1.75rem'} fw={'bold'}>
                {Intl.NumberFormat(locale).format(statistics.setCount)}
              </GourmetText>
            </Stack>
          </Group>

          <Stack>
            <GourmetText cgmff={'ui'} fz={'0.9rem'} fw={500}>
              MOST RECENT SET
            </GourmetText>

            <SetCard set={statistics.lastSet as unknown as TcgDataSet} tcg={tcg} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
