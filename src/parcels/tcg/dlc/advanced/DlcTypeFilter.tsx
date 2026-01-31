import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';
import { typesAndClassifications } from '@/parcels/tcg/dlc/raw/apiValues.ts';

export function DlcTypeFilter({ formData, setFormData }: FormDataProps) {
  const types = typesAndClassifications.data.values
    .filter((d) => d.type === 'type')
    .map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });
  const classifications = typesAndClassifications.data.values
    .filter((d) => d.type === 'classification')
    .map((d) => {
      return { value: d.value, label: capitalizeFirstLetter(d.value) };
    });

  return (
    <FilterComponentMultiDropdown
      data={[
        { group: 'Types', items: types },
        { group: 'Classifications', items: classifications },
      ]}
      placeholder={'Gib einen Typ ein oder wähle einen'}
      searchable
      value={formData.type.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          type: { ...prev.type, values },
        }));
      }}
    />
  );
}
