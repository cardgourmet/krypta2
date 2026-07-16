import { Divider, Group, Stack } from '@mantine/core';
import { IconLabelFilled, IconStar } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { formatRelativeTimestamp } from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import { DeleteListButton } from '@/parcels/lists/ListsOverview/ListRenderer/DeleteListButton/DeleteListButton.tsx';
import { EditListButton } from '@/parcels/lists/ListsOverview/ListRenderer/EditListButton/EditListButton.tsx';
import { VisibilityBadge } from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { paramDefaults } from '@/routes/me/lists';

export function ListDetailsHeader({
  tcg,
  list,
  title,
  onUpdate,
  publicView,
}: {
  tcg?: Tcg;
  list: UserList;
  title: string;
  onUpdate: (list: UserList) => void;
  publicView?: boolean;
}) {
  const { t, i18n } = useTranslation('lists');
  const navigate = useNavigate();

  const { removeLists, updateLists } = useActiveLists();
  const { lists: localUserLists } = useUserLists();

  return (
    <Stack
      gap={'0'}
      style={{
        position: 'sticky',
        top: 'var(--navbar-height)',
        zIndex: 'var(--sticky-layer)',
        backgroundColor: 'var(--gourmet-neutral-0)',
      }}
      mb={'1rem'}
    >
      <Group justify={'space-between'} p={'0.5rem 0'} align={'stretch'}>
        <Stack gap={'0.25rem'}>
          <Group gap={'0.75rem'}>
            <Group gap={'0.25rem'}>
              {list.systemListType === 'favorites' && <IconStar size={24} />}
              <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
                {title}
              </GourmetText>
            </Group>
            <VisibilityBadge visibility={list?.visibility} />
            <IconLabelFilled color={list.color ?? 'var(--gourmet-neutral-9)'} />
          </Group>
          {list.description.length > 0 && (
            <GourmetText cgmff={'ui'} cgmc={'neutral-7'} fz={'1rem'}>
              {list.description}
            </GourmetText>
          )}
          {list.systemListType === 'favorites' && (
            <GourmetText cgmff={'ui'} cgmc={'neutral-7'} fz={'1rem'}>
              {t('overview.card.system.favoritesDesc')}
            </GourmetText>
          )}
          {list.systemListType !== 'favorites' && list.description.length === 0 && (
            <GourmetText cgmff={'ui'} cgmc={'neutral-5'} fz={'1rem'}>
              {t('overview.card.noDescription')}
            </GourmetText>
          )}
        </Stack>

        <Stack justify={'end'}>
          <Group gap={'1rem'}>
            <GourmetText cgmff={'ui'} cgmc={'neutral-7'} fz={'0.9rem'}>
              {t('overview.card.lastUpdated')}{' '}
              <span title={new Date(list.updatedAt).toLocaleString()}>
                {formatRelativeTimestamp(list.updatedAt, i18n.language)}
              </span>
            </GourmetText>

            {!publicView && (
              <Group gap={'0.25rem'}>
                <EditListButton
                  list={list}
                  onSuccess={(list) => {
                    updateLists([{ list: list }]);

                    onUpdate(list);
                  }}
                />
                <DeleteListButton
                  list={list}
                  onSuccess={(id) => {
                    const list = localUserLists.find((l) => l.list.id === id);
                    if (!list) return;

                    removeLists([list.list.id]);

                    // noinspection JSIgnoredPromiseFromCall
                    navigate({
                      to: '/me/lists',
                      search: {
                        ...paramDefaults,
                        tcg: tcg ?? 'all',
                      },
                    });
                  }}
                />
              </Group>
            )}
          </Group>
        </Stack>
      </Group>
      <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
    </Stack>
  );
}
