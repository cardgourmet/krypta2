import {ActionIcon, Checkbox, Group, Overlay} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, type Dispatch, type SetStateAction} from 'react';
import styles from '@/parcels/overview/CardGrid/ImageCard/ImageCard.module.css';
import {MoreActionsMenu} from '@/parcels/overview/CardGrid/ImageCard/MoreActionsMenu/MoreActionsMenu.tsx';

export function ToolsOverlay({
  checked,
  isSelectionMode,
  setSelection,
  menuOpened,
  setMenuOpened,
}: {
  checked: boolean;
  isSelectionMode: boolean;
  setSelection: (s: boolean) => void;
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }} zIndex={0}>
      <Group p={'1rem'} justify={'space-between'}>
        <Activity mode={!isSelectionMode || checked ? 'visible' : 'hidden'}>
          <Checkbox
            style={{ pointerEvents: 'auto' }}
            onChange={(event) => setSelection(event.currentTarget.checked)}
            color={'var(--gourmet-orange-1)'}
            checked={checked}
            classNames={{ root: styles.overlayCheckbox }}
            wrapperProps={{
              'data-menu-opened': menuOpened,
            }}
          />
        </Activity>
        <Activity mode={!isSelectionMode ? 'visible' : 'hidden'}>
          <MoreActionsMenu
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            target={
              <ActionIcon
                style={{ pointerEvents: 'auto' }}
                onClick={() => setMenuOpened((v) => !v)}
                color="var(--gourmet-neutral-dark-3)"
                size={'1.25rem'}
                classNames={{ root: styles.overlayMenuButton }}
                data-menu-opened={menuOpened}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            }
          />
        </Activity>
      </Group>
    </Overlay>
  );
}
