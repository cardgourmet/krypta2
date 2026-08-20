import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { Stack } from '@mantine/core';
import {
  IconBook2,
  IconHistory,
  IconList,
  IconLogin,
  IconLogout,
  IconSettings,
  IconStar,
  IconX,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Button } from '@/parcels/generic/Button/Button';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { NavItem } from '@/parcels/layout/NavItem/NavItem';
import { LanguageSelectorNavItem } from '@/parcels/settings/LanguageSelectorNavItem/LanguageSelectorNavItem';
import { ThemeSelectorNavItem } from '@/parcels/settings/ThemeSelectorNavItem/ThemeSelectorNavItem';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import { Avatar as AvatarComponent } from '@/parcels/user/Avatar/Avatar';
import { paramDefaults } from '@/routes/@{$user}/lists';
import { historyParamDefaults } from '@/routes/me/history';
import styles from './UserDrawer.module.css';

const avatarStyle = new Style(definition);

export const UserDrawer = ({ onClose }: { onClose?: () => void }) => {
  const { user, logout } = useAuth();
  const { tcg } = useTcg();

  const avatarUrl = useMemo(() => {
    if (!user) return;
    if (user.avatarUrl) return user.avatarUrl;

    const avatar = new Avatar(avatarStyle, { seed: user.id });
    return avatar.toDataUri();
  }, [user]);

  return (
    <Stack align="start" gap="1rem">
      <ActionButton className={styles.absoluteCloseButton} onClick={onClose} size="sm">
        <IconX />
      </ActionButton>

      {user ? (
        <>
          {avatarUrl && <AvatarComponent alt={`Avatar of ${user?.displayName}`} size={4} src={avatarUrl} />}

          <div>
            <Typeset block size="lg" style={{ fontFamily: 'var(--cgm-title-font-family)' }} weight={600}>
              {user.displayName}
            </Typeset>
            <Typeset block variant="secondary">
              @{user.username}
            </Typeset>
          </div>

          <Button accent="negative" leadingIcon={<IconLogout />} onClick={logout} size="sm">
            Logout
          </Button>
        </>
      ) : (
        <>
          <div style={{ paddingRight: '3rem' }}>
            <Typeset block size="lg" style={{ fontFamily: 'var(--cgm-title-font-family)' }} weight={600}>
              You're using Cardgourmet anonymously
            </Typeset>
            <Typeset block variant="secondary">
              Log in to start using our personalized features.
            </Typeset>
          </div>

          <Button accent="brand" asChild leadingIcon={<IconLogin />} size="sm">
            <Link onClick={() => onClose?.()} to="/login">
              Login
            </Link>
          </Button>
        </>
      )}

      <section className={styles.navItems}>
        <NavItem asChild icon={<IconHistory />}>
          <Link search={{ ...historyParamDefaults, tcg }} to="/me/history">
            Search History
          </Link>
        </NavItem>
        {user && (
          <>
            <NavItem asChild icon={<IconBook2 />}>
              <Link search={{ ...historyParamDefaults, tcg }} to="/me/saved-searches">
                Saved Searches
              </Link>
            </NavItem>
            <NavItem asChild icon={<IconStar />}>
              <Link params={{ user: user.username, listId: 'favorites' }} to="/@{$user}/lists/$listId">
                Favorites
              </Link>
            </NavItem>
            <NavItem asChild icon={<IconList />}>
              <Link params={{ user: user.username }} search={{ ...paramDefaults, tcg }} to="/@{$user}/lists">
                Lists
              </Link>
            </NavItem>
            <NavItem asChild icon={<IconSettings />}>
              <Link to="/me/settings">Settings</Link>
            </NavItem>
          </>
        )}

        <ThemeSelectorNavItem />
        <LanguageSelectorNavItem />
      </section>
    </Stack>
  );
};
