import {Button, Group, PasswordInput, Stack, TextInput} from '@mantine/core';
import {IconArrowRight} from '@tabler/icons-react';
import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {loginUsingBasicAuth} from '@/parcels/auth/api.ts';
import {GourmetText} from "@/parcels/mantine/GourmetText.tsx";

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
  const { token, login } = useAuth();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navigate = useNavigate();

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'} cgmc={'neutral-9'}>
            Einloggen
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              Zum ersten Mal hier?
            </GourmetText>
            <Link to={'/register'} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>Registrieren</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-1)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        <Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>E-Mail-Adresse oder Benutzername</GourmetText>
            <TextInput value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <Group justify={'space-between'}>
              <GourmetText>Passwort</GourmetText>
              <Link to={'/'} style={{ textDecoration: 'none' }}>
                <GourmetText c={'var(--gourmet-blue-1)'}>Passwort vergessen?</GourmetText>
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
            <GourmetText cgmc={'neutral-0'}>Anmelden</GourmetText>
          </Button>
        </Stack>
      </Stack>
    </Group>
  );
}
