import { Group, Menu, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLink } from '@tabler/icons-react';
import { Activity, type Ref, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useListActionItems } from '@/parcels/lists/ListActionItems/useListActionItems.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { CreateListModal } from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type { UserListResource } from '@/parcels/lists/types.ts';
import { useCardMenuStore } from '@/parcels/overview/cards/TcgCardMenu/useTcgCardMenuStore.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './TcgOverviewCardMenu.module.css';

export function TcgOverviewCardMenu({
  tcg,
  onAddToList,
  onRemoveFromList,
  ref,
}: {
  tcg: Tcg;
  onAddToList?: (res: UserListResource) => void;
  onRemoveFromList?: (res: UserListResource) => void;
} & { ref?: Ref<HTMLDivElement> }) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const { user } = useAuth();

  const { data: activeCard, opened, target: activeTargetRef, closeMenu } = useCardMenuStore((state) => state);
  const resourceId = activeCard?.print?.id;

  const { refetchLists } = useUserLists();

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

  const { entries } = useListActionItems({
    tcg,
    resource: activeCard ?? undefined,
    resourceId,
    rawResourceId: resourceId ?? '',
    onAddedToList: (res) => {
      if (res) {
        if (onAddToList) onAddToList(res);
      }

      closeMenu();
    },
    onRemovedFromList: (listId, resourceId) => {
      if (onRemoveFromList) {
        onRemoveFromList({
          listId: listId,
          resourceId: resourceId,
          resourceType: 'card',
        } as UserListResource);
      }

      closeMenu();
    },
    type: 'card',
    ref,
  });

  return (
    <>
      <CreateListModal
        disclosure={disclosure}
        onSuccess={() => {
          refetchLists();
        }}
      />

      <Activity mode={user ? 'visible' : 'hidden'}>
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
            {activeCard && (
              <Stack p={'0.25rem'} gap={'0rem'}>
                <GourmetText fz={'0.95rem'} fw={'500'}>
                  {activeCard.name}
                </GourmetText>
                <GourmetText fz={'0.95rem'} cgmc={'neutral-6'}>
                  {activeCard.print.collectorNumber}
                </GourmetText>
              </Stack>
            )}

            {entries}

            <Menu.Divider />

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
              className={styles.menuItem}
            >
              <Group gap={'0.5rem'}>
                <IconLink size={18} />
                <GourmetText cgmff={'ui'}>{t('copyPrint')}</GourmetText>
              </Group>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Activity>
    </>
  );
}
