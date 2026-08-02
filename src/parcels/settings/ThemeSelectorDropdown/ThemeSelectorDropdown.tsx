import { type MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconMoon, IconSun, IconSunMoon, type ReactNode } from '@tabler/icons-react';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Menu } from '@/parcels/generic/Menu/Menu';

const icons: Record<MantineColorScheme, ReactNode> = {
  auto: <IconSunMoon />,
  dark: <IconMoon />,
  light: <IconSun />,
};

export const ThemeSelectorDropdown = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton>{icons[colorScheme]}</ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="end" sideOffset={-4}>
        <Menu>
          <DropdownMenuRadioGroup
            onValueChange={(value) => setColorScheme(value as MantineColorScheme)}
            value={colorScheme}
          >
            <Menu.DropdownRadioItem value="dark">Dark</Menu.DropdownRadioItem>
            <Menu.DropdownRadioItem value="light">Light</Menu.DropdownRadioItem>
            <Menu.DropdownRadioItem value="auto">Auto</Menu.DropdownRadioItem>
          </DropdownMenuRadioGroup>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
