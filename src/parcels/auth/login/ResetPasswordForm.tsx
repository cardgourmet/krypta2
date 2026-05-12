import {Blockquote, Button, Group, Stack} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconArrowRight, IconInfoCircle} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {confirmPasswordReset, requestPasswordReset} from '@/parcels/auth/api.ts';
import {GourmetPasswordInput} from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import styles from '@/routes/register/index.module.css';

export function ResetPasswordForm({ token, redirect }: { token?: string; redirect?: string }) {
  const { t } = useTranslation('auth', { keyPrefix: 'forgot' });

  const userForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
    },
  });
  const passwordForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
    },
  });

  const [forgotError, setForgotError] = useState('');

  const [success, setSuccess] = useState(false);

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'} cgmc={'neutral-9'}>
            {t('forgotPasswordTitle')}
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              {t('rememberItAgain')}
            </GourmetText>
            <Link to={'/login'} style={{ textDecoration: 'none' }} params={{ redirect: redirect }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('login')}</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-1)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        {!token && (
          <>
            <form
              onSubmit={userForm.onSubmit(async () => {
                setSuccess(false);
                setForgotError('');

                const values = userForm.getValues();

                const res = await requestPasswordReset(values.username);
                if (res.error) {
                  setForgotError(res.error.key);
                  return;
                }

                setSuccess(true);
              })}
            >
              <Stack>
                <Stack gap={'0.1rem'}>
                  <GourmetTextInput placeholder={t('enterUsername')} {...userForm.getInputProps('username')} />
                </Stack>
                <Button type={'submit'} color={'var(--gourmet-blue-1)'} disabled={success}>
                  <GourmetText cgmc={'neutral-0'}>{t('forgotButton')}</GourmetText>
                </Button>
              </Stack>
            </form>

            {success && (
              <div>
                <GourmetText c={'var(--gourmet-green-1)'}>{t('emailHasBeenSent')}</GourmetText>
              </div>
            )}
          </>
        )}

        {token && (
          <>
            <form
              onSubmit={passwordForm.onSubmit(async () => {
                setSuccess(false);
                setForgotError('');

                const values = passwordForm.getValues();
                if (!values.password) {
                  return;
                }

                const res = await confirmPasswordReset(token, values.password);
                if (res.error) {
                  setForgotError(res.error.key);
                  return;
                }

                setSuccess(true);
              })}
            >
              <Stack>
                <input name="Username" type="text" value={''} autoComplete={'username'} hidden readOnly />

                <Stack gap={'0.1rem'}>
                  <GourmetPasswordInput
                    {...passwordForm.getInputProps('password')}
                    w={'100%'}
                    autoComplete="new-password"
                  />
                </Stack>
                <Button type={'submit'} color={'var(--gourmet-blue-1)'} disabled={success}>
                  <GourmetText cgmc={'neutral-0'}>{t('changePasswordButton')}</GourmetText>
                </Button>
              </Stack>
            </form>

            {success && (
              <div>
                <GourmetText c={'var(--gourmet-green-1)'}>{t('passwordHasBeenReset')}</GourmetText>
              </div>
            )}
          </>
        )}

        {forgotError && (
          <Blockquote color={'var(--gourmet-red-01)'} icon={<IconInfoCircle />} className={styles.errorField}>
            {forgotError}
          </Blockquote>
        )}
      </Stack>
    </Group>
  );
}
