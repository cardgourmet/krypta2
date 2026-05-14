import {ActionIcon, Group, Loader, Stack, UnstyledButton} from '@mantine/core';
import {IconAlertCircle, IconCheck, IconEdit, IconX} from '@tabler/icons-react';
import {startTransition, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {updateUserPassword} from '@/parcels/auth/api.ts';
import {GourmetPasswordInput} from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from '@/routes/me/settings/index.module.css';

export function PasswordSetting() {
  const { t } = useTranslation('auth', { keyPrefix: 'settings' });
  const { t: t2 } = useTranslation('auth', { keyPrefix: 'settings.groups.account.password' });
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
                  {t('edit')}
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

            if (!newPassword || (!user?.isPasswordEmpty && !oldPassword)) return;
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
                disabled={user?.isPasswordEmpty}
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
              label={t2('fieldLabel')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <GourmetPasswordInput
              label={t2('fieldLabelConfirm')}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              autoComplete="new-password"
            />
          </Stack>
        </form>
      )}
      {user?.isPasswordEmpty && (
        <Group gap={'0.25rem'}>
          <IconAlertCircle size={20} color={'var(--gourmet-neutral-6)'} />
          <GourmetText c={'var(--gourmet-neutral-6)'}>{t('noPassword')}</GourmetText>
        </Group>
      )}

      {error && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {error}
        </GourmetText>
      )}
    </Stack>
  );
}
