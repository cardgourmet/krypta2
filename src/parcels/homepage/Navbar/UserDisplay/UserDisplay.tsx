import { Group, Menu, Stack } from '@mantine/core';
import {
  IconAlertHexagon,
  IconBookmark,
  IconHistory,
  IconList,
  IconLogin,
  IconLogout,
  IconSettings,
  IconStar,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { type CSSProperties, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { UserDisplayButton } from '@/parcels/homepage/Navbar/UserDisplay/UserDisplayButton/UserDisplayButton.tsx';
import { UserIcon } from '@/parcels/homepage/Navbar/UserDisplay/UserIcon.tsx';
import { GourmetText } from '@/parcels/mantine/GourmetText.tsx';
import styles from './UserDisplay.module.css';

export function UserDisplay({ style }: { style?: CSSProperties }) {
  const { user, logout } = useAuth();

  const [opened, setOpened] = useState(false);

  return (
    <div style={style}>
      {user && (
        <Group ml={'0.5rem'} gap={'0.25rem'}>
          {user.state === 'unverified' && <IconAlertHexagon color={'var(--gourmet-orange-1)'} size={20} />}
          <Menu
            position="bottom-end"
            shadow="md"
            width={240}
            openDelay={0}
            closeDelay={0}
            classNames={{ dropdown: styles.menuDropdown }}
          >
            <Menu.Target>
              <UserIcon onClick={() => {}} />
            </Menu.Target>

            <Menu.Dropdown>
              <Stack gap={'0'} p={'0.25rem 0.75rem'}>
                <GourmetText cgmc={'neutral-9'}>{user.displayName}</GourmetText>
                <GourmetText cgmc={'neutral-6'}>@{user.username}</GourmetText>

                {user.state === 'unverified' && (
                  <div>
                    <GourmetText mt={'0.5rem'} c={'var(--gourmet-orange-1)'} fz={'0.9rem'}>
                      Du bist noch nicht verifiziert. <br />
                      Damit bist du immernoch ein Gast.
                    </GourmetText>
                  </div>
                )}
              </Stack>

              <Menu.Divider />

              <Menu.Item leftSection={<IconHistory size={18} />} disabled>
                <GourmetText>Suchhistorie</GourmetText>
              </Menu.Item>
              <Menu.Item leftSection={<IconStar size={18} />} disabled>
                <GourmetText>Favoriten</GourmetText>
              </Menu.Item>
              <Menu.Item leftSection={<IconBookmark size={18} />} disabled>
                <GourmetText>Lesezeichen</GourmetText>
              </Menu.Item>
              <Menu.Item leftSection={<IconList size={18} />} disabled>
                <GourmetText>Listen</GourmetText>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item leftSection={<IconSettings size={18} />} disabled>
                <GourmetText>Einstellungen</GourmetText>
              </Menu.Item>
              <Menu.Item color="var(--gourmet-red-01)" leftSection={<IconLogout size={18} />} onClick={logout}>
                <GourmetText c={'var(--gourmet-red-01)'}>Abmelden</GourmetText>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
      {!user && (
        <Menu shadow="md" position={'bottom-end'} opened={opened} onChange={setOpened} width={240}>
          <Menu.Target>
            <UserDisplayButton toggle={() => setOpened(!opened)} />
          </Menu.Target>

          <Menu.Dropdown
            style={{
              backgroundColor: 'var(--gourmet-neutral-3)',
              border: '2px solid var(--gourmet-neutral-4)',
              borderRadius: '8px',
            }}
            p={'0.5rem'}
          >
            <Stack p={'0.25rem'} gap={'0.1rem'}>
              <GourmetText cgmc={'neutral-9'}>Du bist nicht eingeloggt.</GourmetText>
              <GourmetText fz={'0.9rem'} cgmc={'neutral-7'}>
                Um mehr Funktionen nutzen zu können, musst du dich anmelden.
              </GourmetText>
            </Stack>

            <Menu.Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

            <Stack gap={'0.25rem'}>
              <Menu.Item leftSection={<IconHistory size={18} />} className={styles.menuItem}>
                <GourmetText>Suchhistorie</GourmetText>
              </Menu.Item>

              <Menu.Item
                component={Link}
                to={'/login'}
                leftSection={<IconLogin size={18} color={'var(--gourmet-neutral-2)'} />}
                onClick={() => {
                  close();
                }}
                className={styles.menuLoginButton}
              >
                <GourmetText cgmc={'neutral-2'}>Anmelden</GourmetText>
              </Menu.Item>
            </Stack>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
}
