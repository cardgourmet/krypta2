import {Group, Menu, Stack, Text} from '@mantine/core';
import {IconBookmark, IconHistory, IconList, IconLogout, IconQuestionMark, IconSettings, IconStar,} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import styles from './UserDisplay.module.css';

export function UserDisplay() {
  const { user, logout } = useAuth();

  return (
    <>
      {user && (
        <Group ml={'0.5rem'}>
          <Menu position="bottom-end" shadow="md" width={220} classNames={{ dropdown: styles.menuDropdown }}>
            <Menu.Target>
              <button type={'button'} className={styles.avatarIcon}>
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
              </button>
            </Menu.Target>

            <Menu.Dropdown>
              <Stack gap={'0'} p={'0.25rem 0.75rem'}>
                <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-9)'}>
                  {user.displayName}
                </Text>
                <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-6)'}>
                  @{user.username}
                </Text>
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
