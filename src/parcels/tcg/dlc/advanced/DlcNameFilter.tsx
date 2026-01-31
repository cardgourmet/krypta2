import { Stack } from '@mantine/core';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';

export function DlcNameFilter({ formData, setFormData }: FormDataProps) {
  return (
    <Stack>
      <FilterComponentText
        placeholder={`Irgendein Wort wie "Fire"`}
        value={formData.name.value}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setFormData((prev) => ({
            ...prev,
            name: { ...prev.name, value: value },
          }));
        }}
      />
      <FilterComponentCheckbox
        label={'Genaue Übereinstimmung'}
        checked={formData.name.exact}
        onChange={(event) => {
          const value = event.currentTarget.checked;
          setFormData((prev) => ({
            ...prev,
            name: { ...prev.name, exact: value },
          }));
        }}
      />
    </Stack>
  );
}
