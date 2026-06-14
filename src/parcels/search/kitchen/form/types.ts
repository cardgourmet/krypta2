import type { DlcKitchenFormData } from '@/parcels/tcg/dlc/kitchen/formData.ts';
import type { MtgKitchenFormData } from '@/parcels/tcg/mtg/kitchen/formData.ts';
import type { PcgKitchenFormData } from '@/parcels/tcg/pcg/kitchen/formData.ts';

export type KitchenFormProps = {
  k: keyof (PcgKitchenFormData & DlcKitchenFormData & MtgKitchenFormData);
  title: string;
  description: string;
  filter: string;
};
