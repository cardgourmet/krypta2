import {ActionIcon, Grid, Group, Popover, Stack} from '@mantine/core';
import {IconInfoCircle, IconLabelFilled} from '@tabler/icons-react';
import {useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {ColorSelect} from '@/parcels/lists/ListsOverview/ColorSelect/ColorSelect.tsx';
import type {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import {GourmetMultiSelect} from '@/parcels/mantine/GourmetMultiSelect/GourmetMultiSelect.tsx';
import {GourmetSelect} from '@/parcels/mantine/GourmetSelect/GourmetSelect.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {GourmetTextInput} from '@/parcels/mantine/GourmetTextInput/GourmetTextInput.tsx';
import styles from './ListValuesForm.module.css';

export type ListValues = {
  name: string;
  description: string;
  visibility: string;
  allowedTcgs: string[];
  color: string | undefined;
};

export function ListValuesForm({ form }: { form: ReturnType<typeof useListForm> }) {
  const { t } = useTranslation('lists', { keyPrefix: 'form' });
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

  const [opened, setOpened] = useState(false);

  return (
    <Stack>
      <Grid>
        <Grid.Col span={4}>
          <Group h={'2.25rem'} w={'100%'}>
            <GourmetText cgmff={'ui'}>
              {t('fields.name')} <span className={styles.requiredAsterisk}>*</span>
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
            <GourmetText cgmff={'ui'}>{t('fields.description')}</GourmetText>
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
          <Group h={'2.25rem'} w={'100%'} gap={'0.2rem'}>
            <GourmetText cgmff={'ui'}>{t('fields.visibility')}</GourmetText>

            <Popover width={200} position="bottom" withArrow shadow="md" opened={opened} onChange={setOpened}>
              <Popover.Target>
                <ActionIcon className={styles.infoButton} onClick={() => setOpened((o) => !o)}>
                  <IconInfoCircle size={20} color={'var(--gourmet-neutral-8)'} />
                </ActionIcon>
              </Popover.Target>

              <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                <GourmetText size="sm">
                  <Trans t={t} i18nKey={'visibilityExplain.private'} /> <br />
                  <br />
                  <Trans t={t} i18nKey={'visibilityExplain.unlisted'} /> <br />
                  <br />
                  <Trans t={t} i18nKey={'visibilityExplain.public'} />
                </GourmetText>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <GourmetSelect
            placeholder={'Visibility'}
            data={visibilityData}
            defaultValue={form.values.visibility}
            onChange={(val) => {
              form.setFieldValue('fields.visibility', val ?? '');
            }}
            allowDeselect={false}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <Group h={'2.25rem'} w={'100%'}>
            <GourmetText cgmff={'ui'}>{t('fields.allowedTcgs')}</GourmetText>
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <Stack gap={'0.25rem'}>
            <GourmetMultiSelect
              placeholder={t('allowedTcgsPlaceholder')}
              w={'100%'}
              maw={'100%'}
              data={allowedTcgsData}
              defaultValue={form.values.allowedTcgs}
              key={form.key('allowedTcgs')}
              {...form.getInputProps('allowedTcgs')}
            />
            <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
              {t('allowedTcgsExplain')}
            </GourmetText>
          </Stack>
        </Grid.Col>

        <Grid.Col span={4}>
          <Group h={'0'} w={'100%'} gap={'0.25rem'}>
            <GourmetText cgmff={'ui'}>{t('fields.color')}</GourmetText>
            <IconLabelFilled size={20} color={form.getValues().color ?? 'var(--gourmet-neutral-8)'} />
          </Group>
        </Grid.Col>
        <Grid.Col span={8}>
          <ColorSelect
            value={form.getValues().color}
            onChange={(val) => {
              form.setFieldValue('color', val);
            }}
          />
        </Grid.Col>
      </Grid>

      <Group mt={'0.5rem'}>
        <GourmetText cgmff={'ui'} aria-hidden="true">
          <span className={styles.requiredAsterisk}>*</span> {t('required')}
        </GourmetText>
      </Group>
    </Stack>
  );
}
