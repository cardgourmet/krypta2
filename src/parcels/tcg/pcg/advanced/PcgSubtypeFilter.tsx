import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { PcgFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { subTypes } from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function PcgSubtypeFilter({ formData, setFormData }: PcgFormDataProps) {
  const subtypes = subTypes.data.values.map((d) => {
    return { value: d.value, label: capitalizeFirstLetter(d.value) };
  });

  return (
    <FilterComponentMultiDropdown
      data={subtypes}
      placeholder={'Gib einen Subtypen ein oder wähle einen'}
      searchable
      value={formData.subtype.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          subtype: { ...prev.subtype, values },
        }));
      }}
    />
  );
}
