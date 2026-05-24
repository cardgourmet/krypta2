import { Stack } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import type { CuisineFormProps } from '@/parcels/search/cuisine/form/types.ts';
import { SearchCuisineContext } from '@/parcels/search/cuisine/overview/SearchCuisineOverview.tsx';
import { StyledCheckbox } from '@/parcels/search/cuisine/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/cuisine/styled/StyledTextInput.tsx';

type CuisineFormTextProps = CuisineFormProps & {
  inputPlaceholder?: string;
  checkboxLabel?: string;
  withCheckbox: boolean;
};

export function CuisineFormText({ k, inputPlaceholder, checkboxLabel, withCheckbox }: CuisineFormTextProps) {
  const form = useContext(SearchCuisineContext) as UseFormReturnType<unknown>;

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
