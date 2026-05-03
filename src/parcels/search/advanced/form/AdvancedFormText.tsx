import {Stack} from '@mantine/core';
import type {UseFormReturnType} from '@mantine/form';
import {useContext} from 'react';
import type {AdvancedFormProps} from '@/parcels/search/advanced/form/types.ts';
import {AdvancedFilterContext} from '@/parcels/search/advanced/overview/AdvancedFiltersOverview.tsx';
import {StyledCheckbox} from '@/parcels/search/advanced/styled/StyledCheckbox.tsx';
import {StyledTextInput} from '@/parcels/search/advanced/styled/StyledTextInput.tsx';

type AdvancedFormTextProps = AdvancedFormProps & {
  inputPlaceholder?: string;
  checkboxLabel?: string;
  withCheckbox: boolean;
};

export function AdvancedFormText({ k, inputPlaceholder, checkboxLabel, withCheckbox }: AdvancedFormTextProps) {
  const form = useContext(AdvancedFilterContext) as UseFormReturnType<unknown>;

  return (
    <Stack>
      <StyledTextInput
        placeholder={inputPlaceholder}
        key={form.key(`${k}.value`)}
        {...form?.getInputProps(`${k}.value`)}
      />
      {withCheckbox && (
        <StyledCheckbox label={checkboxLabel} key={form.key(`${k}.exact`)} {...form?.getInputProps(`${k}.exact`)} />
      )}
    </Stack>
  );
}
