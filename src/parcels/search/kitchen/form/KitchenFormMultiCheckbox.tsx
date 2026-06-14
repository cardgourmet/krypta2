import { Group, Stack, Text } from '@mantine/core';
import { type ReactElement, useContext } from 'react';
import { Controller } from 'react-hook-form';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext2 } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { StyledCheckbox } from '@/parcels/search/kitchen/styled/StyledCheckbox.tsx';
import { StyledSelect } from '@/parcels/search/kitchen/styled/StyledSelect.tsx';

type KitchenFormMultiCheckboxProps = KitchenFormProps<{ strictValues: Record<string, boolean>; mode: string }> & {
  data: { value: string; label: string }[];
  iconsMap?: Record<string, ReactElement>;
  exactDropdownValues?: Record<'exact' | 'contains', string>;
};

export function KitchenFormMultiCheckbox({ k, data, iconsMap, exactDropdownValues }: KitchenFormMultiCheckboxProps) {
  const form2 = useContext(SearchKitchenContext2);

  return (
    <Stack>
      <Group>
        {data
          .filter((d) => !iconsMap || iconsMap[d.value] !== undefined)
          .map((d) => {
            return (
              <Group gap={'0.5rem'} key={d.value}>
                <Controller
                  control={form2?.control}
                  render={(f) => {
                    return (
                      <StyledCheckbox checked={f.field.value} onChange={f.field.onChange} onBlur={f.field.onBlur} />
                    );
                  }}
                  name={`${k}.strictValues.${d.value}`}
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
        <Controller
          control={form2?.control}
          render={(f) => {
            return (
              <StyledSelect
                withCheckIcon={false}
                allowDeselect={false}
                data={[
                  { value: 'exact', label: exactDropdownValues?.exact },
                  { value: 'contains', label: exactDropdownValues?.contains },
                ]}
                {...f.field}
              />
            );
          }}
          name={`${k}.mode`}
        />
      )}
    </Stack>
  );
}
