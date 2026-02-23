import {ActionIcon, Button, Group, Progress, Stack, Tooltip} from '@mantine/core';
import {IconAlertSquareRounded, IconX} from '@tabler/icons-react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from '@/parcels/overview/CardOverview/CardOverview.module.css';
import type {MtgOverviewWorkAmbient} from '@/parcels/overview/MtgOverviewWorkContext.tsx';

export function OverviewSelectionDisplay({ context: workContext }: { context: MtgOverviewWorkAmbient }) {
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
        gap={'0.1rem'}
      >
        <Group wrap={'nowrap'} justify={'space-between'}>
          <Stack gap={'0'}>
            <Group gap={'0.5rem'}>
              <GourmetText cgmff={'ui'} fz={'1.25rem'} cgmc={'neutral-8'}>
                Auswahl:
              </GourmetText>
              <GourmetText cgmff={'ui'} c={'var(--gourmet-orange-1)'} fw={'500'} fz={'1.25rem'}>
                {workContext.data.selection.elementIds.length} Karten
              </GourmetText>
            </Group>
            <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
              Aktuelle Seite:{' '}
              {Object.keys(workContext.data.selection.elementsByPage[workContext.data.search.page] ?? []).length} Karten
            </GourmetText>
          </Stack>
          <Group wrap={'nowrap'}>
            <Button color={'var(--gourmet-orange-1'} className={styles.selectionButton}>
              <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
                Auswahl verwenden für ...
              </GourmetText>
            </Button>
            <Tooltip label={'Auswahl aufheben'} openDelay={500}>
              <ActionIcon
                color={'var(--gourmet-neutral-3)'}
                onClick={() => {
                  workContext.clearSelection();
                }}
              >
                <IconX size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <Stack gap={'0.25rem'}>{generateProgress(12, workContext.data.selection.elementIds.length, 60)}</Stack>
      </Stack>
    </Group>
  );
}

function generateProgress(sections: number, current: number, max: number) {
  const ratio = max > 0 ? current / max : 0;
  const toPaintCount = Math.max(0, Math.min(sections, Math.ceil(ratio * sections)));
  const toPaintIndex = toPaintCount - 1;

  let color = 'var(--gourmet-green-1)';
  if (ratio <= 0.5) {
    color = 'var(--gourmet-green-1)';
  } else if (ratio <= 0.75) {
    color = 'var(--gourmet-orange-1)';
  } else {
    color = 'var(--gourmet-red-01)';
  }

  return (
    <>
      <Group justify={'end'}>
        <Group gap={'0.25rem'}>
          <Group gap={'0.1rem'}>
            <GourmetText cgmff={'ui'} fw={'500'} c={color}>
              {current}
            </GourmetText>
            <GourmetText cgmff={'ui'}>/60</GourmetText>
          </Group>
          <ActionIcon className={styles.selectionInfoButton}>
            <IconAlertSquareRounded size={20} />
          </ActionIcon>
        </Group>
      </Group>
      <Group grow gap={'0.25rem'}>
        {Array.from(Array(sections).keys()).map((_, index) => {
          return <Progress key={index} color={color} size="xs" value={index <= toPaintIndex ? 100 : 0} />;
        })}
      </Group>
    </>
  );
}
