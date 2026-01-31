import { Group, Stack, Text } from '@mantine/core';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentDropdown } from '@/parcels/search/advanced/FilterComponentDropdown.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';
import { DlcInkAmber } from '@/parcels/tcg/dlc/icons/DlcInkAmber.tsx';
import { DlcInkAmethyst } from '@/parcels/tcg/dlc/icons/DlcInkAmethyst.tsx';
import { DlcInkEmerald } from '@/parcels/tcg/dlc/icons/DlcInkEmerald.tsx';
import { DlcInkRuby } from '@/parcels/tcg/dlc/icons/DlcInkRuby.tsx';
import { DlcInkSapphire } from '@/parcels/tcg/dlc/icons/DlcInkSapphire.tsx';
import { DlcInkSteel } from '@/parcels/tcg/dlc/icons/DlcInkSteel.tsx';
import { inks } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcInkFilter({ formData, setFormData }: FormDataProps) {
  const iconSize = 32;
  return (
    <Stack>
      <Group>
        {inks.data.values
          .filter((d) => d.value !== 'none')
          .map((d) => {
            return (
              <Group gap={'0.25rem'} key={d.value}>
                <FilterComponentCheckbox
                  checked={formData.ink.values[d.value] ?? false}
                  onChange={(event) => {
                    const value = event.currentTarget.checked;

                    setFormData((prev) => {
                      const values = prev.ink.values;
                      values[d.value] = value;
                      return {
                        ...prev,
                        ink: { ...prev.ink, values },
                      };
                    });
                  }}
                />
                <Group gap={'0.1rem'}>
                  {d.value === 'amber' && <DlcInkAmber size={iconSize} color={'#f0b11d'} />}
                  {d.value === 'amethyst' && <DlcInkAmethyst size={iconSize} color={'#80397b'} />}
                  {d.value === 'emerald' && <DlcInkEmerald size={iconSize} color={'#2b8a42'} />}
                  {d.value === 'ruby' && <DlcInkRuby size={iconSize} color={'#d02031'} />}
                  {d.value === 'sapphire' && <DlcInkSapphire size={iconSize} color={'#0b87c1'} />}
                  {d.value === 'steel' && <DlcInkSteel size={iconSize} color={'#9da7b1'} />}
                  <Text fs={'1rem'}>{capitalizeFirstLetter(d.value)}</Text>
                </Group>
              </Group>
            );
          })}
      </Group>
      <FilterComponentDropdown
        withCheckIcon={false}
        allowDeselect={false}
        defaultValue={'contains'}
        data={[
          { value: 'exact', label: 'Genau diese Tinten' },
          { value: 'contains', label: 'Enthält eine dieser Tinten' },
        ]}
        value={formData.ink.exact ? 'exact' : 'contains'}
        onChange={(value) => {
          setFormData((prev) => ({
            ...prev,
            ink: { ...prev.ink, exact: value === 'exact' },
          }));
        }}
      />
    </Stack>
  );
}
