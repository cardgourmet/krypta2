import { Group, Menu, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { type ReactElement, type Ref, use, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { addResourcesToList, type ListApiResource } from '@/parcels/lists/api.ts';
import { ListSingleMenuItem } from '@/parcels/lists/ListActionItems/ListSingleMenuItem/ListSingleMenuItem.tsx';
import type { UserList, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { useCheckUserLimits } from '@/parcels/lists/useInList.tsx';
import { ModalContext } from '@/parcels/modals/Modal.context.tsx';
import { ListCreateNotification } from '@/parcels/notification/list/ListCreateNotification.tsx';
import { ResourcesAddNotification } from '@/parcels/notification/list/ResourcesAddNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import styles from '@/parcels/selection/ListDetailsSelectionDisplay/ListDetailsSelectionButton.module.css';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type ListMultipleMenuProps = {
  actionableResources: ListApiResource[];
  action: 'add' | 'remove';
  activeListContext?: string;
  listContext?: string; // id of list
  withSystem?: boolean;

  dropdownProps?: {} & { ref?: Ref<HTMLDivElement> };

  target:
    | ReactElement
    | ((controls: { opened: boolean; toggle: () => void; close: () => void; open: () => void }) => ReactElement);
  onSuccess?: (res?: UserListResource[]) => void;
};

/**
 * This is used in menus as a button to open a submenu to add or remove
 * selected resources to any of the supported lists the user has.
 */
export function ListMultipleMenu({
  actionableResources,
  action,
  activeListContext,
  listContext,
  withSystem,
  target,
  onSuccess,
  dropdownProps,
}: ListMultipleMenuProps) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');

  const { requestModal } = use(ModalContext);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { activeLists, addResources, addLists } = useActiveLists(activeListContext ?? CONTEXT_LIST_MAIN);
  const actionableResourceIds = useMemo(() => {
    return actionableResources.map((res) => res.id);
  }, [actionableResources]);

  const targetTcgs = useMemo(() => {
    return [...new Set(actionableResources.map((res) => res.game as Tcg))];
  }, [actionableResources]);
  const targetLists = useMemo(() => {
    const lists = activeLists.filter((l) => {
      // if we view the current list, exclude it
      if (l.list.id === listContext) return false;

      // filter by tcg
      if ((l.list.allowedTcgs?.length ?? 0) === 0) return true;
      return targetTcgs.every((t) => l.list.allowedTcgs?.includes(t));
    });

    const filteredLists = lists.filter((l) => {
      if (withSystem) return true;
      return l.list.systemListType === undefined;
    });
    filteredLists.sort((a, b) => {
      const timeA = new Date(a.list.updatedAt).getTime();
      const timeB = new Date(b.list.updatedAt).getTime();

      return (timeA - timeB) * -1;
    });

    return filteredLists;
  }, [activeLists, targetTcgs, withSystem, listContext]);

  const { user } = useAuth();
  const { checkListCreateExceeded, checkListAddExceeded, generateExceededTooltip } = useCheckUserLimits();
  const checkCreateLimitExceeded = useMemo(() => {
    const checkCreate = checkListCreateExceeded(1);
    if (checkCreate) return checkCreate;
    const checkAdd = checkListAddExceeded({ size: 0 } as unknown as UserListWithResources, actionableResources.length);
    if (checkAdd) return checkAdd;

    return null;
  }, [checkListAddExceeded, checkListCreateExceeded, actionableResources.length]);

  const open = () => setSubmenuOpened(true);
  const close = () => setSubmenuOpened(false);
  const toggle = () => setSubmenuOpened((prev) => !prev);
  const mustTarget = typeof target === 'function' ? target({ opened: submenuOpened, toggle, close, open }) : target;

  return (
    <Menu
      opened={submenuOpened}
      onChange={setSubmenuOpened}
      trigger={'click-hover'}
      position={smallestScreen ? 'top' : 'right-start'}
      openDelay={120}
      closeDelay={150}
      withinPortal={false}
      classNames={{ dropdown: styles.menuDropdown }}
    >
      <Menu.Target>{mustTarget}</Menu.Target>

      <Menu.Dropdown
        ref={dropdownProps?.ref}
        style={{
          width: 'max-content',
          minWidth: 200,
          maxWidth: 320,
        }}
      >
        {targetLists.map((list) => {
          return (
            <ListSingleMenuItem
              actionableResources={actionableResources}
              key={list.list.id}
              listWithResources={list}
              action={action}
              onSuccess={onSuccess}
            />
          );
        })}

        {action === 'add' && (
          <>
            {activeLists.length > 0 && <Menu.Divider />}

            <Tooltip
              label={generateExceededTooltip(checkCreateLimitExceeded ?? undefined)}
              disabled={!checkCreateLimitExceeded}
              color={'var(--gourmet-red-01)'}
              withArrow
            >
              <Menu.Item
                disabled={!!checkCreateLimitExceeded}
                onClick={async () => {
                  if (checkCreateLimitExceeded) {
                    return;
                  }

                  try {
                    const createdList = await requestModal<UserList>('createList', { async: true });
                    if (!createdList) return;

                    const res = await addResourcesToList(user!.id, createdList.id, actionableResources);
                    if (res.error) {
                      addLists([{ list: createdList, size: 0 }]);

                      sendErrorNotification(res.error);
                      return;
                    }
                    if (!res.data) return;

                    sendNotification('success', <ListCreateNotification list={createdList} />);
                    sendNotification(
                      'success',
                      <ResourcesAddNotification
                        list={createdList}
                        resourceIds={actionableResourceIds}
                        language={'en'}
                      />,
                    );
                    addLists([{ list: createdList, size: res.data?.length ?? 0 }]);
                    addResources(res.data);
                  } catch {}
                }}
              >
                <Group gap={'0.5rem'}>
                  <IconPlus size={18} />
                  <GourmetText cgmff={'ui'}>{t('createNew')}</GourmetText>
                </Group>
              </Menu.Item>
            </Tooltip>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
