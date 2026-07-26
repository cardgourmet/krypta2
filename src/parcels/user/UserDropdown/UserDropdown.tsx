import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { IconBook2, IconHistory, IconList, IconLogout, IconSettings, IconStar, IconUser } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import { historyParamDefaults } from '@/routes/me/history';
import { paramDefaults } from '@/routes/me/lists';
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
            {user && (
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

                <Menu.DropdownItem asChild icon={<IconHistory />} label="Suchverlauf">
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/history" />
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconBook2 />} label="Gespeicherte Suchen">
                  <Link search={{ ...historyParamDefaults, tcg }} to="/me/saved-searches" />
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconStar />} label="Favoriten">
                  <Link params={{ user: user.username, listId: 'favorites' }} to="/@{$user}/lists/$listId" />
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconList />} label="Listen">
                  <Link search={{ ...paramDefaults, tcg }} to="/me/lists" />
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconSettings />} label="Einstellungen">
                  <Link to="/me/settings" />
                </Menu.DropdownItem>
              </>
            )}
          </div>

          <footer className={styles.footer}>
            <Menu.DropdownItem
              icon={<IconLogout style={{ color: 'var(--cgm-color-negative)' }} />}
              label="Abmelden"
              style={{ color: 'var(--cgm-color-negative)' }}
            />
          </footer>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
