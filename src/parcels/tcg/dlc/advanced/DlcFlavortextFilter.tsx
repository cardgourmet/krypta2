import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';

export function DlcFlavortextFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <FilterComponentText
        placeholder={`Irgendeine Wortfolge wie "Why did Urza"`}
        value={formData.flavortext.value}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setFormData((prev) => ({
            ...prev,
            flavortext: { ...prev.flavortext, value: value },
          }));
        }}
      />
      <FilterComponentCheckbox
        label={'Genaue Übereinstimmung'}
        checked={formData.flavortext.exact}
        onChange={(event) => {
          const value = event.currentTarget.checked;
          setFormData((prev) => ({
            ...prev,
            flavortext: { ...prev.flavortext, exact: value },
          }));
        }}
      />
    </Stack>
  );
}
