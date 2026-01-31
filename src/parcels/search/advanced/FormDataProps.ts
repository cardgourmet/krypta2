import type { SetStateAction } from 'react';
import type { DlcAdvancedFilterFormData } from '@/parcels/tcg/dlc/advanced/useDlcAdvancedFilters.tsx';

export type FormDataProps = {
  formData: DlcAdvancedFilterFormData;
  setFormData: (value: SetStateAction<DlcAdvancedFilterFormData>) => void;
};
