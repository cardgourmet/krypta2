import { Collapse, Group, Stack } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { TFunction } from 'i18next';
import { type HTMLInputAutoCompleteAttribute, type PropsWithChildren, useId, useMemo } from 'react';
import { GourmetPasswordInput } from '@/parcels/generic/mantine/GourmetPasswordInput/GourmetPasswordInput.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { GourmetTextInput } from '@/parcels/generic/mantine/GourmetTextInput/GourmetTextInput.tsx';

export function RegisterFormInputField({
  formValues,
  formFocused,
  formErrors,
  formKey,
  t,
  handleFocus,
  handleChange,
  validationKeys,
  autoComplete,
  password,
  valueProcessor,
}: {
  formValues: Record<string, string>;
  formFocused: Record<keyof typeof formValues, boolean>;
  formErrors: Record<keyof typeof formValues, string[] | undefined>;
  formKey: keyof typeof formValues;
  t: TFunction<string>;
  handleFocus: (name: keyof typeof formValues, value: boolean) => void;
  handleChange: (name: keyof typeof formValues, value: string) => void;
  validationKeys: string[];
  autoComplete?: HTMLInputAutoCompleteAttribute;
  password?: boolean;
  valueProcessor?: (val: string) => string;
}) {
  const inputId = useId();

  const description = t(`${formKey}.description`);
  const describedBy = useMemo(() => {
    return validationKeys.map((key) => `${inputId}-${key}`);
  }, [inputId, validationKeys]);

  const mustValueProcessor = valueProcessor ?? ((val) => val);
  const isValid = formValues[formKey].length > 0 && (formErrors[formKey]?.length ?? 0) === 0;

  return (
    <Stack gap={'0.375rem'}>
      <Stack gap={'0.1rem'}>
        <GourmetText component="label" cgmff={'ui'} fw={'bold'} htmlFor={inputId}>
          {t(`${formKey}.label`)}
        </GourmetText>
        {description && (
          <GourmetText cgmff={'ui'} cgmc={'neutral-6'} lh={'1.25'}>
            {description}
          </GourmetText>
        )}
      </Stack>
      {password && (
        <GourmetPasswordInput
          id={inputId}
          type="password"
          w={'100%'}
          autoComplete={autoComplete}
          value={formValues[formKey]}
          placeholder={t(`${formKey}.placeholder`)}
          onChange={(event) => handleChange(formKey, mustValueProcessor(event.target.value))}
          onFocus={() => handleFocus(formKey, true)}
          onBlur={() => handleFocus(formKey, false)}
          aria-invalid={!isValid}
          aria-describedby={describedBy.join(' ')}
        />
      )}
      {!password && (
        <GourmetTextInput
          id={inputId}
          type="text"
          autoComplete={autoComplete}
          value={formValues[formKey]}
          placeholder={t(`${formKey}.placeholder`)}
          onChange={(event) => handleChange(formKey, mustValueProcessor(event.target.value))}
          onFocus={() => handleFocus(formKey, true)}
          onBlur={() => handleFocus(formKey, false)}
          aria-invalid={!(formValues[formKey].length > 0 && formErrors[formKey]?.length === 0)}
          aria-describedby={describedBy.join(' ')}
        />
      )}
      {validationKeys.length > 0 && (
        <Collapse in={Boolean((formValues[formKey] && !isValid) || formFocused[formKey])} transitionDuration={100}>
          <Stack gap={'0.5rem'}>
            {validationKeys.map((key) => {
              return (
                <ValidationDisplay
                  key={key}
                  inputId={inputId}
                  formValues={formValues}
                  formErrors={formErrors}
                  formKey={formKey}
                  errorKey={key}
                >
                  {t(`${formKey}.errors.${key}`)}
                </ValidationDisplay>
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
}

function ValidationDisplay({
  inputId,
  formValues,
  formErrors,
  formKey,
  errorKey,
  children,
}: PropsWithChildren<{
  inputId: string;
  formValues: Record<string, string>;
  formErrors: Record<keyof typeof formValues, string[] | undefined>;
  formKey: keyof typeof formValues;
  errorKey: string;
}>) {
  return (
    <Group wrap={'nowrap'} gap={'0.5rem'}>
      {(!formValues[formKey] || formErrors[formKey]?.includes(errorKey)) && (
        <IconX size={16} color={'var(--gourmet-red-01)'} aria-label={'Icon X'} />
      )}
      {formValues[formKey] && !formErrors[formKey]?.includes(errorKey) && (
        <IconCheck size={16} color={'var(--gourmet-green-1)'} aria-label={'Icon Check'} />
      )}

      <GourmetText
        id={`${inputId}-${errorKey}`}
        cgmff={'ui'}
        c={
          !formValues[formKey] || formErrors[formKey]?.includes(errorKey)
            ? 'var(--gourmet-red-01)'
            : 'var(--gourmet-green-1)'
        }
        fz={'0.9rem'}
      >
        {children}
      </GourmetText>
    </Group>
  );
}
