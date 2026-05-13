import {Button, Group, Menu} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {IconChevronRight, IconList, IconPlus} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {ListMenuItem2} from '@/parcels/selection/OverviewSelectionDisplay/UseSelectionButton/ListMenuItem2/ListMenuItem2.tsx';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './UseSelectionButton.module.css';

export function UseSelectionButton() {
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');

  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const tcg = useTcgByLocation() as Tcg;
  const { lists, refetchLists } = useUserLists();
  const { systemLists, nonSystemLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const nonSystemLists = lists.filter((l) => {
      if (l.list.systemListType !== undefined) return false;

      // filter by tcg
      if ((l.list.allowedTcgs?.length ?? 0) === 0) return true;
      return l.list.allowedTcgs?.includes(tcg);
    });

    return { systemLists, nonSystemLists };
  }, [lists, tcg]);

  const disclosure = useDisclosure(false);
  const [_, { open }] = disclosure;

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
        <Menu.Target>
          <Button color={'var(--gourmet-orange-1'} className={styles.selectionButton}>
            <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
              {t('useSelection')}
            </GourmetText>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {systemLists.map((list) => {
            return <ListMenuItem2 key={list.list.id} listWithResources={list} action={'add'} />;
          })}

          <Menu
            opened={submenuOpened}
            onChange={setSubmenuOpened}
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
                    <GourmetText cgmff={'ui'}>{t('addToLists')}</GourmetText>
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
              {nonSystemLists.map((list) => (
                <ListMenuItem2 key={list.list.id} listWithResources={list} action={'add'} />
              ))}

              <Menu.Divider />

              <Menu.Item
                onClick={() => {
                  if (lists.length >= 10) return;
                  open();
                }}
              >
                <Group gap={'0.5rem'}>
                  <IconPlus size={18} />
                  <GourmetText cgmff={'ui'}>{t('createNewList')}</GourmetText>
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
