import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/advanced/styled/StyledTextInput.tsx';

export function DlcNameFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <StyledTextInput
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
      <StyledCheckbox
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
