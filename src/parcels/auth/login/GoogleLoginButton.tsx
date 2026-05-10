import {Button} from '@mantine/core';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {IconBrandGoogleFilled} from '@tabler/icons-react';
import {useState} from 'react';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';

export function GoogleLoginButton() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID}>
      <GoogleLoginButtonIntegration />
    </GoogleOAuthProvider>
  );
}

function GoogleLoginButtonIntegration() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  return (
    <Button
      leftSection={<IconBrandGoogleFilled color={'var(--gourmet-neutral-0)'} />}
      color={'var(--gourmet-neutral-9)'}
      onClick={() => {
        // TODO: first call useLogin from google
        // TODO: call loginUsingOAuth
      }}
    >
      <GourmetText c={'var(--gourmet-neutral-1)'}>Continue with Google</GourmetText>
    </Button>
  );
}
