import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import type { AdvancedFormProps } from '@/parcels/search/advanced/form/types.ts';
import { AdvancedFilterContext } from '@/parcels/search/advanced/overview/AdvancedFiltersOverview.tsx';
import { StyledMultiSelect } from '@/parcels/search/advanced/styled/StyledMultiSelect.tsx';

type ValueLabel = { value: string; label: string };
type AdvancedFormMultiSelectProps = AdvancedFormProps & {
  data: ValueLabel[] | { group: string; items: ValueLabel[] }[];
  dropdownPlaceholder?: string;
  withExactDropdown?: boolean;
  withoutLimit?: boolean;
};

export function AdvancedFormMultiSelect({ k, data, dropdownPlaceholder, withoutLimit }: AdvancedFormMultiSelectProps) {
  const form = useContext(AdvancedFilterContext) as UseFormReturnType<unknown>;

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
