import {Button, Group, Loader, Stack} from '@mantine/core';
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google';
import {IconBrandGoogleFilled} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {startTransition, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {loginUsingOAuth} from '@/parcels/auth/api.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {Route} from '@/routes/login';

export function GoogleLoginButton() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID}>
      <GoogleLoginButtonIntegration />
    </GoogleOAuthProvider>
  );
}

function GoogleLoginButtonIntegration() {
  const { login } = useAuth();
  const { redirect } = Route.useSearch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      const date = new Date();
      date.setSeconds(date.getSeconds() + res.expires_in);

      startTransition(async () => {
        const r = await loginUsingOAuth(res.access_token, date.toISOString(), 'google');
        setLoading(false);

        if (r.error) {
          setError(r.error.key);
          return;
        }

        // is logged in
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
    },
    onError: (err) => {
      setLoading(false);

      setError('oauth-error');
      console.log('error during oauth flow', err);
    },
    onNonOAuthError: (err) => {
      setLoading(false);

      setError('unknown');
      console.log('unexpected error', err);
    },
    scope: 'https://www.googleapis.com/auth/userinfo.email',
  });

  return (
    <Stack>
      <Button
        leftSection={<IconBrandGoogleFilled color={'var(--gourmet-neutral-0)'} />}
        color={'var(--gourmet-neutral-9)'}
        onClick={() => {
          googleLogin();
        }}
      >
        <Group>
          <GourmetText c={'var(--gourmet-neutral-1)'}>Continue with Google</GourmetText>
          {loading && <Loader size={18} />}
        </Group>
      </Button>
      {error && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {error}
        </GourmetText>
      )}
    </Stack>
  );
}
