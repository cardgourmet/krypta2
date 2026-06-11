import { Flex, Group, Image, Stack } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import { backupImageUrl } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function RemoveFromListNotification({
  tcg,
  list,
  card,
  language,
}: {
  tcg: Tcg;
  list: UserList;
  card: TcgDataCard;
  language: string;
}) {
  const { t } = useTranslation('details', { keyPrefix: 'notifications.removeFromList' });

  const imageSrc = useMemo(() => {
    if (tcg === 'mtg') {
      card = card as MtgDataCard;

      return (
        card.print.faces[0]?.translations?.[language]?.imageUrls?.thumbnail
        ?? card.print.faces[0]?.translations?.[language]?.imageUrls?.full
      );
    }
    card = card as Exclude<TcgDataCard, MtgDataCard>;

    return (
      card.print.translations?.[language]?.imageUrls?.thumbnail ?? card.print.translations?.[language]?.imageUrls?.full
    );
  }, [card, tcg, language]);

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
          <Image src={imageSrc} style={{ borderRadius: '0.25rem' }} fallbackSrc={backupImageUrl} />
        </div>
      </Flex>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-red-01)'}>
          {t('title', { name: list.name })}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>
          {t('weveRemoved', { name: card.name })}{' '}
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
