import { ActionIcon, Group, Loader, Stack, UnstyledButton } from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';
import { startTransition, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { requestUpdateUserEmail } from '@/parcels/auth/api.ts';
import { GourmetPasswordInput } from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { GourmetTextInput } from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import styles from '@/routes/me/settings/index.module.css';

export function EmailSetting() {
  const { t } = useTranslation('auth', { keyPrefix: 'settings' });
  const { t: t2 } = useTranslation('auth', { keyPrefix: 'settings.groups.account.email' });
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
                {t('edit')}
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
        <GourmetPasswordInput label={t2('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
      )}
      {emailError && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {emailError}
        </GourmetText>
      )}
      {emailPending && (
        <GourmetText c={'var(--gourmet-green-1)'} fz={'0.95rem'}>
          {t('verificationLinkSent')}
        </GourmetText>
      )}
    </Stack>
  );
}
