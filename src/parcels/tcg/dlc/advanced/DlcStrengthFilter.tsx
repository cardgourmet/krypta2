import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';

export function DlcStrengthFilter({ formData, setFormData }: FormDataProps) {
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
