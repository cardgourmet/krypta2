import { Group, Stack } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function QueryRemoveFromListNotification({
  list,
}: {
  tcg: Tcg;
  list: UserList;
  query: ExplainSearchQuery;
  language: string;
}) {
  const { t: t0 } = useTranslation('details', { keyPrefix: 'notifications' });
  const { t } = useTranslation('details', { keyPrefix: 'notifications.removeFromList' });
  const { user } = useAuth();

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-red-01)'}>
          {t('title', { name: list.name })}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>{t('weveRemoved', { name: t0('theQuery') })} </GourmetText>
        <Link to={'/@{$user}/lists/$listId'} params={{ user: user!.username, listId: slugify(list.name) }}>
          <Group gap={'0.25rem'} display={'inline-flex'}>
            <GourmetText cgmc={'neutral-9'} fz={'0.9rem'}>
              {t('goThere')}
            </GourmetText>
            <IconArrowRight size={16} color={'var(--gourmet-neutral-9)'} />
          </Group>
        </Link>
      </Stack>
    </Group>
  );
}
