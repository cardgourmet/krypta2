import {ActionIcon, Group, Loader, Stack, UnstyledButton} from '@mantine/core';
import {IconCheck, IconEdit, IconX} from '@tabler/icons-react';
import {startTransition, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {updateUserDisplayName} from '@/parcels/auth/api.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';
import styles from '@/routes/me/settings/index.module.css';

export function DisplayNameSetting() {
  const { t } = useTranslation('auth', { keyPrefix: 'settings' });
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName!);
  const [displayNameEdit, setDisplayNameEdit] = useState(false);
  const [displayNameLoading, setDisplayNameLoading] = useState(false);
  const [displayNameError, setDisplayNameError] = useState('');
  const displayNameEditRef = useRef<HTMLInputElement>(null);

  return (
    <Stack gap={'0.1rem'}>
      <Group>
        {!displayNameEdit && <GourmetText>{displayName}</GourmetText>}
        {displayNameEdit && (
          <GourmetTextInput
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            readOnly={!displayNameEdit}
            className={styles.inlineTextInput}
            ref={displayNameEditRef}
          />
        )}

        {!displayNameLoading && !displayNameEdit && (
          <UnstyledButton
            onClick={() => {
              setDisplayNameEdit(true);
              displayNameEditRef.current?.focus();
            }}
          >
            <Group gap={'0.5rem'}>
              <IconEdit size={18} color={'var(--gourmet-blue-1)'} />
              <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'}>
                {t('edit')}
              </GourmetText>
            </Group>
          </UnstyledButton>
        )}
        {displayNameLoading && <Loader size={18} />}
        {displayNameEdit && (
          <Group gap={'0.25rem'}>
            <ActionIcon
              onClick={() => {
                setDisplayNameEdit(false);
                setDisplayName(user?.displayName!);
              }}
              className={styles.closeButton}
            >
              <IconX size={18} />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setDisplayNameEdit(false);
                setDisplayNameError('');

                if (displayName === user?.displayName) return;
                setDisplayNameLoading(true);

                startTransition(async () => {
                  const d = await updateUserDisplayName(displayName);

                  setDisplayNameLoading(false);
                  if (d.error || !d.data) {
                    setDisplayName(user?.displayName!);
                    setDisplayNameError(d.error?.key ?? 'unknown');
                    return;
                  }

                  setDisplayName(d.data.displayName);
                });
              }}
              className={styles.checkButton}
            >
              <IconCheck size={18} />
            </ActionIcon>
          </Group>
        )}
      </Group>
      {displayNameError && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {displayNameError}
        </GourmetText>
      )}
    </Stack>
  );
}
