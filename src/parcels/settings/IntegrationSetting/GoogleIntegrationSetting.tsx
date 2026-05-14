import {Group, Loader, Stack} from '@mantine/core';
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google';
import {IconAlertCircle} from '@tabler/icons-react';
import {startTransition, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {connectOAuth, disconnectOAuth} from '@/parcels/auth/api.ts';
import {Button} from '@/parcels/generic/Button/Button';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';

export function GoogleIntegrationSetting() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID}>
      <GoogleIntegration />
    </GoogleOAuthProvider>
  );
}

function GoogleIntegration() {
  const { t } = useTranslation('auth', { keyPrefix: 'settings.groups.integrations.google' });
  const { user, integrations, loadIntegrations } = useAuth();

  const [connected, setConnected] = useState((integrations?.map((i) => i.provider) ?? []).includes('google'));
  useEffect(() => {
    setConnected((integrations?.map((i) => i.provider) ?? []).includes('google'));
  }, [integrations]);

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
            disabled={loading}
            onClick={() => {
              setError('');
              setLoading(true);

              login();
            }}
            size="sm"
          >
            {t('connect')}
          </Button>
        )}
        {connected && (
          <Button
            accent="negative"
            disabled={loading}
            onClick={() => {
              if (user?.isPasswordEmpty) {
                setError('no-password-set');
                return;
              }

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
            size="sm"
          >
            {t('disconnect')}
          </Button>
        )}
        {loading && <Loader size={18} />}
      </Group>
      {user?.isPasswordEmpty && (
        <Group gap={'0.5rem'} wrap={'nowrap'}>
          <IconAlertCircle size={20} color={'var(--gourmet-neutral-6)'} />
          <GourmetText c={'var(--gourmet-neutral-6)'} maw={'32rem'}>
            {t('cantRemove')}
          </GourmetText>
        </Group>
      )}
      {error && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {error}
        </GourmetText>
      )}
    </Stack>
  );
}
