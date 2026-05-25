import type { UseFormReturnType } from '@mantine/form';
import type { Extend, Structure } from '@/parcels/composition/extend';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';

export type ListPropertiesFormFieldsProps = Extend<
  Structure,
  {
    advancedDefaultExpanded?: boolean;
    form: UseFormReturnType<ListPropertiesFormValues>;
  }
>;

export type ListPropertiesFormValues = {
  allowedTcgs: Tcg[];
  color: 'default' | (string & {});
  description: string;
  name: string;
  visibility: 'private' | 'public';
};
