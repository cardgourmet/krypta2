import { Group, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { UserList } from '@/parcels/lists/types.ts';

export function ListUpdateNotification({ list }: { list: UserList }) {
  const { t } = useTranslation('notifications', { keyPrefix: 'lists.updated' });

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
          {t('title', { name: list.name })}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>{t('weveUpdated')} </GourmetText>
      </Stack>
    </Group>
  );
}
