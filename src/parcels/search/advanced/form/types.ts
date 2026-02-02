import type { DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/useDlcAdvancedFilters.tsx';
import type { PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/formData.ts';

export type AdvancedFormProps = {
  k: keyof (PcgAdvancedFilterFormData & DlcAdvancedFilterFormData);
  title: string;
  description: string;
  filter: string;
};
