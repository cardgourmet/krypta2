import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { Button, type ButtonProps, Divider, Group, Stack, Text } from '@mantine/core';
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
import { Link, useNavigate } from '@tanstack/react-router';
import { forwardRef, type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { MobileLanguageSelector } from '@/parcels/homepage/Navbar/LanguageSelector/MobileLanguageSelector.tsx';
import { MobileThemeSelector } from '@/parcels/homepage/Navbar/ThemeSelector/MobileThemeSelector.tsx';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import { historyParamDefaults } from '@/routes/me/history';
import { paramDefaults } from '@/routes/me/lists';
import styles from './MobileUserMenu.module.css';

export function MobileUserMenu({ close }: { close: () => void }) {
  const { t } = useTranslation('nav', { keyPrefix: 'user' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { tcg } = useTcg();
  const avatarFallback = useMemo(() => {
    if (!user || user?.avatarUrl) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      seed: user!.id,
    });

    return avatar.toString();
  }, [user]);

  return (
    <>
      <Group justify={'space-between'}>
        <Text ff={'var(--cgm-content-font-family)'} tt={'uppercase'} fw={'bold'}>
          {t('user')}
        </Text>
        <Button onClick={close} classNames={{ root: styles.closeButton }}>
          <IconX size={18} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>
      {!user && (
        <Stack gap={'0.5rem'}>
          <MobileThemeSelector />
          <MobileLanguageSelector />
          <ItemButton
            title={t('login')}
            icon={<IconLogin size={18} color={'var(--gourmet-neutral-8)'} />}
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
        <Stack gap={'0.5rem'}>
          <Group gap={'0.25rem'}>
            <div className={styles.avatarIcon}>
              {user.avatarUrl && <img src={user.avatarUrl} alt={user.displayName} />}
              {!user.avatarUrl && (
                <img src={`data:image/svg+xml,${encodeURIComponent(avatarFallback ?? '')}`} alt={user.displayName} />
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
          {user.state === 'unverified' && (
            <div>
              <Text mt={'0.5rem'} c={'var(--gourmet-orange-1)'} fz={'0.9rem'}>
                {t('notVerified')
                  .split('\n')
                  .map((item, key) => (
                    <span key={key}>
                      {item}
                      <br />
                    </span>
                  ))}
              </Text>
            </div>
          )}

          <Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

          <Link to={'/me/history'} search={{ ...historyParamDefaults, tcg: tcg }}>
            <ItemButton
              title={t('history')}
              icon={<IconHistory size={18} color={'var(--gourmet-neutral-8)'} />}
              onClick={() => close()}
            />
          </Link>
          <Link to={'/me/saved-searches'} search={{ ...historyParamDefaults, tcg: tcg }}>
            <ItemButton
              title={t('savedSearches')}
              icon={<IconBook2 size={18} color={'var(--gourmet-neutral-8)'} />}
              onClick={() => close()}
            />
          </Link>

          <Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

          <Link to={`/@{$user}/lists/$listId`} params={{ user: user.username, listId: 'favorites' }}>
            <ItemButton
              title={t('favorites')}
              icon={<IconStar size={18} color={'var(--gourmet-neutral-8)'} />}
              disabled={user.state === 'unverified'}
              onClick={() => close()}
            />
          </Link>
          <Link
            to={'/me/lists'}
            search={{
              ...paramDefaults,
              tcg: tcg,
            }}
          >
            <ItemButton
              title={t('lists')}
              icon={<IconList size={18} color={'var(--gourmet-neutral-8)'} />}
              disabled={user.state === 'unverified'}
              onClick={() => close()}
            />
          </Link>

          <Divider style={{ borderColor: 'var(--gourmet-neutral-4)' }} />

          <Link to={'/me/settings'}>
            <ItemButton
              title={t('settings')}
              icon={<IconSettings size={18} color={'var(--gourmet-neutral-8)'} />}
              disabled={user.state === 'unverified'}
              onClick={() => close()}
            />
          </Link>
          <MobileThemeSelector />
          <MobileLanguageSelector />
          <ItemButton
            title={t('logout')}
            icon={<IconLogout size={18} color="var(--gourmet-red-01)" />}
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

export const ItemButton = forwardRef<
  HTMLButtonElement,
  { title: string; icon: ReactElement; onClick?: () => void } & ButtonProps
>((props, ref) => {
  return (
    <Button
      ref={ref}
      justify="space-between"
      leftSection={
        <Group>
          {props.icon}
          <Text ff={'var(--cgm-content-font-family)'} c={props.color}>
            {props.title}
          </Text>
        </Group>
      }
      disabled={props.disabled}
      classNames={{ root: styles.itemButton }}
      onClick={props.onClick}
    />
  );
});
