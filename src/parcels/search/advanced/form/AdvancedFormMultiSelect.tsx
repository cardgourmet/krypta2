import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import { AdvancedFilterContext } from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';
import type { AdvancedFormProps } from '@/parcels/search/advanced/form/types.ts';
import { StyledMultiSelect } from '@/parcels/search/advanced/styled/StyledMultiSelect.tsx';

type AdvancedFormMultiSelectProps = AdvancedFormProps & {
  data: { value: string; label: string }[];
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
      {...form?.getInputProps(`${k}.values`)}
    />
  );
}
