import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { PcgFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { evoStages } from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function PcgStageFilter({ formData, setFormData }: PcgFormDataProps) {
  const stages = evoStages.data.values.map((d) => {
    return { value: d.value, label: capitalizeFirstLetter(d.value) };
  });

  return (
    <FilterComponentMultiDropdown
      data={stages}
      placeholder={'Gib eine Entwicklungsstufe ein oder wähle einen'}
      searchable
      value={formData.stage.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          stage: { ...prev.stage, values },
        }));
      }}
    />
  );
}
