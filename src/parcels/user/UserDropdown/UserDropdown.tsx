import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  IconBook2,
  IconExclamationMark,
  IconHistory,
  IconList,
  IconLogin,
  IconLogout,
  IconSettings,
  IconStar,
} from '@tabler/icons-react';
import { Link, useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import { Avatar as AvatarComponent } from '@/parcels/user/Avatar/Avatar';
import { paramDefaults } from '@/routes/@{$user}/lists';
import { historyParamDefaults } from '@/routes/me/history';
import { UserNavbarTriggerContent } from '../UserNavbarTriggerContent';
import styles from './UserDropdown.module.css';

const avatarStyle = new Style(definition);

export const UserDropdown = () => {
  const { t } = useTranslation('nav', { keyPrefix: 'user' });
  const { user, logout } = useAuth();
  const { tcg } = useTcg();
  const router = useRouter();

  const avatarUrl = useMemo(() => {
    if (!user) return;
    if (user.avatarUrl) return user.avatarUrl;

    const avatar = new Avatar(avatarStyle, { seed: user.id });
    return avatar.toDataUri();
  }, [user]);
  const isUnverified = user?.state === 'unverified';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton style={{ paddingInline: '0' }}>
          {/* TODO: ugly, should probably also be interactable */}
          {isUnverified && (
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                zIndex: 2,
                backgroundColor: 'var(--gourmet-orange-1)',
                borderRadius: '4px',
                height: '20px',
              }}
            >
              <IconExclamationMark style={{ color: 'var(--gourmet-neutral-0)' }} />
            </div>
          )}

          <UserNavbarTriggerContent />
        </ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="end" sideOffset={-4}>
        <Menu className={styles.base}>
          <div className={styles.content}>
            {user ? (
              <>
                <div className={styles.profile}>
                  {avatarUrl && <AvatarComponent alt={`Avatar of ${user?.displayName}`} size={2.5} src={avatarUrl} />}

                  <div>
                    <Typeset block size="sm" style={{ fontFamily: 'var(--cgm-title-font-family)' }} weight={600}>
                      {user.displayName}
                    </Typeset>
                    <Typeset block size="sm" variant="secondary">
                      @{user.username}
                    </Typeset>
                  </div>
                </div>

                {isUnverified && (
                  <div style={{ padding: '0.5rem 1rem' }}>
                    <Typeset block size="sm" style={{ color: 'var(--gourmet-orange-1)' }}>
                      {t('notVerified')}
                    </Typeset>
                  </div>
                )}

                <Menu.DropdownItem asChild icon={<IconHistory />}>
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/history">
                    Search History
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconBook2 />} disabled={isUnverified}>
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/saved-searches" disabled={isUnverified}>
                    Saved Searches
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconStar />} disabled={isUnverified}>
                  <Link
                    params={{ user: user.username, listId: 'favorites' }}
                    to="/@{$user}/lists/$listId"
                    disabled={isUnverified}
                  >
                    Favorites
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconList />} disabled={isUnverified}>
                  <Link
                    params={{ user: user.username }}
                    search={{ ...paramDefaults, tcg }}
                    to="/@{$user}/lists"
                    disabled={isUnverified}
                  >
                    Lists
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconSettings />} disabled={isUnverified}>
                  <Link to="/me/settings" disabled={isUnverified}>
                    Settings
                  </Link>
                </Menu.DropdownItem>
              </>
            ) : (
              <>
                <div style={{ maxWidth: '16rem', padding: '0.25rem 0.625rem 0.625rem' }}>
                  <Typeset
                    block
                    size="sm"
                    style={{ fontFamily: 'var(--cgm-title-font-family)', marginBottom: '0.25rem' }}
                    weight={600}
                  >
                    You're using Cardgourmet anonymously
                  </Typeset>
                  <Typeset block size="sm" variant="secondary">
                    Log in to start using our personalized features.
                  </Typeset>
                </div>

                <Menu.DropdownItem asChild icon={<IconHistory />}>
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/history">
                    Search History
                  </Link>
                </Menu.DropdownItem>
              </>
            )}
          </div>

          <footer className={styles.footer}>
            {user ? (
              <Menu.DropdownItem
                icon={<IconLogout style={{ color: 'var(--cgm-color-negative)' }} />}
                onClick={logout}
                style={{ color: 'var(--cgm-color-negative)' }}
              >
                Logout
              </Menu.DropdownItem>
            ) : (
              <Menu.DropdownItem asChild icon={<IconLogin style={{ color: 'var(--cgm-color-brand)' }} />}>
                <Link
                  style={{ color: 'var(--cgm-color-brand)' }}
                  to="/login"
                  search={{
                    redirect: router.state.location.href,
                  }}
                >
                  Login
                </Link>
              </Menu.DropdownItem>
            )}
          </footer>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
