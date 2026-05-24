import type { SetStateAction } from 'react';
import type { DlcCuisineFormData } from '@/parcels/tcg/dlc/cuisine/formData.ts';
import type { PcgCuisineFormData } from '@/parcels/tcg/pcg/cuisine/formData.ts';

export type DlcFormDataProps = {
  formData: DlcCuisineFormData;
  setFormData: (value: SetStateAction<DlcCuisineFormData>) => void;
};

export type PcgFormDataProps = {
  formData: PcgCuisineFormData;
  setFormData: (value: SetStateAction<PcgCuisineFormData>) => void;
};
