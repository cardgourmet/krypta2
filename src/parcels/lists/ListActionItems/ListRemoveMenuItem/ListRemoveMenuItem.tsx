import {Group, Menu} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconChevronRight, IconList, IconMinus} from '@tabler/icons-react';
import {type Ref, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.module.css';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {ListMenuItem, type ListMenuItemRessourceProps} from '@/parcels/lists/ListActionItems/ListMenuItem/ListMenuItem.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import type {TcgProps} from '@/parcels/tcg/TcgProps.ts';

export function ListRemoveMenuItem(props: ListMenuItemRessourceProps & TcgProps & { ref?: Ref<HTMLDivElement> }) {
  const { ressourceId, type } = props;

  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { lists } = useUserLists();
  const { removableLists } = useMemo(() => {
    const nonSystemLists = lists.filter((l) => l.list.systemListType === undefined);
    const existsInLists = nonSystemLists
      .filter((list) => {
        if (type === 'card') return list.resources?.card?.find((res) => res.listResource.resourceId === ressourceId);
        return list.resources?.user_search?.find((res) => res.listResource.resourceId === ressourceId);
      })
      .map((l) => l.list.id);
    const removableLists = nonSystemLists.filter((list) => {
      return existsInLists.includes(list.list.id);
    });

    return { removableLists };
  }, [lists, ressourceId, type]);

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
          withinPortal={false}
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
                    overlayIcon={<IconMinus size={14} color={'var(--gourmet-red-01)'} />}
                  />
                  <GourmetText cgmff={'ui'}>{t('remove-from-list')}</GourmetText>
                </Group>
                <IconChevronRight size={18} />
              </Group>
            </Menu.Item>
          </Menu.Target>

          <Menu.Dropdown
            ref={props.ref}
            style={{
              width: 'max-content',
              minWidth: 200,
              maxWidth: 320,
            }}
          >
            {removableLists.map((list) => {
              return <ListMenuItem key={list.list.id} listWithResources={list} action={'remove'} {...props} />;
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}
