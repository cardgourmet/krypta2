import {Group, Menu} from '@mantine/core';
import {IconBookmark, IconLink, IconList, IconPlus, IconStar} from '@tabler/icons-react';
import type {ReactElement} from 'react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from '@/parcels/overview/CardGrid/ImageCard/ImageCard.module.css';

export function MoreActionsMenu({
  menuOpened,
  setMenuOpened,
  target,
}: {
  menuOpened: boolean;
  setMenuOpened: (opened: boolean) => void;
  target: ReactElement;
}) {
  return (
    <Menu
      width={220}
      position="top-start"
      opened={menuOpened}
      onChange={setMenuOpened}
      withArrow
      classNames={{ dropdown: styles.menuDropdown }}
    >
      <Menu.Target>{target}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <Group gap={'0.5rem'}>
            <IconStar size={18} />
            <GourmetText cgmff={'ui'}>Favorite</GourmetText>
          </Group>
        </Menu.Item>
        <Menu.Item>
          <Group gap={'0.5rem'}>
            <IconBookmark size={18} />
            <GourmetText cgmff={'ui'}>Bookmark</GourmetText>
          </Group>
        </Menu.Item>

        <Menu.Sub openDelay={120} closeDelay={150}>
          <Menu.Sub.Target>
            <Menu.Sub.Item>
              <Group gap={'0.5rem'}>
                <IconList size={18} />
                <GourmetText cgmff={'ui'}>Add to other list ..</GourmetText>
              </Group>
            </Menu.Sub.Item>
          </Menu.Sub.Target>

          <Menu.Sub.Dropdown>
            <Menu.Item>
              <Group gap={'0.5rem'}>
                <GourmetText cgmff={'ui'}>My MTG list 1</GourmetText>
              </Group>
            </Menu.Item>
            <Menu.Item>
              <Group gap={'0.5rem'}>
                <GourmetText cgmff={'ui'}>second List</GourmetText>
              </Group>
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item>
              <Group gap={'0.5rem'}>
                <IconPlus size={18} />
                <GourmetText cgmff={'ui'}>Create a new one</GourmetText>
              </Group>
            </Menu.Item>
          </Menu.Sub.Dropdown>
        </Menu.Sub>

        <Menu.Divider />

        <Menu.Item>
          <Group gap={'0.5rem'}>
            <IconLink size={18} />
            <GourmetText cgmff={'ui'}>Copy print link</GourmetText>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
