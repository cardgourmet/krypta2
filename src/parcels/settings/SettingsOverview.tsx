import {ActionIcon, Divider, Group, Loader, type MantineColorScheme, Radio, RadioGroup, Stack, UnstyledButton, useMantineColorScheme,} from '@mantine/core';
import {IconCheck, IconEdit, IconX} from '@tabler/icons-react';
import {startTransition, useRef, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {requestUpdateUserEmail, updateUserDisplayName, updateUserPassword} from '@/parcels/auth/api.ts';
import {GourmetPasswordInput} from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import styles from '@/routes/me/settings/index.module.css';

export function SettingsOverview() {
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

            <DisplayNameSetting />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group align={'start'}>
            <GroupSettingTitle title={'E-Mail-Adresse'} />

            <EmailSetting />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group align={'start'}>
            <GroupSettingTitle title={'Passwort'} />

            <PasswordSetting />
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

function PasswordSetting() {
  const { user } = useAuth();

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  const [oldPassword, setOldPassword] = useState('123456789');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  return (
    <Stack>
      {!edit && (
        <Group>
          <GourmetText>••••••••••••••</GourmetText>

          {!loading && (
            <UnstyledButton
              onClick={() => {
                setEdit(true);
                setOldPassword('');
                editRef.current?.focus();
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
          {loading && <Loader size={18} />}
        </Group>
      )}

      {edit && (
        <form
          onSubmit={(e) => {
            e.preventDefault();

            setEdit(false);

            setError('');

            if (!oldPassword || !newPassword) return;
            if (newPassword !== newPassword2) return;
            setLoading(true);

            startTransition(async () => {
              const d = await updateUserPassword(oldPassword, newPassword);

              setOldPassword('123456789');
              setNewPassword('');
              setNewPassword2('');

              setLoading(false);
              if (d.error) {
                setError(d.error?.key);
                return;
              }
            });
          }}
        >
          <Stack>
            <Group>
              <input name="Username" type="text" value={user?.username} autoComplete={'username'} hidden readOnly />

              <GourmetPasswordInput
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={styles.inlineTextInput}
                style={{ width: '12rem' }}
                ref={editRef}
                autoComplete="current-password"
              />

              <Group gap={'0.25rem'}>
                <ActionIcon
                  onClick={() => {
                    setEdit(false);

                    setOldPassword('123456789');
                    setNewPassword('');
                    setNewPassword2('');
                  }}
                  className={styles.closeButton}
                >
                  <IconX size={18} />
                </ActionIcon>
                <ActionIcon type={'submit'} className={styles.checkButton}>
                  <IconCheck size={18} />
                </ActionIcon>
              </Group>
            </Group>

            <GourmetPasswordInput
              label={'New Password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <GourmetPasswordInput
              label={'Confirm New Password'}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              autoComplete="new-password"
            />
          </Stack>
        </form>
      )}
      {error && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {error}
        </GourmetText>
      )}
    </Stack>
  );
}

function EmailSetting() {
  const { user } = useAuth();

  const [emailPending, setEmailPending] = useState<string>('');

  const [email, setEmail] = useState(user?.email!);
  const [emailEdit, setEmailEdit] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const emailEditRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('');

  return (
    <Stack>
      <Group>
        {!emailEdit && <GourmetText>{email}</GourmetText>}
        {emailEdit && (
          <GourmetTextInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!emailEdit}
            className={styles.inlineTextInput}
            ref={emailEditRef}
          />
        )}

        {!emailLoading && !emailEdit && (
          <UnstyledButton
            onClick={() => {
              setEmailEdit(true);
              setEmailPending('');

              emailEditRef.current?.focus();
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
        {emailLoading && <Loader size={18} />}

        {emailEdit && (
          <Group gap={'0.25rem'}>
            <ActionIcon
              onClick={() => {
                setEmailEdit(false);
                setEmail(user?.email!);
              }}
              className={styles.closeButton}
            >
              <IconX size={18} />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setEmailEdit(false);
                setEmailError('');

                if (email === user?.email || !password) return;
                setEmailLoading(true);

                // only if the email has been verified
                setEmail(user?.email!);

                startTransition(async () => {
                  const d = await requestUpdateUserEmail(email, password);

                  setEmailLoading(false);
                  if (d.error) {
                    setEmailError(d.error?.key);
                    return;
                  }

                  setEmailPending(email);
                });
              }}
              className={styles.checkButton}
            >
              <IconCheck size={18} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      {emailEdit && (
        <GourmetPasswordInput label={'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
      )}
      {emailError && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {emailError}
        </GourmetText>
      )}
      {emailPending && (
        <GourmetText c={'var(--gourmet-green-1)'} fz={'0.95rem'}>
          A verification link has been sent to your new email.
        </GourmetText>
      )}
    </Stack>
  );
}

function DisplayNameSetting() {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName!);
  const [displayNameEdit, setDisplayNameEdit] = useState(false);
  const [displayNameLoading, setDisplayNameLoading] = useState(false);
  const [displayNameError, setDisplayNameError] = useState('');
  const displayNameEditRef = useRef<HTMLInputElement>(null);

  return (
    <Stack gap={'0.1rem'}>
      <Group>
        {!displayNameEdit && <GourmetText>{displayName}</GourmetText>}
        {displayNameEdit && (
          <GourmetTextInput
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            readOnly={!displayNameEdit}
            className={styles.inlineTextInput}
            ref={displayNameEditRef}
          />
        )}

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
