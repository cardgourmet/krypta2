import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { setNames } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcSetsFilter({ formData, setFormData }: DlcFormDataProps) {
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
