import { Group, Stack } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { BasicRegistrationForm } from '@/parcels/auth/register/BasicRegistrationForm.tsx';
import type { OAuthData } from '@/parcels/auth/register/GoogleRegisterButton.tsx';
import { OAuthRegistrationForm } from '@/parcels/auth/register/OAuthRegistrationForm.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export const registerParamsSchema = z.object({
  redirect: z.string().optional(),
});

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
  validateSearch: registerParamsSchema,
});

export const USERNAME_REGEX = /^[a-z0-9_]*$/;
export const DISPLAYNAME_REGEX = /^[a-zA-Z0-9-_\s]{3,50}$/;
export const PASSWORD_REGEX = /^.{8,128}$/;
export const EMAIL_REGEX =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: EMAILS YOU KNOW
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function RouteComponent() {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { redirect } = Route.useSearch();

  const [oauthData, setOAuthData] = useState<OAuthData | undefined>(undefined);

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'}>
            {t('registerTitle')}
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              {t('firstTime')}
            </GourmetText>
            <Link to={'/login'} style={{ textDecoration: 'none' }} search={{ redirect: redirect }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('login')}</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-5)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        {oauthData && (
          <OAuthRegistrationForm
            oauthData={oauthData}
            clearOAuthData={() => {
              setOAuthData(undefined);
            }}
          />
        )}

        {!oauthData && (
          <BasicRegistrationForm
            onOAuthSuccess={(data) => {
              setOAuthData(data);
            }}
          />
        )}
      </Stack>
    </Group>
  );
}
