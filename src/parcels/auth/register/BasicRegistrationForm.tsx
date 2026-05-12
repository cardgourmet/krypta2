import { Blockquote, Divider, Stack } from '@mantine/core';
import { matches, useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { registerUsingBasicAuth } from '@/parcels/auth/api.ts';
import { GoogleRegisterButton, type OAuthData } from '@/parcels/auth/register/GoogleRegisterButton.tsx';
import { Button } from '@/parcels/generic/Button/Button';
import { GourmetPasswordInput } from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { GourmetTextInput } from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import { EMAIL_REGEX, PASSWORD_REGEX, Route, USERNAME_REGEX } from '@/routes/register';
import styles from '@/routes/register/index.module.css';

export function BasicRegistrationForm({ onOAuthSuccess }: { onOAuthSuccess: (data: OAuthData) => void }) {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { login } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      username: '',
      password: '',
      password2: '',
    },
    validate: {
      email: matches(EMAIL_REGEX, 'invalid-email'),
      username: matches(USERNAME_REGEX, 'invalid-username'),
      password: matches(PASSWORD_REGEX, 'invalid-password'),
      password2: (value, values) => (value !== values.password ? 'passwords-doesnt-match' : null),
    },
  });

  const [registerError, setRegisterError] = useState<string>('');

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => {
          const values = form.getValues();

          setRegisterError('');

          registerUsingBasicAuth({
            email: values.email,
            username: values.username,
            password: values.password,
          }).then((r) => {
            if (r.error) {
              setRegisterError(r.error.key);
              return;
            }

            // login potentially without session token
            login({
              token: r.session,
              expiresAt: r.data?.session?.expiresAt,
              user: r.data?.user,
            });

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
            <GourmetText>{t('email')}</GourmetText>
            <GourmetTextInput {...form.getInputProps('email')} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>{t('username')}</GourmetText>
            <GourmetTextInput {...form.getInputProps('username')} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>{t('password')}</GourmetText>
            <GourmetPasswordInput w={'100%'} {...form.getInputProps('password')} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>{t('password-repeat')}</GourmetText>
            <GourmetPasswordInput w={'100%'} {...form.getInputProps('password2')} />
          </Stack>

          <Button type="submit">{t('register-button')}</Button>
        </Stack>
      </form>

      <Divider label={'Or'} />

      <GoogleRegisterButton onSuccess={onOAuthSuccess} />

      {registerError && (
        <Blockquote color={'var(--gourmet-red-01)'} icon={<IconInfoCircle />} className={styles.errorField}>
          {registerError}
        </Blockquote>
      )}
    </>
  );
}
