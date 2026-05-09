import {ActionIcon, Combobox, Group, Loader, Stack, UnstyledButton, useCombobox} from '@mantine/core';
import {IconCaretDownFilled, IconCheck, IconEdit, IconX} from '@tabler/icons-react';
import {startTransition, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {updateUserSettings} from '@/parcels/auth/api.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './LanguageSetting.module.css';

export function LanguageSetting({
  field,
  languages,
}: {
  field: 'global' | 'mtg' | 'dlc' | 'pcg';
  languages: string[];
}) {
  const { t } = useTranslation('auth', { keyPrefix: 'settings' });
  const { user, updateUser } = useAuth();
  const current = user?.settings?.preferredLanguages?.[field];

  const [language, setLanguage] = useState<string>(current as string);

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const combobox = useCombobox();
  const items = Object.fromEntries(languages.map((l) => [l, t(`languages.${l}`)]));
  const options = Object.entries(items).map(([key, value]) => (
    <Combobox.Option value={key} key={key}>
      <Group justify={'space-between'}>
        <Group>
          <GourmetText
            cgmff={'ui'}
            fw={key === language ? '600' : 'inherit'}
            cgmc={key === language ? 'neutral-9' : 'neutral-7'}
          >
            {value}
          </GourmetText>
        </Group>
        {key === language && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Stack>
      {!edit && (
        <Group>
          <GourmetText>{t(`languages.${language}`)}</GourmetText>

          {!loading && (
            <UnstyledButton
              onClick={() => {
                setEdit(true);
                setLanguage(current as string);
              }}
            >
              <Group gap={'0.5rem'}>
                <IconEdit size={18} color={'var(--gourmet-blue-1)'} />
                <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'}>
                  Bearbeiten
                </GourmetText>
              </Group>
            </UnstyledButton>
          )}
          {loading && <Loader size={18} />}
        </Group>
      )}

      {edit && (
        <Group>
          <Combobox
            onOptionSubmit={(optionValue) => {
              setLanguage(optionValue);
              combobox.closeDropdown();

              setEdit(false);
              setLoading(true);
              startTransition(async () => {
                const res = await updateUserSettings({
                  ...user?.settings,
                  preferredLanguages: {
                    ...user?.settings?.preferredLanguages,
                    [field]: optionValue,
                  },
                });

                setLoading(false);
                if (res.error) {
                  setError(res.error.key);
                  return;
                }

                if (res.data) updateUser(res.data);
                setLanguage(optionValue);
              });
            }}
            store={combobox}
          >
            <Combobox.Target>
              <UnstyledButton
                className={styles.dropdownButton}
                onClick={() => {
                  if (combobox.dropdownOpened) combobox.closeDropdown();
                  else combobox.openDropdown();
                }}
              >
                <Group justify={'space-between'}>
                  <GourmetText>{t(`languages.${language}`)}</GourmetText>
                  <IconCaretDownFilled size={18} />
                </Group>
              </UnstyledButton>
            </Combobox.Target>

            <Combobox.Dropdown miw={'10rem'}>
              <Combobox.Options mah={'24rem'} style={{ overflowY: 'auto' }}>
                {options}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <ActionIcon
            onClick={() => {
              setEdit(false);
            }}
            className={styles.closeButton}
          >
            <IconX size={18} />
          </ActionIcon>
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
