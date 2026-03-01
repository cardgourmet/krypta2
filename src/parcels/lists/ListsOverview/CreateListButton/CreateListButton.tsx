import {Button, Grid, Group, Modal, Stack} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useDisclosure} from '@mantine/hooks';
import {IconList, IconPlus} from '@tabler/icons-react';
import {useRouter} from '@tanstack/react-router';
import {validate} from 'uuid';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {createList} from '@/parcels/lists/api.ts';
import {ColorSelect} from '@/parcels/lists/ListsOverview/ColorSelect/ColorSelect.tsx';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetMultiSelect} from '@/parcels/mantine/GourmetMultiSelect/GourmetMultiSelect.tsx';
import {GourmetSelect} from '@/parcels/mantine/GourmetSelect/GourmetSelect.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/mantine/GourmetTextInput/GourmetTextInput.tsx';
import styles from './CreateListButton.module.css';

export default function CreateListButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const auth = useAuth();

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

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: '',
      visibility: 'private',
      allowedTcgs: [] as string[],
      color: undefined as string | undefined,
    },
    validate: {
      name: (val) => {
        if (val === '') return 'Name cannot be empty';
        if (val.length > 100) return 'Name cannot be longer than 100 characters';
        if (validate(val)) return 'Name cannot be a UUID';
        return null;
      },
      description: (val) => {
        if (val.length > 1000) return 'Description cannot be longer than 1000 characters';
        return null;
      },
    },
  });

  const router = useRouter();

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!auth.user) return;

            const res = form.validate();
            if (res.hasErrors) return;

            const formValues = form.getValues();
            const list = {
              name: formValues.name,
              description: formValues.description,
              visibility: formValues.visibility,
              allowedTcgs: formValues.allowedTcgs,
              color: formValues.color,
            } as Partial<UserList> & { name: string };

            console.log(form.getValues());
            createList(auth.user.id, list, auth.token).then(({ data, error }) => {
              if (error) {
                console.log('error when creating list :(', error);
                return;
              }

              console.log('success!', data);
              // cleanup and close
              close();
              form.reset();
              router.invalidate();
            });
          }}
        >
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
                  defaultValue={'private'}
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

            <Group justify={'end'}>
              <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
                <GourmetText cgmc={'neutral-9'}>Cancel</GourmetText>
              </Button>
              <Button type="submit" color={'var(--gourmet-blue-1)'}>
                <GourmetText cgmc={'neutral-1'}>Create</GourmetText>
              </Button>
            </Group>
          </Stack>
        </form>
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
