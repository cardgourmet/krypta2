import { Group, Stack, Text } from '@mantine/core';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';
import { DlcRarityCommon } from '@/parcels/tcg/dlc/icons/DlcRarityCommon.tsx';
import { DlcRarityEnchanted } from '@/parcels/tcg/dlc/icons/DlcRarityEnchanted.tsx';
import { DlcRarityLegendary } from '@/parcels/tcg/dlc/icons/DlcRarityLegendary.tsx';
import { DlcRarityRare } from '@/parcels/tcg/dlc/icons/DlcRarityRare.tsx';
import { DlcRaritySuperRare } from '@/parcels/tcg/dlc/icons/DlcRaritySuperRare.tsx';
import { DlcRarityUncommon } from '@/parcels/tcg/dlc/icons/DlcRarityUncommon.tsx';
import { rarities } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcRarityFilter({ formData, setFormData }: FormDataProps) {
  const iconSize = 20;
  return (
    <Stack>
      <Group>
        {rarities.data.values.map((d) => {
          return (
            <Group gap={'0.5rem'} key={d.value}>
              <FilterComponentCheckbox
                checked={formData.rarity.values[d.value] ?? false}
                onChange={(event) => {
                  const value = event.currentTarget.checked;

                  setFormData((prev) => {
                    const values = prev.rarity.values;
                    values[d.value] = value;
                    return {
                      ...prev,
                      rarity: { ...prev.rarity, values },
                    };
                  });
                }}
              />
              <Group gap={'0.2rem'}>
                {d.value === 'common' && <DlcRarityCommon size={iconSize} />}
                {d.value === 'uncommon' && <DlcRarityUncommon size={iconSize} />}
                {d.value === 'rare' && <DlcRarityRare size={iconSize} />}
                {d.value === 'super_rare' && <DlcRaritySuperRare size={iconSize} />}
                {d.value === 'legendary' && <DlcRarityLegendary size={iconSize} />}
                {d.value === 'enchanted' && <DlcRarityEnchanted size={iconSize} />}
                <Text fs={'1rem'}>{capitalizeFirstLetter(d.value)}</Text>
              </Group>
            </Group>
          );
        })}
      </Group>
    </Stack>
  );
}
