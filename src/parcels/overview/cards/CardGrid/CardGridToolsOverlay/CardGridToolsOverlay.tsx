import { Checkbox, Group, Overlay, Stack, Tooltip } from '@mantine/core';
import { IconLabelFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Activity, type ReactElement, useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { CONTEXT_LIST_MAIN, useActiveListsResource } from '@/parcels/lists/ActiveListsState.tsx';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import styles from './CardGridToolsOverlay.module.css';

export function CardGridToolsOverlay({
  card,
  checked,
  isSelectionMode,
  setSelection,
  menuButton,
  withoutLabels,
  color,
}: {
  card: TcgDataCard;
  checked: boolean;
  isSelectionMode: boolean;
  setSelection: (s: boolean) => void;
  menuButton: ReactElement;
  withoutLabels?: boolean;
  color?: string;
}) {
  const { user } = useAuth();
  const { existsInLists } = useActiveListsResource(CONTEXT_LIST_MAIN, card.print.id);
  const sortedExistsInLists = useMemo(() => {
    return existsInLists.sort((a, b) => a.list.slug.localeCompare(b.list.slug));
  }, [existsInLists]);

  return (
    <>
      <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
        <Group p={'1rem 1rem 0 1rem'} justify={'space-between'}>
          <Activity mode={!isSelectionMode || checked ? 'visible' : 'hidden'}>
            <Checkbox
              style={{ pointerEvents: 'auto' }}
              onChange={(event) => setSelection(event.currentTarget.checked)}
              color={color ?? 'var(--gourmet-orange-1)'}
              checked={checked}
              classNames={{ root: styles.overlayCheckbox }}
              /*wrapperProps={{
                'data-menu-opened': menuOpened,
              }}*/
              data-toggle-visibility={true}
            />
          </Activity>
          <Activity mode={!isSelectionMode ? 'visible' : 'hidden'}>{menuButton}</Activity>
        </Group>
      </Overlay>
      {!withoutLabels && (
        <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
          <Group m={'2.5rem 0 0 0'} justify={'end'}>
            <Stack gap={'0'} style={{ pointerEvents: 'none' }}>
              {sortedExistsInLists.slice(0, 5).map((l, index) => {
                return (
                  <div key={l.list.id} style={{ pointerEvents: 'auto' }}>
                    <Link
                      to={'/@{$user}/lists/$listId'}
                      params={{ user: user!.username, listId: l.list.slug }}
                      className={styles.listLink}
                      preload={false}
                    >
                      <Tooltip label={l.list.name} openDelay={500}>
                        <IconLabelFilled
                          color={l.list.color ?? 'var(--gourmet-neutral-9)'}
                          style={{
                            transform: `rotate(180deg) translate(-5px, ${index * 16}px)`,
                          }}
                          className={styles.listLabel}
                          size={28}
                        />
                      </Tooltip>
                    </Link>
                  </div>
                );
              })}
            </Stack>
          </Group>
        </Overlay>
      )}
    </>
  );
}
