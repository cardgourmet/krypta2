import {Button, Group, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import {createFileRoute} from '@tanstack/react-router';
import {Activity, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.tsx';
import {loginUsingBasicAuth, logout, registerUsingBasicAuth} from '@/parcels/auth/api.ts';
import {useUserSession} from '@/parcels/auth/useUserSession.ts';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
});

export const USERNAME_REGEX = /^[a-z0-9_]{3,}$/;
export const DISPLAYNAME_REGEX = /^[a-zA-Z0-9-_\s]{3,50}$/;
export const PASSWORD_REGEX = /^.{8,}$/;
export const EMAIL_REGEX =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: EMAILS YOU KNOW
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function RouteComponent() {
  const { session, setSession } = useUserSession();
  const loggedInUser = useAuth();

  // TODO: button to register with email + username + password
  // TODO: button to register using Google or Github

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  return (
    <Stack style={{ margin: '1rem 4rem' }}>
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
          <Text>Login</Text>
          <TextInput label="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
          <PasswordInput
            label="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            w={'12rem'}
          />
          <Button
            onClick={() => {
              if (loginUsername.length <= 1) return;
              if (loginPassword.length <= 1) return;

              loginUsingBasicAuth(
                {
                  usernameOrEmail: loginUsername,
                  password: loginPassword,
                },
                session?.sessionToken,
              ).then((r) => {
                if (r.error) {
                  console.log('Error during login', r.error);
                  return;
                }
                if (r.session && r.data?.session) {
                  setSession({
                    sessionToken: r.session,
                    expiresAt: r.data?.session.expiresAt,
                  });
                }

                console.log('Successfully loginned', JSON.stringify(r.data));
              });
            }}
          >
            Login
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
    </Stack>
  );
}
