import {Center, Divider, Group, SimpleGrid, Stack} from '@mantine/core';
import {createFileRoute, Link, notFound} from '@tanstack/react-router';
import type {ReactElement} from 'react';
import type {GourmetApiResponse} from '@/parcels/api/handleApiCall.ts';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {type DlcDataSet, fetchDlcSets} from '@/parcels/tcg/dlc/api.ts';
import {fetchMtgSets, type MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import {fetchPcgSets, type PcgDataSet} from '@/parcels/tcg/pcg/api.ts';
import {TcgSetIcon} from '@/parcels/tcg/TcgSetIcon.tsx';
import type {TcgDataSets} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './index.module.css';

export const Route = createFileRoute('/$tcg/sets/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
  loader: async ({ params }) => {
    let res: GourmetApiResponse<TcgDataSets> | undefined;
    if (params.tcg === 'mtg') {
      res = await fetchMtgSets();
    } else if (params.tcg === 'pcg') {
      res = await fetchPcgSets();
    } else if (params.tcg === 'dlc') {
      res = await fetchDlcSets();
    }
    return res;
  },
});

function RouteComponent() {
  const { tcg } = Route.useParams();
  const data = Route.useLoaderData();

  const { component, title } = useBreadcrumbs({ subpage: 'Alle Sets' });

  return (
    <>
      <title>{`All Sets Overview – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>

      <div>
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
          <Stack p={'0.5rem 0'}>
            <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
              {title?.label}
            </GourmetText>
          </Stack>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
        </Stack>

        <Stack>{data?.data?.items && sortSetsByReleaseYear(tcg as Tcg, data.data.items, 'desc')}</Stack>
      </div>
    </>
  );
}

function sortSetsByReleaseYear(tcg: Tcg, sets: TcgDataSet[], order: 'asc' | 'desc'): ReactElement[] {
  let filteredSets = sets;
  if (tcg === 'pcg') {
    filteredSets = filteredSets.filter((set) => {
      const s = set as PcgDataSet;

      return s.region === 'int' && ['main_expansion', 'special_expansion', 'energies'].includes(s.type);
    });
  }

  const setsByYear = groupBy<TcgDataSet, number>(filteredSets, (set) => {
    let releaseDate: string | undefined;
    if (tcg === 'mtg') {
      releaseDate = (set as MtgDataSet).releaseDate;
    } else if (tcg === 'pcg') {
      releaseDate = (set as PcgDataSet).releaseStartDate ?? undefined;
    } else if (tcg === 'dlc') {
      releaseDate = (set as DlcDataSet).releaseDate;
    }

    if (releaseDate === undefined) return 0 as number;
    return new Date(releaseDate).getFullYear();
  });
  const setsByYearArr = Object.entries(setsByYear).map(([year, sets]) => ({
    year: Number(year),
    sets,
  }));

  setsByYearArr.sort((a, b) => {
    if (order === 'asc') return a.year - b.year;
    return (a.year - b.year) * -1;
  });

  return setsByYearArr.map(({ year, sets }) => {
    return (
      <Stack key={year} gap={'0.5rem'}>
        <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fw={400} fz={'1.2rem'}>
          {year}
        </GourmetText>

        <SimpleGrid cols={4}>
          {sets.map((set) => (
            <SetCard key={set.id} tcg={tcg} set={set} />
          ))}
        </SimpleGrid>
      </Stack>
    );
  });
}

/*const bannerSrc =
  'https://images.ctfassets.net/s5n2t79q9icq/5DBkWOEJ02sWQGXU6Xm2Nd/eae989456760c6a51db665741a2d5643/3H8hMTEhhnho_DE_660x237.png';*/

function SetCard({ tcg, set }: { tcg: Tcg; set: TcgDataSet }) {
  const language = 'en';
  const translation = set.translations[language];

  const name = translation?.name ?? 'translation not found';
  const logoUrl = translation?.imageUrls?.logo ?? '';

  // TODO: make date formatted
  let date = new Date().toLocaleDateString();
  if (tcg === 'mtg') {
    date = (set as MtgDataSet).releaseDate;
  } else if (tcg === 'pcg') {
    date = (set as PcgDataSet).releaseStartDate ?? '';
  } else if (tcg === 'dlc') {
    date = (set as DlcDataSet).releaseDate;
  }

  return (
    <Stack className={styles.setCard}>
      <Stack gap={'0.5rem'} h={'100%'}>
        <Group wrap={'nowrap'} gap={'1rem'}>
          <TcgSetIcon tcg={tcg} setCode={set.code ?? '?'} />
          <div>
            <Link
              to={'/$tcg/sets/$setCode'}
              params={{ tcg: tcg, setCode: set.code ?? '?' }}
              className={styles.setCardLink}
            >
              <GourmetText cgmc={'neutral-8'} span>
                {name}
              </GourmetText>
            </Link>
            <GourmetText cgmc={'neutral-6'} fz={'0.85rem'} span>
              {set.code}
            </GourmetText>
          </div>
        </Group>

        <Center>
          {logoUrl && (
            <Link
              to={'/$tcg/sets/$setCode'}
              params={{ tcg: tcg, setCode: set.code ?? '?' }}
              className={styles.setCardLink}
            >
              <img src={logoUrl} alt={'banner'} style={{ maxWidth: '100%', maxHeight: '5rem' }} />
            </Link>
          )}
          {!logoUrl && (
            <Center style={{ height: '5rem' }}>
              <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                No image available.
              </GourmetText>
            </Center>
          )}
        </Center>

        <Stack justify={'space-between'} h={'100%'}>
          <Group justify={'end'}>
            <div className={styles.setTypeTag}>
              <GourmetText cgmff={'monospace'} fz={'0.85rem'}>
                {set.type}
              </GourmetText>
            </div>
          </Group>

          <Group justify={'space-between'}>
            <GourmetText>{set.printsAvailable} prints</GourmetText>
            <GourmetText cgmff={'ui'}>{date}</GourmetText>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  );
}

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      // biome-ignore lint/suspicious/noAssignInExpressions: <>
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
