import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/advanced/styled/StyledTextInput.tsx';

export function DlcArtistFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <StyledTextInput
        placeholder={`Irgendein Teil eines Namens wie "Magali"`}
        value={formData.artist.value}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setFormData((prev) => ({
            ...prev,
            artist: { ...prev.artist, value: value },
          }));
        }}
      />
      <StyledCheckbox
        label={'Genaue Übereinstimmung'}
        checked={formData.artist.exact}
        onChange={(event) => {
          const value = event.currentTarget.checked;
          setFormData((prev) => ({
            ...prev,
            artist: { ...prev.artist, exact: value },
          }));
        }}
      />
    </Stack>
  );
}
