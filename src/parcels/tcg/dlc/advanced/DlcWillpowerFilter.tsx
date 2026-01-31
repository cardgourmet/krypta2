import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';

export function DlcWillpowerFilter({ formData, setFormData }: FormDataProps) {
  return (
    <FilterComponentNumberCompare
      operator={formData.willpower.operator}
      onOperatorChange={(operator) => {
        setFormData((prev) => ({
          ...prev,
          willpower: { ...prev.willpower, operator },
        }));
      }}
      value={formData.willpower.value}
      onValueChange={(value) => {
        setFormData((prev) => ({
          ...prev,
          willpower: { ...prev.willpower, value },
        }));
      }}
    />
  );
}
