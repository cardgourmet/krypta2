import { Group, Loader, Stack, Switch } from '@mantine/core';
import { startTransition, useState } from 'react';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { updateUserSettings } from '@/parcels/auth/api.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function SyncLanguageSetting() {
  // const { t } = useTranslation('auth', { keyPrefix: 'settings' });
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState<boolean>(user?.settings?.preferredLanguages?.syncLanguages ?? true);

  return (
    <Stack>
      <Group gap={'0.5rem'}>
        <Switch
          disabled={loading}
          checked={checked}
          onChange={(event) => {
            setError('');
            setLoading(true);
            setChecked(event.currentTarget.checked);

            startTransition(async () => {
              const res = await updateUserSettings({
                ...user?.settings,
                preferredLanguages: {
                  ...user?.settings?.preferredLanguages,
                  syncLanguages: event.currentTarget.checked,
                },
              });

              setLoading(false);
              if (res.error) {
                sendErrorNotification(res.error);
                return;
              }

              if (res.data) updateUser(res.data);
            });
          }}
        />
        {loading && <Loader size={18} />}
      </Group>

      {error && (
        <GourmetText c={'var(--gourmet-red-01)'} fz={'0.95rem'}>
          {error}
        </GourmetText>
      )}
    </Stack>
  );
}
