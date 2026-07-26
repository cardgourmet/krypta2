import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { Stack } from '@mantine/core';
import { IconBook2, IconHistory, IconList, IconLogout, IconSettings, IconStar, IconX } from '@tabler/icons-react';
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
import { historyParamDefaults } from '@/routes/me/history';
import { paramDefaults } from '@/routes/me/lists';
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
      {!user && (
        <header className={styles.header}>
          <Typeset asChild size="lg" style={{ fontFamily: 'var(--cgm-title-font-family)' }} weight={500}>
            <h2>User</h2>
          </Typeset>

          <ActionButton onClick={onClose} size="sm">
            <IconX />
          </ActionButton>
        </header>
      )}

      {user && (
        <>
          <ActionButton className={styles.absoluteCloseButton} onClick={onClose} size="sm">
            <IconX />
          </ActionButton>

          {avatarUrl && (
            <figure className={styles.avatar}>
              <img alt="" className={styles.image} src={avatarUrl} />
            </figure>
          )}

          <div>
            <Typeset block size="lg" style={{ fontFamily: 'var(--cgm-title-font-family)' }} weight={600}>
              {user.displayName}
            </Typeset>
            <Typeset block variant="secondary">
              @{user.username}
            </Typeset>
          </div>

          <Button accent="negative" leadingIcon={<IconLogout />} size="sm">
            Abmelden
          </Button>

          <section className={styles.navItems}>
            <NavItem asChild icon={<IconHistory />} label="Suchverlauf">
              <Link search={{ ...historyParamDefaults, tcg }} to="/me/history" />
            </NavItem>
            <NavItem asChild icon={<IconBook2 />} label="Gespeicherte Suchen">
              <Link search={{ ...historyParamDefaults, tcg }} to="/me/saved-searches" />
            </NavItem>
            <NavItem asChild icon={<IconStar />} label="Favoriten">
              <Link params={{ user: user.username, listId: 'favorites' }} to="/@{$user}/lists/$listId" />
            </NavItem>
            <NavItem asChild icon={<IconList />} label="Listen">
              <Link search={{ ...paramDefaults, tcg }} to="/me/lists" />
            </NavItem>
            <NavItem asChild icon={<IconSettings />} label="Einstellungen">
              <Link to="/me/settings" />
            </NavItem>

            <ThemeSelectorNavItem />
            <LanguageSelectorNavItem />
          </section>
        </>
      )}
    </Stack>
  );
};
