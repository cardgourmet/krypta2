import {Combobox, Group, UnstyledButton, useCombobox} from '@mantine/core';
import {IconCaretDownFilled, IconCheck} from '@tabler/icons-react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {useMtgOverviewWorkContext} from '@/parcels/overview/MtgOverviewWorkContext.tsx';
import styles from './MorePagesDropdown.module.css';

export function MorePagesDropdown({
  text,
  currentPage,
  onSelect,
}: {
  text: string;
  currentPage: number;
  onSelect?: (selected: string) => void;
}) {
  const work = useMtgOverviewWorkContext();

  const combobox = useCombobox();
  const options = Object.entries(work?.data?.selection?.elementsByPage ?? {}).map(([page, elements]) => (
    <Combobox.Option value={page} key={page}>
      <Group justify={'space-between'}>
        <Group gap={'0.5rem'}>
          <GourmetText cgmff={'ui'} cgmc={page === `${currentPage}` ? 'neutral-9' : 'neutral-7'}>
            Seite {page}
          </GourmetText>
          <span className={styles.badge}>{elements.length}</span>
        </Group>
        {page === `${currentPage}` && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
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
          <Group gap={'0.1rem'}>
            <GourmetText cgmff="ui" c={'var(--gourmet-neutral-8)'}>
              {text}
            </GourmetText>
            <IconCaretDownFilled size={14} color={'var(--gourmet-neutral-8)'} />
          </Group>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown miw={'12rem'}>
        <Combobox.Options mah={'16rem'} style={{ overflowY: 'auto' }}>
          {options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
