import { Stack } from '@mantine/core';
import { useContext } from 'react';
import { Controller } from 'react-hook-form';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext2 } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import { StyledCheckbox } from '@/parcels/search/kitchen/styled/StyledCheckbox.tsx';
import { StyledTextInput } from '@/parcels/search/kitchen/styled/StyledTextInput.tsx';

type KitchenFormTextProps = KitchenFormProps<{ value: string; exact: boolean }> & {
  inputPlaceholder?: string;
  checkboxLabel?: string;
  withCheckbox: boolean;
};

export function KitchenFormText({ k, inputPlaceholder, checkboxLabel, withCheckbox }: KitchenFormTextProps) {
  const form2 = useContext(SearchKitchenContext2);

  return (
    <Stack maw={'50%'}>
      <Controller
        control={form2?.control}
        render={(f) => {
          return <StyledTextInput placeholder={inputPlaceholder} {...f.field} />;
        }}
        name={`${k}.value`}
      />
      {withCheckbox && (
        <Controller
          control={form2?.control}
          render={(f) => {
            return (
              <StyledCheckbox
                label={checkboxLabel}
                checked={f.field.value}
                onChange={f.field.onChange}
                onBlur={f.field.onBlur}
              />
            );
          }}
          name={`${k}.exact`}
        />
      )}
    </Stack>
  );
}
