import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';

export function DlcNameFilter({ formData, setFormData }: DlcFormDataProps) {
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
