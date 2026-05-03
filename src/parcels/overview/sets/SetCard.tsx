import {Center, Group, Stack} from '@mantine/core';
import {Link} from '@tanstack/react-router';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from '@/parcels/overview/sets/SetsOverview.module.css';
import type {DlcDataSet} from '@/parcels/tcg/dlc/api.ts';
import type {MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import type {PcgDataSet} from '@/parcels/tcg/pcg/api.ts';
import {TcgSetIcon} from '@/parcels/tcg/TcgSetIcon.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function SetCard({ tcg, set }: { tcg: Tcg; set: TcgDataSet }) {
  const language = 'en';
  const translation = set.translations[language];

  const name = translation?.name ?? 'translation not found';
  const logoUrl = translation?.imageUrls?.logo ?? '';

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
      <Stack gap={'0.75rem'} h={'100%'}>
        <Stack gap="0.15rem">
          <Group wrap={'nowrap'} gap={'0.75rem'}>
            <div style={{ alignSelf: 'start' }}>
              <TcgSetIcon tcg={tcg} setCode={set.code ?? '?'} />
            </div>
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
          <Group justify={'start'}>
            <div className={styles.setTypeTag}>
              <GourmetText cgmff={'monospace'} fz={'0.75rem'}>
                {set.type}
              </GourmetText>
            </div>
          </Group>
        </Stack>

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

        <Stack justify={'end'} h={'100%'}>
          <Group justify={'space-between'}>
            <GourmetText cgmff={'ui'}>{set.printsAvailable} prints</GourmetText>
            <GourmetText cgmff={'ui'}>{date}</GourmetText>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  );
}
