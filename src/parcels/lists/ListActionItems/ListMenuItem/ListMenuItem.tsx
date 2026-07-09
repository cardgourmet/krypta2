import { Group, Menu, type MenuItemProps, Tooltip } from '@mantine/core';
import { IconLabelFilled, IconMinus, IconPlus } from '@tabler/icons-react';
import { type ReactElement, useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.module.css';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { addResourcesToList, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { useCheckListLimits, useUserLimits } from '@/parcels/lists/useInList.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import type { OptionalTcgProps } from '@/parcels/tcg/TcgProps.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export type ListMenuItemResourceProps = {
  resourceId: string;
  type?: 'card' | 'user_search';
  raw?: boolean;
  onSuccess?: (res?: UserListResource) => void;
};

export type ListMenuItemProps = {
  resourceIds: string[];
  type: 'card' | 'user_search';
  action: 'add' | 'remove';
  listWithResources: UserListWithResources;

  icon?: ReactElement;
  buttonText?: string;
  raw?: boolean;
  onSuccess?: (res?: UserListResource[]) => void;
} & MenuItemProps &
  OptionalTcgProps;

export function ListMenuItem({
  resourceIds,
  tcg,
  listWithResources,
  type,
  action,
  icon,
  buttonText,
  raw,
  onSuccess,
  disabled,
  ...others
}: ListMenuItemProps) {
  const locationTcg = useTcgByLocation();
  const mustTcg = tcg ?? (locationTcg as Tcg);
  const { user } = useAuth();
  const { list_resources_per_list } = useUserLimits(user);

  const mustType = type === 'user_search' ? 'search' : type;

  const { list, resources, size } = listWithResources;
  const listResourceIds = useMemo(() => {
    return resources?.[type]?.map((r) => r.listResource.resourceId) ?? [];
  }, [resources, type]);
  const listActionCount = useMemo(() => {
    if (action === 'add') {
      return resourceIds.filter((id) => !listResourceIds.includes(id)).length;
    }
    return resourceIds.filter((id) => listResourceIds.includes(id)).length;
  }, [listResourceIds, action, resourceIds]);

  const checkListLimits = useCheckListLimits();
  const exceedsLimit = useMemo(() => {
    if (listActionCount === 0) return false;
    if (action === 'remove') return false;
    return !checkListLimits(listWithResources, listActionCount);
  }, [checkListLimits, listActionCount, listWithResources, action]);

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;
        if (!checkListLimits(listWithResources, listActionCount)) {
          return;
        }

        if (action === 'add') {
          const toAddRes = resourceIds.map((r) => ({ id: r }));

          addResourcesToList(user?.id, list.id, mustTcg, toAddRes, mustType, raw).then((res) => {
            if (res.error) {
              sendErrorNotification(res.error);
              return;
            }

            const data = res?.data;
            if (onSuccess) {
              onSuccess(data);
            }
          });
          return;
        }
        if (action === 'remove') {
          removeResourcesFromList(user?.id, list.id, mustTcg, resourceIds, mustType).then((res) => {
            if (res.error) {
              sendErrorNotification(res.error);
              return;
            }

            if (onSuccess) {
              onSuccess(
                resourceIds.map((resourceId) => ({ listId: list.id, resourceId: resourceId }) as UserListResource),
              );
            }
          });
          return;
        }
      }}
      className={styles.menuItem}
      disabled={disabled || exceedsLimit || listActionCount === 0}
      {...others}
    >
      <Group gap={'0.5rem'}>
        {icon && (
          <>
            <IconWithOverlayIcon
              icon={icon}
              overlayIcon={
                action === 'add' ? (
                  <IconPlus size={14} color={'var(--gourmet-green-1)'} />
                ) : (
                  <IconMinus size={14} color={'var(--gourmet-red-01)'} />
                )
              }
            />
            <GourmetText cgmff={'ui'}>{buttonText}</GourmetText>
          </>
        )}

        {!icon && (
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
                <GourmetText
                  cgmff={'monospace'}
                  c={listActionCount < 0 ? 'var(--gourmet-red-01)' : 'var(--gourmet-green-1)'}
                  fz={'0.9rem'}
                >
                  {listActionCount < 0 && `-${listActionCount}`}
                  {listActionCount >= 0 && `+${listActionCount}`}
                </GourmetText>

                <GourmetText cgmff={'monospace'} c={'var(--gourmet-neutral-5)'} fz={'0.9rem'}>
                  {size ?? '?'}/{list_resources_per_list}
                </GourmetText>
              </Group>
            )}
          </Group>
        )}
      </Group>
    </Menu.Item>
  );
}
