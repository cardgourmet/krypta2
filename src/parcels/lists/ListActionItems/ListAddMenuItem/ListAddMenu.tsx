import { Group, Menu } from '@mantine/core';
import { type UseDisclosureReturnValue, useMediaQuery } from '@mantine/hooks';
import { IconChevronRight, IconList, IconPlus } from '@tabler/icons-react';
import { type Ref, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import styles from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.module.css';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {
  ListMenuItem,
  type ListMenuItemResourceProps,
} from '@/parcels/lists/ListActionItems/ListMenuItem/ListMenuItem.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { useUserLimits } from '@/parcels/lists/useInList.tsx';
import type { TcgProps } from '@/parcels/tcg/TcgProps.ts';

export function ListAddMenu(
  props: {
    disclosure: UseDisclosureReturnValue;
    buttonText?: string;
    existsInLists: UserListWithResources[];
    activeListContext: string;
  } & ListMenuItemResourceProps &
    TcgProps & { ref?: Ref<HTMLDivElement> },
) {
  const { disclosure, existsInLists, activeListContext } = props;
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { activeLists } = useActiveLists(activeListContext ?? CONTEXT_LIST_MAIN);
  const existsInListsIds = useMemo(() => {
    return existsInLists.map((l) => l.list.id);
  }, [existsInLists]);

  const nonSystemLists = useMemo(() => {
    const nonSystemLists = activeLists.filter((l) => {
      if (l.list.systemListType !== undefined) return false;

      // filter by tcg
      if ((l.list.allowedTcgs?.length ?? 0) === 0) return true;
      return l.list.allowedTcgs?.includes(props.tcg);
    });
    nonSystemLists.sort((a, b) => {
      const timeA = new Date(a.list.updatedAt).getTime();
      const timeB = new Date(b.list.updatedAt).getTime();

      return (timeA - timeB) * -1;
    });

    return nonSystemLists;
  }, [activeLists, props.tcg]);

  const [_, { open }] = disclosure;

  const { user } = useAuth();
  const { lists } = useUserLimits(user);

  return (
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
                overlayIcon={<IconPlus size={14} color={'var(--gourmet-green-1)'} />}
              />
              <GourmetText cgmff={'ui'}>{props.buttonText}</GourmetText>
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
        {nonSystemLists.map((list) => {
          return (
            <ListMenuItem
              resourceIds={[props.resourceId]}
              type={props.type ?? 'card'}
              raw={props.raw}
              key={list.list.id}
              listWithResources={list}
              action={'add'}
              disabled={existsInListsIds.includes(list.list.id)}
              buttonText={t('addToList')}
              onSuccess={(res) => {
                if (res && props.onSuccess) {
                  props.onSuccess(res[0]);
                }
              }}
            />
          );
        })}
        {nonSystemLists.length > 1 && <Menu.Divider />}

        <Menu.Item
          onClick={() => {
            if (activeLists.length >= lists) return;
            open();
          }}
        >
          <Group gap={'0.5rem'}>
            <IconPlus size={18} />
            <GourmetText cgmff={'ui'}>{t('createNew')}</GourmetText>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
