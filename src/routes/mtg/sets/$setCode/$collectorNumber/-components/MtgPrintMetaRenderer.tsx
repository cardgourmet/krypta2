import { Group, Stack, Text } from '@mantine/core';
import { IconBrush, IconCalendar, IconDiamond, IconLanguage, IconNumber, IconPlayCard } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { MtgDataPrint, MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import styles from '@/routes/mtg/sets/$setCode/$collectorNumber/{-$any}.module.css';

export function MtgPrintMetaRenderer({ print, set }: { print: MtgDataPrint; set: MtgDataSet }) {
  return (
    <Stack
      style={{
        border: '1px dashed var(--gourmet-neutral-5)',
        borderRadius: '4px',
        flexGrow: '1',
        minHeight: '32rem',
        maxWidth: '16rem',
        marginLeft: 'auto',
      }}
    >
      <Stack gap={'xs'}>
        <Link to={'/mtg/sets/$setCode'} params={{ setCode: set.code.toLowerCase() }} className={styles.setLink}>
          <Group gap={'xs'} wrap={'nowrap'} align={'start'}>
            <MtgSetIcon setCode={set.code.toLowerCase()} />
            <Stack gap={'0.25rem'}>
              <Text ff={'var(--cgm-content-font-family)'} fz={'1rem'} c={'var(--gourmet-neutral-9)'}>
                {set.translations.en.name}
              </Text>
              <Text ff={'var(--cgm-content-font-family)'} fz={'xs'} c={'var(--gourmet-neutral-7)'}>
                {set.code} &#x2022; {set.printsAvailable} Karten &#x2022; {set.releaseDate}
              </Text>
            </Stack>
          </Group>
        </Link>
        <Group p={'sm'}>
          <Group gap={'xs'}>
            <IconNumber strokeWidth={'2'} />
            <Text>#{print.collectorNumber}</Text>
          </Group>
          <Group gap={'xs'}>
            <IconDiamond />
            <Text>{print.rarity}</Text>
          </Group>

          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconPlayCard />
            <Text>{print.finishes.join(', ')}</Text>
          </Group>
          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconLanguage />
            <Text style={{ textWrap: 'wrap' }}>{print.supportedLanguages.join(', ')}</Text>
          </Group>

          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconBrush />
            <Text>{print.artist}</Text>
          </Group>
        </Group>
      </Stack>
    </Stack>
  );
}

export const MtgSetIcon = ({ setCode }: { setCode: string }) => {
  return (
    <i className={`ss ss-${setCode.toLowerCase()}`} style={{ color: 'var(--gourmet-neutral-9)', fontSize: '1.5rem' }} />
  );
};
