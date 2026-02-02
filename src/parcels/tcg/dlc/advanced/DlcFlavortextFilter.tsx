import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/advanced/styled/StyledTextInput.tsx';

export function DlcFlavortextFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <StyledTextInput
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
      <StyledCheckbox
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
