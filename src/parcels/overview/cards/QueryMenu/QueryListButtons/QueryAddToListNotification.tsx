import { Flex, Group, Stack } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function QueryAddToListNotification({
  list,
}: {
  tcg: Tcg;
  list: UserList;
  query: ExplainSearchQuery;
  language: string;
}) {
  const { t } = useTranslation('details', { keyPrefix: 'notifications.addToList' });

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Flex>
        <div
          style={{
            aspectRatio: '672 / 936',
            width: '4rem',
            flexShrink: 0,
          }}
        >
          {/*<Image src={imageSrc} style={{ borderRadius: '0.25rem' }} fallbackSrc={backupImageUrl} />*/}
        </div>
      </Flex>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
          {t('title', { name: list.name })}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>
          {t('weveAdded', { name: 'the query' })}{' '}
          <Link to={'/me/lists/$listId'} params={{ listId: slugify(list.name) }}>
            <Group gap={'0.25rem'} display={'inline-flex'}>
              <GourmetText cgmc={'neutral-9'} fz={'0.9rem'}>
                {t('goThere')}
              </GourmetText>
              <IconArrowRight size={16} color={'var(--gourmet-neutral-9)'} />
            </Group>
          </Link>
        </GourmetText>
      </Stack>
    </Group>
  );
}
