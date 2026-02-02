import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledNumberCompare } from '@/parcels/search/advanced/styled/StyledNumberCompare.tsx';

export function DlcStrengthFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <StyledNumberCompare
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
