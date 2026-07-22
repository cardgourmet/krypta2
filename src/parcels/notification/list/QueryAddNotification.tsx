import { Group, Stack } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { PossibleSearchResource } from '@/parcels/lists/api.ts';
import type { UserList } from '@/parcels/lists/types.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function QueryAddNotification({
  list,
}: {
  tcg: Tcg;
  list: UserList;
  query: PossibleSearchResource;
  language: string;
}) {
  const { user } = useAuth();
  const { t: t0 } = useTranslation('notifications', { keyPrefix: 'overview' });
  const { t } = useTranslation('notifications', { keyPrefix: 'details.addToList' });

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
          {t('title', { name: list.name })}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>{t('weveAdded', { name: t0('theQuery') })} </GourmetText>
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
