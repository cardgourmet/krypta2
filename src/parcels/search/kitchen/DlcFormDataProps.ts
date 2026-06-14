import type { SetStateAction } from 'react';
import type { DlcKitchenFormData } from '@/parcels/tcg/dlc/kitchen/formData.ts';
import type { PcgKitchenFormData } from '@/parcels/tcg/pcg/kitchen/formData.ts';

export type DlcFormDataProps = {
  formData: DlcKitchenFormData;
  setFormData: (value: SetStateAction<DlcKitchenFormData>) => void;
};

export type PcgFormDataProps = {
  formData: PcgKitchenFormData;
  setFormData: (value: SetStateAction<PcgKitchenFormData>) => void;
};
