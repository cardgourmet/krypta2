import {Divider, Group, Stack, Text} from "@mantine/core";
import {IconBrush, IconCalendar, IconDiamond, IconLanguage, IconMagnetic, IconNumber, IconPlayCard} from "@tabler/icons-react";
import {Link} from "@tanstack/react-router";
import type {MtgDataPrint, MtgDataSet} from "@/parcels/tcg/mtg/api.ts";
import styles from "@/routes/mtg/sets/$setCode/$collectorNumber/{-$any}.module.css";

export function MtgPrintMetaRenderer({ print, set }: { print: MtgDataPrint; set: MtgDataSet }) {
  return (
    <Stack
      style={{
        border: '1px dashed var(--gourmet-neutral-5)',
        borderRadius: '4px',
        flexGrow: '1',
        minHeight: '32rem',
        maxWidth: '16rem',
      }}
      p={'0.25rem'}
    >
      <Stack gap={'xs'}>
        <Link to={'/mtg/sets/$setCode'} params={{ setCode: set.code.toLowerCase() }} className={styles.setLink}>
          <Group gap={'xs'} wrap={'nowrap'} align={'start'}>
            <IconMagnetic size={32} />
            <Text ff={'var(--cgm-content-font-family)'} fz={'1rem'} c={'var(--gourmet-neutral-9)'}>
              {set.translations.en.name}
            </Text>
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
          <Group gap={'xs'}>
            <IconCalendar />
            <Text>{print.releaseDate}</Text>
          </Group>

          <Divider my="xs" color={'var(--gourmet-neutral-2)'} w={'100%'} />

          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconPlayCard />
            <Text>{print.finishes.join(', ')}</Text>
          </Group>
          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconLanguage />
            <Text style={{ textWrap: 'wrap' }}>{print.supportedLanguages.join(', ')}</Text>
          </Group>

          <Divider my="xs" color={'var(--gourmet-neutral-2)'} w={'100%'} />

          <Group gap={'xs'} wrap="nowrap" align={'start'}>
            <IconBrush />
            <Text>{print.artist}</Text>
          </Group>
        </Group>
      </Stack>
    </Stack>
  );
}
