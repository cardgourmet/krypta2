import {ActionIcon, Divider, Group, Stack, Tooltip} from '@mantine/core';
import {IconBookmark, IconEdit, IconGlobe, IconLink, IconLock, IconStar, IconTrash, IconTrashOff,} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import styles from '@/parcels/lists/ListsOverview/ListsOverview.module.css';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export function ListElementHeader({ list }: { list: UserList }) {
  const { t } = useTranslation('lists');

  return (
    <Stack gap={'0.5rem'}>
      <Stack gap={'0.1rem'}>
        <Group justify={'space-between'} wrap={'nowrap'}>
          <Group gap={'0.5rem'} wrap={'nowrap'}>
            {list.systemListType === 'bookmarks' && <IconBookmark size={22} color={'var(--gourmet-neutral-9'} />}
            {list.systemListType === 'favorites' && <IconStar size={22} color={'var(--gourmet-neutral-9'} />}

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

            <VisibilityBadge visibility={list.visibility} />
          </Group>

          <Group gap={'0.25rem'}>
            <Tooltip label={'Edit List'} openDelay={500}>
              <ActionIcon className={styles.editButton}>
                <IconEdit color={'var(--gourmet-neutral-7'} size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={list.systemListType ? `This is a system list and can't be deleted` : 'Delete List'}
              openDelay={500}
            >
              <ActionIcon className={styles.editButton} disabled={list.systemListType !== undefined}>
                {list.systemListType && <IconTrashOff color={'var(--gourmet-neutral-5'} size={20} />}
                {!list.systemListType && <IconTrash color={'var(--gourmet-neutral-7'} size={20} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        {list.systemListType && <GourmetText cgmc={'neutral-6'}>{t(`system.${list.systemListType}-desc`)}</GourmetText>}
        {list.description && <GourmetText cgmc={'neutral-7'}>{list.description}</GourmetText>}
        {!list.systemListType && !list.description && <GourmetText cgmc={'neutral-4'}>No description set.</GourmetText>}
      </Stack>

      <Divider w={'100%'} color={'var(--gourmet-neutral-5)'} size={2} />
    </Stack>
  );
}

function VisibilityBadge({ visibility }: { visibility: 'private' | 'public' | undefined }) {
  return (
    <Group gap={'0.2rem'} className={styles.visibilityBadge} wrap={'nowrap'}>
      {visibility === 'private' && <IconLock size={18} color={'var(--gourmet-neutral-7'} />}
      {visibility === 'public' && <IconGlobe size={18} color={'var(--gourmet-neutral-7'} />}
      {visibility === undefined && <IconLink size={18} color={'var(--gourmet-neutral-7'} />}

      <GourmetText fz={'0.9rem'} c={'var(--gourmet-neutral-7'}>
        {visibility ? visibility : 'unlisted'}
      </GourmetText>
    </Group>
  );
}
