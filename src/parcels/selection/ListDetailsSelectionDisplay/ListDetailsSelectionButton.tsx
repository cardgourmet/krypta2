import { Button, Group, Menu } from '@mantine/core';
import { IconChevronRight, IconList, IconMinus, IconPlus } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import { ListMultipleMenu } from '@/parcels/lists/ListActionItems/ListMultipleMenu/ListMultipleMenu.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import styles from './ListDetailsSelectionButton.module.css';

export function ListDetailsSelectionButton({ list }: { list: UserList }) {
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });

  const [menuOpened, setMenuOpened] = useState(false);

  const selectedResourcesById = useListDetailsWorkStore((state) => state.data?.selection?.elementDataById) ?? {};
  const selectedResourceIds = useListDetailsWorkStore((state) => state.data?.selection?.elementIds) ?? [];

  const actionableResources = useMemo(() => {
    const selectedResources = selectedResourceIds.map((resId) => {
      return selectedResourcesById[resId];
    });
    return selectedResources.map((res) => ({
      id: res.listResource.resourceId,
      resourceType: res.listResource.resourceType,
      game: res.listResource.game,
    }));
  }, [selectedResourceIds, selectedResourcesById]);

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
        <Button
          color={list.color ?? 'var(--gourmet-orange-1'}
          className={styles.selectionButton}
          style={{
            '--current-color': list.color ?? 'var(--gourmet-orange-1)',
          }}
        >
          <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
            {t('useSelection')}
          </GourmetText>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
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
