import { Stack } from '@mantine/core';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentCheckbox } from '@/parcels/search/advanced/FilterComponentCheckbox.tsx';
import { FilterComponentText } from '@/parcels/search/advanced/FilterComponentText.tsx';

export function DlcArtistFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <Stack>
      <FilterComponentText
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
      <FilterComponentCheckbox
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
