import { Button, Group, Menu } from '@mantine/core';
import { IconChevronRight, IconList, IconMinus, IconPlus, IconStar } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import { ListMultipleMenu } from '@/parcels/lists/ListActionItems/ListMultipleMenu/ListMultipleMenu.tsx';
import { ListSingleMenuItem } from '@/parcels/lists/ListActionItems/ListSingleMenuItem/ListSingleMenuItem.tsx';
import type { UserListResource } from '@/parcels/lists/types.ts';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './UseSelectionButton.module.css';

export function UseSelectionButton() {
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });

  const [menuOpened, setMenuOpened] = useState(false);

  const tcg = useTcgByLocation() as Tcg;
  const { activeLists } = useActiveLists(CONTEXT_LIST_MAIN);
  const { systemLists } = useMemo(() => {
    const systemLists = activeLists.filter((l) => l.list.systemListType !== undefined);
    const nonSystemLists = activeLists
      .filter((l) => {
        if (l.list.systemListType !== undefined) return false;

        // filter by tcg
        if ((l.list.allowedTcgs?.length ?? 0) === 0) return true;
        return l.list.allowedTcgs?.includes(tcg);
      })
      .sort((a, b) => {
        const timeA = new Date(a.list.updatedAt).getTime();
        const timeB = new Date(b.list.updatedAt).getTime();

        return (timeA - timeB) * -1;
      });

    return { systemLists, nonSystemLists };
  }, [activeLists, tcg]);

  const selectedResourcesById = useOverviewWorkStore((state) => state.data?.selection?.elementDataById) ?? {};
  const selectedPrintIds = useOverviewWorkStore((state) => state.data?.selection?.elementIds) ?? [];
  const actionableResources = useMemo(() => {
    const selectedResources = selectedPrintIds.map((resId) => {
      return selectedResourcesById[resId];
    });
    return selectedResources.map((res) => ({
      id: res.card.print.id,
      resourceType: 'card' as UserListResource['resourceType'],
      game: tcg,
    }));
  }, [selectedPrintIds, selectedResourcesById, tcg]);

  const inFavorites = useMemo(() => {
    const favoriteList = systemLists[0];
    if (!favoriteList) return 0;

    return (
      favoriteList.resources?.card?.filter((c) => selectedPrintIds.includes(c.listResource.resourceId))?.length ?? 0
    );
  }, [selectedPrintIds, systemLists]);

  return (
    <Menu
      width={260}
      position="top"
      opened={menuOpened}
      onChange={setMenuOpened}
      withArrow
      classNames={{ dropdown: styles.menuDropdown }}
    >
      <Menu.Target>
        <Button color={'var(--gourmet-orange-1'} className={styles.selectionButton}>
          <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
            {t('useSelection')}
          </GourmetText>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {systemLists.map((list) => {
          return (
            <ListSingleMenuItem
              key={list.list.id}
              listWithResources={list}
              actionableResources={actionableResources}
              action={'add'}
              icon={<IconStar size={18} />}
              buttonText={t(`favorite`, { count: selectedPrintIds.length - inFavorites })}
            />
          );
        })}

        <ListMultipleMenu
          actionableResources={actionableResources}
          action={'add'}
          target={
            <Menu.Item closeMenuOnClick={false} className={styles.menuItem}>
              <Group justify={'space-between'}>
                <Group gap={'0.5rem'}>
                  <IconWithOverlayIcon
                    icon={<IconList size={18} />}
                    overlayIcon={<IconPlus size={14} color={'var(--gourmet-green-1)'} />}
                  />
                  <GourmetText cgmff={'ui'}>{t('addToLists')}</GourmetText>
                </Group>
                <IconChevronRight size={18} />
              </Group>
            </Menu.Item>
          }
          withSystem
        />
        <ListMultipleMenu
          actionableResources={actionableResources}
          action={'remove'}
          target={
            <Menu.Item closeMenuOnClick={false} className={styles.menuItem}>
              <Group justify={'space-between'}>
                <Group gap={'0.5rem'}>
                  <IconWithOverlayIcon
                    icon={<IconList size={18} />}
                    overlayIcon={<IconMinus size={14} color={'var(--gourmet-red-01)'} />}
                  />
                  <GourmetText cgmff={'ui'}>{t('removeFromLists')}</GourmetText>
                </Group>
                <IconChevronRight size={18} />
              </Group>
            </Menu.Item>
          }
          withSystem
        />
      </Menu.Dropdown>
    </Menu>
  );
}
