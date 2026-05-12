import { Blockquote, Group, Stack } from '@mantine/core';
import { matches, useForm } from '@mantine/form';
import { IconArrowRight, IconInfoCircle } from '@tabler/icons-react';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { registerUsingBasicAuth } from '@/parcels/auth/api.ts';
import { Button } from '@/parcels/generic/Button/Button';
import { GourmetPasswordInput } from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { GourmetTextInput } from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import styles from './index.module.css';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      // if the user is already logged in -> forward to the home page
      throw redirect({
        to: '/',
      });
    }
  },
});

export const USERNAME_REGEX = /^[a-z0-9_]{3,36}$/;
export const DISPLAYNAME_REGEX = /^[a-zA-Z0-9-_\s]{3,50}$/;
export const PASSWORD_REGEX = /^.{8,128}$/;
export const EMAIL_REGEX =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: EMAILS YOU KNOW
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function RouteComponent() {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { login } = useAuth();

  // const [registerError, setRegisterError] = useState<string>('');

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

  const navigate = useNavigate();

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'}>
            {t('register-title')}
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              {t('first-time')}
            </GourmetText>
            <Link to={'/login'} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('login')}</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-5)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

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
                to: '/',
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

        {registerError && (
          <Blockquote color={'var(--gourmet-red-01)'} icon={<IconInfoCircle />} className={styles.errorField}>
            {registerError}
          </Blockquote>
        )}
      </Stack>
    </Group>
  );
}
