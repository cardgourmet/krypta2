import {Divider, Group, Stack} from '@mantine/core';
import {IconLabelFilled, IconLink, IconLock, IconStar, IconWorld} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useTranslation} from 'react-i18next';
import {DeleteListButton} from '@/parcels/lists/ListsOverview/ListRenderer/DeleteListButton/DeleteListButton.tsx';
import {EditListButton} from '@/parcels/lists/ListsOverview/ListRenderer/EditListButton/EditListButton.tsx';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './ListElementHeader.module.css';

export function ListElementHeader({
  list,
  onCreate,
  onDelete,
}: {
  list: UserList;
  onCreate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useTranslation('lists');

  return (
    <Stack gap={'0.5rem'}>
      <Stack gap={'0.1rem'}>
        <Group justify={'space-between'} wrap={'nowrap'}>
          <Group gap={'0.5rem'} wrap={'nowrap'}>
            {list.systemListType === 'favorites' && <IconStar size={22} color={'var(--gourmet-neutral-9'} />}

            <Link to={'/me/lists/$listId'} params={{ listId: list.slug }} className={styles.link}>
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

            <VisibilityBadge visibility={list.visibility} />

            <IconLabelFilled size={22} color={list.color ?? 'var(--gourmet-neutral-9'} />
          </Group>

          <Group gap={'0.25rem'}>
            <EditListButton list={list} onSuccess={onCreate} />
            <DeleteListButton list={list} onSuccess={onDelete} />
          </Group>
        </Group>
        {list.systemListType && <GourmetText cgmc={'neutral-6'}>{t(`system.${list.systemListType}-desc`)}</GourmetText>}
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

      <Divider w={'100%'} color={'var(--gourmet-neutral-4)'} size={2} />
    </Stack>
  );
}

function VisibilityBadge({ visibility }: { visibility: 'private' | 'public' | undefined }) {
  const { t } = useTranslation('lists');

  return (
    <Group gap={'0.2rem'} className={styles.visibilityBadge} wrap={'nowrap'}>
      {visibility === 'private' && <IconLock size={18} color={'var(--gourmet-neutral-7'} />}
      {visibility === 'public' && <IconWorld size={18} color={'var(--gourmet-neutral-7'} />}
      {visibility === undefined && <IconLink size={18} color={'var(--gourmet-neutral-7'} />}

      <GourmetText fz={'0.9rem'} c={'var(--gourmet-neutral-7'}>
        {visibility ? t(`visibility.${visibility}`) : t('unlisted')}
      </GourmetText>
    </Group>
  );
}
