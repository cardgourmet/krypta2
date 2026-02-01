import type { SetStateAction } from 'react';
import type { DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/useDlcAdvancedFilters.tsx';
import type { PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/usePcgAdvancedFilters.tsx';

export type DlcFormDataProps = {
  formData: DlcAdvancedFilterFormData;
  setFormData: (value: SetStateAction<DlcAdvancedFilterFormData>) => void;
};

export type PcgFormDataProps = {
  formData: PcgAdvancedFilterFormData;
  setFormData: (value: SetStateAction<PcgAdvancedFilterFormData>) => void;
};
