import { Button, Group, Menu, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronRight, IconList, IconPlus, IconStar } from '@tabler/icons-react';
import { use, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { addResourcesToList } from '@/parcels/lists/api.ts';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import { ListMenuItem } from '@/parcels/lists/ListActionItems/ListMenuItem.tsx';
import type { UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { useCheckUserLimits } from '@/parcels/lists/useInList.tsx';
import { ModalContext } from '@/parcels/modals/Modal.context.tsx';
import { ListCreateNotification } from '@/parcels/notification/ListCreateNotification.tsx';
import { ResourcesAddNotification } from '@/parcels/notification/ResourcesAddNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ListDetailsSelectionButton.module.css';

export function ListDetailsSelectionButton({ tcg, list }: { tcg: Tcg; list: UserList }) {
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });
  const smallestScreen = useMediaQuery('(max-width: 500px)');
  const { user } = useAuth();

  const { requestModal } = use(ModalContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const locationTcg = useTcgByLocation() as Tcg;
  const mustTcg = tcg ?? locationTcg;
  const { activeLists, addResources, addLists } = useActiveLists(CONTEXT_LIST_MAIN);
  const { systemLists, nonSystemLists } = useMemo(() => {
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

  const selectedResourcesById = useListDetailsWorkStore((state) => state.data?.selection?.elementDataById) ?? {};
  const selectedResourceIds = useListDetailsWorkStore((state) => state.data?.selection?.elementIds) ?? [];
  const inFavorites = useMemo(() => {
    const favoriteList = systemLists[0];
    if (!favoriteList) return 0;

    return (
      favoriteList.resources?.card?.filter((c) => selectedResourceIds.includes(c.listResource.resourceId))?.length ?? 0
    );
  }, [selectedResourceIds, systemLists]);
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

  const { checkListCreateExceeded, checkListAddExceeded, generateExceededTooltip } = useCheckUserLimits();
  const checkCreateLimitExceeded = useMemo(() => {
    const checkCreate = checkListCreateExceeded(1);
    if (checkCreate) return checkCreate;
    const checkAdd = checkListAddExceeded({ size: 0 } as unknown as UserListWithResources, selectedResourceIds.length);
    if (checkAdd) return checkAdd;

    return null;
  }, [checkListAddExceeded, checkListCreateExceeded, selectedResourceIds.length]);

  console.log('mustTcg', mustTcg);

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
            Use selection for ...
          </GourmetText>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {systemLists.map((list) => {
          return (
            <ListMenuItem
              actionableResources={actionableResources}
              key={list.list.id}
              listWithResources={list}
              action={'add'}
              icon={<IconStar size={18} />}
              buttonText={t(`favorite`, { count: selectedResourceIds.length - inFavorites })}
              onSuccess={(res) => {
                if (!res) return;

                addResources(res);

                const existingIds = new Set(
                  Object.values(list.resources ?? {}).flatMap((v) => v.map((r) => r.listResource.resourceId)),
                );
                const filteredIds = selectedResourceIds.filter((s) => !existingIds.has(s));

                sendNotification(
                  'success',
                  <ResourcesAddNotification tcg={tcg} list={list.list} resourceIds={filteredIds} language={'en'} />,
                );
              }}
            />
          );
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
            {nonSystemLists.map((list) => {
              return (
                <ListMenuItem
                  actionableResources={actionableResources}
                  key={list.list.id}
                  listWithResources={list}
                  action={'add'}
                  onSuccess={(res) => {
                    if (!res) return;

                    addResources(res);

                    const existingIds = new Set(
                      Object.values(list.resources ?? {}).flatMap((v) => v.map((r) => r.listResource.resourceId)),
                    );
                    const filteredIds = selectedResourceIds.filter((s) => !existingIds.has(s));

                    sendNotification(
                      'success',
                      <ResourcesAddNotification tcg={tcg} list={list.list} resourceIds={filteredIds} language={'en'} />,
                    );
                  }}
                />
              );
            })}

            <Menu.Divider />

            <Tooltip
              label={generateExceededTooltip(checkCreateLimitExceeded ?? undefined)}
              disabled={!checkCreateLimitExceeded}
              color={'var(--gourmet-red-01)'}
              withArrow
            >
              <Menu.Item
                disabled={!!checkCreateLimitExceeded}
                onClick={async () => {
                  if (checkCreateLimitExceeded) {
                    return;
                  }

                  try {
                    const createdList = await requestModal<UserList>('createList', { async: true });
                    if (!createdList) return;

                    const res = await addResourcesToList(user!.id, createdList.id, actionableResources);
                    if (res.error) {
                      addLists([{ list: createdList, size: 0 }]);

                      sendErrorNotification(res.error);
                      return;
                    }

                    sendNotification('success', <ListCreateNotification list={createdList} />);
                    sendNotification(
                      'success',
                      <ResourcesAddNotification
                        tcg={tcg}
                        list={createdList}
                        resourceIds={selectedResourceIds}
                        language={'en'}
                      />,
                    );
                    addLists([{ list: createdList, size: res.data?.length ?? 0 }]);
                  } catch {}
                }}
              >
                <Group gap={'0.5rem'}>
                  <IconPlus size={18} />
                  <GourmetText cgmff={'ui'}>{t('createNewList')}</GourmetText>
                </Group>
              </Menu.Item>
            </Tooltip>
          </Menu.Dropdown>
        </Menu>
      </Menu.Dropdown>
    </Menu>
  );
}
