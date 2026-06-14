import type { DlcCuisineFormData } from '@/parcels/tcg/dlc/cuisine/formData.ts';
import type { MtgCuisineFormData } from '@/parcels/tcg/mtg/cuisine/formData.ts';
import type { PcgCuisineFormData } from '@/parcels/tcg/pcg/cuisine/formData.ts';

export type CuisineFormProps = {
  k: keyof (PcgCuisineFormData & DlcCuisineFormData & MtgCuisineFormData);
  title: string;
  description: string;
  filter: string;
};
