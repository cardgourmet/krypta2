import { Stack } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import { AdvancedFilterContext } from '@/parcels/search/advanced/form/AdvancedFiltersOverview.tsx';
import type { AdvancedFormProps } from '@/parcels/search/advanced/form/types.ts';
import { StyledCheckbox } from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/advanced/styled/StyledTextInput.tsx';

type AdvancedFormTextProps = AdvancedFormProps & {
  inputPlaceholder?: string;
  checkboxLabel?: string;
  withCheckbox: boolean;
};

export function AdvancedFormText({ k, inputPlaceholder, checkboxLabel, withCheckbox }: AdvancedFormTextProps) {
  const form = useContext(AdvancedFilterContext) as UseFormReturnType<unknown>;

  return (
    <Stack>
      <StyledTextInput placeholder={inputPlaceholder} {...form?.getInputProps(`${k}.value`)} />
      {withCheckbox && <StyledCheckbox label={checkboxLabel} {...form?.getInputProps(`${k}.exact`)} />}
    </Stack>
  );
}
