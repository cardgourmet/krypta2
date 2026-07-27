import { Blockquote, Group, Stack } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { startTransition, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { registerUsingOAuth } from '@/parcels/auth/api.ts';
import type { OAuthData } from '@/parcels/auth/register/GoogleRegisterButton.tsx';
import { RegisterFormInputField } from '@/parcels/auth/register/RegisterFormInputField.tsx';
import { Button } from '@/parcels/generic/Button/Button';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { DISPLAYNAME_REGEX, Route, USERNAME_REGEX } from '@/routes/register';
import styles from '@/routes/register/index.module.css';

export type OAuthFormValues = {
  username: string;
  displayname: string;
};

export function OAuthRegistrationForm({
  oauthData,
  clearOAuthData,
}: {
  oauthData: OAuthData;
  clearOAuthData: () => void;
}) {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { login } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<OAuthFormValues>({
    username: '',
    displayname: '',
  });
  const [formErrors, setFormErrors] = useState<Record<keyof OAuthFormValues, string[] | undefined>>({
    username: undefined,
    displayname: undefined,
  });
  const [formFocused, setFormFocused] = useState<{
    username?: boolean;
    displayname?: boolean;
  }>({});

  const [registerError, setRegisterError] = useState<string>('');

  const validateField = (name: string, value: string): string[] | string | undefined => {
    const errors: string[] = [];
    switch (name as keyof typeof formValues) {
      case 'username':
        if (!(value.length >= 3 && value.length <= 50)) {
          errors.push('invalid-username-length');
        }
        if (!USERNAME_REGEX.test(value)) {
          errors.push('invalid-username-charset');
        }
        break;
      case 'displayname':
        if (!(value.length >= 3 && value.length <= 50)) {
          errors.push('invalid-displayname-length');
        }
        if (!DISPLAYNAME_REGEX.test(value)) {
          errors.push('invalid-displayname');
        }
        break;
      default:
        return undefined;
    }
    return errors;
  };

  const handleFocus = (name: string, value: boolean) => {
    setFormFocused((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
  };

  return (
    <Stack>
      <GourmetText c={'var(--gourmet-green-1)'}>{t('oauth.verified')}</GourmetText>

      {registerError && (
        <Blockquote color={'var(--gourmet-red-01)'} className={styles.errorField} p={'1rem'}>
          {registerError}
        </Blockquote>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();

          setRegisterError('');

          startTransition(async () => {
            const r = await registerUsingOAuth(
              oauthData.accessToken,
              oauthData.expiresAt,
              oauthData.provider as 'google',
              formValues.username,
              formValues.displayname,
            );

            if (r.error) {
              setRegisterError(t(`errors.${r.error.key}`));
              return;
            }

            // is logged in
            if ((r.session && r.data?.session) || r.data?.user?.state === 'unverified') {
              login({
                token: r.session,
                expiresAt: r.data?.session?.expiresAt,
                user: r.data.user,
              });
            }

            // noinspection JSIgnoredPromiseFromCall
            navigate({
              to: redirect ?? '/',
              replace: true,
            });
          });
        }}
      >
        <Stack>
          <RegisterFormInputField
            formValues={formValues}
            formFocused={formFocused}
            formErrors={formErrors}
            formKey={'username'}
            t={t}
            handleFocus={handleFocus}
            handleChange={handleChange}
            validationKeys={['invalid-username-length', 'invalid-username-charset']}
            autoComplete={'name'}
            valueProcessor={(val) => val.toLowerCase()}
          />

          <RegisterFormInputField
            formValues={formValues}
            formFocused={formFocused}
            formErrors={formErrors}
            formKey={'displayname'}
            t={t}
            handleFocus={handleFocus}
            handleChange={handleChange}
            validationKeys={['invalid-displayname-length', 'invalid-displayname']}
          />

          <Group gap={'0.2rem'} justify={'end'}>
            <Button onClick={clearOAuthData} variant="secondary">
              {t('oauth.cancel')}
            </Button>

            <Button type="submit">{t('oauth.finish')}</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
