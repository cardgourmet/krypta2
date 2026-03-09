import {Group, Menu} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconBookmark, IconChevronRight, IconLabelFilled, IconLink, IconList, IconPlus, IconStar,} from '@tabler/icons-react';
import type {Dispatch, ReactElement, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {addCardResourcesToList} from '@/parcels/lists/api.ts';
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
  submenuOpened,
  setSubmenuOpened,
  target,
}: {
  card: TcgDataCard;
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  submenuOpened: boolean;
  setSubmenuOpened: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
}) {
  const tcg = useTcgByLocation();
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const lists = useUserLists();

  const systemLists = lists.lists.filter((l) => l.list.systemListType !== undefined);
  const nonSystemLists = lists.lists.filter((l) => l.list.systemListType === undefined);

  const existsInLists = lists.lists
    .filter((list) => {
      return list.resources?.card?.find((res) => res.listResource.resourceId === card.print.id);
    })
    .map((l) => l.list.id);

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
            <ListAddMenuItem
              key={list.list.id}
              card={card}
              listWithResources={list}
              disabled={existsInLists.includes(list.list.id)}
            />
          );
        })}

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
            <Menu.Item closeMenuOnClick={false} onClick={() => setSubmenuOpened((prev) => !prev)}>
              <Group justify={'space-between'}>
                <Group gap={'0.5rem'}>
                  <IconList size={18} />
                  <GourmetText cgmff={'ui'}>{t('add-to-list')}</GourmetText>
                </Group>
                <IconChevronRight size={18} />
              </Group>
            </Menu.Item>
          </Menu.Target>

          <Menu.Dropdown>
            {/* TODO: only display lists that the card can be added to? */}

            {nonSystemLists.map((list) => {
              return <ListAddMenuItem key={list.list.id} card={card} listWithResources={list} />;
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

        {existsInLists.length > 0 && <GourmetText>Remove from list ...</GourmetText>}

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

function ListAddMenuItem({
  card,
  listWithResources,
  disabled,
}: {
  card: TcgDataCard;
  listWithResources: UserListWithResources;
  disabled?: boolean;
}) {
  const tcg = useTcgByLocation() as Tcg;
  const { user } = useAuth();
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const { list } = listWithResources;

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;

        addCardResourcesToList(user?.id, list.id, tcg, [{ id: card.print.id }]).then((res) => {
          if (res.error) {
            console.error('error while adding resource to list', res.error);
            return;
          }

          console.log('success! added to list');
        });
      }}
      disabled={disabled}
    >
      <Group gap={'0.5rem'}>
        {list.systemListType === 'favorites' && (
          <>
            <IconStar size={18} />
            <GourmetText cgmff={'ui'}>{t('favorite')}</GourmetText>
          </>
        )}
        {list.systemListType === 'bookmarks' && (
          <>
            <IconBookmark size={18} />
            <GourmetText cgmff={'ui'}>{t('bookmark')}</GourmetText>
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
