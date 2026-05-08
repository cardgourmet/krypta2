import {ActionIcon, Combobox, Group, Loader, Stack, UnstyledButton, useCombobox} from '@mantine/core';
import {IconCheck, IconEdit, IconX} from '@tabler/icons-react';
import {startTransition, useState} from 'react';
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
  const { user } = useAuth();
  const current = user?.settings?.preferredLanguages?.[field];

  const [language, setLanguage] = useState<string>(current as string);

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const combobox = useCombobox();
  const items = Object.fromEntries(languages.map((l) => [l, l.toUpperCase()]));
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
          <GourmetText>{current}</GourmetText>

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

              setLoading(true);
              startTransition(async () => {
                const res = await updateUserSettings({
                  ...user?.settings,
                  preferredLanguages: {
                    ...user?.settings?.preferredLanguages,
                    [field]: optionValue,
                  },
                });

                setEdit(false);
                setLoading(false);
                if (res.error) {
                  setError(res.error.key);
                  return;
                }
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
                <GourmetText>{language}</GourmetText>
              </UnstyledButton>
            </Combobox.Target>

            <Combobox.Dropdown miw={'10rem'}>
              <Combobox.Options>{options}</Combobox.Options>
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
