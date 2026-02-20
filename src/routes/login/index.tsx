import {Button, Group, PasswordInput, Stack, TextInput} from '@mantine/core';
import {IconArrowRight} from '@tabler/icons-react';
import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {loginUsingBasicAuth} from '@/parcels/auth/api.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export const Route = createFileRoute('/login/')({
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

function RouteComponent() {
  const { t } = useTranslation('auth', { keyPrefix: 'login' });
  const { token, login } = useAuth();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navigate = useNavigate();

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'} cgmc={'neutral-9'}>
            {t('login-title')}
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              {t('first-time')}
            </GourmetText>
            <Link to={'/register'} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('register')}</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-1)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        <Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>{t('email-or-name')}</GourmetText>
            <TextInput value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <Group justify={'space-between'}>
              <GourmetText>{t('password')}</GourmetText>
              <Link to={'/'} style={{ textDecoration: 'none' }}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('forgot-password')}</GourmetText>
              </Link>
            </Group>
            <PasswordInput value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} w={'100%'} />
          </Stack>
          <Button
            color={'var(--gourmet-blue-1)'}
            onClick={() => {
              if (loginUsername.length <= 1) return;
              if (loginPassword.length <= 1) return;

              loginUsingBasicAuth(
                {
                  usernameOrEmail: loginUsername,
                  password: loginPassword,
                },
                token,
              ).then((r) => {
                if (r.error) {
                  console.log('Error during login', r.error);
                  return;
                }
                if ((r.session && r.data?.session) || r.data?.user?.state === 'unverified') {
                  login({
                    token: r.session,
                    expiresAt: r.data?.session.expiresAt,
                    user: r.data.user,
                  });
                }

                console.log('Successfully loginned', JSON.stringify(r.data));

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/',
                  replace: true,
                });
              });
            }}
          >
            <GourmetText cgmc={'neutral-0'}>{t('login-button')}</GourmetText>
          </Button>
        </Stack>
      </Stack>
    </Group>
  );
}
