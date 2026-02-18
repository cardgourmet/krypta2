import {Button, type ButtonProps, Divider, Group, Stack, Text} from '@mantine/core';
import {IconBookmark, IconHistory, IconList, IconLogin, IconLogout, IconQuestionMark, IconSettings, IconStar, IconX,} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {forwardRef, type ReactElement} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {MobileLanguageSelector} from '@/parcels/homepage/Navbar/LanguageSelector/MobileLanguageSelector.tsx';
import {MobileThemeSelector} from '@/parcels/homepage/Navbar/ThemeSelector/MobileThemeSelector.tsx';
import styles from './MobileUserMenu.module.css';

export function MobileUserMenu({ close }: { close: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Group justify={'space-between'}>
        <Text ff={'var(--cgm-content-font-family)'} tt={'uppercase'} fw={'bold'}>
          Benutzer
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
            title={'Anmelden'}
            icon={<IconLogin size={18} />}
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
                Du bist noch nicht verifiziert. <br />
                Damit bist du immernoch ein Gast.
              </Text>
            </div>
          )}

          <Divider />

          <ItemButton
            title={'Suchhistorie'}
            icon={<IconHistory size={18} color={'var(--gourmet-neutral-8)'} />}
            disabled
          />
          <ItemButton title={'Favoriten'} icon={<IconStar size={18} color={'var(--gourmet-neutral-8)'} />} disabled />
          <ItemButton
            title={'Lesezeichen'}
            icon={<IconBookmark size={18} color={'var(--gourmet-neutral-8)'} />}
            disabled
          />
          <ItemButton title={'Listen'} icon={<IconList size={18} color={'var(--gourmet-neutral-8)'} />} disabled />

          <Divider />

          <ItemButton
            title={'Einstellungen'}
            icon={<IconSettings size={18} color={'var(--gourmet-neutral-8)'} />}
            disabled
          />
          <MobileThemeSelector />
          <MobileLanguageSelector />
          <ItemButton
            title={'Abmelden'}
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
