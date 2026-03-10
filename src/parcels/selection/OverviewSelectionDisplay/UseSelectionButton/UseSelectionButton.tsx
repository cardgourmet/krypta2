import {Button, Group, Menu} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconBookmark, IconChevronRight, IconLabelFilled, IconList, IconMinus, IconPlus, IconStar,} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {addCardResourcesToList} from '@/parcels/lists/api.ts';
import {IconWithOverlayIcon} from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './UseSelectionButton.module.css';

export function UseSelectionButton() {
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');

  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { lists } = useUserLists();
  const { systemLists, nonSystemLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const nonSystemLists = lists.filter((l) => l.list.systemListType === undefined);

    return { systemLists, nonSystemLists };
  }, [lists]);

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
            {t('use-selection')}
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
                  <GourmetText cgmff={'ui'}>{t('add-to-lists')}</GourmetText>
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

            <Menu.Item>
              <Group gap={'0.5rem'}>
                <IconPlus size={18} />
                <GourmetText cgmff={'ui'}>{t('create-new-list')}</GourmetText>
              </Group>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Menu.Dropdown>
    </Menu>
  );
}

function ListMenuItem2({
  listWithResources,
  action,
}: {
  listWithResources: UserListWithResources;
  action: 'add' | 'remove';
}) {
  const tcg = useTcgByLocation() as Tcg;
  const { user } = useAuth();
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });

  const workContext = useTcgOverviewWorkContext();
  const selectedPrintIds = workContext?.data?.selection?.elementIds ?? [];

  const { refetchLists } = useUserLists();
  const { list, resources, size } = listWithResources;
  const listResourceIds = useMemo(() => {
    return resources?.card?.map((r) => r.listResource.resourceId) ?? [];
  }, [resources]);
  const addToListCount = useMemo(() => {
    return selectedPrintIds.filter((id) => !listResourceIds.includes(id)).length;
  }, [listResourceIds, selectedPrintIds]);

  return (
    <Menu.Item
      onClick={() => {
        if (!user?.id) return;
        if ((size ?? 0) + addToListCount > 100) return;

        addCardResourcesToList(user?.id, list.id, tcg, [
          ...selectedPrintIds.map((id) => {
            return { id: id };
          }),
        ]).then((res) => {
          if (res.error) {
            console.error('error while adding resource to list', res.error);
            return;
          }

          console.log('success! added to list');
          refetchLists();
        });
        return;
      }}
      disabled={addToListCount === 0}
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
            <GourmetText cgmff={'ui'}>{t(`favorite`, { count: addToListCount })}</GourmetText>
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
            <GourmetText cgmff={'ui'}>{t(`bookmark`, { count: addToListCount })}</GourmetText>
          </>
        )}

        {list.systemListType === undefined && (
          <Group justify={'space-between'} w={'100%'}>
            <Group gap={'0.25rem'}>
              <GourmetText cgmff={'ui'}>{list.name}</GourmetText>
              {list.color && <IconLabelFilled size={18} color={list.color ?? 'var(--gourmet-neutral-9'} />}
            </Group>

            <Group gap={'0.5rem'}>
              <GourmetText cgmff={'ui'} c={'var(--gourmet-green-1)'}>
                +{addToListCount}
              </GourmetText>

              <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-5)'}>
                {size ?? '?'}/100
              </GourmetText>
            </Group>
          </Group>
        )}
      </Group>
    </Menu.Item>
  );
}
