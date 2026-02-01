import { Stack } from '@mantine/core';
import type { SetStateAction } from 'react';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';

type FormFilterData = { value?: string; exact?: boolean; values?: string[] | Record<string, boolean> };
type FormFilterDataRecord = Record<string, FormFilterData>;

type AdvancedTextFilterProps<FormData> = {
  formData: FormData;
  setFormData: (value: SetStateAction<FormData>) => void;
  formKey: keyof FormData;

  dropdownPlaceholder?: string;

  withExactCheckbox?: boolean;
  checkboxLabel?: string;
};

export function AdvancedTextFilter<FormData>({
  formData,
  setFormData,
  formKey,
  dropdownPlaceholder,
  withExactCheckbox,
  checkboxLabel,
}: AdvancedTextFilterProps<FormData>) {
  const specificFormData = formData as FormFilterDataRecord;
  const specificKey = formKey as string;

  return (
    <Stack>
      <FilterComponentText
        placeholder={dropdownPlaceholder}
        value={specificFormData[specificKey].value}
        onChange={(event) => {
          const value = event.currentTarget.value;

          const deepCopy = structuredClone(specificFormData);
          deepCopy[specificKey].value = value;
          setFormData(deepCopy as FormData);
        }}
      />
      {withExactCheckbox && (
        <FilterComponentCheckbox
          label={checkboxLabel}
          checked={specificFormData[specificKey].exact}
          onChange={(event) => {
            const value = event.currentTarget.checked;

            const deepCopy = structuredClone(specificFormData);
            deepCopy[specificKey].exact = value;
            setFormData(deepCopy as FormData);
          }}
        />
      )}
    </Stack>
  );
}

type AdvancedMultiSelectProps<FormData> = {
  formData: FormData;
  setFormData: (value: SetStateAction<FormData>) => void;
  formKey: keyof FormData;
  data: { value: string; label: string }[];

  dropdownPlaceholder?: string;

  withExactDropdown?: boolean;
};

export function AdvancedMultiSelectFilter<FormData>({
  formData,
  setFormData,
  formKey,
  data,
  dropdownPlaceholder,
}: AdvancedMultiSelectProps<FormData>) {
  const specificFormData = formData as FormFilterDataRecord;
  const specificKey = formKey as string;

  console.log(specificFormData, formKey, specificKey);

  return (
    <FilterComponentMultiDropdown
      data={data}
      placeholder={dropdownPlaceholder}
      searchable
      value={specificFormData[specificKey].values as string[]}
      onChange={(values) => {
        const deepCopy = structuredClone(specificFormData);
        deepCopy[specificKey].values = values;
        setFormData(deepCopy as FormData);
      }}
    />
  );
}
