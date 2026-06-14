import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { StyledMultiSelect } from '@/parcels/search/kitchen/styled/StyledMultiSelect.tsx';

type ValueLabel = { value: string; label: string };
type KitchenFormMultiSelectProps = KitchenFormProps & {
  data: ValueLabel[] | { group: string; items: ValueLabel[] }[];
  dropdownPlaceholder?: string;
  withExactDropdown?: boolean;
  withoutLimit?: boolean;
};

export function KitchenFormMultiSelect({ k, data, dropdownPlaceholder, withoutLimit }: KitchenFormMultiSelectProps) {
  const form = useContext(SearchKitchenContext) as UseFormReturnType<unknown>;

  return (
    <StyledMultiSelect
      data={data}
      placeholder={dropdownPlaceholder}
      searchable
      limit={withoutLimit ? 10_000 : 10}
      key={form.key(`${k}.values`)}
      {...form?.getInputProps(`${k}.values`)}
    />
  );
}
