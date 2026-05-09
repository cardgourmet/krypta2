import {Button, Group, Loader, Stack} from '@mantine/core';
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google';
import {startTransition, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {connectOAuth, disconnectOAuth} from '@/parcels/auth/api.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';

export function GoogleIntegrationSetting() {
  return (
    <GoogleOAuthProvider clientId={'754383302885-809uidvoogh3bjsivfnif1m313q3e70v.apps.googleusercontent.com'}>
      <GoogleIntegration />
    </GoogleOAuthProvider>
  );
}

function GoogleIntegration() {
  const { integrations, loadIntegrations } = useAuth();

  const [connected, setConnected] = useState((integrations?.map((i) => i.provider) ?? []).includes('google'));

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const login = useGoogleLogin({
    onSuccess: (res) => {
      const date = new Date();
      date.setSeconds(date.getSeconds() + res.expires_in);

      setConnected(true);

      startTransition(async () => {
        const res2 = await connectOAuth(res.access_token, date.toISOString(), 'google');
        setLoading(false);

        if (res2.error) {
          setConnected(false);
          setError(res2.error.key);
          return;
        }

        // reload integrations
        loadIntegrations();
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
      <Group>
        {!connected && (
          <Button
            color={'var(--gourmet-blue-1)'}
            onClick={() => {
              setError('');
              setLoading(true);

              login();
            }}
            disabled={loading}
          >
            Connect with Google
          </Button>
        )}
        {connected && (
          <Button
            color={'var(--gourmet-red-01)'}
            onClick={() => {
              setLoading(true);
              setConnected(false);

              startTransition(async () => {
                const res = await disconnectOAuth('google');
                setLoading(false);

                if (res.error) {
                  setConnected(true);
                  setError(res.error.key);
                }
              });
            }}
            disabled={loading}
          >
            Disconnect from Google
          </Button>
        )}
        {loading && <Loader size={18} />}
      </Group>
      {error && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {error}
        </GourmetText>
      )}
    </Stack>
  );
}
