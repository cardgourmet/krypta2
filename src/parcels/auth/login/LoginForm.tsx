import {Blockquote, Divider, Group, Stack} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconArrowRight, IconInfoCircle} from '@tabler/icons-react';
import {Link, useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {loginUsingBasicAuth} from '@/parcels/auth/api.ts';
import {GoogleLoginButton} from '@/parcels/auth/login/GoogleLoginButton.tsx';
import {Button} from '@/parcels/generic/Button/Button';
import {GourmetPasswordInput} from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import {Route} from '@/routes/login';
import styles from '@/routes/register/index.module.css';

export function LoginForm() {
  const { t } = useTranslation('auth', { keyPrefix: 'login' });
  const { login } = useAuth();

  const { redirect } = Route.useSearch();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  });
  const [loginError, setLoginError] = useState<string>('');

  const navigate = useNavigate();

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'} cgmc={'neutral-9'}>
            {t('loginTitle')}
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              {t('firstTime')}
            </GourmetText>
            <Link to={'/register'} style={{ textDecoration: 'none' }} params={{ redirect: redirect }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('register')}</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-1)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        <form
          onSubmit={form.onSubmit(() => {
            const values = form.getValues();

            setLoginError('');

            loginUsingBasicAuth({
              usernameOrEmail: values.username,
              password: values.password,
            }).then((r) => {
              if (r.error) {
                setLoginError(r.error.key);
                return;
              }
              if ((r.session && r.data?.session) || r.data?.user?.state === 'unverified') {
                login({
                  token: r.session,
                  expiresAt: r.data?.session.expiresAt,
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
              <GourmetTextInput {...form.getInputProps('username')} />
            </Stack>
            <Stack gap={'0.1rem'}>
              <Group justify={'space-between'}>
                <GourmetText>{t('password')}</GourmetText>
                <Link to={'/forgot'} style={{ textDecoration: 'none' }}>
                  <GourmetText c={'var(--gourmet-blue-1)'}>{t('forgotPassword')}</GourmetText>
                </Link>
              </Group>
              <GourmetPasswordInput {...form.getInputProps('password')} w={'100%'} />
            </Stack>

            <Button type="submit">{t('loginButton')}</Button>
          </Stack>
        </form>

        <Divider label={'Or'} />

        <GoogleLoginButton />

        {loginError && (
          <Blockquote color={'var(--gourmet-red-01)'} icon={<IconInfoCircle />} className={styles.errorField}>
            {loginError}
          </Blockquote>
        )}
      </Stack>
    </Group>
  );
}
