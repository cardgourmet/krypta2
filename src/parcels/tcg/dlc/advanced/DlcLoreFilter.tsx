import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';

export function DlcLoreFilter({ formData, setFormData }: FormDataProps) {
  return (
    <FilterComponentNumberCompare
      operator={formData.lore.operator}
      onOperatorChange={(operator) => {
        setFormData((prev) => ({
          ...prev,
          lore: { ...prev.lore, operator },
        }));
      }}
      value={formData.lore.value}
      onValueChange={(value) => {
        setFormData((prev) => ({
          ...prev,
          lore: { ...prev.lore, value },
        }));
      }}
    />
  );
}
