import { Stack } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { StyledCheckbox } from '@/parcels/search/kitchen/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/kitchen/styled/StyledTextInput.tsx';

type KitchenFormTextProps = KitchenFormProps & {
  inputPlaceholder?: string;
  checkboxLabel?: string;
  withCheckbox: boolean;
};

export function KitchenFormText({ k, inputPlaceholder, checkboxLabel, withCheckbox }: KitchenFormTextProps) {
  const form = useContext(SearchKitchenContext) as UseFormReturnType<unknown>;

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
