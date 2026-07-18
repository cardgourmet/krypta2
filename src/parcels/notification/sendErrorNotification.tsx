import { Group, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { GourmetError } from '@/parcels/api/handleApiCall.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function sendErrorNotification(error: GourmetError) {
  notifications.show({
    autoClose: 5_000,
    color: 'var(--gourmet-red-01)',
    message: (
      <Group wrap={'nowrap'} align={'stretch'}>
        <Stack justify={'start'} gap={'0.25rem'}>
          <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-red-01)'}>
            Unexpected Error
          </GourmetText>
          <GourmetText fz={'0.9rem'}>
            An unexpected error has occured, please try again later and report it to us if it happens again.
          </GourmetText>
          <GourmetText fz={'0.9rem'}>
            Code: <code>{error.key}</code>
          </GourmetText>
        </Stack>
      </Group>
    ),
  });
}
