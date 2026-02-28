import {
  Button,
  Grid,
  Group,
  Modal,
  MultiSelect,
  type MultiSelectProps,
  Select,
  type SelectProps,
  Stack,
  TextInput,
  type TextInputProps,
  UnstyledButton,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconCheck, IconChevronDown, IconList, IconPlus} from '@tabler/icons-react';
import {useState} from 'react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './CreateListButton.module.css';

export default function CreateListButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconList size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              Create New List
            </GourmetText>
          </Group>
        }
      >
        <Stack>
          <Grid>
            <Grid.Col span={4}>
              <Group h={'100%'} w={'100%'}>
                <GourmetText cgmff={'ui'}>
                  Name <span className={styles.requiredAsterisk}>*</span>
                </GourmetText>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <GourmetTextInput placeholder={'e.g. "New deck ideas"'} />
            </Grid.Col>

            <Grid.Col span={4}>
              <Group h={'100%'} w={'100%'}>
                <GourmetText cgmff={'ui'}>Description</GourmetText>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <GourmetTextInput placeholder={'Describe your list'} />
            </Grid.Col>

            <Grid.Col span={4}>
              <Group h={'100%'} w={'100%'}>
                <GourmetText cgmff={'ui'}>Visibility</GourmetText>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <GourmetSelect
                placeholder={'Visibility'}
                defaultValue={'private'}
                data={[
                  { value: 'private', label: 'Private' },
                  { value: 'unlisted', label: 'Unlisted' },
                  { value: 'public', label: 'Public' },
                ]}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <Group h={'2.25rem'} w={'100%'}>
                <GourmetText cgmff={'ui'}>Allowed TCGs</GourmetText>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <Stack gap={'0.5rem'}>
                <GourmetMultiSelect
                  placeholder={'Choose'}
                  w={'100%'}
                  maw={'100%'}
                  data={[
                    { value: 'mtg', label: 'MTG' },
                    { value: 'pcg', label: 'PCG' },
                    { value: 'dlc', label: 'DLC' },
                  ]}
                />
                <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
                  If empty, all TCGs are allowed.
                </GourmetText>
              </Stack>
            </Grid.Col>

            <Grid.Col span={4}>
              <Group h={'100%'} w={'100%'}>
                <GourmetText cgmff={'ui'}>Color</GourmetText>
              </Group>
            </Grid.Col>
            <Grid.Col span={8}>
              <ColorSelect />
            </Grid.Col>
          </Grid>

          <Group mt={'0.5rem'}>
            <GourmetText cgmff={'ui'} aria-hidden="true">
              <span className={styles.requiredAsterisk}>*</span> Required Field
            </GourmetText>
          </Group>

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>Cancel</GourmetText>
            </Button>
            <Button color={'var(--gourmet-blue-1)'}>
              <GourmetText cgmc={'neutral-1'}>Create</GourmetText>
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Button
        color={'var(--gourmet-blue-1)'}
        leftSection={<IconPlus size={20} color={'var(--gourmet-neutral-1'} />}
        h={'1.75rem'}
        p={'0 0.5rem'}
        onClick={open}
      >
        <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
          Create new list
        </GourmetText>
      </Button>
    </>
  );
}

function ColorSelect() {
  //const colors = ['FFADAD', 'FFD6A5', 'FDFFB6', 'CAFFBF', '9BF6FF', 'A0C4FF', 'BDB2FF', 'FFC6FF'];
  const colors = ['#e6261f', '#eb7532', '#f7d038', '#a3e048', '#49da9a', '#34bbe6', '#4355db', '#d23be7'];
  const [currentSelected, setCurrentSelected] = useState<string | undefined>(undefined);

  return (
    <Group gap={'0.5rem'}>
      {colors.map((color, i) => {
        const isSelected = currentSelected === color;

        return (
          <UnstyledButton
            onClick={() => {
              if (isSelected) {
                setCurrentSelected(undefined);
              } else {
                setCurrentSelected(color);
              }
            }}
            key={i}
            style={{ color: `${color}` }}
            className={styles.colorSelectButton}
            data-selected={isSelected}
          />
        );
      })}
    </Group>
  );
}

function GourmetMultiSelect(props: MultiSelectProps) {
  return (
    <MultiSelect {...props} classNames={{ root: styles.multiSelect }} rightSection={<IconChevronDown size={18} />} />
  );
}

function GourmetSelect(props: SelectProps) {
  return (
    <Select
      {...props}
      classNames={{ root: styles.select }}
      renderOption={({ option, checked }) => {
        return (
          <Group justify={'space-between'} w={'100%'}>
            <GourmetText cgmc={checked ? 'neutral-9' : 'neutral-7'} cgmff={'ui'} fw={checked ? '500' : ''}>
              {option.label}
            </GourmetText>
            {checked && <IconCheck size={20} />}
          </Group>
        );
      }}
      rightSection={<IconChevronDown size={18} />}
    />
  );
}

function GourmetTextInput(props: TextInputProps) {
  return <TextInput {...props} classNames={{ root: styles.textInput }} />;
}
