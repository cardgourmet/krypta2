import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/advanced/styled/StyledTextInput.tsx';

export function DlcTextFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <StyledTextInput
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
      <StyledCheckbox
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
