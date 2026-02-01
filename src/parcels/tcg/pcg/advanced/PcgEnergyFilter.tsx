import { Group, Stack, Text } from '@mantine/core';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { PcgFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentDropdown } from '@/parcels/search/advanced/FilterComponentDropdown.tsx';
import { PcgEnergyColorless } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyColorless.tsx';
import { PcgEnergyDarkness } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDarkness.tsx';
import { PcgEnergyDragon } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyDragon.tsx';
import { PcgEnergyFairy } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFairy.tsx';
import { PcgEnergyFighting } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFighting.tsx';
import { PcgEnergyFire } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyFire.tsx';
import { PcgEnergyGrass } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyGrass.tsx';
import { PcgEnergyLightning } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyLightning.tsx';
import { PcgEnergyMetal } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyMetal.tsx';
import { PcgEnergyPsychic } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyPsychic.tsx';
import { PcgEnergyWater } from '@/parcels/tcg/pcg/icons/energy/PcgEnergyWater.tsx';
import { energyTypes } from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function PcgEnergyFilter({ formData, setFormData }: PcgFormDataProps) {
  const iconSize = 32;
  return (
    <Stack>
      <Group>
        {energyTypes.data.values
          .filter((d) => d.value !== 'free')
          .map((d) => {
            return (
              <Group gap={'0.25rem'} key={d.value}>
                <FilterComponentCheckbox
                  checked={formData.energy.values[d.value] ?? false}
                  onChange={(event) => {
                    const value = event.currentTarget.checked;

                    setFormData((prev) => {
                      const values = prev.energy.values;
                      values[d.value] = value;
                      return {
                        ...prev,
                        energy: { ...prev.energy, values },
                      };
                    });
                  }}
                />
                <Group gap={'0.1rem'}>
                  {d.value === 'colorless' && <PcgEnergyColorless size={iconSize} />}
                  {d.value === 'darkness' && <PcgEnergyDarkness size={iconSize} />}
                  {d.value === 'dragon' && <PcgEnergyDragon size={iconSize} />}
                  {d.value === 'fairy' && <PcgEnergyFairy size={iconSize} />}
                  {d.value === 'fighting' && <PcgEnergyFighting size={iconSize} />}
                  {d.value === 'fire' && <PcgEnergyFire size={iconSize} />}
                  {d.value === 'grass' && <PcgEnergyGrass size={iconSize} />}
                  {d.value === 'lightning' && <PcgEnergyLightning size={iconSize} />}
                  {d.value === 'metal' && <PcgEnergyMetal size={iconSize} />}
                  {d.value === 'psychic' && <PcgEnergyPsychic size={iconSize} />}
                  {d.value === 'water' && <PcgEnergyWater size={iconSize} />}
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
          { value: 'exact', label: 'Genau diese Energien' },
          { value: 'contains', label: 'Enthält eine dieser Energien' },
        ]}
        value={formData.energy.exact ? 'exact' : 'contains'}
        onChange={(value) => {
          setFormData((prev) => ({
            ...prev,
            energy: { ...prev.energy, exact: value === 'exact' },
          }));
        }}
      />
    </Stack>
  );
}
