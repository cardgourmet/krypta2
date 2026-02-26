import {Button, Group, Menu} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {IconBookmark, IconChevronRight, IconList, IconPlus, IconStar} from "@tabler/icons-react";
import {useState} from "react";
import {GourmetText} from "@/parcels/mantine/GourmetText.tsx";
import styles from "@/parcels/selection/OverviewSelectionDisplay/OverviewSelectionDisplay.module.css";

export function UseSelectionButton() {
  const smallestScreen = useMediaQuery('(max-width: 500px)');

  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  return (
    <Menu width={260} position="top" opened={menuOpened} onChange={setMenuOpened} withArrow>
      <Menu.Target>
        <Button color={'var(--gourmet-orange-1'} className={styles.selectionButton}>
          <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
            Auswahl verwenden für ...
          </GourmetText>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          <Group gap={'0.5rem'}>
            <IconStar size={18} />
            <GourmetText cgmff={'ui'}>Als Favoriten markieren</GourmetText>
          </Group>
        </Menu.Item>
        <Menu.Item>
          <Group gap={'0.5rem'}>
            <IconBookmark size={18} />
            <GourmetText cgmff={'ui'}>Zu Lesezeichen hinzufügen</GourmetText>
          </Group>
        </Menu.Item>

        <Menu
          opened={submenuOpened}
          onChange={setSubmenuOpened}
          width={200}
          trigger={'click-hover'}
          position={smallestScreen ? 'top' : 'right-start'}
          openDelay={120}
          closeDelay={150}
        >
          <Menu.Target>
            <Menu.Item closeMenuOnClick={false} onClick={() => setSubmenuOpened((prev) => !prev)}>
              <Group justify={'space-between'}>
                <Group gap={'0.5rem'}>
                  <IconList size={18} />
                  <GourmetText cgmff={'ui'}>Zur Liste hinzufügen ..</GourmetText>
                </Group>
                <IconChevronRight size={18} />
              </Group>
            </Menu.Item>
          </Menu.Target>

          <Menu.Dropdown>
            {['My MTG list 1', 'second List', 'dritte Liste', 'oh my goddness', 'oh my damn'].map((item, index) => (
              <Menu.Item key={index}>
                <Group gap={'0.5rem'}>
                  <GourmetText cgmff={'ui'}>{item}</GourmetText>
                </Group>
              </Menu.Item>
            ))}

            <Menu.Divider />

            <Menu.Item>
              <Group gap={'0.5rem'}>
                <IconPlus size={18} />
                <GourmetText cgmff={'ui'}>Neue Erstellen</GourmetText>
              </Group>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Menu.Dropdown>
    </Menu>
  );
}
