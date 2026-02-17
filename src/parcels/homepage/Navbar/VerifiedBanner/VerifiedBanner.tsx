import {Group, Text, UnstyledButton} from '@mantine/core';
import {IconChecks, IconX} from '@tabler/icons-react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import styles from './VerifiedBanner.module.css';

export function VerifiedBanner() {
  const { removeVerified } = useAuth();

  return (
    <Group classNames={{ root: styles.banner }} p={'0.5rem'} justify={'space-between'}>
      <Group gap={'0.5rem'}>
        <IconChecks />
        <Text>Dein Account wurde verifiziert, du kannst dich jetzt normal einloggen.</Text>
      </Group>
      <UnstyledButton classNames={{ root: styles.closeButton }} onClick={removeVerified}>
        <IconX size={18} />
      </UnstyledButton>
    </Group>
  );
}
