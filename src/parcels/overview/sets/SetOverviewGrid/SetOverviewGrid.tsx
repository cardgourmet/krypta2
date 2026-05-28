import { Stack } from '@mantine/core';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import type { GroupedSet } from '@/parcels/overview/sets/SetsOverview.tsx';
import type { PcgDataEra } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { SetCard } from '../SetCard/SetCard';
import styles from './SetOverviewGrid.module.css';

export function SetOverviewGrid({
  tcg,
  groupedSets,
  erasById,
}: {
  tcg: string;
  groupedSets: GroupedSet[];
  erasById: Record<string, PcgDataEra>;
}) {
  return (
    <Stack gap="2rem">
      {groupedSets.map((e) => {
        const era: PcgDataEra | undefined = erasById[e.era ?? ''];
        const eraId = `era-${e?.year ?? era?.id}`;
        const eraName = era?.translations?.en?.name;

        return (
          <section aria-labelledby={eraId} key={eraId}>
            {(e.era !== undefined || e.year !== undefined) && (
              <Typeset
                asChild
                size="lg"
                style={{ fontFamily: 'var(--cgm-title-font-family)', margin: '0 0 0.5rem' }}
                weight={600}
              >
                <h2 id={eraId}>{e?.year ?? eraName}</h2>
              </Typeset>
            )}

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
