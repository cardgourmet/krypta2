import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconCaretDownFilled } from '@tabler/icons-react';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { Menu } from '@/parcels/generic/Menu/Menu.tsx';
import styles from '@/parcels/search/bar/NewSearchbar/NewSearchbar.module.css';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export const TcgDropdown = ({ currentTcg, setCurrentTcg }: { currentTcg: Tcg; setCurrentTcg: (tcg: Tcg) => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={styles.inputButton}
          style={{
            marginLeft: 'var(--cgm-searchbar-inline-padding)',
          }}
          title="Current TCG"
          trailingIcon={<IconCaretDownFilled fontSize={12} />}
          variant="tertiary"
        >
          <TcgIcon height={20} tcg={currentTcg} width={20} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent asChild align="start" sideOffset={-4}>
        <Menu>
          <DropdownMenuRadioGroup onValueChange={(value) => setCurrentTcg(value as Tcg)} value={currentTcg}>
            <Menu.DropdownRadioItem icon={<TcgIcon height={20} tcg="mtg" width={20} />} value="mtg">
              {getNameByTcg('mtg')}
            </Menu.DropdownRadioItem>
            <Menu.DropdownRadioItem icon={<TcgIcon height={20} tcg="pcg" width={20} />} value="pcg">
              {getNameByTcg('pcg')}
            </Menu.DropdownRadioItem>
            <Menu.DropdownRadioItem icon={<TcgIcon height={20} tcg="dlc" width={20} />} value="dlc">
              {getNameByTcg('dlc')}
            </Menu.DropdownRadioItem>
          </DropdownMenuRadioGroup>
        </Menu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
