import {Group, Menu, Tooltip} from '@mantine/core';
import {IconBookmark, IconLabelFilled, IconMinus, IconPlus, IconStar} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {addResourcesToList, removeResourcesFromList} from '@/parcels/lists/api.ts';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from '@/parcels/overview/CardGrid/MoreActionsMenu/MoreActionsMenu.module.css';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';

export function ListMenuItem({
  ressourceId,
  listWithResources,
  disabled,
  action,
  type,
  tcg,
}: {
  ressourceId: string;
  listWithResources: UserListWithResources;
  action: 'add' | 'remove';
  disabled?: boolean;
  type?: 'card' | 'search';
  tcg?: Tcg;
}) {
  const locationTcg = useTcgByLocation();
  const mustTcg = tcg ?? (locationTcg as Tcg);
  const { user } = useAuth();
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });

  const { refetchLists } = useUserLists();
  const { list, resources, size } = listWithResources;
  const listResourceIds = useMemo(() => {
    if (type === 'card') return resources?.card?.map((r) => r.listResource.resourceId) ?? [];
    return resources?.user_search?.map((r) => r.listResource.resourceId) ?? [];
  }, [resources, type]);
  const addToListCount = useMemo(() => {
    return !listResourceIds.includes(ressourceId) ? 1 : 0;
  }, [listResourceIds, ressourceId]);

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;

        if (action === 'add') {
          addResourcesToList(user?.id, list.id, mustTcg, [{ id: ressourceId }], type).then((res) => {
            if (res.error) {
              console.error('error while adding resource to list', res.error);
              return;
            }

            console.log('success! added to list');
            refetchLists();
          });
          return;
        }
        if (action === 'remove') {
          removeResourcesFromList(user?.id, list.id, mustTcg, [ressourceId], type).then((res) => {
            if (res.error) {
              console.error('error while removing resource to list', res.error);
              return;
            }

            console.log('success! removed to list');
            refetchLists();
          });
          return;
        }
      }}
      disabled={disabled}
      className={styles.menuItem}
    >
      <Group gap={'0.5rem'}>
        {list.systemListType === 'favorites' && (
          <>
            <IconWithOverlayIcon
              icon={<IconStar size={18} />}
              overlayIcon={
                action === 'add' ? (
                  <IconPlus size={14} color={'var(--gourmet-green-1)'} />
                ) : (
                  <IconMinus size={14} color={'var(--gourmet-red-01)'} />
                )
              }
            />
            <GourmetText cgmff={'ui'}>{t(`favorite${action === 'remove' ? '-remove' : ''}`)}</GourmetText>
          </>
        )}
        {list.systemListType === 'bookmarks' && (
          <>
            <IconWithOverlayIcon
              icon={<IconBookmark size={18} />}
              overlayIcon={
                action === 'add' ? (
                  <IconPlus size={14} color={'var(--gourmet-green-1)'} />
                ) : (
                  <IconMinus size={14} color={'var(--gourmet-red-01)'} />
                )
              }
            />
            <GourmetText cgmff={'ui'}>{t(`bookmark${action === 'remove' ? '-remove' : ''}`)}</GourmetText>
          </>
        )}

        {list.systemListType === undefined && (
          <Group justify={'space-between'} w={'100%'} wrap={'nowrap'}>
            <Group gap={'0.25rem'} wrap={'nowrap'}>
              <Tooltip label={list.name} openDelay={500}>
                <GourmetText
                  cgmff={'ui'}
                  maw={'10rem'}
                  style={{
                    textWrap: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {list.name}
                </GourmetText>
              </Tooltip>
              {list.color && <IconLabelFilled size={18} color={list.color ?? 'var(--gourmet-neutral-9'} />}
            </Group>

            {action === 'add' && (
              <Group gap={'0.5rem'} wrap={'nowrap'}>
                <GourmetText cgmff={'monospace'} c={'var(--gourmet-green-1)'} fz={'0.9rem'}>
                  +{addToListCount}
                </GourmetText>

                <GourmetText cgmff={'monospace'} c={'var(--gourmet-neutral-5)'} fz={'0.9rem'}>
                  {size ?? '?'}/100
                </GourmetText>
              </Group>
            )}
          </Group>
        )}
      </Group>
    </Menu.Item>
  );
}
