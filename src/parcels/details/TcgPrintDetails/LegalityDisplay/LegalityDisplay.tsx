import { Center, Group, Stack } from '@mantine/core';
import { IconAlertCircle, IconCircleCheck, IconCircleX, IconEdit } from '@tabler/icons-react';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import styles from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.module.css';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export type Legality = {
  format: string;
  status: 'legal' | 'restricted' | 'banned';
};

export function LegalityDisplay({ legalities }: { legalities: Legality[] }) {
  return (
    <Stack maw={'28rem'} gap={'0.25rem'}>
      <Center>
        <GourmetText cgmff={'title'} fz={'1.25rem'} fw={500}>
          Legalities
        </GourmetText>
      </Center>

      <Stack
        gap={'0.25rem'}
        h={'20rem'}
        style={{
          border: '1px solid var(--gourmet-neutral-3)',
          borderRadius: '0.5rem',
          padding: '1rem 1.5rem',
        }}
        justify={'space-between'}
      >
        <Group style={{ rowGap: '0.5rem' }}>
          {legalities
            .sort((a, b) => a.format.localeCompare(b.format))
            .map((l, i) => {
              return (
                <div key={i} className={styles.legality}>
                  <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fz={'0.95rem'} className={styles.legalityPill}>
                    {capitalizeFirstLetter(l.format)}
                  </GourmetText>
                  {l.status === 'legal' && <IconCircleCheck color={'var(--gourmet-green-1)'} />}
                  {l.status === 'restricted' && <IconAlertCircle color={'var(--gourmet-orange-01)'} />}
                  {l.status === 'banned' && <IconCircleX color={'var(--gourmet-red-01)'} />}
                </div>
              );
            })}
        </Group>
        <Stack gap={'0'}>
          <GourmetText cgmff={'ui'}>Everything not listed here is not legal by default.</GourmetText>

          <Button
            accent="brand"
            size="sm"
            leadingIcon={<IconEdit />}
            variant="tertiary"
            onClick={() => {
              // TODO: open menu to edit displayed formats
            }}
          >
            <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'}>
              Edit displayed formats
            </GourmetText>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
