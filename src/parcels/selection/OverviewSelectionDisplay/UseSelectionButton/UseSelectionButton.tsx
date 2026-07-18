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
import { ListMenuItem } from '@/parcels/lists/ListActionItems/ListMenuItem/ListMenuItem.tsx';
import type { UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { useCheckUserLimits } from '@/parcels/lists/useInList.tsx';
import { ModalContext } from '@/parcels/modals/Modal.context';
import { CardsAddNotification } from '@/parcels/notification/CardsAddNotification.tsx';
import { ListCreateNotification } from '@/parcels/notification/ListCreateNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import { useTcgOverviewWorkStore } from '@/parcels/selection/useTcgOverviewWorkStore.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './UseSelectionButton.module.css';

export function UseSelectionButton() {
  const { t } = useTranslation('selection', { keyPrefix: 'useSelectionMenu' });

  const { requestModal } = use(ModalContext);

  const smallestScreen = useMediaQuery('(max-width: 500px)');

  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const { user } = useAuth();
  const { checkListCreateExceeded, checkListAddExceeded, generateExceededTooltip } = useCheckUserLimits();

  const tcg = useTcgByLocation() as Tcg;
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

    console.log(nonSystemLists);

    return { systemLists, nonSystemLists };
  }, [activeLists, tcg]);

  const selectedPrintIds = useTcgOverviewWorkStore((state) => state.data?.selection?.elementIds) ?? [];
  const inFavorites = useMemo(() => {
    const favoriteList = systemLists[0];
    if (!favoriteList) return 0;

    return (
      favoriteList.resources?.card?.filter((c) => selectedPrintIds.includes(c.listResource.resourceId))?.length ?? 0
    );
  }, [selectedPrintIds, systemLists]);

  const checkCreateLimitExceeded = useMemo(() => {
    const checkCreate = checkListCreateExceeded(1);
    if (checkCreate) return checkCreate;
    const checkAdd = checkListAddExceeded({ size: 0 } as unknown as UserListWithResources, selectedPrintIds.length);
    if (checkAdd) return checkAdd;

    return null;
  }, [checkListAddExceeded, checkListCreateExceeded, selectedPrintIds.length]);

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
            <ListMenuItem
              resourceIds={selectedPrintIds}
              key={list.list.id}
              listWithResources={list}
              action={'add'}
              type={'card'}
              icon={<IconStar size={18} />}
              buttonText={t(`favorite`, { count: selectedPrintIds.length - inFavorites })}
              onSuccess={(res) => {
                if (!res) return;

                addResources(res);

                sendNotification(
                  'success',
                  <CardsAddNotification tcg={tcg} list={list.list} printIds={selectedPrintIds} language={'en'} />,
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
            {nonSystemLists.map((list) => (
              <ListMenuItem
                resourceIds={selectedPrintIds}
                type={'card'}
                key={list.list.id}
                listWithResources={list}
                action={'add'}
                onSuccess={(res) => {
                  if (!res) return;

                  addResources(res);

                  sendNotification(
                    'success',
                    <CardsAddNotification tcg={tcg} list={list.list} printIds={selectedPrintIds} language={'en'} />,
                  );
                }}
              />
            ))}

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
                    addLists([{ list: createdList }]);

                    const res = await addResourcesToList(
                      user!.id,
                      createdList.id,
                      tcg,
                      selectedPrintIds.map((i) => ({ id: i })),
                      'card',
                    );
                    if (res.error) {
                      sendErrorNotification(res.error);
                      return;
                    }

                    sendNotification('success', <ListCreateNotification list={createdList} />);
                    sendNotification(
                      'success',
                      <CardsAddNotification tcg={tcg} list={createdList} printIds={selectedPrintIds} language={'en'} />,
                    );
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
