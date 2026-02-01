import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';

export function DlcLoreFilter({ formData, setFormData }: DlcFormDataProps) {
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
