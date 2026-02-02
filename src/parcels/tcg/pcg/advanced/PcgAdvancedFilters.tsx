import { IconTextSize } from '@tabler/icons-react';
import { AdvancedFilterCategory } from '@/parcels/search/advanced/form/AdvancedFilterCategory.tsx';
import { AdvancedFormText } from '@/parcels/search/advanced/form/AdvancedFormText.tsx';

export function PcgAdvancedFilters() {
  return (
    <>
      <AdvancedFilterCategory category={'text'} icon={<IconTextSize />}>
        <AdvancedFormText k={'text'} title={'Text'} description={'Some text'} filter={'text'} withCheckbox />
      </AdvancedFilterCategory>
      <AdvancedFilterCategory category={'text'} icon={<IconTextSize />}>
        <AdvancedFormText k={'text'} title={'Text'} description={'Some text'} filter={'text'} withCheckbox />
      </AdvancedFilterCategory>
    </>
  );
}
