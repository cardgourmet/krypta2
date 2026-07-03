import { Group, Stack } from '@mantine/core';
import { IconEyeOff, IconLabelFilled, IconWorld } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Expander } from '@/parcels/generic/Expander/Expander';
import { Input } from '@/parcels/generic/Input/Input';
import { Select } from '@/parcels/generic/Select/Select';
import { TagSelect } from '@/parcels/generic/TagSelect/TagSelect';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { ColorSelect } from '../../ListsOverview/ColorSelect/ColorSelect';
import type { ListPropertiesFormFieldsProps } from './types';

export const ListPropertiesFormFields = ({
  advancedDefaultExpanded,
  form,
  isSystem,
  ...props
}: ListPropertiesFormFieldsProps) => {
  const { t } = useTranslation('lists', { keyPrefix: 'modal' });
  const [color, setColor] = useState(form.values.color);

  form.watch('color', ({ value }) => setColor(value));

  return (
    <Stack gap="0.75rem" {...props}>
      {!isSystem && (
        <>
          <Input
            key={form.key('name')}
            label={t('fields.name.label')}
            placeholder={t('fields.name.placeholder')}
            required
            {...form.getInputProps('name')}
          />

          <Input
            key={form.key('description')}
            label={t('fields.description.label')}
            placeholder={t('fields.description.placeholder')}
            {...form.getInputProps('description')}
          />

          <Expander
            defaultValue={advancedDefaultExpanded}
            renderLabel={(isExpanded) => `${!isExpanded ? 'Show' : 'Hide'} advanced settings`}
          >
            <Stack gap="0.75rem">
              <Select
                data={[
                  { label: t('fields.visibility.private'), value: 'private' },
                  { label: t('fields.visibility.public'), value: 'public' },
                ]}
                key={form.key('visibility')}
                label={t('fields.visibility.label')}
                optionDecorations={{
                  private: {
                    description: t('fields.visibility.privateDesc'),
                    icon: <IconEyeOff />,
                  },
                  public: {
                    description: t('fields.visibility.publicDesc'),
                    icon: <IconWorld />,
                  },
                }}
                {...form.getInputProps('visibility')}
              />

              <TagSelect
                data={[
                  { label: 'Disney Lorcana', value: 'dlc' },
                  { label: 'Magic: The Gathering', value: 'mtg' },
                  { label: 'Pokémon TCG', value: 'pcg' },
                ]}
                hidePickedOptions
                hint={t('fields.tcgs.desc')}
                key={form.key('allowedTcgs')}
                label="TCGs"
                optionDecorations={{
                  dlc: {
                    supportingText: 'DLC',
                  },
                  mtg: {
                    supportingText: 'MTG',
                  },
                  pcg: {
                    supportingText: 'PCG',
                  },
                }}
                placeholder={t('fields.tcgs.placeholder')}
                searchable
                {...form.getInputProps('allowedTcgs')}
              />

              <Stack gap="0.25rem">
                <Typeset size="sm" weight={500}>
                  {t('fields.color.label')}
                </Typeset>

                <Group justify="space-between">
                  <IconLabelFilled style={{ color: color === 'default' ? 'var(--gourmet-neutral-8)' : color }} />
                  <ColorSelect key={form.key('color')} {...form.getInputProps('color')} />
                </Group>
              </Stack>
            </Stack>
          </Expander>
        </>
      )}

      {isSystem && (
        <Select
          data={[
            { label: t('fields.visibility.private'), value: 'private' },
            { label: t('fields.visibility.public'), value: 'public' },
          ]}
          key={form.key('visibility')}
          label={t('fields.visibility.label')}
          optionDecorations={{
            private: {
              description: t('fields.visibility.privateDesc'),
              icon: <IconEyeOff />,
            },
            public: {
              description: t('fields.visibility.publicDesc'),
              icon: <IconWorld />,
            },
          }}
          {...form.getInputProps('visibility')}
        />
      )}
    </Stack>
  );
};
