import { Button, Combobox, Group, Stack, Text, TextInput, useCombobox } from '@mantine/core';
import { IconCaretDownFilled, IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './MobileSearchbar.module.css';

type MobileSearchbarProps = {
  close: () => void;
};

export function MobileSearchbar({ close }: MobileSearchbarProps) {
  const tcg = useTcgByLocation() ?? 'dlc';

  const combobox = useCombobox();
  const [selectedTcg, setSelectedTcg] = useState<Tcg | null>(tcg);

  return (
    <Stack>
      <Group>
        <TextInput
          classNames={{
            root: styles.testInputRoot,
            input: styles.testInput,
            section: styles.testInputSection,
          }}
          leftSection={
            <Combobox
              classNames={{ dropdown: styles.cgmDropdown }}
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
                  classNames={{ root: styles.testButtonRoot }}
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
          }
          rightSection={
            <Button classNames={{ root: styles.testButtonRoot }}>
              <IconX size={16} color={'var(--gourmet-neutral-8)'} />
            </Button>
          }
        />
        <Button onClick={close}>
          <IconX size={16} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>

      <Group>
        <Text>Help</Text>
        <Text>Advanced Search</Text>
      </Group>

      <Group>
        <Text>Beginne zu Tippen um Vorschläge zu bekommen / Query Explanation</Text>
      </Group>

      <Stack>
        <Text>Zuletzt</Text>
        <Text>History</Text>
      </Stack>
    </Stack>
  );
}
