import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { franchises } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcFranchiseFilter({ formData, setFormData }: DlcFormDataProps) {
  const franchiseNames = franchises.data.values
    .filter((d) => d.type === 'name')
    .map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });

  return (
    <FilterComponentMultiDropdown
      data={franchiseNames}
      searchable
      placeholder={`Gib ein Franchise ein oder wähle eins`}
      value={formData.franchise.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          franchise: { ...prev.franchise, values },
        }));
      }}
    />
  );
}
