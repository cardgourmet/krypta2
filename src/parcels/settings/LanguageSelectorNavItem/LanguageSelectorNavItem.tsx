import { UnstyledButton } from '@mantine/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { NavItem } from '@/parcels/layout/NavItem/NavItem';

export const LanguageSelectorNavItem = () => {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavItem asChild hasDropdown label="Sprache">
          <UnstyledButton />
        </NavItem>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild sideOffset={8}>
        <Menu fullTriggerWidth>
          <DropdownMenuRadioGroup onValueChange={(value) => i18n.changeLanguage(value)} value={i18n.language}>
            <Menu.DropdownRadioItem label="English" value="en" />
            <Menu.DropdownRadioItem label="Deutsch" value="de" />
          </DropdownMenuRadioGroup>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
