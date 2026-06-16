import { Flex } from '@mantine/core';
import { useContext } from 'react';
import { Controller } from 'react-hook-form';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext2 } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { StyledMultiSelect } from '@/parcels/search/kitchen/styled/StyledMultiSelect.tsx';

type ValueLabel = { value: string; label: string };
type KitchenFormMultiSelectProps = KitchenFormProps<{ values: string[] }> & {
  data: ValueLabel[] | { group: string; items: ValueLabel[] }[];
  dropdownPlaceholder?: string;
  withExactDropdown?: boolean;
  withoutLimit?: boolean;
};

export function KitchenFormMultiSelect({ k, data, dropdownPlaceholder, withoutLimit }: KitchenFormMultiSelectProps) {
  const form2 = useContext(SearchKitchenContext2);

  return (
    <Flex maw={'50%'}>
      <Controller
        control={form2?.control}
        render={(f) => {
          return (
            <StyledMultiSelect
              w={'100%'}
              data={data}
              placeholder={dropdownPlaceholder}
              searchable
              limit={withoutLimit ? 10_000 : 10}
              {...f.field}
            />
          );
        }}
        name={`${k}.values`}
      />
    </Flex>
  );
}
