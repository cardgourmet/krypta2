import {Grid, Group, Stack} from '@mantine/core';
import {ColorSelect} from '@/parcels/lists/ListsOverview/ColorSelect/ColorSelect.tsx';
import styles from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.module.css';
import type {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import {GourmetMultiSelect} from '@/parcels/mantine/GourmetMultiSelect/GourmetMultiSelect.tsx';
import {GourmetSelect} from '@/parcels/mantine/GourmetSelect/GourmetSelect.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/mantine/GourmetTextInput/GourmetTextInput.tsx';

export type ListValues = {
  name: string;
  description: string;
  visibility: string;
  allowedTcgs: string[];
  color: string | undefined;
};

export function ListValuesForm({ form }: { form: ReturnType<typeof useListForm> }) {
  const visibilityData = [
    { value: 'private', label: 'Private' },
    { value: 'unlisted', label: 'Unlisted' },
    { value: 'public', label: 'Public' },
  ];
  const allowedTcgsData = [
    { value: 'mtg', label: 'MTG' },
    { value: 'pcg', label: 'PCG' },
    { value: 'dlc', label: 'DLC' },
  ];

  return (
    <Stack>
      <Grid>
        <Grid.Col span={4}>
          <Group h={'2.25rem'} w={'100%'}>
            <GourmetText cgmff={'ui'}>
              Name <span className={styles.requiredAsterisk}>*</span>
            </GourmetText>
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <GourmetTextInput
            placeholder={'e.g. "New deck ideas"'}
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <Group h={'2.25rem'} w={'100%'}>
            <GourmetText cgmff={'ui'}>Description</GourmetText>
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <GourmetTextInput
            placeholder={'Describe your list'}
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <Group h={'2.25rem'} w={'100%'}>
            <GourmetText cgmff={'ui'}>Visibility</GourmetText>
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <GourmetSelect
            placeholder={'Visibility'}
            data={visibilityData}
            defaultValue={form.values.visibility}
            onChange={(val) => {
              form.setFieldValue('visibility', val ?? '');
            }}
            allowDeselect={false}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <Group h={'2.25rem'} w={'100%'}>
            <GourmetText cgmff={'ui'}>Allowed TCGs</GourmetText>
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <Stack gap={'0.25rem'}>
            <GourmetMultiSelect
              placeholder={'Choose'}
              w={'100%'}
              maw={'100%'}
              data={allowedTcgsData}
              defaultValue={form.values.allowedTcgs}
              key={form.key('allowedTcgs')}
              {...form.getInputProps('allowedTcgs')}
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
          <ColorSelect
            onChange={(val) => {
              form.setFieldValue('color', val);
            }}
          />
        </Grid.Col>
      </Grid>

      <Group mt={'0.5rem'}>
        <GourmetText cgmff={'ui'} aria-hidden="true">
          <span className={styles.requiredAsterisk}>*</span> Required Field
        </GourmetText>
      </Group>
    </Stack>
  );
}
