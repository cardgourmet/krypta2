import { Button, Combobox, Group, useCombobox } from '@mantine/core';
import { IconCaretDownFilled, IconCheck } from '@tabler/icons-react';
import styles from '@/parcels/search/MobileSearchbar/MobileSearchbar.module.css';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type MobileTcgSelectorProps = {
  selectedTcg: Tcg;
  setSelectedTcg: (selectedTcg: Tcg) => void;
};

export function MobileTcgSelector({ selectedTcg, setSelectedTcg }: MobileTcgSelectorProps) {
  const combobox = useCombobox();

  return (
    <Combobox
      classNames={{ dropdown: styles.mantineDropdown }}
      store={combobox}
      width={200}
      position="bottom-start"
      onOptionSubmit={(val) => {
        setSelectedTcg(val as Tcg);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          classNames={{ root: styles.mantineButtonRoot }}
          onClick={() => {
            combobox.toggleDropdown();
          }}
        >
          {selectedTcg === 'dlc' && <DLCIcon width={20} height={20} color={'var(--gourmet-neutral-8)'} />}
          {selectedTcg === 'mtg' && <MTGIcon width={20} height={20} color={'var(--gourmet-neutral-8)'} />}
          {selectedTcg === 'pcg' && <PCGIcon width={20} height={20} color={'var(--gourmet-neutral-8)'} />}
          <IconCaretDownFilled width={14} height={14} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {Object.entries({
            mtg: 'Magic: The Gathering',
            dlc: 'Disney Lorcana',
            pcg: 'Pokémon Card Game',
          }).map(([tcg, name], index) => (
            <Combobox.Option value={tcg} key={index} active={selectedTcg === tcg}>
              <Group justify={'space-between'}>
                {name}
                {tcg === selectedTcg && <IconCheck size={16} />}
              </Group>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
