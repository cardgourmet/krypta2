import { FilterComponentNumberCompare } from '@/parcels/search/advanced/FilterComponentNumberCompare.tsx';
import type { FormDataProps } from '@/parcels/search/advanced/FormDataProps.ts';

export function DlcMovecostFilter({ formData, setFormData }: FormDataProps) {
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
