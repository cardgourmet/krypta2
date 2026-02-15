import {Button, Group, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import {IconArrowRight} from '@tabler/icons-react';
import {createFileRoute, Link, redirect} from '@tanstack/react-router';
import {useState} from 'react';
import {registerUsingBasicAuth} from '@/parcels/auth/api.ts';
import {useUserSession} from '@/parcels/auth/useUserSession.ts';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth) {
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
  const { session, setSession } = useUserSession();

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPassword2, setRegisterPassword2] = useState('');

  return (
    <Stack gap={'xl'} m={'6rem 20rem'}>
      <Stack gap={'0.25rem'}>
        <Text fz={'h2'}>Willkommen bei Cardgourmet</Text>
        <Group gap={'0.25rem'}>
          <Text fz={'md'} c={'var(--gourmet-neutral-6)'}>
            Schon mal hier gewesen?
          </Text>
          <Link to={'/login'} style={{ textDecoration: 'none' }}>
            <Group gap={'0.25rem'}>
              <Text c={'var(--gourmet-blue-5)'}>Anmelden</Text>
              <IconArrowRight size={16} color={'var(--gourmet-blue-5)'} />
            </Group>
          </Link>
        </Group>
      </Stack>

      <Stack>
        <Stack gap={'0.1rem'}>
          <Text>E-Mail-Adresse</Text>
          <TextInput value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
        </Stack>
        <Stack gap={'0.1rem'}>
          <Text>Benutzername</Text>
          <TextInput value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
        </Stack>
        <Stack gap={'0.1rem'}>
          <Text>Passwort</Text>
          <PasswordInput value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} w={'100%'} />
        </Stack>
        <Stack gap={'0.1rem'}>
          <Text>Passwort wiederholen</Text>
          <PasswordInput value={registerPassword2} onChange={(e) => setRegisterPassword2(e.target.value)} w={'100%'} />
        </Stack>
        <Button
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
              session?.sessionToken,
            ).then((r) => {
              if (r.error) {
                console.log('Error during register:', r.error);
                return;
              }
              if (r.session && r.data?.session) {
                setSession({
                  sessionToken: r.session,
                  expiresAt: r.data?.session.expiresAt,
                });
              }

              console.log('Successfully registered', JSON.stringify(r.data));
            });
          }}
        >
          Registrieren
        </Button>
      </Stack>
    </Stack>
    /*<Stack style={{ margin: '1rem 4rem' }}>
      <Text>Session: {JSON.stringify(session)}</Text>
      <Text>User: {JSON.stringify(loggedInUser)}</Text>
      <Activity mode={loggedInUser ? 'hidden' : 'visible'}>
        <Group>
          <Text>Register</Text>
          <TextInput label="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
          <TextInput label="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
          <PasswordInput
            label="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            w={'12rem'}
          />
          <Button
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
                session?.sessionToken,
              ).then((r) => {
                if (r.error) {
                  console.log('Error during register:', r.error);
                  return;
                }
                if (r.session && r.data?.session) {
                  setSession({
                    sessionToken: r.session,
                    expiresAt: r.data?.session.expiresAt,
                  });
                }

                console.log('Successfully registered', JSON.stringify(r.data));
              });
            }}
          >
            Register
          </Button>
        </Group>
        <Group>
          <Text>Resend Confirmation</Text>
          <TextInput label="Email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} />
          <Button
            onClick={() => {
              if (session?.sessionToken) return;

              resendConfirmationMail({ email: resendEmail }, session?.sessionToken).then((r) => {
                if (r.error) {
                  if (r.statusCode === 409) {
                    // already verified
                    console.log("Already verified, don't need to resend mail");
                    return;
                  }

                  console.log('Error during resend email:', r.error);
                  return;
                }

                console.log('Successfully resend email', JSON.stringify(r.data));
              });
            }}
          >
            Resend
          </Button>
        </Group>
      </Activity>
      <Activity mode={loggedInUser ? 'visible' : 'hidden'}>
        <Group>
          <Button
            color={'red'}
            onClick={() => {
              logout(session?.sessionToken).then((r) => {
                setSession(undefined);

                if (r.error) {
                  console.log('Error during logout', r.error);
                  return;
                }

                console.log('Successfully logoutted', JSON.stringify(r.data));
              });
            }}
          >
            Logout
          </Button>
        </Group>
      </Activity>
    </Stack>*/
  );
}
