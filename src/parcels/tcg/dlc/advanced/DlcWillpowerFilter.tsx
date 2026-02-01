import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';

export function DlcWillpowerFilter({ formData, setFormData }: DlcFormDataProps) {
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
