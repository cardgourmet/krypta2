import { Group, Modal, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconChecks, IconX } from '@tabler/icons-react';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import styles from './EmailChangedBanner.module.css';

export function EmailChangedBanner() {
  const smallScreen = useMediaQuery('(max-width: 800px)');
  const removeEmailWasChanged = useLocalUserStateStore((state) => state.removeEmailWasChanged);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {smallScreen && (
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Group>
              <IconChecks size={18} color={'var(--gourmet-green-1)'} />
              <Text ff={'var(--cgm-title-font-family)'} fw={'bold'}>
                Email Has Changed
              </Text>
            </Group>
          }
        >
          <Text ff={'var(--cgm-content-font-family)'}>Your email has been changed, please login again.</Text>
        </Modal>
      )}

      <Group classNames={{ root: styles.banner }} p={'0.5rem'} justify={'space-between'} wrap={'nowrap'}>
        <UnstyledButton
          style={{ overflow: 'hidden', cursor: 'default' }}
          onClick={() => {
            if (smallScreen) open();
          }}
        >
          <Group gap={'0.5rem'} wrap={'nowrap'} style={{ overflow: 'hidden' }}>
            <IconChecks />
            <Text style={{ overflow: 'hidden', textWrap: 'nowrap', textOverflow: 'ellipsis' }}>
              Your email has been changed, please login again.
            </Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton classNames={{ root: styles.closeButton }} onClick={removeEmailWasChanged}>
          <IconX size={18} />
        </UnstyledButton>
      </Group>
    </>
  );
}
