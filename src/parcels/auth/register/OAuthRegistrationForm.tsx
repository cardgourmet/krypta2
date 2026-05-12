import { Blockquote, Group, Stack } from '@mantine/core';
import { matches, useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { startTransition, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { registerUsingOAuth } from '@/parcels/auth/api.ts';
import type { OAuthData } from '@/parcels/auth/register/GoogleRegisterButton.tsx';
import { Button } from '@/parcels/generic/Button/Button';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { GourmetTextInput } from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import { Route, USERNAME_REGEX } from '@/routes/register';
import styles from '@/routes/register/index.module.css';

export function OAuthRegistrationForm({
  oauthData,
  clearOAuthData,
}: {
  oauthData: OAuthData;
  clearOAuthData: () => void;
}) {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { login } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const oauthForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
    },
    validate: {
      username: matches(USERNAME_REGEX, 'invalid-username'),
    },
  });

  const [registerError, setRegisterError] = useState<string>('');

  return (
    <Stack>
      <GourmetText c={'var(--gourmet-green-1)'}>
        Your Google account has been verified. To finish the registration, enter a username for your Cardgourmet
        account.
      </GourmetText>

      <form
        onSubmit={oauthForm.onSubmit(() => {
          setRegisterError('');
          const values = oauthForm.getValues();

          startTransition(async () => {
            const r = await registerUsingOAuth(
              oauthData.accessToken,
              oauthData.expiresAt,
              oauthData.provider as 'google',
              values.username,
            );

            if (r.error) {
              setRegisterError(r.error.key);
              return;
            }

            // is logged in
            if ((r.session && r.data?.session) || r.data?.user?.state === 'unverified') {
              login({
                token: r.session,
                expiresAt: r.data?.session?.expiresAt,
                user: r.data.user,
              });
            }

            // noinspection JSIgnoredPromiseFromCall
            navigate({
              to: redirect ?? '/',
              replace: true,
            });
          });
        })}
      >
        <Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>{t('username')}</GourmetText>
            <GourmetTextInput {...oauthForm.getInputProps('username')} />
          </Stack>

          <Group gap={'0.2rem'} justify={'end'}>
            <Button onClick={clearOAuthData} variant="secondary">
              Cancel Registration
            </Button>

            <Button type="submit">Finish Registration</Button>
          </Group>
        </Stack>
      </form>

      {registerError && (
        <Blockquote color={'var(--gourmet-red-01)'} icon={<IconInfoCircle />} className={styles.errorField}>
          {registerError}
        </Blockquote>
      )}
    </Stack>
  );
}
