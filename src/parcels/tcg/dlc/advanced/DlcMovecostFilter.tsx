import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';

export function DlcMovecostFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <FilterComponentNumberCompare
      operator={formData.movecost.operator}
      onOperatorChange={(operator) => {
        setFormData((prev) => ({
          ...prev,
          movecost: { ...prev.movecost, operator },
        }));
      }}
      value={formData.movecost.value}
      onValueChange={(value) => {
        setFormData((prev) => ({
          ...prev,
          movecost: { ...prev.movecost, value },
        }));
      }}
    />
  );
}
