import { SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { PcgDataEra } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { SetCard } from '../SetCard/SetCard';

export function SetOverviewGrid({
  tcg,
  sortedSets,
  erasById,
}: {
  tcg: string;
  sortedSets:
    | {
        year: number;
        era: undefined;
        sets: TcgDataSet[];
      }[]
    | {
        era: string;
        year: undefined;
        sets: TcgDataSet[];
      }[];
  erasById: Record<string, PcgDataEra>;
}) {
  const smallScreen = useMediaQuery('(max-width: 1100px)');
  const smallerScreen = useMediaQuery('(max-width: 800px)');
  const smallestScreen = useMediaQuery('(max-width: 565px)');

  return (
    <Stack gap={'2rem'}>
      {sortedSets.map((e) => {
        const era: PcgDataEra | undefined = erasById[e.era ?? ''];
        const eraName = era?.translations?.en?.name;

        return (
          <Stack key={e?.year ?? e.era} gap={'0.5rem'}>
            <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fw={400} fz={'1.2rem'}>
              {e?.year ?? eraName}
            </GourmetText>

            <SimpleGrid cols={smallestScreen ? 1 : smallerScreen ? 2 : smallScreen ? 3 : 4}>
              {e.sets.map((set) => (
                <SetCard key={set.id} set={set} tcg={tcg as Tcg} />
              ))}
            </SimpleGrid>
          </Stack>
        );
      })}
    </Stack>
  );
}
