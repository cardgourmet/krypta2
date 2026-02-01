import { Group, Stack, Text } from '@mantine/core';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { PcgFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { baseTypes } from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function PcgBasetypeFilter({ formData, setFormData }: PcgFormDataProps) {
  const basetypes = baseTypes.data.values.map((d) => {
    return { value: d.value, label: capitalizeFirstLetter(d.value) };
  });

  return (
    <Stack>
      <Group>
        {basetypes.map((d) => {
          return (
            <Group gap={'0.5rem'} key={d.value}>
              <FilterComponentCheckbox
                checked={formData.basetype.values[d.value] ?? false}
                onChange={(event) => {
                  const value = event.currentTarget.checked;

                  setFormData((prev) => {
                    const values = prev.basetype.values;
                    values[d.value] = value;
                    return {
                      ...prev,
                      basetype: { ...prev.basetype, values },
                    };
                  });
                }}
              />
              <Text fs={'1rem'}>{capitalizeFirstLetter(d.value)}</Text>
            </Group>
          );
        })}
      </Group>
    </Stack>
  );
}
