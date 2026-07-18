import { groupBy } from '@/parcels/groupBy.ts';
import type { DlcDataSet } from '@/parcels/tcg/dlc/api.ts';
import type { MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataEra, PcgDataSet } from '@/parcels/tcg/pcg/api.ts';
import type { SortDirection, TcgDataSet } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function groupByEra(tcg: Tcg, sets: TcgDataSet[], order: SortDirection, erasById: Record<string, PcgDataEra>) {
  const setsByEra = groupBy<TcgDataSet, string>(sets, (set) => {
    if (tcg === 'pcg') {
      return (set as PcgDataSet).eraId;
    }
    return '';
  });
  const setsByEraArr = Object.entries(setsByEra).map(([eraId, sets]) => ({
    era: eraId,
    year: undefined,
    sets,
  }));

  setsByEraArr.sort((a, b) => {
    const eraA = erasById[a.era];
    const eraB = erasById[b.era];
    const ancientDate = new Date(0);

    const dateA = eraA?.from ? new Date(eraA.from) : ancientDate;
    const dateB = eraB?.from ? new Date(eraB.from) : ancientDate;

    if (order === 'asc') return dateA.getTime() - dateB.getTime();
    return (dateA.getTime() - dateB.getTime()) * -1;
  });

  return setsByEraArr;
}

export function groupByYear(tcg: Tcg, sets: TcgDataSet[], order: SortDirection) {
  const setsByYear = groupBy<TcgDataSet, number>(sets, (set) => {
    const releaseDate = getReleaseDate(tcg as Tcg, set);

    if (releaseDate === undefined) return 0 as number;
    return new Date(releaseDate).getFullYear();
  });
  const setsByYearArr = Object.entries(setsByYear).map(([year, sets]) => ({
    year: Number(year),
    era: undefined,
    sets,
  }));

  setsByYearArr.sort((a, b) => {
    if (order === 'asc') return a.year - b.year;
    return (a.year - b.year) * -1;
  });

  return setsByYearArr;
}

export function getReleaseDate(tcg: Tcg, set: TcgDataSet): Date | undefined {
  let releaseDate: string | undefined;
  if (tcg === 'mtg') {
    releaseDate = (set as MtgDataSet).releaseDate;
  } else if (tcg === 'pcg') {
    releaseDate = (set as PcgDataSet).releaseStartDate ?? undefined;
  } else if (tcg === 'dlc') {
    releaseDate = (set as DlcDataSet).releaseDate;
  }

  return releaseDate ? new Date(releaseDate) : undefined;
}
