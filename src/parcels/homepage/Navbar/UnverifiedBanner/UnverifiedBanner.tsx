import {Button, Group, Modal, Stack, Text, UnstyledButton} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {IconAlertHexagon, IconAlertHexagonFilled} from '@tabler/icons-react';
import {useCallback} from 'react';
import {useTimer} from 'react-timer-hook';
import {type DataAuthUser, resendConfirmationMail} from '@/parcels/auth/api.ts';
import styles from './UnverifiedBanner.module.css';

export function UnverifiedBanner({ user }: { user: DataAuthUser }) {
  const smallScreen = useMediaQuery('(max-width: 800px)');
  const timer = useTimer({ expiryTimestamp: new Date(), autoStart: false });
  const [opened, { open, close }] = useDisclosure(false);

  const resendMail = useCallback(() => {
    if (timer.isRunning) return;
    timer.restart(in30s(), true);

    resendConfirmationMail({ email: user.email }).then((r) => {
      if (r.error) {
        console.log(r.error);
        return;
      }

      console.log('Resended confirmation mail.');
    });
  }, [timer.isRunning, timer.restart, user.email]);

  return (
    <>
      {smallScreen && (
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Group>
              <IconAlertHexagonFilled size={18} color={'var(--gourmet-orange-1)'} />
              <Text ff={'var(--cgm-title-font-family)'} fw={'bold'}>
                Unverifizierter Account
              </Text>
            </Group>
          }
        >
          <Stack>
            <Text ff={'var(--cgm-content-font-family)'}>
              Dein Account ist nicht verifiziert. Bestätige deine E-Mail-Adresse über den Link, den du von uns erhalten
              hast.
            </Text>
            <Button
              color={'var(--gourmet-orange-1)'}
              style={{ color: 'var(--gourmet-black-1)' }}
              onClick={resendMail}
              disabled={timer.isRunning}
            >
              {timer.isRunning && <>In {timer.seconds} Sekunden</>}
              {!timer.isRunning && 'Link erneut senden'}
            </Button>
          </Stack>
        </Modal>
      )}

      <Group gap={'0.5rem'} classNames={{ root: styles.banner }} p={'0.5rem'} wrap={'nowrap'}>
        <UnstyledButton
          style={{ overflow: 'hidden', cursor: 'default' }}
          onClick={() => {
            if (smallScreen) open();
          }}
        >
          <Group gap={'0.5rem'} wrap={'nowrap'}>
            <IconAlertHexagon size={18} style={{ flexShrink: 0 }} />
            <Text style={{ overflow: 'hidden', textWrap: 'nowrap', textOverflow: 'ellipsis' }}>
              Dein Account ist nicht verifiziert. Bestätige deine E-Mail-Adresse über den Link, den du von uns erhalten
              hast.
            </Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton classNames={{ root: styles.resendButton }} onClick={resendMail} data-disabled={timer.isRunning}>
          <Text style={{ textWrap: 'nowrap' }}>Link erneut senden</Text>
        </UnstyledButton>
        {!smallScreen && timer.isRunning && <Text c={'var(--gourmet-orange-2)'}>(In {timer.seconds} Sekunden)</Text>}
      </Group>
    </>
  );
}

function in30s() {
  return new Date(Date.now() + 30 * 1000);
}
