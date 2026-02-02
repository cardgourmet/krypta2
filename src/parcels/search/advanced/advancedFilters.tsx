import { Group, Stack, Text } from '@mantine/core';
import { type ReactElement, type SetStateAction, useMemo } from 'react';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentDropdown } from '@/parcels/search/advanced/FilterComponentDropdown.tsx';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import {
  FilterComponentNumberCompare,
  type NumberCompareOperator,
} from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';

type FormFilterData = {
  value?: string | number;
  exact?: boolean;
  values?: string[] | Record<string, boolean>;
  operator?: string;
};
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

          const deepCopy = JSON.parse(JSON.stringify(specificFormData));
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

            const deepCopy = JSON.parse(JSON.stringify(specificFormData));
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

  return (
    <FilterComponentMultiDropdown
      data={data}
      placeholder={dropdownPlaceholder}
      searchable
      value={specificFormData[specificKey].values as string[]}
      limit={20}
      onChange={(values) => {
        const deepCopy = structuredClone(specificFormData);
        deepCopy[specificKey].values = values;
        setFormData(deepCopy as FormData);
      }}
    />
  );
}

type AdvancedMultiCheckboxFilterProps<FormData> = {
  formData: FormData;
  setFormData: (value: SetStateAction<FormData>) => void;
  formKey: keyof FormData;
  data: { value: string; label: string }[];

  iconsMap?: Record<string, ReactElement>;
  moreValuesPlaceholder?: string;
  exactDropdownValues?: Record<'true' | 'false', string>;
};

export function AdvancedMultiCheckboxFilter<FormData>({
  formData,
  setFormData,
  formKey,
  data,
  iconsMap,
  moreValuesPlaceholder,
  exactDropdownValues,
}: AdvancedMultiCheckboxFilterProps<FormData>) {
  const specificFormData = formData as FormFilterDataRecord;
  const specificKey = formKey as string;
  const specificValues = specificFormData[specificKey].values as Record<string, boolean>;

  const moreValues = useMemo(() => {
    const values =
      iconsMap
      && Object.entries(iconsMap).length < data.length
      && data.filter((d) => {
        return iconsMap[d.value] === undefined;
      });
    if (!values) return [];
    return values;
  }, [data, iconsMap]);
  const moreValuesList: string[] = useMemo(() => {
    if (!iconsMap) return [];
    return Object.entries(specificValues)
      .filter(([key]) => iconsMap[key] === undefined)
      .map(([key]) => key);
  }, [specificValues, iconsMap]);

  return (
    <Stack>
      <Group>
        {data
          .filter((d) => !iconsMap || iconsMap[d.value] !== undefined)
          .map((d) => {
            return (
              <Group gap={'0.5rem'} key={d.value}>
                <FilterComponentCheckbox
                  checked={specificValues[d.value] ?? false}
                  onChange={(event) => {
                    specificValues[d.value] = event.currentTarget.checked;

                    const deepCopy = structuredClone(specificFormData);
                    setFormData(deepCopy as FormData);
                  }}
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
      {moreValues && moreValues.length > 0 && (
        <FilterComponentMultiDropdown
          data={moreValues}
          placeholder={moreValuesPlaceholder}
          searchable
          value={moreValuesList}
          onChange={(values) => {
            const newValues = { ...specificValues };
            moreValuesList.forEach((d) => {
              delete newValues[d];
            });
            values.forEach((d) => {
              newValues[d] = true;
            });

            const deepCopy = structuredClone(specificFormData);
            deepCopy[specificKey].values = newValues;
            setFormData(deepCopy as FormData);
          }}
        />
      )}
      {exactDropdownValues?.true && (
        <FilterComponentDropdown
          withCheckIcon={false}
          allowDeselect={false}
          defaultValue={'contains'}
          data={[
            { value: 'exact', label: exactDropdownValues?.true },
            { value: 'contains', label: exactDropdownValues?.false },
          ]}
          value={specificFormData[specificKey].exact ? 'exact' : 'contains'}
          onChange={(value) => {
            const deepCopy = structuredClone(specificFormData);
            deepCopy[specificKey].exact = value === 'exact';
            setFormData(deepCopy as FormData);
          }}
        />
      )}
    </Stack>
  );
}

type AdvancedNumberFilterProps<FormData> = {
  formData: FormData;
  setFormData: (value: SetStateAction<FormData>) => void;
  formKey: keyof FormData;
};

export function AdvancedNumberFilter<FormData>({
  formData,
  setFormData,
  formKey,
}: AdvancedNumberFilterProps<FormData>) {
  const specificFormData = formData as FormFilterDataRecord;
  const specificKey = formKey as string;

  return (
    <FilterComponentNumberCompare
      operator={specificFormData[specificKey].operator as NumberCompareOperator}
      onOperatorChange={(operator) => {
        const deepCopy = structuredClone(specificFormData);
        deepCopy[specificKey].operator = operator;
        setFormData(deepCopy as FormData);
      }}
      value={specificFormData[specificKey].value as number}
      onValueChange={(value) => {
        const deepCopy = structuredClone(specificFormData);
        deepCopy[specificKey].value = value;
        setFormData(deepCopy as FormData);
      }}
    />
  );
}
