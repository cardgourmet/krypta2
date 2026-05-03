import type {SetStateAction} from 'react';
import type {DlcAdvancedFilterFormData} from "@/parcels/tcg/dlc/advanced/formData.ts";
import type {PcgAdvancedFilterFormData} from "@/parcels/tcg/pcg/advanced/formData.ts";

export type DlcFormDataProps = {
  formData: DlcAdvancedFilterFormData;
  setFormData: (value: SetStateAction<DlcAdvancedFilterFormData>) => void;
};

export type PcgFormDataProps = {
  formData: PcgAdvancedFilterFormData;
  setFormData: (value: SetStateAction<PcgAdvancedFilterFormData>) => void;
};
