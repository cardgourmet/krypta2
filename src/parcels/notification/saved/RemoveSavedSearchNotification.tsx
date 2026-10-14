import { Group, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function RemoveSavedSearchNotification() {
  const { t } = useTranslation('notifications', { keyPrefix: 'saved.removed' });

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-red-01)'}>
          {t('title')}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>{t('text')} </GourmetText>
      </Stack>
    </Group>
  );
}
