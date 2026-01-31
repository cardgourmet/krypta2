import type { SetStateAction } from 'react';
import type { DlcAdvancedFilterFormData } from '@/routes/dlc/advanced/-dlcAdvancedCategories.tsx';

export type FormDataProps = {
  formData: DlcAdvancedFilterFormData;
  setFormData: (value: SetStateAction<DlcAdvancedFilterFormData>) => void;
};
