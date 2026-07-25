import { Center, Group, Menu, SimpleGrid, Stack, Switch, UnstyledButton } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { DE, GB } from 'country-flag-icons/react/3x2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestAnimationFrameTransition } from '@/parcels/animation/requestAnimationFrameTransition.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { updateUserSettings } from '@/parcels/auth/api.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { useUserLanguage } from '@/parcels/state/useUserLanguage.tsx';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('nav', { keyPrefix: 'language' });

  const { user, updateUser } = useAuth();
  const [language, setLanguage] = useUserLanguage();
  const [localLanguage, setLocalLanguage] = useState<string>(language);

  const switchLanguage = useCallback(
    (lang: string) => {
      // noinspection JSIgnoredPromiseFromCall
      i18n.changeLanguage(lang);
    },
    [i18n.changeLanguage],
  );
  useEffect(() => {
    switchLanguage(language);
    setLocalLanguage(language);
  }, [language, switchLanguage]);

  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncChecked, setSyncChecked] = useState(user?.settings.preferredLanguages?.syncLanguages ?? true);
  useEffect(() => {
    setSyncChecked(user?.settings.preferredLanguages?.syncLanguages ?? false);
  }, [user?.settings.preferredLanguages?.syncLanguages]);

  return (
    <Menu
      shadow="md"
      position={'bottom-end'}
      opened={opened}
      onChange={setOpened}
      width={340}
      transitionProps={{ transition: 'pop', duration: 100 }}
    >
      <Menu.Target>
        <UnstyledButton className={styles.iconButton}>
          <Center>
            <IconLanguage size={22} color={'var(--gourmet-neutral-8)'} />
          </Center>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          backgroundColor: 'var(--cgm-sidebar-bg)',
          border: '1px solid var(--cgm-sidebar-border)',
          borderRadius: '4px',
        }}
        p={'0.5rem'}
      >
        <Stack p={'0.25rem 0.5rem'}>
          <SimpleGrid cols={2}>
            <GourmetText cgmff={'ui'}>Language</GourmetText>

            <Group gap={'0.5rem'}>
              {['en', 'de'].map((l) => {
                return (
                  <UnstyledButton
                    key={l}
                    style={{
                      border: localLanguage === l ? '2px solid var(--gourmet-blue-1)' : '2px solid transparent',
                    }}
                    className={styles.languageIcon}
                    onClick={() => {
                      setLocalLanguage(l);
                      setLanguage(l as 'en' | 'de');

                      if (!user) return;

                      requestAnimationFrameTransition(async () => {
                        const res = await updateUserSettings({
                          ...user?.settings,
                          preferredLanguages: {
                            ...user?.settings?.preferredLanguages,
                            global: l as 'en' | 'de',
                          },
                        });

                        setLoading(false);
                        if (res.error) {
                          sendErrorNotification(res.error);
                          return;
                        }

                        if (res.data) updateUser(res.data);
                      });
                    }}
                  >
                    <Center>
                      {l === 'en' && (
                        <GB
                          title={t(l)}
                          style={{
                            height: '1.25rem',
                            filter: localLanguage === l ? undefined : 'grayscale(1)',
                          }}
                        />
                      )}
                      {l === 'de' && (
                        <DE
                          title={t(l)}
                          style={{
                            height: '1.25rem',
                            filter: localLanguage === l ? undefined : 'grayscale(1)',
                          }}
                        />
                      )}
                    </Center>
                  </UnstyledButton>
                );
              })}
            </Group>
          </SimpleGrid>

          {user && (
            <Stack gap={'0.5rem'}>
              <Switch
                disabled={loading}
                checked={syncChecked}
                label={t('syncWithTcgs')}
                color={'var(--gourmet-blue-1)'}
                withThumbIndicator={false}
                onChange={(event) => {
                  const checked = event.currentTarget.checked;

                  setLoading(true);
                  setSyncChecked(checked);

                  requestAnimationFrameTransition(async () => {
                    const res = await updateUserSettings({
                      ...user?.settings,
                      preferredLanguages: {
                        ...user?.settings?.preferredLanguages,
                        syncLanguages: checked,
                      },
                    });

                    setLoading(false);
                    if (res.error) {
                      sendErrorNotification(res.error);
                      return;
                    }

                    if (res.data) updateUser(res.data);
                  });
                }}
              />
              <GourmetText cgmff={'ui'} cgmc={'neutral-5'} fz={'0.9rem'}>
                {t('syncExplanation')}
              </GourmetText>
            </Stack>
          )}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
