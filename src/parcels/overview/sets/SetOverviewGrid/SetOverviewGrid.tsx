import { Stack } from '@mantine/core';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import type { PcgDataEra } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { SetCard } from '../SetCard/SetCard';
import styles from './SetOverviewGrid.module.css';

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
  return (
    <Stack gap="2rem">
      {sortedSets.map((e) => {
        const era: PcgDataEra | undefined = erasById[e.era ?? ''];
        const eraId = `era-${e?.year ?? era.id}`;
        const eraName = era?.translations?.en?.name;

        return (
          <section aria-labelledby={eraId} key={eraId}>
            <Typeset
              asChild
              size="lg"
              style={{ fontFamily: 'var(--cgm-title-font-family)', margin: '0 0 0.5rem' }}
              weight={600}
            >
              <h2 id={eraId}>{e?.year ?? eraName}</h2>
            </Typeset>

            <div className={styles.grid}>
              {e.sets.map((set) => (
                <SetCard key={set.id} set={set} tcg={tcg as Tcg} />
              ))}
            </div>
          </section>
        );
      })}
    </Stack>
  );
}
