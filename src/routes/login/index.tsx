import {Button, Group, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import {IconArrowRight} from '@tabler/icons-react';
import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {loginUsingBasicAuth} from '@/parcels/auth/api.ts';

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
          <Text fz={'h2'}>Einloggen</Text>
          <Group gap={'0.25rem'}>
            <Text fz={'md'} c={'var(--gourmet-neutral-6)'}>
              Zum ersten Mal hier?
            </Text>
            <Link to={'/register'} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <Text c={'var(--gourmet-blue-5)'}>Registrieren</Text>
                <IconArrowRight size={16} color={'var(--gourmet-blue-5)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        <Stack>
          <Stack gap={'0.1rem'}>
            <Text>E-Mail-Adresse oder Benutzername</Text>
            <TextInput value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <Group justify={'space-between'}>
              <Text>Passwort</Text>
              <Link to={'/'} style={{ textDecoration: 'none' }}>
                <Text c={'var(--gourmet-blue-5)'}>Passwort vergessen?</Text>
              </Link>
            </Group>
            <PasswordInput value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} w={'100%'} />
          </Stack>
          <Button
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
                if (r.session && r.data?.session) {
                  login({
                    token: r.session,
                    expiresAt: r.data?.session.expiresAt,
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
            Anmelden
          </Button>
        </Stack>
      </Stack>
    </Group>
  );
}
