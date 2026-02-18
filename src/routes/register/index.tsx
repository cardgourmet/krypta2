import {Button, Group, PasswordInput, Stack, TextInput} from '@mantine/core';
import {IconArrowRight} from '@tabler/icons-react';
import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {registerUsingBasicAuth} from '@/parcels/auth/api.ts';
import {GourmetText} from "@/parcels/mantine/GourmetText.tsx";

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

export const USERNAME_REGEX = /^[a-z0-9_]{3,}$/;
export const DISPLAYNAME_REGEX = /^[a-zA-Z0-9-_\s]{3,50}$/;
export const PASSWORD_REGEX = /^.{8,}$/;
export const EMAIL_REGEX =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: EMAILS YOU KNOW
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function RouteComponent() {
  const { token, login } = useAuth();

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPassword2, setRegisterPassword2] = useState('');

  const navigate = useNavigate();

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'}>
            Registrieren
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              Schon mal hier gewesen?
            </GourmetText>
            <Link to={'/login'} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>Anmelden</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-5)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        <Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>E-Mail-Adresse</GourmetText>
            <TextInput value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>Benutzername</GourmetText>
            <TextInput value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>Passwort</GourmetText>
            <PasswordInput value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} w={'100%'} />
          </Stack>
          <Stack gap={'0.1rem'}>
            <GourmetText>Passwort wiederholen</GourmetText>
            <PasswordInput
              value={registerPassword2}
              onChange={(e) => setRegisterPassword2(e.target.value)}
              w={'100%'}
            />
          </Stack>
          <Button
            color={'var(--gourmet-blue-1)'}
            onClick={() => {
              if (registerEmail.length <= 1) return;
              if (registerUsername.length <= 1) return;
              if (registerPassword.length <= 1) return;

              registerUsingBasicAuth(
                {
                  email: registerEmail,
                  username: registerUsername,
                  password: registerPassword,
                },
                token,
              ).then((r) => {
                if (r.error) {
                  console.log('Error during register:', r.error);
                  return;
                }
                if (r.session && r.data?.session) {
                  login({
                    token: r.session,
                    expiresAt: r.data?.session.expiresAt,
                  });
                }

                console.log('Successfully registered', JSON.stringify(r.data));

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/',
                  replace: true,
                });
              });
            }}
          >
            <GourmetText cgmc={'neutral-0'}>Registrieren</GourmetText>
          </Button>
        </Stack>
      </Stack>
    </Group>
  );
}
