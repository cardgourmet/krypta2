import {Combobox, Group, type StyleProp, UnstyledButton, useCombobox} from '@mantine/core';
import {IconCaretDownFilled, IconCheck} from '@tabler/icons-react';
import type {Property} from 'csstype';
import type {TFunction} from 'i18next';
import {useEffect, useState} from 'react';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './TextDropdown.module.css';

export type TextDropdownProps = {
  items: Record<string, string>;
  t: TFunction<string>;
  transPrefix?: string;

  defaultSelected?: string;
  onSelect?: (selected: string) => void;

  miw?: StyleProp<Property.MinWidth<string | number> | undefined>;
};

export function TextDropdown({ items, t, transPrefix, defaultSelected, onSelect, miw }: TextDropdownProps) {
  const combobox = useCombobox();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultSelected);
  useEffect(() => {
    setSelectedValue(defaultSelected);
  }, [defaultSelected]);

  const options = Object.entries(items).map(([key, value]) => (
    <Combobox.Option value={key} key={key}>
      <Group justify={'space-between'}>
        <Group>
          <GourmetText
            cgmff={'ui'}
            fw={key === selectedValue ? '600' : 'inherit'}
            cgmc={key === selectedValue ? 'neutral-9' : 'neutral-7'}
          >
            {value}
          </GourmetText>
        </Group>
        {key === selectedValue && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setSelectedValue(val);
        combobox.closeDropdown();

        if (onSelect) onSelect(val);
      }}
      position={'bottom-start'}
    >
      <Combobox.Target>
        <UnstyledButton
          onClick={() => {
            if (combobox.dropdownOpened) combobox.closeDropdown();
            else combobox.openDropdown();
          }}
          classNames={{ root: styles.dropdownTextButton }}
        >
          <Group gap={'0.25rem'} pl={'0.25rem'}>
            <GourmetText cgmff="ui" c={'var(--gourmet-blue-1)'}>
              {t(`${transPrefix ? `${transPrefix}.` : ''}${selectedValue}`)}
            </GourmetText>
            <IconCaretDownFilled size={14} color={'var(--gourmet-blue-1)'} />
          </Group>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown miw={miw ?? '12rem'}>
        <Combobox.Options mah={'24rem'} style={{ overflowY: 'auto' }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
