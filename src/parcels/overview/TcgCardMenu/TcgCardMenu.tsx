import {Group, Menu} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconLink} from '@tabler/icons-react';
import {type Ref, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {AddToListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/AddToListMenu/AddToListMenu.tsx';
import {ListMenuItem} from '@/parcels/overview/CardGrid/MoreActionsMenu/ListMenuItem/ListMenuItem.tsx';
import {RemoveFromListMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/RemoveFromListMenu/RemoveFromListMenu.tsx';
import type {MenuControls} from '@/parcels/overview/TcgCardMenu/useTcgCardMenuControls.ts';
import {slugify} from '@/parcels/slugify.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgCardMenu({
  tcg,
  controls,
  onSearchSaved,
  onRemoveFromList,
  ref,
}: {
  tcg: Tcg;
  controls: MenuControls<TcgDataCard>;

  onSearchSaved?: (id: string) => void;
  onRemoveFromList?: (listId: string) => void;
} & { ref?: Ref<HTMLDivElement> }) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const { data: activeCard, opened, target: activeTargetRef, closeMenu } = controls;

  const resourceId = activeCard?.print?.id;
  const { lists, refetchLists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.card?.find((res) => res.listResource.resourceId === resourceId);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, resourceId]);

  // rerender on resize
  const [, forceRerender] = useState(0);
  useEffect(() => {
    const onResize = () => forceRerender((n) => n + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // prevent scrolling when open
  useEffect(() => {
    if (!opened) return;

    const preventScroll = (event: Event) => event.preventDefault();

    const preventKeyScroll = (event: KeyboardEvent) => {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
      if (keys.includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll);

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [opened]);

  const disclosure = useDisclosure(false);
  const onChange = useCallback(
    (v: boolean) => {
      if (!v) closeMenu();
      else {
        // ignore.
      }
    },
    [closeMenu],
  );

  // TODO: make dropdown like it was before
  return (
    <>
      <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />

      <Menu
        opened={opened}
        onChange={onChange}
        onClose={closeMenu}
        withArrow
        withinPortal={false}
        styles={{ dropdown: { pointerEvents: 'auto' } }}
        openDelay={0}
        transitionProps={{ duration: 0 }}
        position={'bottom-end'}
      >
        <Menu.Target>
          <span
            style={{
              position: 'fixed',
              left: activeTargetRef
                ? (activeTargetRef.getBoundingClientRect().left + activeTargetRef.getBoundingClientRect().right) / 2
                : -9999,
              top: activeTargetRef ? activeTargetRef.getBoundingClientRect().bottom : -9999,
              width: 1,
              height: 1,
              pointerEvents: 'none',
            }}
          />
        </Menu.Target>

        <Menu.Dropdown ref={ref}>
          {systemLists.map((list) => {
            return (
              <ListMenuItem
                key={list.list.id}
                ressourceId={resourceId ?? ''}
                raw={resourceId === undefined}
                listWithResources={list}
                action={existsInLists.includes(list.list.id) ? 'remove' : 'add'}
                type={'search'}
                tcg={tcg}
                onSuccess={(res) => {
                  if (res) {
                    if (onSearchSaved) onSearchSaved(res.resourceId);
                  }
                }}
              />
            );
          })}
          {systemLists.length === 0 && <GourmetText>No system lists</GourmetText>}

          <AddToListMenu
            ref={ref}
            ressourceId={resourceId ?? ''}
            raw={resourceId === undefined}
            disclosure={disclosure}
            type={'card'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onSearchSaved) onSearchSaved(res.resourceId);
              }
            }}
          />
          <RemoveFromListMenu
            ref={ref}
            ressourceId={resourceId ?? ''}
            raw={resourceId === undefined}
            type={'card'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onRemoveFromList) onRemoveFromList(res.listId);
              }
            }}
          />

          <Menu.Item
            onClick={() => {
              if (!activeCard) return;

              const set = activeCard.print.setCode?.toLowerCase() as string;
              const cn = activeCard.print.collectorNumber.toLowerCase();

              navigator.clipboard.writeText(
                `${window.location.origin}/${tcg}/sets/${set}/${cn}/${slugify(activeCard.name)}`,
              );

              closeMenu();
            }}
          >
            <Group gap={'0.5rem'}>
              <IconLink size={18} />
              <GourmetText cgmff={'ui'}>{t('copy-print')}</GourmetText>
            </Group>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
