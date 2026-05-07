import {ActionIcon, Divider, Group, Loader, type MantineColorScheme, Radio, RadioGroup, Stack, UnstyledButton, useMantineColorScheme,} from '@mantine/core';
import {IconCheck, IconEdit, IconX} from '@tabler/icons-react';
import {createFileRoute, redirect} from '@tanstack/react-router';
import {startTransition, useRef, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {updateUserDisplayName} from '@/parcels/auth/api.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import styles from './index.module.css';

export const Route = createFileRoute('/me/settings/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.auth?.user?.state !== 'verified') {
      throw redirect({
        to: '/',
      });
    }
  },
});

function RouteComponent() {
  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Settings',
      },
    ],
  });

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // TODO: categories
  /*

  Allgemein
  - Theme

  Account & Sicherheit
  - Anzeigename
  - E-Mail-Adresse
  - Passwort

  Privatsphäre
  - Sichtbarkeit deines Profils
  - Sichtbarkeit deiner Aktivität
  - Sichtbarkeit deiner Inhalte (Listen)

  Sprache
  - Benachrichtigungen
  - MTG, DLC, PCG (preferred)

  Integrationen
  - connect to google

   */

  const [displayName, setDisplayName] = useState(user?.displayName!);
  const [displayNameEdit, setDisplayNameEdit] = useState(false);
  const [displayNameLoading, setDisplayNameLoading] = useState(false);
  const [displayNameError, setDisplayNameError] = useState('');
  const displayNameEditRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <title>{`Account Settings – Cardgourmet`}</title>
      {component}

      <Stack
        gap={'0'}
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 'var(--sticky-layer)',
          backgroundColor: 'var(--gourmet-neutral-0)',
        }}
        mb={'1rem'}
      >
        <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
          <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
            {title?.label}
          </GourmetText>
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <Stack gap={'2.5rem'}>
        <Stack>
          <GroupTitle text={'Allgemein'} />

          <Group>
            <GroupSettingTitle title={'Theme'} description={'Diese Einstellung gilt nur für diesen Browser.'} />

            <Stack>
              <RadioGroup
                name={'theme'}
                value={colorScheme}
                onChange={(val) => {
                  setColorScheme(val as MantineColorScheme);
                }}
              >
                <Group>
                  <Radio value={'light'} label={'Light'} />
                  <Radio value={'dark'} label={'Dark'} />
                  <Radio value={'auto'} label={'Auto'} />
                </Group>
              </RadioGroup>
            </Stack>
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Account & Sicherheit'} />

          <Group align={'start'}>
            <GroupSettingTitle title={'Anzeigename'} description={'So wirst du auf Cardgourmet dargestellt.'} />

            <Stack gap={'0.1rem'}>
              <Group>
                <GourmetTextInput
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  readOnly={!displayNameEdit}
                  className={styles.inlineTextInput}
                  ref={displayNameEditRef}
                />

                {!displayNameLoading && !displayNameEdit && (
                  <UnstyledButton
                    onClick={() => {
                      setDisplayNameEdit(true);
                      displayNameEditRef.current?.focus();
                    }}
                  >
                    <Group gap={'0.5rem'}>
                      <IconEdit size={18} color={'var(--gourmet-blue-1)'} />
                      <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'}>
                        Bearbeiten
                      </GourmetText>
                    </Group>
                  </UnstyledButton>
                )}
                {displayNameLoading && <Loader size={18} />}
                {displayNameEdit && (
                  <Group gap={'0.25rem'}>
                    <ActionIcon
                      onClick={() => {
                        setDisplayNameEdit(false);
                        setDisplayName(user?.displayName!);
                      }}
                      className={styles.closeButton}
                    >
                      <IconX size={18} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        setDisplayNameEdit(false);
                        setDisplayNameError('');

                        if (displayName === user?.displayName) return;
                        setDisplayNameLoading(true);

                        startTransition(async () => {
                          const d = await updateUserDisplayName(displayName);

                          setDisplayNameLoading(false);
                          if (d.error || !d.data) {
                            setDisplayName(user?.displayName!);
                            setDisplayNameError(d.error?.key ?? 'unknown');
                            return;
                          }

                          setDisplayName(d.data.displayName);
                        });
                      }}
                      className={styles.checkButton}
                    >
                      <IconCheck size={18} />
                    </ActionIcon>
                  </Group>
                )}
              </Group>
              {displayNameError && (
                <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
                  {displayNameError}
                </GourmetText>
              )}
            </Stack>
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle title={'E-Mail-Adresse'} />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle title={'Passwort'} />
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Privatsphäre'} />

          <Group>
            <GroupSettingTitle
              title={'Sichtbarkeit deines Profils'}
              description={'Du entscheidest, wer dein Profil sehen darf.'}
            />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Sichtbarkeit deiner Aktivität'}
              description={'Du entscheidest, wer sehen darf, wann du zuletzt online warst.'}
            />
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Sprache'} />

          <Group>
            <GroupSettingTitle
              title={'Benachrichtigungen'}
              description={'Wir werden E-Mails an dich in dieser Sprache verschicken.'}
            />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Magic: The Gathering'}
              description={'Karten werden bevorzugt in dieser Sprache gesucht und dargestellt.'}
            />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Pokémon Card Game'}
              description={'Karten werden bevorzugt in dieser Sprache gesucht und dargestellt.'}
            />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Disney Lorcana'}
              description={'Karten werden bevorzugt in dieser Sprache gesucht und dargestellt.'}
            />
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Integrationen'} />
        </Stack>

        <GourmetText>{JSON.stringify(user)}</GourmetText>
      </Stack>
    </div>
  );
}

function GroupSettingTitle({ title, description }: { title: string; description?: string }) {
  return (
    <Stack w={'50%'} gap={'0rem'}>
      <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fw={500}>
        {title}
      </GourmetText>

      {description && (
        <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
          {description}
        </GourmetText>
      )}
    </Stack>
  );
}

function GroupTitle({ text }: { text: string }) {
  return (
    <Stack gap={'0.15rem'}>
      <GourmetText cgmff={'title'} fz={'h3'} fw={600}>
        {text}
      </GourmetText>
      <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
    </Stack>
  );
}
