import {capitalizeFirstLetter} from "@/parcels/capitalizeFirstLetter.ts";
import {FilterComponentMultiDropdown} from "@/parcels/search/advanced/FilterComponentMultiDropdown.tsx";
import type {FormDataProps} from "@/parcels/search/advanced/FormDataProps.ts";
import {franchises} from "@/parcels/tcg/dlc/raw/apiValues.ts";

export function DlcFranchiseFilter({formData, setFormData}: FormDataProps) {
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
