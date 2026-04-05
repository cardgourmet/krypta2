import {Group, Menu, Stack} from '@mantine/core';
import {IconBook2, IconHistory, IconList, IconLogin, IconLogout, IconSettings, IconStar} from '@tabler/icons-react';
import {Link, useRouter} from '@tanstack/react-router';
import {type CSSProperties, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {UserDisplayButton} from '@/parcels/homepage/Navbar/UserDisplay/UserDisplayButton/UserDisplayButton.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {useTcg} from '@/parcels/tcg/TcgProvider.tsx';
import {historyParamDefaults} from '@/routes/me/history';
import {paramDefaults} from '@/routes/me/lists';
import {savedSearchesParamDefaults} from '@/routes/me/saved-searches';
import styles from './UserDisplay.module.css';

export function UserDisplay({ style }: { style?: CSSProperties }) {
  const { t } = useTranslation('nav', { keyPrefix: 'user' });
  const { user, logout } = useAuth();
  const { tcg } = useTcg();

  const [opened, setOpened] = useState(false);

  const router = useRouter();

  return (
    <div style={style}>
      {user && (
        <Menu shadow="md" position={'bottom-end'} opened={opened} onChange={setOpened} width={240}>
          <Menu.Target>
            <UserDisplayButton toggle={() => setOpened(!opened)} />
          </Menu.Target>

          <Menu.Dropdown
            style={{
              backgroundColor: 'var(--cgm-sidebar-bg)',
              border: '1px solid var(--cgm-sidebar-border)',
              borderRadius: '4px',
            }}
            p={'0.5rem'}
          >
            <Stack gap={'0'} p={'0.25rem 0.5rem'}>
              <Group gap={'0.75rem'} m={'0 0 0.5rem 0'}>
                <Group w={'2.5rem'} h={'2.5rem'}>
                  <div className={styles.userIcon}>
                    {user.avatarUrl && <img src={user.avatarUrl ?? ''} alt={user.displayName} />}
                  </div>
                </Group>

                <Stack gap={'0'}>
                  <GourmetText cgmc={'neutral-9'}>{user.displayName}</GourmetText>
                  <GourmetText cgmc={'neutral-6'} style={{ lineHeight: '0.8rem' }}>
                    @{user.username}
                  </GourmetText>
                </Stack>
              </Group>

              {user.state === 'unverified' && (
                <div>
                  <GourmetText mt={'0.5rem'} c={'var(--gourmet-orange-1)'} fz={'0.9rem'}>
                    {t('not-verified')
                      .split('\n')
                      .map((item, key) => (
                        <span key={key}>
                          {item}
                          <br />
                        </span>
                      ))}
                  </GourmetText>
                </div>
              )}
            </Stack>

            <Menu.Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

            <Link to={'/me/history'} search={{ ...historyParamDefaults, tcg: tcg }} style={{ textDecoration: 'none' }}>
              <Menu.Item leftSection={<IconHistory size={18} />} className={styles.menuItem}>
                <GourmetText cgmff="ui">{t('history')}</GourmetText>
              </Menu.Item>
            </Link>
            <Link
              to={'/me/saved-searches'}
              search={{ ...savedSearchesParamDefaults, tcg: tcg }}
              style={{ textDecoration: 'none' }}
            >
              <Menu.Item leftSection={<IconBook2 size={18} />} className={styles.menuItem}>
                <GourmetText cgmff="ui">{t('savedSearches')}</GourmetText>
              </Menu.Item>
            </Link>

            <Menu.Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

            <Link to={'/me/lists/$listId'} params={{ listId: 'favorites' }} style={{ textDecoration: 'none' }}>
              <Menu.Item
                leftSection={<IconStar size={18} />}
                className={styles.menuItem}
                disabled={user.state === 'unverified'}
              >
                <GourmetText cgmff="ui">{t('favorites')}</GourmetText>
              </Menu.Item>
            </Link>
            <Link
              to={'/me/lists'}
              search={{
                ...paramDefaults,
                tcg: tcg,
              }}
              style={{ textDecoration: 'none' }}
            >
              <Menu.Item
                leftSection={<IconList size={18} />}
                className={styles.menuItem}
                disabled={user.state === 'unverified'}
              >
                <GourmetText cgmff="ui">{t('lists')}</GourmetText>
              </Menu.Item>
            </Link>

            <Menu.Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

            <Menu.Item
              leftSection={<IconSettings size={18} />}
              className={styles.menuItem}
              disabled={user.state === 'unverified'}
            >
              <GourmetText cgmff="ui">{t('settings')}</GourmetText>
            </Menu.Item>
            <Menu.Item
              color="var(--gourmet-red-01)"
              leftSection={<IconLogout size={18} />}
              onClick={() => {
                logout();

                // need this: https://github.com/TanStack/router/issues/2072#issuecomment-3152903491
                router.invalidate();
                router.navigate({ reloadDocument: true });
              }}
              className={styles.menuItem}
            >
              <GourmetText c={'var(--gourmet-red-01)'} cgmff="ui">
                {t('logout')}
              </GourmetText>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
      {!user && (
        <Menu shadow="md" position={'bottom-end'} opened={opened} onChange={setOpened} width={240}>
          <Menu.Target>
            <UserDisplayButton toggle={() => setOpened(!opened)} />
          </Menu.Target>

          <Menu.Dropdown
            style={{
              backgroundColor: 'var(--cgm-sidebar-bg)',
              border: '1px solid var(--cgm-sidebar-border)',
              borderRadius: '4px',
            }}
            p={'0.5rem'}
          >
            <Stack p={'0.25rem'} gap={'0.1rem'}>
              <GourmetText cgmc={'neutral-9'}>{t('not-logged-in')}</GourmetText>
              <GourmetText fz={'0.9rem'} cgmc={'neutral-7'}>
                {t('more-features')}
              </GourmetText>
            </Stack>

            <Menu.Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

            <Stack gap={'0.25rem'}>
              <Link
                to={'/me/history'}
                search={{ ...historyParamDefaults, tcg: tcg }}
                style={{ textDecoration: 'none' }}
              >
                <Menu.Item leftSection={<IconHistory size={18} />} className={styles.menuItem}>
                  <GourmetText cgmff="ui">{t('history')}</GourmetText>
                </Menu.Item>
              </Link>

              <Menu.Item
                component={Link}
                to={'/login'}
                leftSection={<IconLogin size={18} color={'var(--gourmet-neutral-2)'} />}
                onClick={() => {
                  close();
                }}
                className={styles.menuLoginButton}
              >
                <GourmetText cgmc={'neutral-2'}>{t('login')}</GourmetText>
              </Menu.Item>
            </Stack>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
}
