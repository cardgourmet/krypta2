import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledNumberCompare } from '@/parcels/search/advanced/styled/StyledNumberCompare.tsx';

export function DlcWillpowerFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <StyledNumberCompare
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
