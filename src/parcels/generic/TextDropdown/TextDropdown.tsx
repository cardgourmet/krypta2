import { Combobox, Group, Stack, type StyleProp, UnstyledButton, useCombobox } from '@mantine/core';
import { IconCaretDownFilled, IconCheck } from '@tabler/icons-react';
import type { Property } from 'csstype';
import type { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './TextDropdown.module.css';

export type TextDropdownProps = {
  items: Record<string, string | TextDropdownEntry>;
  t: TFunction<string>;
  transPrefix?: string;

  defaultSelected?: string;
  onSelect?: (selected: string) => void;

  miw?: StyleProp<Property.MinWidth<string | number> | undefined>;
  color?: 'blue' | 'grey';
  trim?: boolean;
  disabled?: boolean;
};
export type TextDropdownEntry = {
  key: string;
  value: string;
  description?: string;
};

export function TextDropdown({
  items,
  t,
  transPrefix,
  defaultSelected,
  onSelect,
  miw,
  color,
  trim,
  disabled,
}: TextDropdownProps) {
  const combobox = useCombobox();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultSelected);
  useEffect(() => {
    setSelectedValue(defaultSelected);
  }, [defaultSelected]);

  const options = Object.entries(items).map(([key, value]) => {
    const entry = (value as TextDropdownEntry).value
      ? (value as TextDropdownEntry)
      : ({ key: key, value: value } as TextDropdownEntry);

    return (
      <Combobox.Option value={key} key={key}>
        <Group justify={'space-between'} align={entry.description ? 'start' : undefined}>
          <Stack gap={'0'}>
            <GourmetText
              cgmff={'ui'}
              fw={key === selectedValue ? '600' : 'inherit'}
              cgmc={key === selectedValue ? 'neutral-9' : 'neutral-7'}
            >
              {entry.value}
            </GourmetText>
            {entry.description && (
              <Group maw={'12rem'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-5'} fz={'0.875rem'}>
                  {entry.description}
                </GourmetText>
              </Group>
            )}
          </Stack>
          <Group w={18} miw={18} justify={'center'}>
            {key === selectedValue && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
          </Group>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setSelectedValue(val);
        combobox.closeDropdown();

        if (onSelect) onSelect(val);
      }}
      position={'bottom-start'}
      disabled={disabled}
    >
      <Combobox.Target>
        <UnstyledButton
          onClick={() => {
            if (combobox.dropdownOpened) combobox.closeDropdown();
            else combobox.openDropdown();
          }}
          classNames={{ root: styles.dropdownTextButton }}
          data-disabled={disabled}
          disabled={disabled}
          style={{
            '--color': (color ?? 'blue') === 'blue' ? 'var(--gourmet-blue-1)' : 'var(--gourmet-neutral-6)',
          }}
        >
          <Group gap={'0.25rem'} pl={trim === true ? undefined : '0.25rem'}>
            <GourmetText
              cgmff="ui"
              c={
                disabled
                  ? 'var(--gourmet-neutral-5)'
                  : (color ?? 'blue') === 'blue'
                    ? 'var(--gourmet-blue-1)'
                    : 'var(--gourmet-neutral-6)'
              }
            >
              {t(`${transPrefix ? `${transPrefix}.` : ''}${selectedValue}`)}
            </GourmetText>
            <IconCaretDownFilled
              size={14}
              color={
                disabled
                  ? 'var(--gourmet-neutral-5)'
                  : (color ?? 'blue') === 'blue'
                    ? 'var(--gourmet-blue-1)'
                    : 'var(--gourmet-neutral-6)'
              }
            />
          </Group>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown miw={miw ?? 'fit-content'}>
        <Combobox.Options mah={'24rem'} style={{ overflowY: 'auto' }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
