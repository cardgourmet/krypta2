import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { PcgFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { baseTypes } from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function PcgBasetypeFilter({ formData, setFormData }: PcgFormDataProps) {
  const basetypes = baseTypes.data.values.map((d) => {
    return { value: d.value, label: capitalizeFirstLetter(d.value) };
  });

  return (
    <FilterComponentMultiDropdown
      data={basetypes}
      placeholder={'Gib einen Basis-Typen ein oder wähle einen'}
      searchable
      value={formData.basetype.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          basetype: { ...prev.basetype, values },
        }));
      }}
    />
  );
}
