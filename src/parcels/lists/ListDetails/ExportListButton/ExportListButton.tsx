import { ActionIcon, Button, Group, Modal, Stack, Textarea, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetSelect } from '@/parcels/generic/mantine/GourmetSelect/GourmetSelect.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import styles from './ExportListButton.module.css';

export function ExportListButton({ list }: { list: UserList }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.delete' });
  const [opened, { open, close }] = useDisclosure(false);

  // TODO: which formats to export per tcg
  // TODO: MTG
  // - MTGA `[Quantity] [Card Name] ([Set Code]) [Collector Number]`
  // - MTGO `[Quantity] [Card Name]`
  // TODO: PCG
  // - Limitless `[Quantity] [Card Name] [Set Code] [Collector Number]`
  // - PTCGO
  // - PokemonCard.io
  // - pkmn.gg
  // TODO: DLC
  // - Dreamborn `[Quantity] [Card Name] - [Card Title]`
  // - lorcana.gg

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconUpload size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              Export
            </GourmetText>
          </Group>
        }
        size="xl"
      >
        <Stack>
          <Stack gap={'0.25rem'}>
            <Group gap={'1rem'}>
              <GourmetText cgmff={'ui'} cgmc={'neutral-8'} fz={'h4'}>
                Export Preview
              </GourmetText>
              <GourmetText cgmff={'ui'} cgmc={'neutral-6'} fz={'1rem'}>
                First 10 Rows are shown
              </GourmetText>
            </Group>

            <Textarea
              value={`1 Pikachu ex MP1 6
1 Detective Pikachu PR-SV 98
1 Pikachu PR-SV 242`}
              autosize
              minRows={10}
              maxRows={10}
              className={styles.preview}
            />
          </Stack>

          <Group>
            <GourmetSelect
              data={[
                { group: 'MTG', items: ['MTGO', 'MTGA'] },
                { group: 'PCG', items: ['Limitless', 'PTCGO', 'PokemonCard.io', 'pkmn.gg'] },
                { group: 'DLC', items: ['Dreamborn', 'lorcana.gg'] },
              ]}
              value={'MTGO'}
              defaultValue={'MTGO'}
              allowDeselect={false}
            />
          </Group>

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>{t('cancel')}</GourmetText>
            </Button>
            <Button color={'var(--gourmet-blue-1)'} onClick={() => {}}>
              <GourmetText cgmc={'neutral-0'}>Copy to Clipboard</GourmetText>
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Tooltip label={t('tooltip')} openDelay={500}>
        <ActionIcon className={styles.editButton} disabled={list.systemListType !== undefined} onClick={open}>
          <IconUpload color={'var(--gourmet-neutral-7'} size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
