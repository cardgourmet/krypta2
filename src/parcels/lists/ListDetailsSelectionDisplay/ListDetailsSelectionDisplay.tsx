import { ActionIcon, Flex, Group, Stack, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { ListDetailsSelectionButton } from '@/parcels/lists/ListDetailsSelectionDisplay/ListDetailsSelectionButton.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import { useTcgOverviewWorkStore } from '@/parcels/selection/useTcgOverviewWorkStore.ts';

export function ListDetailsSelectionDisplay({ list }: { list: UserList }) {
  const { t } = useTranslation('selection');
  const smallScreen = useMediaQuery('(max-width: 580px)');

  // TODO: replace with own store
  const workData = useTcgOverviewWorkStore((state) => state.data);
  const clearSelection = useTcgOverviewWorkStore((state) => state.clearSelection);

  const cardAmount = workData?.selection?.elementIds?.length ?? 0;

  return (
    <Group
      style={{
        position: 'sticky',
        bottom: '1rem',
        marginTop: '1rem',
        zIndex: 'var(--sticky-layer)',
        pointerEvents: 'none',
      }}
      justify={'center'}
      align={'center'}
    >
      <Stack
        style={{
          border: '2px solid var(--cgm-navbar-border)',
          borderRadius: '4px',
          backgroundColor: 'var(--cgm-navbar-bg)',
          padding: '1rem',
          boxShadow: '2px 4px 8px #000000',
          pointerEvents: 'auto',
        }}
        w={'36rem'}
        maw={'36rem'}
        gap={smallScreen ? '0.5rem' : '0.1rem'}
      >
        <Flex
          wrap={'nowrap'}
          justify={'space-between'}
          direction={smallScreen ? 'column' : 'row'}
          gap={smallScreen ? 'lg' : ''}
        >
          <Stack gap={'0'} justify={'center'}>
            <Group gap={'0.5rem'}>
              <GourmetText cgmff={'ui'} fz={'1.25rem'} cgmc={'neutral-9'}>
                Selection:
              </GourmetText>
              <GourmetText cgmff={'monospace'} c={list.color ?? 'var(--gourmet-orange-1)'} fw={'500'} fz={'1.25rem'}>
                {cardAmount} Items
              </GourmetText>
            </Group>
          </Stack>
          <Group wrap={'nowrap'}>
            <ListDetailsSelectionButton list={list} />
            <Tooltip label={t('clearSelection')} openDelay={500}>
              <ActionIcon
                color={'var(--gourmet-neutral-3)'}
                onClick={() => {
                  clearSelection();
                }}
              >
                <IconX size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Flex>
      </Stack>
    </Group>
  );
}
