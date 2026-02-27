import {ActionIcon, Group, Popover, Progress, Stack} from '@mantine/core';
import {IconAlertSquareRounded} from '@tabler/icons-react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './SelectionProgress.module.css';

export function SelectionProgress({ sections, current, max }: { sections: number; current: number; max: number }) {
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

          <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon className={styles.selectionInfoButton}>
                <IconAlertSquareRounded size={20} />
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
              <Stack>
                <GourmetText>
                  Du darfst nur maximal <b>60</b> Karten gleichzeitig auswählen.
                </GourmetText>
                <GourmetText>
                  Falls du mehr auswählen möchtest, überlege zuerst, ob du eventuell lieber{' '}
                  <u>die gesamte Suche abspeichern</u> willst.
                </GourmetText>
              </Stack>
            </Popover.Dropdown>
          </Popover>
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
