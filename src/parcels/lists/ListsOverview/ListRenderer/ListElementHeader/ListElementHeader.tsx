import { Group, Stack, Tooltip } from '@mantine/core';
import { IconLabelFilled, IconLock, IconStar, IconWorld } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Route } from '@/routes/me/lists';
import styles from './ListElementHeader.module.css';

export function ListElementHeader({ list }: { list: UserList }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.card' });
  const { user } = useAuth();

  const search = Route.useSearch();
  const { tcg } = search;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const listTcg = useMemo(() => {
    let t = tcg;
    if (list.allowedTcgs?.length === 1) {
      t = list.allowedTcgs[0] as Tcg;
    }
    if (t === 'all') {
      return undefined;
    }
    return t;
  }, []);

  return (
    <Stack id={`list-${list.id}`} gap={'0.5rem'}>
      <Stack gap={'0.1rem'}>
        <Group justify={'space-between'} wrap={'nowrap'}>
          <Group gap={'0.5rem'} wrap={'nowrap'} style={{ minWidth: 0, flex: 1 }}>
            {list.systemListType === 'favorites' && <IconStar size={22} color={'var(--gourmet-neutral-9'} />}

            <Link
              to={'/@{$user}/lists/$listId'}
              params={{ user: user!.username, listId: list.slug }}
              search={{ tcg: listTcg }}
              className={styles.link}
              preload={false}
              style={{ flexShrink: 1 }}
            >
              <GourmetText
                cgmff={'ui'}
                cgmc={'neutral-9'}
                fw={400}
                fz={'1.5rem'}
                maw={'22rem'}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textWrap: 'nowrap',
                }}
              >
                {list.systemListType && t(`system.${list.name}`)}
                {!list.systemListType && <>{list.name}</>}
              </GourmetText>
            </Link>

            <VisibilityBadge visibility={list.visibility} withoutText />

            <IconLabelFilled size={22} color={list.color ?? 'var(--gourmet-neutral-9'} style={{ flexShrink: 0 }} />
          </Group>
        </Group>
        {list.systemListType && <GourmetText cgmc={'neutral-6'}>{t(`system.${list.systemListType}Desc`)}</GourmetText>}
        {list.description && (
          <GourmetText
            cgmc={'neutral-7'}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textWrap: 'nowrap',
            }}
          >
            {list.description}
          </GourmetText>
        )}
        {!list.systemListType && !list.description && (
          <GourmetText cgmc={'neutral-4'}>{t('noDescription')}</GourmetText>
        )}
      </Stack>
    </Stack>
  );
}

export function VisibilityBadge({
  visibility,
  withoutText,
}: {
  visibility: 'private' | 'public' | undefined;
  withoutText?: boolean;
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.card' });

  return (
    <Tooltip label={t(`visibility.${visibility}`)} openDelay={500}>
      <Group gap={'0.2rem'} className={styles.visibilityBadge} wrap={'nowrap'}>
        {(visibility === 'private' || visibility === undefined) && (
          <IconLock size={18} color={'var(--gourmet-neutral-7'} />
        )}
        {visibility === 'public' && <IconWorld size={18} color={'var(--gourmet-neutral-7'} />}

        {!withoutText && (
          <GourmetText fz={'0.9rem'} c={'var(--gourmet-neutral-7'}>
            {visibility ? t(`visibility.${visibility}`) : t('visibility.private')}
          </GourmetText>
        )}
      </Group>
    </Tooltip>
  );
}
