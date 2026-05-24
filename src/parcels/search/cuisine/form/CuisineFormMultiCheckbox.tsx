import { Group, Stack, Text } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { type ReactElement, useContext } from 'react';
import type { CuisineFormProps } from '@/parcels/search/cuisine/form/types.ts';
import { SearchCuisineContext } from '@/parcels/search/cuisine/overview/SearchCuisineOverview.tsx';
import { StyledCheckbox } from '@/parcels/search/cuisine/styled/StyledCheckbox.tsx';
import { StyledSelect } from '@/parcels/search/cuisine/styled/StyledSelect.tsx';

type CuisineFormMultiCheckboxProps = CuisineFormProps & {
  data: { value: string; label: string }[];
  iconsMap?: Record<string, ReactElement>;
  exactDropdownValues?: Record<'exact' | 'contains', string>;
};

export function CuisineFormMultiCheckbox({ k, data, iconsMap, exactDropdownValues }: CuisineFormMultiCheckboxProps) {
  const form = useContext(SearchCuisineContext) as UseFormReturnType<unknown>;

  return (
    <Stack>
      <Group>
        {data
          .filter((d) => !iconsMap || iconsMap[d.value] !== undefined)
          .map((d) => {
            return (
              <Group gap={'0.5rem'} key={d.value}>
                <StyledCheckbox
                  key={form.key(`${k}.values.${d.value}`)}
                  {...form?.getInputProps(`${k}.values.${d.value}`)}
                />

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
          key={form.key(`${k}.mode`)}
          {...form?.getInputProps(`${k}.mode`)}
        />
      )}
    </Stack>
  );
}
