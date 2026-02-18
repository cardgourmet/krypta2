import {Group, Menu, Stack, Text} from '@mantine/core';
import {IconAlertHexagon, IconBookmark, IconHistory, IconList, IconLogout, IconSettings, IconStar,} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {UserIcon} from '@/parcels/homepage/Navbar/UserDisplay/UserIcon.tsx';
import styles from './UserDisplay.module.css';

export function UserDisplay() {
  const { user, logout } = useAuth();

  return (
    <>
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
                <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-9)'}>
                  {user.displayName}
                </Text>
                <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-6)'}>
                  @{user.username}
                </Text>

                {user.state === 'unverified' && (
                  <div>
                    <Text mt={'0.5rem'} c={'var(--gourmet-orange-1)'} fz={'0.9rem'}>
                      Du bist noch nicht verifiziert. <br />
                      Damit bist du immernoch ein Gast.
                    </Text>
                  </div>
                )}
              </Stack>

              <Menu.Divider />

              <Menu.Item leftSection={<IconHistory size={18} />} disabled>
                <Text ff={'var(--cgm-content-font-family)'}>Suchhistorie</Text>
              </Menu.Item>
              <Menu.Item leftSection={<IconStar size={18} />} disabled>
                <Text ff={'var(--cgm-content-font-family)'}>Favoriten</Text>
              </Menu.Item>
              <Menu.Item leftSection={<IconBookmark size={18} />} disabled>
                <Text ff={'var(--cgm-content-font-family)'}>Lesezeichen</Text>
              </Menu.Item>
              <Menu.Item leftSection={<IconList size={18} />} disabled>
                <Text ff={'var(--cgm-content-font-family)'}>Listen</Text>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item leftSection={<IconSettings size={18} />} disabled>
                <Text ff={'var(--cgm-content-font-family)'}>Einstellungen</Text>
              </Menu.Item>
              <Menu.Item color="var(--gourmet-red-01)" leftSection={<IconLogout size={18} />} onClick={logout}>
                <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-red-01)'}>
                  Abmelden
                </Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
      {!user && (
        <Link to={'/login'} style={{ textDecoration: 'none' }}>
          <button type="button" className={styles.loginButton}>
            Anmelden / Registrieren
          </button>
        </Link>
      )}
    </>
  );
}
