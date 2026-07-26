import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconLanguage } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Menu } from '@/parcels/generic/Menu/Menu';

export const LanguageSelectorDropdown = () => {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton>
          <IconLanguage />
        </ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="end" sideOffset={-4}>
        <Menu>
          <DropdownMenuRadioGroup onValueChange={(value) => i18n.changeLanguage(value)} value={i18n.language}>
            <Menu.DropdownRadioItem label="English" value="en" />
            <Menu.DropdownRadioItem label="Deutsch" value="de" />
          </DropdownMenuRadioGroup>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
