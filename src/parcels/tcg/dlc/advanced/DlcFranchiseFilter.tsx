import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledMultiSelect } from '@/parcels/search/advanced/styled/StyledMultiSelect.tsx';
import { franchises } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcFranchiseFilter({ formData, setFormData }: DlcFormDataProps) {
  const franchiseNames = franchises.data.values
    .filter((d) => d.type === 'name')
    .map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });

  return (
    <StyledMultiSelect
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
