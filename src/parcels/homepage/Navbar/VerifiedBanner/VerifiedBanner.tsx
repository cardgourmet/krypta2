import { Group, Modal, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconChecks, IconX } from '@tabler/icons-react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from './VerifiedBanner.module.css';

export function VerifiedBanner() {
  const smallScreen = useMediaQuery('(max-width: 800px)');
  const { removeVerified } = useAuth();
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
                Account verifiziert
              </Text>
            </Group>
          }
        >
          <Text ff={'var(--cgm-content-font-family)'}>
            Dein Account wurde verifiziert, du kannst dich jetzt normal einloggen.
          </Text>
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
              Dein Account wurde verifiziert, du kannst dich jetzt normal einloggen.
            </Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton classNames={{ root: styles.closeButton }} onClick={removeVerified}>
          <IconX size={18} />
        </UnstyledButton>
      </Group>
    </>
  );
}
