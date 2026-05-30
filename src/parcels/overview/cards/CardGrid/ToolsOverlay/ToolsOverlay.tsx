import { Checkbox, Group, Overlay, Stack, Tooltip } from '@mantine/core';
import { IconLabelFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Activity, type ReactElement, useMemo } from 'react';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import styles from './ToolsOverlay.module.css';

export function ToolsOverlay({
  card,
  checked,
  isSelectionMode,
  setSelection,
  menuButton,
}: {
  card: TcgDataCard;
  checked: boolean;
  isSelectionMode: boolean;
  setSelection: (s: boolean) => void;
  menuButton: ReactElement;
}) {
  const { lists } = useUserLists();
  const existsInLists = useMemo(() => {
    return lists.filter((l) => {
      return l.resources?.card?.find((r) => r.listResource.resourceId === card.print.id);
    });
  }, [lists, card.print.id]);

  return (
    <>
      <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
        <Group p={'1rem 1rem 0 1rem'} justify={'space-between'}>
          <Activity mode={!isSelectionMode || checked ? 'visible' : 'hidden'}>
            <Checkbox
              style={{ pointerEvents: 'auto' }}
              onChange={(event) => setSelection(event.currentTarget.checked)}
              color={'var(--gourmet-orange-1)'}
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
      <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
        <Group m={'2.5rem 0 0 0'} justify={'end'}>
          <Stack gap={'0'} style={{ pointerEvents: 'none' }}>
            {existsInLists.slice(0, 5).map((l, index) => {
              return (
                <div key={l.list.id} style={{ pointerEvents: 'auto' }}>
                  <Link to={'/me/lists/$listId'} params={{ listId: l.list.slug }} className={styles.listLink}>
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
    </>
  );
}
