import { Group, Stack, Text } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { type ReactElement, useContext } from 'react';
import { AdvancedFilterContext } from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';
import type { AdvancedFormProps } from '@/parcels/search/advanced/form/types.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledSelect } from '@/parcels/search/advanced/styled/StyledSelect.tsx';

type AdvancedFormMultiCheckboxProps = AdvancedFormProps & {
  data: { value: string; label: string }[];
  iconsMap?: Record<string, ReactElement>;
  exactDropdownValues?: Record<'exact' | 'contains', string>;
};

export function AdvancedFormMultiCheckbox({ k, data, iconsMap, exactDropdownValues }: AdvancedFormMultiCheckboxProps) {
  const form = useContext(AdvancedFilterContext) as UseFormReturnType<unknown>;

  return (
    <Stack>
      <Group>
        {data
          .filter((d) => !iconsMap || iconsMap[d.value] !== undefined)
          .map((d) => {
            return (
              <Group gap={'0.5rem'} key={d.value}>
                <StyledCheckbox {...form.getInputProps(`${k}.values.${d.value}`)} />

                {!iconsMap && <Text fs={'1rem'}>{d.label}</Text>}
                {iconsMap && (
                  <Group gap={'0.1rem'}>
                    {iconsMap[d.value] ?? <div>icon not found</div>}
                    <Text fs={'1rem'}>{d.label}</Text>
                  </Group>
                )}
              </Group>
            );
          })}
      </Group>
      {exactDropdownValues?.exact && (
        <StyledSelect
          withCheckIcon={false}
          allowDeselect={false}
          data={[
            { value: 'exact', label: exactDropdownValues?.exact },
            { value: 'contains', label: exactDropdownValues?.contains },
          ]}
          {...form.getInputProps(`${k}.mode`)}
        />
      )}
    </Stack>
  );
}
