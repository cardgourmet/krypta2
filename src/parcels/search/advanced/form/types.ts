import type { DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/formData.ts';
import type { MtgAdvancedFilterFormData } from '@/parcels/tcg/mtg/advanced/formData.ts';
import type { PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/formData.ts';

export type AdvancedFormProps = {
  k: keyof (PcgAdvancedFilterFormData & DlcAdvancedFilterFormData & MtgAdvancedFilterFormData);
  title: string;
  description: string;
  filter: string;
};
