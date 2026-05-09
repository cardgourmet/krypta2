import {Divider, Group, Stack} from '@mantine/core';
import {useMemo} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {DisplayNameSetting} from '@/parcels/settings/DisplayNameSetting/DisplayNameSetting.tsx';
import {EmailSetting} from '@/parcels/settings/EmailSetting/EmailSetting.tsx';
import {LanguageSetting} from '@/parcels/settings/LanguageSetting/LanguageSetting.tsx';
import {PasswordSetting} from '@/parcels/settings/PasswordSetting/PasswordSetting.tsx';
import {ThemeSetting} from '@/parcels/settings/ThemeSetting/ThemeSetting.tsx';

export function SettingsOverview() {
  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Settings',
      },
    ],
  });

  const mtgLanguages = useMemo(() => {
    return [
      'en',
      'de',
      'fr',
      'it',
      'es',
      'pt',
      'el',
      'ar',
      'zhs',
      'zht',
      'he',
      'jp',
      'ko',
      'la',
      'ph',
      'ru',
      'sa',
      'qy',
    ];
  }, []);
  const pcgLanguages = useMemo(() => {
    return ['en', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'ru', 'pl', 'jp', 'ko', 'zht', 'zhs', 'cmn', 'yue', 'th', 'id'];
  }, []);
  const dlcLanguages = useMemo(() => {
    return ['en', 'de', 'fr', 'it'];
  }, []);

  return (
    <div>
      <title>{`Account Settings – Cardgourmet`}</title>
      {component}

      <Stack
        gap={'0'}
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 'var(--sticky-layer)',
          backgroundColor: 'var(--gourmet-neutral-0)',
        }}
        mb={'1rem'}
      >
        <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
          <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
            {title?.label}
          </GourmetText>
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <Stack gap={'2.5rem'}>
        <Stack>
          <GroupTitle text={'Allgemein'} />

          <Group>
            <GroupSettingTitle title={'Theme'} description={'Diese Einstellung gilt nur für diesen Browser.'} />

            <ThemeSetting />
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Account & Sicherheit'} />

          <Group align={'start'}>
            <GroupSettingTitle title={'Anzeigename'} description={'So wirst du auf Cardgourmet dargestellt.'} />

            <DisplayNameSetting />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group align={'start'}>
            <GroupSettingTitle title={'E-Mail-Adresse'} />

            <EmailSetting />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group align={'start'}>
            <GroupSettingTitle title={'Passwort'} />

            <PasswordSetting />
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Sprache'} />

          <Group>
            <GroupSettingTitle
              title={'Benachrichtigungen'}
              description={'Wir werden E-Mails an dich in dieser Sprache verschicken.'}
            />

            <LanguageSetting field={'global'} languages={['en', 'de']} />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Magic: The Gathering'}
              description={'Karten werden bevorzugt in dieser Sprache gesucht und dargestellt.'}
            />

            <LanguageSetting field={'mtg'} languages={mtgLanguages} />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Pokémon Card Game'}
              description={'Karten werden bevorzugt in dieser Sprache gesucht und dargestellt.'}
            />

            <LanguageSetting field={'pcg'} languages={pcgLanguages} />
          </Group>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} variant={'dashed'} />

          <Group>
            <GroupSettingTitle
              title={'Disney Lorcana'}
              description={'Karten werden bevorzugt in dieser Sprache gesucht und dargestellt.'}
            />

            <LanguageSetting field={'dlc'} languages={dlcLanguages} />
          </Group>
        </Stack>
        <Stack>
          <GroupTitle text={'Integrationen'} />
        </Stack>

        <GourmetText>{JSON.stringify(user)}</GourmetText>
      </Stack>
    </div>
  );
}

function GroupSettingTitle({ title, description }: { title: string; description?: string }) {
  return (
    <Stack w={'50%'} gap={'0rem'}>
      <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fw={500}>
        {title}
      </GourmetText>

      {description && (
        <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
          {description}
        </GourmetText>
      )}
    </Stack>
  );
}

function GroupTitle({ text }: { text: string }) {
  return (
    <Stack gap={'0.15rem'}>
      <GourmetText cgmff={'title'} fz={'h3'} fw={600}>
        {text}
      </GourmetText>
      <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
    </Stack>
  );
}
