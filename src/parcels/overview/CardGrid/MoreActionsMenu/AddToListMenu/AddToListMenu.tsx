import {Group, Menu} from '@mantine/core';
import {type UseDisclosureReturnValue, useMediaQuery} from '@mantine/hooks';
import {IconChevronRight, IconList, IconPlus} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {ListMenuItem} from '@/parcels/overview/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import styles from '@/parcels/overview/CardGrid/MoreActionsMenu/MoreActionsMenu.module.css';

export function AddToListMenu({ card, disclosure }: { card: TcgDataCard; disclosure: UseDisclosureReturnValue }) {
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

  const [_, { open }] = disclosure;

  return (
    <Menu
      opened={submenuOpened}
      onChange={setSubmenuOpened}
      width={200}
      trigger={'click-hover'}
      position={smallestScreen ? 'top' : 'right-start'}
      openDelay={120}
      closeDelay={150}
      classNames={{ dropdown: styles.menuDropdown }}
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
            if (lists.length >= 10) return;
            open();
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
