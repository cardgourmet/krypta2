import { Group, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function AddSavedSearchNotification() {
  const { t } = useTranslation('notifications', { keyPrefix: 'saved.added' });

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
          {t('title')}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>{t('text')} </GourmetText>
      </Stack>
    </Group>
  );
}
