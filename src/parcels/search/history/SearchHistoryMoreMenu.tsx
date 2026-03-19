import {Menu} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {type Dispatch, type ReactElement, type SetStateAction, useMemo} from 'react';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {AddToListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/AddToListMenu/AddToListMenu.tsx';
import {ListMenuItem} from '@/parcels/overview/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import styles from '@/parcels/overview/CardGrid/MoreActionsMenu/MoreActionsMenu.module.css';
import {RemoveFromListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/RemoveFromListMenu/RemoveFromListMenu.tsx';
import type {UserSearchHistoryEntry} from '@/parcels/search/types.ts';
import type {Tcg} from "@/parcels/tcg/useTcgByLocation.ts";

export function SearchHistoryMoreMenu({
  tcg,
  search,
  menuOpened,
  setMenuOpened,
  target,
}: {
  tcg: Tcg;
  search: UserSearchHistoryEntry;
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
}) {
  const { lists, refetchLists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === search.savedSearch?.id);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, search.savedSearch?.id]);

  const disclosure = useDisclosure(false);

  return (
    <>
      <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />

      <Menu
        width={260}
        position="top"
        opened={menuOpened}
        onChange={setMenuOpened}
        withArrow
        classNames={{ dropdown: styles.menuDropdown }}
      >
        <Menu.Target>{target}</Menu.Target>

        <Menu.Dropdown>
          {systemLists.map((list) => {
            return (
              <ListMenuItem
                key={list.list.id}
                ressourceId={search.savedSearch?.id ?? ''}
                listWithResources={list}
                action={existsInLists.includes(list.list.id) ? 'remove' : 'add'}
                type={'search'}
                tcg={tcg}
              />
            );
          })}

          <AddToListMenu ressourceId={search.savedSearch?.id ?? ''} disclosure={disclosure} type={'search'} tcg={tcg} />
          <RemoveFromListMenu ressourceId={search.savedSearch?.id ?? ''} type={'search'} tcg={tcg} />
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
