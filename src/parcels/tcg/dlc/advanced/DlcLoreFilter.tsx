import type { DlcFormDataProps } from '@/parcels/search/advanced/DlcFormDataProps.ts';
import { StyledNumberCompare } from '@/parcels/search/advanced/styled/StyledNumberCompare.tsx';

export function DlcLoreFilter({ formData, setFormData }: DlcFormDataProps) {
  return (
    <StyledNumberCompare
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
