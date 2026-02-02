import { Stack } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import { AdvancedFilterContext } from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';
import type { AdvancedFormProps } from '@/parcels/search/advanced/form/types.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/advanced/styled/StyledTextInput.tsx';
import type { PcgAdvancedFilterFormData } from '@/parcels/tcg/pcg/advanced/formData.ts';

export type AdvancedFormTextProps = AdvancedFormProps & {
  withCheckbox: boolean;
};

export function AdvancedFormText({ k, withCheckbox }: AdvancedFormTextProps) {
  const form = useContext(AdvancedFilterContext) as UseFormReturnType<PcgAdvancedFilterFormData>;

  return (
    <Stack>
      <StyledTextInput placeholder={''} {...form?.getInputProps(`${k}.value`)} />
      {withCheckbox && <StyledCheckbox label={''} {...form?.getInputProps(`${k}.exact`)} />}
    </Stack>
  );
}
