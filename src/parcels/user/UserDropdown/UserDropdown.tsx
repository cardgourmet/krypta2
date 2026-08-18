import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  IconBook2,
  IconHistory,
  IconList,
  IconLogin,
  IconLogout,
  IconSettings,
  IconStar,
  IconUser,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import { paramDefaults } from '@/routes/@{$user}/lists';
import { historyParamDefaults } from '@/routes/me/history';
import styles from './UserDropdown.module.css';

const avatarStyle = new Style(definition);

export const UserDropdown = () => {
  const { user, logout } = useAuth();
  const { tcg } = useTcg();

  const avatarUrl = useMemo(() => {
    if (!user) return;
    if (user.avatarUrl) return user.avatarUrl;

    const avatar = new Avatar(avatarStyle, { seed: user.id });
    return avatar.toDataUri();
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton>
          <IconUser />
        </ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="end" sideOffset={-4}>
        <Menu className={styles.base}>
          <div className={styles.content}>
            {user ? (
              <>
                <div className={styles.profile}>
                  {avatarUrl && (
                    <figure className={styles.avatar}>
                      <img alt="" className={styles.image} src={avatarUrl} />
                    </figure>
                  )}

                  <div>
                    <Typeset block size="sm" style={{ fontFamily: 'var(--cgm-title-font-family)' }} weight={600}>
                      {user.displayName}
                    </Typeset>
                    <Typeset block size="sm" variant="secondary">
                      @{user.username}
                    </Typeset>
                  </div>
                </div>

                <Menu.DropdownItem asChild icon={<IconHistory />}>
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/history">
                    Suchverlauf
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconBook2 />}>
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/saved-searches">
                    Gespeicherte Suchen
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconStar />}>
                  <Link params={{ user: user.username, listId: 'favorites' }} to="/@{$user}/lists/$listId">
                    Favoriten
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconList />}>
                  <Link params={{ user: user.username }} search={{ ...paramDefaults, tcg }} to="/@{$user}/lists">
                    Listen
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconSettings />}>
                  <Link to="/me/settings">Einstellungen</Link>
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
                    Du benutzt Cardgourmet anonym
                  </Typeset>
                  <Typeset block size="sm" variant="secondary">
                    Melde dich an, um unsere personalisierten Features zu nutzen.
                  </Typeset>
                </div>

                <Menu.DropdownItem asChild icon={<IconHistory />}>
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/history">
                    Suchverlauf
                  </Link>
                </Menu.DropdownItem>
              </>
            )}
          </div>

          <footer className={styles.footer}>
            {user ? (
              <Menu.DropdownItem
                icon={<IconLogout style={{ color: 'var(--cgm-color-negative)' }} />}
                style={{ color: 'var(--cgm-color-negative)' }}
              >
                Abmelden
              </Menu.DropdownItem>
            ) : (
              <Menu.DropdownItem asChild icon={<IconLogin style={{ color: 'var(--cgm-color-brand)' }} />}>
                <Link style={{ color: 'var(--cgm-color-brand)' }} to="/login">
                  Anmelden
                </Link>
              </Menu.DropdownItem>
            )}
          </footer>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
