import {Group, Menu, Tooltip} from '@mantine/core';
import {IconLabelFilled, IconMinus, IconPlus, IconStar} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {addResourcesToList} from '@/parcels/lists/api.ts';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';
import {useTcgOverviewWorkContext} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkContext.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ListMenuItem2.module.css';

export function ListMenuItem2({
  listWithResources,
  action,
}: {
  listWithResources: UserListWithResources;
  action: 'add' | 'remove';
}) {
  const tcg = useTcgByLocation() as Tcg;
  const { user } = useAuth();
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });

  const workContext = useTcgOverviewWorkContext();
  const selectedPrintIds = workContext?.data?.selection?.elementIds ?? [];

  const { refetchLists } = useUserLists();
  const { list, resources, size } = listWithResources;
  const listResourceIds = useMemo(() => {
    return resources?.card?.map((r) => r.listResource.resourceId) ?? [];
  }, [resources]);
  const addToListCount = useMemo(() => {
    return selectedPrintIds.filter((id) => !listResourceIds.includes(id)).length;
  }, [listResourceIds, selectedPrintIds]);
  const noti = useGourmetNotification();

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;
        if ((size ?? 0) + addToListCount > 100) return;

        addResourcesToList(user?.id, list.id, tcg, [
          ...selectedPrintIds.map((id) => {
            return { id: id };
          }),
        ]).then((res) => {
          if (res.error) {
            noti.show('Unknown error', `${res.error}`, 'error');
            return;
          }

          console.log('success! added to list');
          refetchLists();
        });
        return;
      }}
      disabled={addToListCount === 0}
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
            <GourmetText cgmff={'ui'}>{t(`favorite`, { count: addToListCount })}</GourmetText>
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

            <Group gap={'0.5rem'} wrap={'nowrap'}>
              <GourmetText cgmff={'monospace'} c={'var(--gourmet-green-1)'} fz={'0.9rem'}>
                +{addToListCount}
              </GourmetText>

              <GourmetText cgmff={'monospace'} c={'var(--gourmet-neutral-5)'} fz={'0.9rem'}>
                {size ?? '?'}/100
              </GourmetText>
            </Group>
          </Group>
        )}
      </Group>
    </Menu.Item>
  );
}
