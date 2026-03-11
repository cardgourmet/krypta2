import {Group, Menu} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconLink} from '@tabler/icons-react';
import {type Dispatch, type ReactElement, type SetStateAction, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {AddToListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/AddToListMenu/AddToListMenu.tsx';
import {ListMenuItem} from '@/parcels/overview/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import {RemoveFromListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/RemoveFromListMenu/RemoveFromListMenu.tsx';
import {slugify} from '@/parcels/slugify.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './MoreActionsMenu.module.css';

export function MoreActionsMenu({
  card,
  menuOpened,
  setMenuOpened,
  target,
}: {
  card: TcgDataCard;
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
}) {
  const tcg = useTcgByLocation();
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });

  const { lists, refetchLists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === card.print.id);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, card.print.id]);

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
                card={card}
                listWithResources={list}
                action={existsInLists.includes(list.list.id) ? 'remove' : 'add'}
              />
            );
          })}

          <AddToListMenu card={card} disclosure={disclosure} />
          <RemoveFromListMenu card={card} />

          <Menu.Divider />

          <Menu.Item
            onClick={() => {
              const set = card.print.setCode?.toLowerCase() as string;
              const cn = card.print.collectorNumber.toLowerCase();

              // noinspection JSIgnoredPromiseFromCall
              navigator.clipboard
                .writeText(`${window.location.origin}/${tcg as Tcg}/sets/${set}/${cn}/${slugify(card.name)}`)
                .then(() => {
                  // TODO: event handler to show popup on card that it was successful
                });
            }}
          >
            <Group gap={'0.5rem'}>
              <IconLink size={18} />
              <GourmetText cgmff={'ui'}>{t('copy-print')}</GourmetText>
            </Group>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
