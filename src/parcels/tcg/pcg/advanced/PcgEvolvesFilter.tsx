import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { PcgFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentMultiDropdown } from '@/parcels/search/advanced/FilterComponentMultiDropdown.tsx';
import { evolvesFromName } from '@/parcels/tcg/pcg/raw/apiValues.ts';

export function PcgEvolvesFilter({ formData, setFormData }: PcgFormDataProps) {
  const evolvesNames = evolvesFromName.data.values.map((d) => {
    return { value: d.value, label: capitalizeFirstLetter(d.value) };
  });

  return (
    <FilterComponentMultiDropdown
      data={evolvesNames}
      placeholder={'Gib ein Pokémon ein oder wähle eins'}
      searchable
      value={formData.evolves.values}
      onChange={(values) => {
        setFormData((prev) => ({
          ...prev,
          evolves: { ...prev.evolves, values },
        }));
      }}
    />
  );
}
