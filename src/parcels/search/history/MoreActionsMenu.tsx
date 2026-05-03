import {Menu} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {type Dispatch, type PropsWithChildren, type ReactElement, type Ref, type SetStateAction, useMemo, useState,} from 'react';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {AddToListMenu} from '@/parcels/overview/cards/CardGrid/MoreActionsMenu/AddToListMenu/AddToListMenu.tsx';
import {ListMenuItem} from '@/parcels/overview/cards/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import styles from '@/parcels/overview/cards/CardGrid/MoreActionsMenu/MoreActionsMenu.module.css';
import {RemoveFromListMenu} from '@/parcels/overview/cards/CardGrid/MoreActionsMenu/RemoveFromListMenu/RemoveFromListMenu.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function MoreActionsMenu({
  tcg,
  resourceId,
  rawResourceId,
  menuOpened,
  setMenuOpened,
  target,
  onSearchSaved,
  onRemoveFromList,
  type,
  children,
  ref,
}: PropsWithChildren<
  {
    tcg: Tcg;
    resourceId?: string;
    rawResourceId: string;
    menuOpened?: boolean;
    setMenuOpened?: Dispatch<SetStateAction<boolean>>;
    target: ReactElement;
    onSearchSaved?: (id: string) => void;
    onRemoveFromList?: (listId: string) => void;
    type: 'card' | 'user_search';
  } & { ref?: Ref<HTMLDivElement> }
>) {
  const { lists, refetchLists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.[type]?.find((res) => res.listResource.resourceId === resourceId);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, resourceId, type]);
  const disclosure = useDisclosure(false);

  const [backupMenuOpened, setBackupMenuOpened] = useState(false);

  return (
    <>
      <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />

      <Menu
        width={260}
        position="top"
        opened={menuOpened ?? backupMenuOpened}
        onChange={setMenuOpened ?? setBackupMenuOpened}
        withArrow
        classNames={{ dropdown: styles.menuDropdown }}
      >
        <Menu.Target>{target}</Menu.Target>

        <Menu.Dropdown ref={ref}>
          {systemLists.map((list) => {
            return (
              <ListMenuItem
                key={list.list.id}
                ressourceId={resourceId ?? rawResourceId}
                raw={resourceId === undefined}
                listWithResources={list}
                action={existsInLists.includes(list.list.id) ? 'remove' : 'add'}
                type={'search'}
                tcg={tcg}
                onSuccess={(res) => {
                  if (res) {
                    if (onSearchSaved) onSearchSaved(res.resourceId);
                  }
                }}
              />
            );
          })}

          <AddToListMenu
            ref={ref}
            ressourceId={resourceId ?? rawResourceId}
            raw={resourceId === undefined}
            disclosure={disclosure}
            type={type === 'card' ? 'card' : 'search'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onSearchSaved) onSearchSaved(res.resourceId);
              }
            }}
          />
          <RemoveFromListMenu
            ref={ref}
            ressourceId={resourceId ?? rawResourceId}
            raw={resourceId === undefined}
            type={type === 'card' ? 'card' : 'search'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onRemoveFromList) onRemoveFromList(res.listId);
              }
            }}
          />

          {children}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
