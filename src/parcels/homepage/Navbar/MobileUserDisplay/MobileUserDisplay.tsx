import { Button, type ButtonProps, Divider, Group, Stack, Text } from '@mantine/core';
import {
  IconBookmark,
  IconHistory,
  IconList,
  IconLogin,
  IconLogout,
  IconQuestionMark,
  IconSettings,
  IconStar,
  IconX,
} from '@tabler/icons-react';
import type { ReactElement } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from './MobileUserDisplay.module.css';
import { useNavigate } from '@tanstack/react-router';

export function MobileUserDisplay({ close }: { close: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Group justify={'space-between'}>
        <Text ff={'var(--cgm-content-font-family)'} tt={'uppercase'} fw={'bold'}>
          Benutzer
        </Text>
        <Button onClick={close} classNames={{ root: styles.closeButton }}>
          <IconX size={18} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>
      {!user && (
        <Stack>
          <ItemButton
            title={'Anmelden'}
            icon={<IconLogin size={18} />}
            onClick={() => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                to: '/login',
              });
              close();
            }}
          />
        </Stack>
      )}
      {user && (
        <Stack>
          <Group gap={'0.25rem'}>
            <div className={styles.avatarIcon}>
              {user.avatarUrl && <img src={user.avatarUrl} alt={user.displayName} />}
              {!user.avatarUrl && (
                <Group
                  justify={'center'}
                  align={'center'}
                  style={{
                    backgroundColor: 'var(--gourmet-neutral-3)',
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <IconQuestionMark color={'var(--gourmet-neutral-8)'} />
                </Group>
              )}
            </div>
            <Stack gap={'0'} p={'0.25rem 0.75rem'}>
              <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-9)'}>
                {user.displayName}
              </Text>
              <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-6)'}>
                @{user.username}
              </Text>
            </Stack>
          </Group>

          <Divider />

          <ItemButton title={'Suchhistorie'} icon={<IconHistory size={18} />} disabled />
          <ItemButton title={'Favoriten'} icon={<IconStar size={18} />} disabled />
          <ItemButton title={'Lesezeichen'} icon={<IconBookmark size={18} />} disabled />
          <ItemButton title={'Listen'} icon={<IconList size={18} />} disabled />

          <Divider />

          <ItemButton title={'Einstellungen'} icon={<IconSettings size={18} />} />
          <ItemButton
            title={'Abmelden'}
            icon={<IconLogout size={18} />}
            color="var(--gourmet-red-01)"
            onClick={() => {
              logout();
              close();
            }}
          />
        </Stack>
      )}
    </>
  );
}

function ItemButton(props: { title: string; icon: ReactElement; onClick?: () => void } & ButtonProps) {
  return (
    <Button
      justify="space-between"
      leftSection={
        <Group>
          {props.icon}
          <Text ff={'var(--cgm-content-font-family)'}>{props.title}</Text>
        </Group>
      }
      disabled={props.disabled}
      classNames={{ root: styles.itemButton }}
      onClick={props.onClick}
    />
  );
}
