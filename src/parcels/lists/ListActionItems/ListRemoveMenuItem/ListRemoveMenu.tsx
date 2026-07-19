import { Group, Menu } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronRight, IconList, IconMinus } from '@tabler/icons-react';
import { type Ref, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.module.css';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {
  LegacyListMenuItem,
  type ListMenuItemResourceProps,
} from '@/parcels/lists/ListActionItems/ListMenuItem/LegacyListMenuItem.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import type { TcgProps } from '@/parcels/tcg/TcgProps.ts';

export function ListRemoveMenu(
  props: { existsInLists: UserListWithResources[] } & ListMenuItemResourceProps &
    TcgProps & { ref?: Ref<HTMLDivElement> },
) {
  const { existsInLists } = props;

  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const existsInListsIds = useMemo(() => {
    return existsInLists.map((l) => l.list.id);
  }, [existsInLists]);

  const removableLists = useMemo(() => {
    return existsInLists
      .filter((l) => l.list.systemListType !== 'favorites')
      .sort((a, b) => {
        const timeA = new Date(a.list.updatedAt).getTime();
        const timeB = new Date(b.list.updatedAt).getTime();

        return (timeA - timeB) * -1;
      });
  }, [existsInLists]);

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
                  <GourmetText cgmff={'ui'}>{t('removeFromList')}</GourmetText>
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
              return (
                <LegacyListMenuItem
                  resourceIds={[props.resourceId]}
                  type={props.type ?? 'card'}
                  raw={props.raw}
                  key={list.list.id}
                  listWithResources={list}
                  action={'remove'}
                  disabled={!existsInListsIds.includes(list.list.id)}
                  onSuccess={(res) => {
                    if (res && props.onSuccess) {
                      props.onSuccess(res[0]);
                    }
                  }}
                />
              );
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
}
