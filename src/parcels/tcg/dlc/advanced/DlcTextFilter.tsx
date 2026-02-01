import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';

export function DlcTextFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <FilterComponentText
        placeholder={`Irgendeine Wortfolge wie "Draw a card"`}
        value={formData.text.value}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setFormData((prev) => ({
            ...prev,
            text: { ...prev.text, value: value },
          }));
        }}
      />
      <FilterComponentCheckbox
        label={'Genaue Übereinstimmung'}
        checked={formData.text.exact}
        onChange={(event) => {
          const value = event.currentTarget.checked;
          setFormData((prev) => ({
            ...prev,
            text: { ...prev.text, exact: value },
          }));
        }}
      />
    </Stack>
  );
}
