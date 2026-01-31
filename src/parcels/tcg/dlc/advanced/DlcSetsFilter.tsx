import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';
import { setNames } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcSetsFilter({ formData, setFormData }: FormDataProps) {
  return (
    <FilterComponentMultiDropdown
      data={setNames.data.values.map((d) => d.value)}
      searchable
      placeholder={`Gib einen Setnamen ein oder wähle eins`}
      value={formData.sets.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          sets: { ...prev.sets, values },
        }));
      }}
    />
  );
}
