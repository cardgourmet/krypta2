import { Group, Menu, type MenuItemProps, Tooltip } from '@mantine/core';
import { IconLabelFilled, IconMinus, IconPlus } from '@tabler/icons-react';
import { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.module.css';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { addResourcesToList, type ListApiResource, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { useCheckListLimits, useCheckUserLimits, useUserLimits } from '@/parcels/lists/useInList.tsx';
import { sendListActionNotification } from '@/parcels/notification/list/sendListActionNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';

export type ListSingleMenuItemProps = {
  listWithResources: UserListWithResources;
  actionableResources: ListApiResource[];
  action: 'add' | 'remove';

  icon?: ReactElement;
  buttonText?: string;
  onSuccess?: (res?: UserListResource[]) => void;
  listContext?: {
    key: string;
    sync?: boolean;
  };
} & MenuItemProps;

/**
 * This is used in menus as a single button to add or remove a selection of resources
 * to one specific list.
 */
export function ListSingleMenuItem({
  listWithResources,
  actionableResources,
  action,
  icon,
  buttonText,
  onSuccess,
  disabled,
  listContext,
  ...others
}: ListSingleMenuItemProps) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const { user } = useAuth();

  const { generateExceededTooltip, checkListAddExceeded } = useCheckUserLimits();
  const { list_resources_per_list } = useUserLimits(user);
  const { addResources, removeResources } = useActiveLists(listContext?.key ?? CONTEXT_LIST_MAIN);

  const resourceIds = useMemo(() => {
    return actionableResources.map((res) => res.id);
  }, [actionableResources]);
  const { list, resources, size } = listWithResources;
  const listResourceIds = useMemo(() => {
    return new Set(Object.values(resources ?? {}).flatMap((res) => res.map((r) => r.listResource.resourceId)));
  }, [resources]);
  const listActionCount = useMemo(() => {
    if (action === 'add') {
      return resourceIds.filter((id) => !listResourceIds.has(id)).length;
    }
    return resourceIds.filter((id) => listResourceIds.has(id)).length;
  }, [listResourceIds, action, resourceIds]);

  const checkListLimits = useCheckListLimits();
  const exceedsLimit = useMemo(() => {
    if (listActionCount === 0) return null;
    if (action === 'remove') return null;
    return checkListAddExceeded(listWithResources, listActionCount);
  }, [listActionCount, listWithResources, action, checkListAddExceeded]);
  const isDisabled = disabled || !!exceedsLimit || listActionCount === 0;

  return (
    <Tooltip
      label={
        exceedsLimit
          ? generateExceededTooltip(exceedsLimit ?? undefined)
          : action === 'add'
            ? t('nothingAdd')
            : t('nothingRemove')
      }
      disabled={!isDisabled}
      color={'var(--gourmet-red-01)'}
      withArrow
    >
      <Menu.Item
        onClick={() => {
          if (!user?.id) return;
          if (action === 'add' && !checkListLimits(listWithResources, listActionCount)) {
            console.log('attemtping to remove 1.5', resourceIds);
            return;
          }

          if (action === 'add') {
            addResourcesToList(user?.id, list.id, actionableResources).then((res) => {
              if (res.error) {
                sendErrorNotification(res.error);
                return;
              }

              const data = res?.data;

              if (data) {
                addResources(data, listContext?.sync);

                sendListActionNotification(list, 'add', {
                  resources: data,
                  resolved: Object.fromEntries(actionableResources.map((a) => [a.id, a.resolved])),
                });
              }

              if (onSuccess) {
                onSuccess(data);
              }
            });
            return;
          }
          if (action === 'remove') {
            removeResourcesFromList(user?.id, list.id, resourceIds).then((res) => {
              if (res.error) {
                sendErrorNotification(res.error);
                return;
              }

              removeResources(resourceIds, [list.id]);

              const resources = actionableResources.map(
                (res) => ({ listId: list.id, resourceId: res.id, resourceType: res.resourceType }) as UserListResource,
              );
              sendListActionNotification(list, 'remove', {
                resources: resources,
                resolved: Object.fromEntries(actionableResources.map((a) => [a.id, a.resolved])),
              });

              if (onSuccess) {
                onSuccess(resources);
              }
            });
            return;
          }
        }}
        className={styles.menuItem}
        disabled={isDisabled}
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

              <Group gap={'0.5rem'} wrap={'nowrap'}>
                <GourmetText
                  cgmff={'monospace'}
                  c={action === 'remove' ? 'var(--gourmet-red-01)' : 'var(--gourmet-green-1)'}
                  fz={'0.9rem'}
                >
                  {action === 'remove' && `-${listActionCount}`}
                  {action === 'add' && `+${listActionCount}`}
                </GourmetText>

                <GourmetText cgmff={'monospace'} c={'var(--gourmet-neutral-5)'} fz={'0.9rem'}>
                  {size ?? '?'}/{list_resources_per_list}
                </GourmetText>
              </Group>
            </Group>
          )}
        </Group>
      </Menu.Item>
    </Tooltip>
  );
}
