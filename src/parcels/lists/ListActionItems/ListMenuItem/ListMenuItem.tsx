import { Group, Menu, Tooltip } from '@mantine/core';
import { IconLabelFilled, IconMinus, IconPlus } from '@tabler/icons-react';
import { type ReactElement, useMemo } from 'react';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.module.css';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { addResourcesToList, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { OptionalTcgProps } from '@/parcels/tcg/TcgProps.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export type ListMenuItemRessourceProps = {
  resourceId: string;
  type?: 'card' | 'search';
  raw?: boolean;
  onSuccess?: (res?: UserListResource) => void;
};

export function ListMenuItem({
  resourceId,
  listWithResources,
  disabled,
  action,
  type,
  tcg,
  raw,
  onSuccess,
  icon,
  buttonText,
}: {
  listWithResources: UserListWithResources;
  action: 'add' | 'remove';
  disabled?: boolean;
  icon?: ReactElement;
  buttonText?: string;
} & ListMenuItemRessourceProps &
  OptionalTcgProps) {
  const locationTcg = useTcgByLocation();
  const mustTcg = tcg ?? (locationTcg as Tcg);
  const { user } = useAuth();

  const { list, resources, size } = listWithResources;
  const listResourceIds = useMemo(() => {
    if (type === 'card') return resources?.card?.map((r) => r.listResource.resourceId) ?? [];
    return resources?.user_search?.map((r) => r.listResource.resourceId) ?? [];
  }, [resources, type]);
  const addToListCount = useMemo(() => {
    return !listResourceIds.includes(resourceId) ? 1 : 0;
  }, [listResourceIds, resourceId]);

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;

        if (action === 'add') {
          addResourcesToList(user?.id, list.id, mustTcg, [{ id: resourceId }], type, raw).then((res) => {
            if (res.error) {
              sendErrorNotification(res.error);
              return;
            }

            const data = res?.data;
            if (onSuccess && data) onSuccess(data[0]);
          });
          return;
        }
        if (action === 'remove') {
          removeResourcesFromList(user?.id, list.id, mustTcg, [resourceId], type).then((res) => {
            if (res.error) {
              sendErrorNotification(res.error);
              return;
            }

            if (onSuccess) onSuccess({ listId: list.id, resourceId: resourceId } as UserListResource);
          });
          return;
        }
      }}
      disabled={disabled}
      className={styles.menuItem}
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
