import {Group, Menu} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconBookmark, IconChevronRight, IconLabelFilled, IconLink, IconList, IconMinus, IconPlus, IconStar,} from '@tabler/icons-react';
import {type Dispatch, type ReactElement, type SetStateAction, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {addCardResourcesToList, removeCardResourcesFromList} from '@/parcels/lists/api.ts';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
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

  const { lists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === card.print.id);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, card.print.id]);

  return (
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

        <AddToOtherListMenu card={card} />
        <RemoveFromOtherListMenu card={card} />

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
  );
}

function RemoveFromOtherListMenu({ card }: { card: TcgDataCard }) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { lists } = useUserLists();
  const { removableLists } = useMemo(() => {
    const nonSystemLists = lists.filter((l) => l.list.systemListType === undefined);
    const existsInLists = nonSystemLists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === card.print.id);
      })
      .map((l) => l.list.id);
    const removableLists = nonSystemLists.filter((list) => {
      return existsInLists.includes(list.list.id);
    });

    return { removableLists };
  }, [lists, card.print.id]);

  return (
    <>
      {removableLists.length > 0 && (
        <Menu
          opened={submenuOpened}
          onChange={setSubmenuOpened}
          width={200}
          trigger={'click-hover'}
          position={smallestScreen ? 'top' : 'right-start'}
          openDelay={120}
          closeDelay={150}
        >
          <Menu.Target>
            <Menu.Item
              closeMenuOnClick={false}
              onClick={() => setSubmenuOpened((prev) => !prev)}
              className={styles.menuItem}
            >
              <Group justify={'space-between'}>
                <Group gap={'0.5rem'}>
                  <IconWithOverlayIcon
                    icon={<IconList size={18} />}
                    overlayIcon={<IconMinus size={14} color={'var(--gourmet-red-01)'} />}
                  />
                  <GourmetText cgmff={'ui'}>{t('remove-from-list')}</GourmetText>
                </Group>
                <IconChevronRight size={18} />
              </Group>
            </Menu.Item>
          </Menu.Target>

          <Menu.Dropdown>
            {removableLists.map((list) => {
              return <ListMenuItem key={list.list.id} card={card} listWithResources={list} action={'remove'} />;
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}

function AddToOtherListMenu({ card }: { card: TcgDataCard }) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { lists } = useUserLists();
  const { nonSystemLists, existsInLists } = useMemo(() => {
    const nonSystemLists = lists.filter((l) => l.list.systemListType === undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === card.print.id);
      })
      .map((l) => l.list.id);

    return { nonSystemLists, existsInLists };
  }, [lists, card.print.id]);

  return (
    <Menu
      opened={submenuOpened}
      onChange={setSubmenuOpened}
      width={200}
      trigger={'click-hover'}
      position={smallestScreen ? 'top' : 'right-start'}
      openDelay={120}
      closeDelay={150}
    >
      <Menu.Target>
        <Menu.Item
          closeMenuOnClick={false}
          onClick={() => setSubmenuOpened((prev) => !prev)}
          className={styles.menuItem}
        >
          <Group justify={'space-between'}>
            <Group gap={'0.5rem'}>
              <IconWithOverlayIcon
                icon={<IconList size={18} />}
                overlayIcon={<IconPlus size={14} color={'var(--gourmet-green-1)'} />}
              />
              <GourmetText cgmff={'ui'}>{t('add-to-list')}</GourmetText>
            </Group>
            <IconChevronRight size={18} />
          </Group>
        </Menu.Item>
      </Menu.Target>

      <Menu.Dropdown>
        {nonSystemLists.map((list) => {
          return (
            <ListMenuItem
              key={list.list.id}
              card={card}
              listWithResources={list}
              action={'add'}
              disabled={existsInLists.includes(list.list.id)}
            />
          );
        })}
        {nonSystemLists.length === 0 && (
          <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
            No list found.
          </GourmetText>
        )}

        <Menu.Divider />

        <Menu.Item
          onClick={() => {
            // TODO: open modal to create new list (if we didn't hit the limit yet
          }}
        >
          <Group gap={'0.5rem'}>
            <IconPlus size={18} />
            <GourmetText cgmff={'ui'}>{t('create-new')}</GourmetText>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function ListMenuItem({
  card,
  listWithResources,
  disabled,
  action,
}: {
  card: TcgDataCard;
  listWithResources: UserListWithResources;
  action: 'add' | 'remove';
  disabled?: boolean;
}) {
  const tcg = useTcgByLocation() as Tcg;
  const { user } = useAuth();
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });

  const { refetchLists } = useUserLists();
  const { list } = listWithResources;

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;

        if (action === 'add') {
          addCardResourcesToList(user?.id, list.id, tcg, [{ id: card.print.id }]).then((res) => {
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
          removeCardResourcesFromList(user?.id, list.id, tcg, [card.print.id]).then((res) => {
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
          <>
            <GourmetText cgmff={'ui'}>{list.name}</GourmetText>
            {list.color && <IconLabelFilled size={18} color={list.color ?? 'var(--gourmet-neutral-9'} />}
          </>
        )}
      </Group>
    </Menu.Item>
  );
}
