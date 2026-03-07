import {ActionIcon, Checkbox, Group, Overlay} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, type Dispatch, type SetStateAction} from 'react';
import {MoreActionsMenu} from '@/parcels/overview/CardGrid/MoreActionsMenu/MoreActionsMenu.tsx';
import styles from './ToolsOverlay.module.css';

export function ToolsOverlay({
  checked,
  isSelectionMode,
  setSelection,
  menuOpened,
  setMenuOpened,
  submenuOpened,
  setSubmenuOpened,
}: {
  checked: boolean;
  isSelectionMode: boolean;
  setSelection: (s: boolean) => void;
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  submenuOpened: boolean;
  setSubmenuOpened: Dispatch<SetStateAction<boolean>>;
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
            data-toggle-visibility={true}
          />
        </Activity>
        <Activity mode={!isSelectionMode ? 'visible' : 'hidden'}>
          <MoreActionsMenu
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            submenuOpened={submenuOpened}
            setSubmenuOpened={setSubmenuOpened}
            target={
              <ActionIcon
                style={{ pointerEvents: 'auto' }}
                onClick={() => setMenuOpened((v) => !v)}
                color="var(--gourmet-neutral-dark-3)"
                size={'1.25rem'}
                classNames={{ root: styles.overlayMenuButton }}
                data-menu-opened={menuOpened}
                data-toggle-visibility={true}
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
