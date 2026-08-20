import { type MantineColorScheme, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { NavItem } from '@/parcels/layout/NavItem/NavItem';

export const ThemeSelectorNavItem = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavItem asChild hasDropdown>
          <UnstyledButton>Theme</UnstyledButton>
        </NavItem>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild sideOffset={8}>
        <Menu fullTriggerWidth>
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
