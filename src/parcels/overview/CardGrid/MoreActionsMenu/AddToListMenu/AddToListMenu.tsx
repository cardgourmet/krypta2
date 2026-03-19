import { Group, Menu } from '@mantine/core';
import { type UseDisclosureReturnValue, useMediaQuery } from '@mantine/hooks';
import { IconChevronRight, IconList, IconPlus } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { GourmetText } from '@/parcels/mantine/GourmetText.tsx';
import { ListMenuItem } from '@/parcels/overview/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import styles from '@/parcels/overview/CardGrid/MoreActionsMenu/MoreActionsMenu.module.css';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function AddToListMenu({
  tcg,
  ressourceId,
  disclosure,
  type,
}: {
  tcg: Tcg;
  ressourceId: string;
  disclosure: UseDisclosureReturnValue;
  type?: 'card' | 'search';
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { lists } = useUserLists();
  const { nonSystemLists, existsInLists } = useMemo(() => {
    const nonSystemLists = lists.filter((l) => l.list.systemListType === undefined);
    const existsInLists = lists
      .filter((list) => {
        if (type === 'card') return list.resources?.card?.find((res) => res.listResource.resourceId === ressourceId);
        return list.resources?.user_search?.find((res) => res.listResource.resourceId === ressourceId);
      })
      .map((l) => l.list.id);

    return { nonSystemLists, existsInLists };
  }, [lists, ressourceId, type]);

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

      <Menu.Dropdown
        style={{
          width: 'max-content',
          minWidth: 200,
          maxWidth: 320,
        }}
      >
        {nonSystemLists.map((list) => {
          return (
            <ListMenuItem
              key={list.list.id}
              ressourceId={ressourceId}
              listWithResources={list}
              action={'add'}
              disabled={existsInLists.includes(list.list.id)}
              type={type}
              tcg={tcg}
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
