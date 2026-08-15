import { Blockquote, Divider, Stack } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { registerUsingBasicAuth } from '@/parcels/auth/api.ts';
import { GoogleRegisterButton, type OAuthData } from '@/parcels/auth/register/GoogleRegisterButton.tsx';
import { RegisterFormInputField } from '@/parcels/auth/register/RegisterFormInputField.tsx';
import { Button } from '@/parcels/generic/Button/Button';
import { DISPLAYNAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX, Route, USERNAME_REGEX } from '@/routes/register';
import styles from '@/routes/register/index.module.css';

export type FormValues = {
  email: string;
  username: string;
  displayname: string;
  password: string;
  password2: string;
};

export function BasicRegistrationForm({ onOAuthSuccess }: { onOAuthSuccess: (data: OAuthData) => void }) {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { login } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: '',
    username: '',
    displayname: '',
    password: '',
    password2: '',
  });
  const [formErrors, setFormErrors] = useState<Record<keyof FormValues, string[] | undefined>>({
    email: undefined,
    username: undefined,
    displayname: undefined,
    password: undefined,
    password2: undefined,
  });
  const [formFocused, setFormFocused] = useState<{
    email?: boolean;
    username?: boolean;
    displayname?: boolean;
    password?: boolean;
    password2?: boolean;
  }>({});

  const [registerError, setRegisterError] = useState<string>('');

  const validateField = (name: string, value: string): string[] | string | undefined => {
    const errors: string[] = [];
    switch (name as keyof typeof formValues) {
      case 'email':
        if (!EMAIL_REGEX.test(value)) errors.push('invalid-email');
        break;
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
      case 'password':
        if (!PASSWORD_REGEX.test(value)) {
          errors.push('invalid-password');
        }
        break;
      case 'password2':
        if (value !== formValues.password) {
          errors.push('passwords-doesnt-match');
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
    <>
      {registerError && (
        <Blockquote color={'var(--gourmet-red-01)'} className={styles.errorField} p={'1rem'}>
          {registerError}
        </Blockquote>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();

          // Validate all fields
          const errors: typeof formErrors = {} as typeof formErrors;
          let hasErrors = false;

          (Object.keys(formValues) as Array<keyof typeof formValues>).forEach((key) => {
            const error = validateField(key, formValues[key]);
            if (error !== undefined && error.length > 0) {
              if (typeof error === 'string') {
                errors[key] = [error];
              } else {
                errors[key] = error;
              }
              hasErrors = true;
            }
          });
          setFormErrors(errors);
          if (hasErrors) return;

          setRegisterError('');

          registerUsingBasicAuth({
            email: formValues.email,
            username: formValues.username,
            displayname: formValues.displayname,
            password: formValues.password,
          }).then((r) => {
            if (r.error) {
              const key = r.error.key;

              setRegisterError(t(`errors.${key}`));
              return;
            }

            // login potentially without session token
            login({
              token: r.session,
              expiresAt: r.data?.session?.expiresAt,
              user: r.data?.user,
            });

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
            formFocused={formFocused as Record<keyof FormValues, boolean>}
            formErrors={formErrors}
            formKey={'email'}
            t={t}
            handleFocus={handleFocus}
            handleChange={handleChange}
            validationKeys={['invalid-email']}
            autoComplete={'email'}
          />

          <RegisterFormInputField
            formValues={formValues}
            formFocused={formFocused as Record<keyof FormValues, boolean>}
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
            formFocused={formFocused as Record<keyof FormValues, boolean>}
            formErrors={formErrors}
            formKey={'displayname'}
            t={t}
            handleFocus={handleFocus}
            handleChange={handleChange}
            validationKeys={['invalid-displayname-length', 'invalid-displayname']}
          />

          <RegisterFormInputField
            formValues={formValues}
            formFocused={formFocused as Record<keyof FormValues, boolean>}
            formErrors={formErrors}
            formKey={'password'}
            t={t}
            handleFocus={handleFocus}
            handleChange={handleChange}
            validationKeys={['invalid-password']}
            autoComplete="new-password"
            password
          />

          <RegisterFormInputField
            formValues={formValues}
            formFocused={formFocused as Record<keyof FormValues, boolean>}
            formErrors={formErrors}
            formKey={'password2'}
            t={t}
            handleFocus={handleFocus}
            handleChange={handleChange}
            validationKeys={['passwords-doesnt-match']}
            autoComplete="new-password"
            password
          />

          <Button type="submit">{t('registerButton')}</Button>
        </Stack>
      </form>

      <Divider label={'Or'} />

      <GoogleRegisterButton onSuccess={onOAuthSuccess} />
    </>
  );
}
