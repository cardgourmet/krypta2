import {Button, Group, Stack} from '@mantine/core';
import {formRootRule, useForm} from '@mantine/form';
import {IconArrowRight} from '@tabler/icons-react';
import {createFileRoute, Link, redirect, useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetPasswordInput} from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';

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
});

export const USERNAME_REGEX = /^[a-z0-9_]{3,}$/;
export const DISPLAYNAME_REGEX = /^[a-zA-Z0-9-_\s]{3,50}$/;
export const PASSWORD_REGEX = /^.{8,}$/;
export const EMAIL_REGEX =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: EMAILS YOU KNOW
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function RouteComponent() {
  const { t } = useTranslation('auth', { keyPrefix: 'register' });
  const { login } = useAuth();

  // const [registerError, setRegisterError] = useState<string>('');

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      username: '',
      password: '',
      password2: '',
    },
    validate: {
      email: (value) => (value.length < 2 ? 'invalid' : null),
      username: (value) => (value.length < 2 ? 'invalid' : null),
      password: (value) => (value.length < 2 ? 'invalid' : null),
      [formRootRule]: (value) => (value.password === value.password2 ? 'password-not-equal' : null),
    },
  });

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPassword2, setRegisterPassword2] = useState('');

  const navigate = useNavigate();

  return (
    <Group justify={'center'}>
      <Stack gap={'xl'} mt={'6rem'} w={'28rem'}>
        <Stack gap={'0.25rem'}>
          <GourmetText fz={'h2'} cgmff={'title'}>
            {t('register-title')}
          </GourmetText>
          <Group gap={'0.25rem'}>
            <GourmetText fz={'md'} cgmc={'neutral-6'}>
              {t('first-time')}
            </GourmetText>
            <Link to={'/login'} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <GourmetText c={'var(--gourmet-blue-1)'}>{t('login')}</GourmetText>
                <IconArrowRight size={16} color={'var(--gourmet-blue-5)'} />
              </Group>
            </Link>
          </Group>
        </Stack>

        <form
          onSubmit={form.onSubmit(() => {
            // TODO: was successful
            /*if (registerEmail.length <= 1) return;
              if (registerUsername.length <= 1) return;
              if (registerPassword.length <= 1) return;

              registerUsingBasicAuth({
                email: registerEmail,
                username: registerUsername,
                password: registerPassword,
              }).then((r) => {
                if (r.error) {
                  console.log('Error during register:', r.error);
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
                  to: '/',
                  replace: true,
                });
              });*/
          })}
        >
          <Stack>
            <Stack gap={'0.1rem'}>
              <GourmetText>{t('email')}</GourmetText>
              <GourmetTextInput {...form.getInputProps('email')} />
            </Stack>
            <Stack gap={'0.1rem'}>
              <GourmetText>{t('username')}</GourmetText>
              <GourmetTextInput {...form.getInputProps('username')} />
            </Stack>
            <Stack gap={'0.1rem'}>
              <GourmetText>{t('password')}</GourmetText>
              <GourmetPasswordInput w={'100%'} {...form.getInputProps('password')} />
            </Stack>
            <Stack gap={'0.1rem'}>
              <GourmetText>{t('password-repeat')}</GourmetText>
              <GourmetPasswordInput w={'100%'} {...form.getInputProps('password2')} />
            </Stack>
            <Button type={'submit'} color={'var(--gourmet-blue-1)'}>
              <GourmetText cgmc={'neutral-0'}>{t('register-button')}</GourmetText>
            </Button>
          </Stack>
        </form>
      </Stack>
    </Group>
  );
}
