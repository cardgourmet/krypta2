import { Input, Popover, ScrollArea } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

interface ThumbnailSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const ThumbnailSearchInput = ({ value, onChange, onSearch }: ThumbnailSearchInputProps) => {
  const [popoverOpened, setPopoverOpened] = useState(false);

  return (
    <Popover opened={popoverOpened} onChange={setPopoverOpened} width="target" position="bottom" shadow="md">
      <Popover.Target>
        <Input
          value={value}
          onChange={(event) => {
            const newValue = event.currentTarget.value;
            onChange(newValue);
            setPopoverOpened(newValue.length > 0);
          }}
          placeholder="Search by name"
          leftSection={<IconSearch size={16} />}
          rightSection={
            value ? (
              <Input.ClearButton
                aria-label="Clear input"
                onClick={() => {
                  onChange('');
                  setPopoverOpened(false);
                }}
              />
            ) : null
          }
          style={{ flexGrow: 1 }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSearch?.(value);
            }
          }}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea.Autosize mah={200}>
          {/* TODO: Suggestions based on value */}
          <GourmetText cgmc={'neutral-4'} size="sm">
            Suggestions will appear here...
          </GourmetText>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
};
