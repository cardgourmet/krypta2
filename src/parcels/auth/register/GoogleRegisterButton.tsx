import {Button, Group, Loader, Stack} from '@mantine/core';
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google';
import {IconBrandGoogleFilled} from '@tabler/icons-react';
import {startTransition, useState} from 'react';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';

export type OAuthData = { accessToken: string; expiresAt: string; provider: string };

export function GoogleRegisterButton({ onSuccess }: { onSuccess: (data: OAuthData) => void }) {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID}>
      <GoogleRegisterButtonIntegration onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  );
}

function GoogleRegisterButtonIntegration({ onSuccess }: { onSuccess: (data: OAuthData) => void }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      const date = new Date();
      date.setSeconds(date.getSeconds() + res.expires_in);

      startTransition(async () => {
        setLoading(false);

        onSuccess({ accessToken: res.access_token, expiresAt: date.toISOString(), provider: 'google' });
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
