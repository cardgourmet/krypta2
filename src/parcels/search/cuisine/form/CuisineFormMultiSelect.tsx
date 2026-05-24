import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import type { CuisineFormProps } from '@/parcels/search/cuisine/form/types.ts';
import { SearchCuisineContext } from '@/parcels/search/cuisine/overview/SearchCuisineOverview.tsx';
import { StyledMultiSelect } from '@/parcels/search/cuisine/styled/StyledMultiSelect.tsx';

type ValueLabel = { value: string; label: string };
type CuisineFormMultiSelectProps = CuisineFormProps & {
  data: ValueLabel[] | { group: string; items: ValueLabel[] }[];
  dropdownPlaceholder?: string;
  withExactDropdown?: boolean;
  withoutLimit?: boolean;
};

export function CuisineFormMultiSelect({ k, data, dropdownPlaceholder, withoutLimit }: CuisineFormMultiSelectProps) {
  const form = useContext(SearchCuisineContext) as UseFormReturnType<unknown>;

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
