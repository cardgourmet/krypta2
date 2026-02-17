import {Group, Text, UnstyledButton} from '@mantine/core';
import {IconAlertHexagon} from '@tabler/icons-react';
import {useTimer} from 'react-timer-hook';
import {type DataAuthUser, resendConfirmationMail} from '@/parcels/auth/api.ts';
import styles from './UnverifiedBanner.module.css';

export function UnverifiedBanner({ user }: { user: DataAuthUser }) {
  const timer = useTimer({ expiryTimestamp: new Date() });

  return (
    <Group gap={'0.5rem'} classNames={{ root: styles.banner }} p={'0.5rem'}>
      <IconAlertHexagon />
      <Text>
        Dein Account ist nicht verifiziert. Bestätige deine E-Mail-Adresse über den Link, den du von uns erhalten hast.
      </Text>
      <UnstyledButton
        classNames={{ root: styles.resendButton }}
        onClick={() => {
          if (timer.isRunning) return;
          timer.restart(in30s(), true);

          resendConfirmationMail({ email: user.email }).then((r) => {
            if (r.error) {
              console.log(r.error);
              return;
            }

            console.log('Resended confirmation mail.');
          });
        }}
        data-disabled={timer.isRunning}
      >
        <Text>Link erneut senden</Text>
      </UnstyledButton>
      {timer.isRunning && <Text c={'var(--gourmet-orange-2)'}>(In {timer.seconds} Sekunden)</Text>}
    </Group>
  );
}

function in30s() {
  return new Date(Date.now() + 30 * 1000);
}
