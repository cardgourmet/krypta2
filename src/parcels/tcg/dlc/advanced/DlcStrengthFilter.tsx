import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';

export function DlcStrengthFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <FilterComponentNumberCompare
      operator={formData.strength.operator}
      onOperatorChange={(operator) => {
        setFormData((prev) => ({
          ...prev,
          strength: { ...prev.strength, operator },
        }));
      }}
      value={formData.strength.value}
      onValueChange={(value) => {
        setFormData((prev) => ({
          ...prev,
          strength: { ...prev.strength, value },
        }));
      }}
    />
  );
}
