import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledNumberCompare } from '@/parcels/search/advanced/styled/StyledNumberCompare.tsx';

export function DlcMovecostFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <StyledNumberCompare
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
